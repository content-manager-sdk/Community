using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

using HP.HPTRIM.SDK;

namespace SDK_Basics_Searching
{
  /// <summary>
  /// This class represents a result created by the Searcher class. It holds the
  /// logging information as well as the resulting objects.
  /// </summary>
  public class SearchResult
  {
    private string           m_log;
    private TrimMainObject[] m_results;

    /// <summary>
    /// The log text created while searching.
    /// </summary>
    public string LogText { get { return m_log; } }

    /// <summary>
    /// The objects found while searching.
    /// </summary>
    public TrimMainObject[] ResultObjects { get { return m_results; } }

    /// <summary>
    /// This constructor sets the logging and result data. There is no other way
    /// to set those, so the contents of the SearchResult cannot be changed 
    /// after it was created.
    /// </summary>
    /// <param name="newLog"></param>
    /// <param name="newResults"></param>
    public SearchResult(string newLog, TrimMainObject[] newResults)
    {
      m_log     = newLog;
      m_results = newResults;
    }


  }
}
