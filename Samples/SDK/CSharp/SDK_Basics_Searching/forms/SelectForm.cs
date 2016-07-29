using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Windows.Forms;

namespace SDK_Basics_Searching
{
  public partial class SelectForm : Form
  {
    private string[] listItems;
    private string   selected;
    private int      selectedIndex;

    public string SelectedItem
    {
      get { return selected; }
    }

    public int SelectedItemIndex
    {
      get { return selectedIndex;  }
    }

    public SelectForm(string[] newListItems, string labelText, string title)
    {
      listItems = newListItems;
      InitializeComponent();
      this.Text = title;
      selectLabel.Text = labelText;

      /* Here we fill the ListBox with the given databases. */
      for (int i = 0; i < listItems.Length; i++)
      {
        selectListBox.Items.Add(listItems[i]);
      }
    }

    private void okButton_Click(object sender, EventArgs e)
    {
      selected      = selectListBox.SelectedItem.ToString();
      selectedIndex = selectListBox.SelectedIndex;

      Dispose();
    }
  }
}
