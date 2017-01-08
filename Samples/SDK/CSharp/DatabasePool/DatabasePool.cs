using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace HP.HPTRIM.SDK.Samples
{
    public class DatabasePool : IDisposable
    {
        static readonly DatabasePool instance = new DatabasePool();

        private static Object _poolLock = new Object();
        private bool _isDisposed = false;
        private const int POOL_SIZE = 500;


        // In production code this inforation will probably be stored in a config file.
        private const string WG_NAME = "local";
        private const int WG_PORT = 1137;
        private const string ALT_WG_NAME = "";
        private const int ALT_WG_PORT = 0;

        static DatabasePool()
        {
            Database.AllowAccessFromMultipleThreads = true;
        }

        DatabasePool() { }


        public static DatabasePool Instance
        {
            get
            {
                return instance;
            }
        }

        private readonly List<DatabasePoolEntry> _pool = new List<DatabasePoolEntry>();

        public DatabasePoolEntry AcquirePoolEntry(string dbid, string identity, bool isSingleHop = false, string remoteIp = null)
        {
            if (_isDisposed) throw new ObjectDisposedException("DatabasePool");

            lock (_poolLock)
            {
                DatabasePoolEntry pooled = GetPoolEntry(identity, dbid);

                if (pooled != null)
                {
                    pooled.LastAccessed = DateTime.Now;

                    return pooled;
                }

            }

            TrimPool();

            DatabasePoolEntry mine = new DatabasePoolEntry(identity, WG_NAME, WG_PORT, dbid, ALT_WG_NAME, ALT_WG_PORT, isSingleHop, remoteIp);

            lock (_poolLock)
            {
                _pool.Add(mine);
            }

            return mine;

        }

        private DatabasePoolEntry GetPoolEntry(string identity, string dbid)
        {
            lock (_poolLock)
            {
                DatabasePoolEntry poolEntry = _pool.Where(
                    p => p.isAvailable(identity, dbid)).FirstOrDefault();

                if (poolEntry != null)
                {
                    poolEntry.IsLocked = true;
                }

                return poolEntry;
            }
        }


        private static bool _disposing;
        private void TrimPool()
        {
            // We trim the pool in three stages:
            // * first mark pool entries as ready for disposal (dirty)
            // * next we actually dispose them
            // * last we remove the disposed objects from the list.

            // it might be fine to simplify this and do it in one loop, this code has built up over the
            // years as we have attempted to optimise the pool.
            int newPoolSize = POOL_SIZE;

            if (_pool.Count >= newPoolSize)
            {
                bool gotMonitor = false;
                try
                {
                    Monitor.TryEnter(_poolLock, ref gotMonitor);
                    if (gotMonitor)
                    {

                        _pool.Sort(delegate (DatabasePoolEntry p1, DatabasePoolEntry p2)
                        {
                            return p2.LastAccessed.CompareTo(p1.LastAccessed);
                        });

                        for (int counter = _pool.Count; counter >= newPoolSize; counter--)
                        {
                            _pool[counter - 1].Dirty = true;
                        }
                    }
                }
                finally
                {
                    if (gotMonitor)
                    {
                        Monitor.Exit(_poolLock);
                    }
                }

                try
                {
                    if (!_disposing)
                    {
                        _disposing = true;
                        List<DatabasePoolEntry> tempList = null;
                        lock (_poolLock)
                        {
                            tempList = _pool.ToList();
                        }
                        foreach (var pe in tempList.Where(pp => pp.Dirty))
                        {
                            pe.Dispose();
                            pe.AwaitingRemoval = true;

                        }
                    }
                }
                finally
                {
                    _disposing = false;
                }

                if (Monitor.TryEnter(_poolLock))
                {
                    try
                    {
                        for (int counter = 0; counter < _pool.Count; counter++)
                        {
                            if (_pool[counter].AwaitingRemoval)
                            {
                                _pool.RemoveAt(counter);
                            }
                        }
                    }
                    finally
                    {
                        Monitor.Exit(_poolLock);
                    }
                }
            }
        }
        public void ReleasePoolEntry(Guid id)
        {
            if (_isDisposed) throw new ObjectDisposedException("DatabasePool");

            lock (_poolLock)
            {
                DatabasePoolEntry mine = _pool.Where(p =>
                    p.Id == id).FirstOrDefault();
                if (mine != null)
                {
                    mine.IsLocked = false;
                }
            }
        }

        #region IDisposable Members

        public void Dispose()
        {
            if (_pool != null)
            {

                lock (_poolLock)
                {
                    foreach (DatabasePoolEntry dp in _pool)
                    {
                        System.Diagnostics.Debug.Assert(!dp.IsLocked, "Attempt to Dispose Database still in use.");

                        dp.Dispose();
                    }

                    _pool.Clear();
                }
            }
            _isDisposed = true;
        }
        #endregion
    }


}
