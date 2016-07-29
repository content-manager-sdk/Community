using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Windows.Forms;

using HP.HPTRIM.SDK;

namespace SDK_Basics_Searching
{
  /// <summary>
  /// This class provides a method to search the database it was created with.
  /// </summary>
  public class Searcher
  {
    /* The database used for the search operations. */
    private Database m_db;

    /// <summary>
    /// This constructor initializes the database to perform search operations
    /// on.
    /// </summary>
    /// <param name="newDB"></param>
    public Searcher(Database newDB)
    {
      m_db = newDB;
    }

    /// <summary>
    /// This method constructs the TRIM objects necessary for searching the 
    /// database and finally performs the search.
    /// </summary>
    /// <param name="searchString"></param>
    /// <param name="searchClause"></param>
    /// <param name="objectType"></param>
    /// <returns></returns>
    public SearchResult Search(
      string[]          searchStrings,
      SearchClauseIds[] ids,
      BaseObjectTypes   objectType)
    {
      long[] results;
      StringBuilder sb = new StringBuilder();

      /* Each id should have a search string (at least null). */
      if (ids.Length != searchStrings.Length)
      {
        throw new ArgumentOutOfRangeException(
          "\nThere was a problem with the search clauses.(Arrays differ in length.)");
      }

      sb.Append("\r\nLooking for ").Append(objectType.ToString()).Append("s. ( ");

      /* We need to construct the TrimMainObjectSearch object. */
      TrimMainObjectSearch search = new TrimMainObjectSearch(m_db, objectType);
      {
        /* Iterate over all the search clauses. */
        for (int i = 0; i < ids.Length; i++)
        {
            TrimSearchClause sc = new TrimSearchClause(m_db, objectType, ids[i]);
          
          if (!sc.SetCriteriaFromString(searchStrings[i]))
          {
            throw new ArgumentException(
              "\nThere was a problem with the search string: " + sc.ErrorMessage);
          }
          search.AddSearchClause(sc);

          sb.Append(ids[i].ToString()).Append(" ");

          /*
           * We want to have a conjunction of the search clauses.
           * You can completely redefine the way your search clauses are 
           * connected to each other. (AND || OR || NOT)
           * 
           * More on how the search stack in TRIM works can be found in the
           * SDK documentation.
           */
          if (i > 0)
          {
            search.And(); 
          }
        } // end for loop        
        
        /* The actual search is performed here and now. */
        results = search.GetResultAsUriArray();
      } // end using search

      /* Now we have to get the objects for the URI's and put them together. */
      TrimMainObject[] objects = CreateObjectList(results, objectType);

      sb.Append(")\r\n\tFound ").Append(objects.Length).Append(" ");
      sb.Append(objectType.ToString()).Append("s.");

      return new SearchResult(sb.ToString(), objects);
    }

    /// <summary>
    /// This method creates the list of objects found during the search.
    /// Therefor it determines which type has been used.
    /// 
    /// You can easily add more types to take care of.
    /// </summary>
    /// <param name="uriList"></param>
    /// <param name="objectType"></param>
    /// <returns></returns>
    private TrimMainObject[] CreateObjectList(long[] uriList,
      BaseObjectTypes objectType)
    {
      TrimMainObject[] result;

      /* What sort of TrimMainObjects do we have to list? */
      switch (objectType)
      {
        case BaseObjectTypes.Record:
          /* We have to list Records. */
          result = new Record[uriList.Length];
          for (int i = 0; i < uriList.Length; i++)
          {
            result[i] = new Record(m_db, uriList[i]);
          }
          break;

        case BaseObjectTypes.Location:
          /* We have to list Locations. */
          result = new Location[uriList.Length];
          for (int i = 0; i < uriList.Length; i++)
          {
            result[i] = new Location(m_db, uriList[i]);
          }
          break;

        /* Any other ObjectType to be listed can be added here (new case). */

        default:
          throw new ArgumentException("\nInvalid BaseObjectType:" + objectType);
      }
      return result;
    }
  }
}
