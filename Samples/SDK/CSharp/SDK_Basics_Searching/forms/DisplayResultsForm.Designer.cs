namespace SDK_Basics_Searching
{
  partial class DisplayResultsForm
  {
    /// <summary>
    /// Required designer variable.
    /// </summary>
    private System.ComponentModel.IContainer components = null;

    /// <summary>
    /// Clean up any resources being used.
    /// </summary>
    /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
    protected override void Dispose(bool disposing)
    {
      if (disposing && (components != null))
      {
        components.Dispose();
      }
      base.Dispose(disposing);
    }

    #region Windows Form Designer generated code

    /// <summary>
    /// Required method for Designer support - do not modify
    /// the contents of this method with the code editor.
    /// </summary>
    private void InitializeComponent()
    {
      System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(DisplayResultsForm));
      this.resultListView = new System.Windows.Forms.ListView();
      this.columnHeader0 = new System.Windows.Forms.ColumnHeader();
      this.columnHeader1 = new System.Windows.Forms.ColumnHeader();
      this.columnHeader2 = new System.Windows.Forms.ColumnHeader();
      this.columnHeader3 = new System.Windows.Forms.ColumnHeader();
      this.okButton = new System.Windows.Forms.Button();
      this.SuspendLayout();
      // 
      // resultListView
      // 
      this.resultListView.Anchor = ((System.Windows.Forms.AnchorStyles)((((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Bottom)
                  | System.Windows.Forms.AnchorStyles.Left)
                  | System.Windows.Forms.AnchorStyles.Right)));
      this.resultListView.Columns.AddRange(new System.Windows.Forms.ColumnHeader[] {
            this.columnHeader0,
            this.columnHeader1,
            this.columnHeader2,
            this.columnHeader3});
      this.resultListView.GridLines = true;
      this.resultListView.Location = new System.Drawing.Point(12, 12);
      this.resultListView.Name = "resultListView";
      this.resultListView.Size = new System.Drawing.Size(813, 165);
      this.resultListView.TabIndex = 0;
      this.resultListView.UseCompatibleStateImageBehavior = false;
      this.resultListView.View = System.Windows.Forms.View.Details;
      // 
      // columnHeader0
      // 
      this.columnHeader0.Tag = "";
      this.columnHeader0.Text = "Title";
      this.columnHeader0.Width = 388;
      // 
      // columnHeader1
      // 
      this.columnHeader1.Text = "URI";
      this.columnHeader1.Width = 98;
      // 
      // columnHeader2
      // 
      this.columnHeader2.Text = "Last Updated";
      this.columnHeader2.Width = 131;
      // 
      // columnHeader3
      // 
      this.columnHeader3.Text = "Author";
      this.columnHeader3.Width = 191;
      // 
      // okButton
      // 
      this.okButton.Anchor = ((System.Windows.Forms.AnchorStyles)(((System.Windows.Forms.AnchorStyles.Bottom | System.Windows.Forms.AnchorStyles.Left)
                  | System.Windows.Forms.AnchorStyles.Right)));
      this.okButton.Location = new System.Drawing.Point(12, 183);
      this.okButton.Name = "okButton";
      this.okButton.Size = new System.Drawing.Size(813, 38);
      this.okButton.TabIndex = 1;
      this.okButton.Text = "OK";
      this.okButton.UseVisualStyleBackColor = true;
      this.okButton.Click += new System.EventHandler(this.okButton_Click);
      // 
      // DisplayResultsForm
      // 
      this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
      this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
      this.AutoScroll = true;
      this.ClientSize = new System.Drawing.Size(837, 233);
      this.Controls.Add(this.okButton);
      this.Controls.Add(this.resultListView);
      this.FormBorderStyle = System.Windows.Forms.FormBorderStyle.FixedSingle;
      this.Icon = ((System.Drawing.Icon)(resources.GetObject("$this.Icon")));
      this.Name = "DisplayResultsForm";
      this.Text = "Search Results";
      this.ResumeLayout(false);

    }

    #endregion

    private System.Windows.Forms.ListView resultListView;
    private System.Windows.Forms.ColumnHeader columnHeader0;
    private System.Windows.Forms.ColumnHeader columnHeader1;
    private System.Windows.Forms.ColumnHeader columnHeader2;
    private System.Windows.Forms.Button okButton;
    private System.Windows.Forms.ColumnHeader columnHeader3;

  }
}