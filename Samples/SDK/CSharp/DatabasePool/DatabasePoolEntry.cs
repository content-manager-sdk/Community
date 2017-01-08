using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HP.HPTRIM.SDK.Samples
{
    public sealed class DatabasePoolEntry : IDisposable
    {

        private bool _isDisposed = false;

        private DateTime _firstAccessed;

        private DatabasePoolEntry() { }

        public DatabasePoolEntry(string identity, string wgName, int wgPort, string dbid, string alt_wgName, int alt_wgPort, bool isSingleHop = false, string remoteIp = null)
        {
            try
            {
                setDatabase(identity, wgName, wgPort, dbid, alt_wgName, alt_wgPort, isSingleHop, remoteIp);

                UserName = identity;
                Id = Guid.NewGuid();
                IsLocked = true;
                DatabaseId = dbid;
                LastAccessed = DateTime.Now;
                _firstAccessed = DateTime.Now;
            }
            catch
            {
                try
                {
                    this.Dispose();
                }
                catch
                {
                    //   throw;
                }
                throw;
            }
        }


        private HP.HPTRIM.SDK.Database _trimDatabase;
        public HP.HPTRIM.SDK.Database TrimDatabase
        {
            get
            {
                if (_isDisposed) throw new ObjectDisposedException("_trimDatabase");
                return _trimDatabase;
            }
        }
        public Guid Id { get; set; }

        internal String UserName { get; private set; }

        internal DateTime LastAccessed { get; set; }

        internal bool IsLocked { get; set; }

        internal bool Dirty { get; set; }

        internal bool AwaitingRemoval { get; set; }

        internal String DatabaseId { get; private set; }


        internal bool isAvailable(string forUser, string dbId)
        {
            return
                this.UserName == forUser
                && this.IsLocked == false
                && _firstAccessed.AddMinutes(10) > DateTime.Now
                && this.DatabaseId == dbId
                && this.Dirty != true;
        }

        private void setDatabase(string identity, string wgName, int wgPort, string dbid, string alt_wgName, int alt_wgPort, bool isSingleHop, string remoteIp)
        {
            _trimDatabase = new Database()
            {
                Id = dbid,
                WorkgroupServerName = wgName,
                WorkgroupServerPort = wgPort,
                IsSingleHopClient = isSingleHop
            };

            if (!string.IsNullOrWhiteSpace(identity))
            {
                _trimDatabase.TrustedUser = identity;


                if (TrimApplication.ServiceType == ServiceTypes.WebService)
                {
                    TrimUserOptionSet webclientOption = new TrimUserOptionSet(_trimDatabase, UserOptionSetIds.WebClient);
                    string timeZone = webclientOption.GetPropertyString(PropertyIds.WebClientUserOptionsTimezone);

                    if (!string.IsNullOrEmpty(timeZone))
                    {
                        try
                        {
                            _trimDatabase.SetTimezoneString(timeZone);

                        }
                        catch
                        {
                            // if an invalid time zone is set we do not want an exception as that would stop the user fixing the time-zone

                          //  _log.WarnFormat("Invalid timezone ({0}) set by {1}", timeZone, identity);
                        }

                    }
                }

                // this allows the users IP address to be logged in the WGS log
                if (!string.IsNullOrEmpty(remoteIp))
                {
                    _trimDatabase.ClientIPAddress = remoteIp;
                }
            }
            if (!string.IsNullOrEmpty(alt_wgName))
            {
                _trimDatabase.AlternateWorkgroupServerName = alt_wgName;
                _trimDatabase.AlternateWorkgroupServerPort = alt_wgPort;
            }

            if (_trimDatabase.IsValid)
            {

                //Now that all the properties have been established, attempt to connect to the database
                _trimDatabase.Connect();

                if (!_trimDatabase.IsConnected)
                {
                    throw new DatabaseConnectException("Database failed to connect. " + _trimDatabase.ErrorMessage);
                }
            }
            else
            {
                throw new DatabaseConnectException("Unable to connect to database. " + _trimDatabase.ErrorMessage);
            }

        }

        #region IDisposable Members

        public void Dispose()
        {
            Dispose(true);

            GC.SuppressFinalize(this);
        }

        public void Dispose(bool disposing)
        {

            if (disposing)
            {
                if (!_isDisposed)
                {
                    if (null != _trimDatabase)
                    {
                        if (_trimDatabase is SDK.Database)
                        {

                            try
                            {
                                _trimDatabase.Dispose();
                                _trimDatabase = null;
                            }
                            catch
                            {
                                throw;
                            }
                        }
                        else
                        {
                            throw new Exception(string.Format("Attempting to dispose: {0}.", _trimDatabase.GetType().Name));
                        }

                    }
                    _isDisposed = true;
                }
            }
        }

        ~DatabasePoolEntry()
        {
            Dispose(false);
        }
        #endregion
    }
}
