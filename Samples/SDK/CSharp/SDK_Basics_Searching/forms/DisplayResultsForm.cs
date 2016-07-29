using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Windows.Forms;

using HP.HPTRIM.SDK;

namespace SDK_Basics_Searching
{
  /// <summary>
  /// This is a form for displaying search results in a ListView.
  /// At the moment it is able to display Record and Location results but it can
  /// be extended easily.
  /// </summary>
  public partial class DisplayResultsForm : Form
  {
    public DisplayResultsForm(TrimMainObject[] resultObjectList, 
      BaseObjectTypes objectType)
    {
      InitializeComponent();

      /* Add the results of given type to the ListBox. */
      DisplayResults(resultObjectList, objectType);
    }

    /// <summary>
    /// This method decides what BaseObjectType to display and invokes the 
    /// associated method.
    /// 
    /// When you want to add more types to be displayed, just add a suitable
    /// method and another case. You then might want to merge the methods to
    /// avoid redundant code.
    /// </summary>
    /// <param name="resultObjectList"></param>
    /// <param name="objectType"></param>
    private void DisplayResults(TrimMainObject[] resultObjectList,
      BaseObjectTypes objectType) 
    {
      /* What sort of TrimMainObjects do we have to display? */
      switch (objectType)
      {
        case BaseObjectTypes.Record:
          /* We have to display Records. */
          Record[] records = (Record[]) resultObjectList;
          DisplayRecords(records);
          break;

        case BaseObjectTypes.Location:
          /* We have to display Locations. */
          columnHeader0.Text = "Name";
          columnHeader3.Text = "Location Type";

          Location[] locations = (Location[]) resultObjectList;
          DisplayLocations(locations);
          break;

        /* Any other ObjectType to be displayed can be added here. */

        default:
          break;
      }
    }

    /// <summary>
    /// This method displays given Records in the DisplayResultsForm(this).
    /// </summary>
    /// <param name="recordList"></param>
    private void DisplayRecords(Record[] recordList)
    {
      foreach (Record record in recordList)
      {
        ListViewItem tmpItem = new ListViewItem();

        /* Fill the columns of the result table. */
        tmpItem.Text = record.Title;
        tmpItem.SubItems.Add(record.Uri.ToString());
        tmpItem.SubItems.Add(record.LastUpdatedOn.ToShortDateTimeString());

        if (record.Author != null)
        {
          tmpItem.SubItems.Add(record.Author.GivenNames + " "
            + record.Author.Surname);
        }

        /* Add the Record to the displayed result table. */
        resultListView.Items.Add(tmpItem);
      }
    }
    
    /// <summary>
    /// This method displays given Locations in the DisplayResultsForm(this).
    /// </summary>
    /// <param name="locationList"></param>
    private void DisplayLocations(Location[] locationList)
    {
      foreach (Location location in locationList)
      {
        ListViewItem tmpItem = new ListViewItem();

        /* Fill the columns of the result table. */
        tmpItem.Text = location.NameString;
        tmpItem.SubItems.Add(location.Uri.ToString());
        tmpItem.SubItems.Add(location.LastUpdatedOn.ToShortDateTimeString());
        tmpItem.SubItems.Add(location.TypeOfLocation.ToString());

        /* Add the Record to the displayed result table. */
        resultListView.Items.Add(tmpItem);
      }
    }

    /* Think for yourself :D */
    private void okButton_Click(object sender, EventArgs e)
    {
      Dispose();
    }
  }
}
