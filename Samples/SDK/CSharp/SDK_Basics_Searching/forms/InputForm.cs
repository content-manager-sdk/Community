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
  public partial class InputForm : Form
  {
    private string input;

    public string Input
    {
      get { return input; }
    }

    public InputForm(string title, string label)
    {
      this.Text = title;

      InitializeComponent();
      inputLabel.Text = label;
    }

    private void inputSendButton_Click(object sender, EventArgs e)
    {      
      input = inputTextBox.Text;
      Dispose();
    }
  }
}
