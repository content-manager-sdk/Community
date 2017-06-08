# Database Pool
Instantiating a Database object can take several hundred milliseconds.  In many applications this is inconsequential as the Database is connected once and then kept open for the life of the application.  The stateless nature of a web service makes this impractical meaning that to an overhead of up to half a second can be added to each request simply to open a database connection.
The database pool keeps a list of connected database objects in memory for a user so that if they have connected previously we can re-use an existing connection.

## ReleasePoolEntry
To allow a connection to be re-used call ReleasePoolEntry after you have finished with the Database for the moment.  You will probably want to use a try/finally block t make sure ReleasePoolentry is called.  Alternatively you may wrap the acquire and release in a disposable object.

## Disposal
Make sure you call DatabasePool.Instance.Dispose() as you application closes as the Database object logs errors if the database object is disposed by the garbage collector.
 

## Thread safety
The Database object is not thread safe and will log errors if it is used from different threads.  To disable these errors we call Database.AllowAccessFromMultipleThreads = true;.  To prevent concurrent usage from different threads we make sure that the Database is only used by one request at a time.  If all connected Database objects are in use for a particular user we instantiate a new one and add it to the pool.

## Sample usage
Clearly the Database Pool is not intended for use within a console application but within a web service.  It is presented in a console application for the sake of simplicity only.  To use this cop, paste and modify as require.