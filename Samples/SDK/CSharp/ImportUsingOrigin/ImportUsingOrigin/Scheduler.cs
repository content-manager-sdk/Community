using System;
using System.Timers;

namespace HP.HPTRIM.SDK.Samples.ImportUsingOrigin
{
    public class Scheduler : IDisposable
    {
        private IRunnable _runnable;
        private Timer _timer = null;

        public Scheduler(IRunnable runnable, int minuteInterval)
        {
            _runnable = runnable;

            _timer = new Timer();
            _timer.Elapsed += _timer_Elapsed;
            _timer.Interval = minuteInterval * 60 * 1000;

        }

        void _timer_Elapsed(object sender, ElapsedEventArgs e)
        {
            if (!_runnable.Running)
            {
                _runnable.Run();
            }
        }


        public void Start()
        {
            _runnable.Run();

            _timer.Start();
        }

        public void Stop()
        {
            _timer.Stop();
        }

        public void Dispose()
        {
            if (_timer != null)
            {
                _timer.Close();
                _timer = null;
            }
        }
    }

}
