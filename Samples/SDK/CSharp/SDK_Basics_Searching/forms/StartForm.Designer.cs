namespace SDK_Basics_Searching
{
  partial class StartForm
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
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(StartForm));
            this.menuStrip1 = new System.Windows.Forms.MenuStrip();
            this.fileToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.connectToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.defaultDBToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.viaDBIDToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.chooseFromListToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.disconnectToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.exitToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.locationToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.searchByToolStripMenuItem1 = new System.Windows.Forms.ToolStripMenuItem();
            this.titleToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.typeOfLocationToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.recordToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.searchByToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.titleWordToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.recordNumberToolStripMenuItem1 = new System.Windows.Forms.ToolStripMenuItem();
            this.uriToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.testToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.statusBox = new System.Windows.Forms.TextBox();
            this.menuStrip1.SuspendLayout();
            this.SuspendLayout();
            // 
            // menuStrip1
            // 
            this.menuStrip1.Items.AddRange(new System.Windows.Forms.ToolStripItem[] {
            this.fileToolStripMenuItem,
            this.locationToolStripMenuItem,
            this.recordToolStripMenuItem});
            this.menuStrip1.Location = new System.Drawing.Point(0, 0);
            this.menuStrip1.Name = "menuStrip1";
            this.menuStrip1.Size = new System.Drawing.Size(319, 24);
            this.menuStrip1.TabIndex = 1;
            this.menuStrip1.Text = "menuStrip1";
            // 
            // fileToolStripMenuItem
            // 
            this.fileToolStripMenuItem.DropDownItems.AddRange(new System.Windows.Forms.ToolStripItem[] {
            this.connectToolStripMenuItem,
            this.disconnectToolStripMenuItem,
            this.exitToolStripMenuItem});
            this.fileToolStripMenuItem.Name = "fileToolStripMenuItem";
            this.fileToolStripMenuItem.Size = new System.Drawing.Size(37, 20);
            this.fileToolStripMenuItem.Text = "File";
            // 
            // connectToolStripMenuItem
            // 
            this.connectToolStripMenuItem.DropDownItems.AddRange(new System.Windows.Forms.ToolStripItem[] {
            this.defaultDBToolStripMenuItem,
            this.viaDBIDToolStripMenuItem,
            this.chooseFromListToolStripMenuItem});
            this.connectToolStripMenuItem.Name = "connectToolStripMenuItem";
            this.connectToolStripMenuItem.Size = new System.Drawing.Size(133, 22);
            this.connectToolStripMenuItem.Text = "Connect";
            // 
            // defaultDBToolStripMenuItem
            // 
            this.defaultDBToolStripMenuItem.Name = "defaultDBToolStripMenuItem";
            this.defaultDBToolStripMenuItem.Size = new System.Drawing.Size(164, 22);
            this.defaultDBToolStripMenuItem.Text = "Default DB";
            this.defaultDBToolStripMenuItem.Click += new System.EventHandler(this.defaultDBToolStripMenuItem_Click);
            // 
            // viaDBIDToolStripMenuItem
            // 
            this.viaDBIDToolStripMenuItem.Name = "viaDBIDToolStripMenuItem";
            this.viaDBIDToolStripMenuItem.Size = new System.Drawing.Size(164, 22);
            this.viaDBIDToolStripMenuItem.Text = "via DB ID";
            this.viaDBIDToolStripMenuItem.Click += new System.EventHandler(this.viaDBIDToolStripMenuItem_Click);
            // 
            // chooseFromListToolStripMenuItem
            // 
            this.chooseFromListToolStripMenuItem.Name = "chooseFromListToolStripMenuItem";
            this.chooseFromListToolStripMenuItem.Size = new System.Drawing.Size(164, 22);
            this.chooseFromListToolStripMenuItem.Text = "Choose from List";
            this.chooseFromListToolStripMenuItem.Click += new System.EventHandler(this.chooseListToolStripMenuItem_Click);
            // 
            // disconnectToolStripMenuItem
            // 
            this.disconnectToolStripMenuItem.Enabled = false;
            this.disconnectToolStripMenuItem.Name = "disconnectToolStripMenuItem";
            this.disconnectToolStripMenuItem.Size = new System.Drawing.Size(133, 22);
            this.disconnectToolStripMenuItem.Text = "Disconnect";
            this.disconnectToolStripMenuItem.Click += new System.EventHandler(this.disconnectToolStripMenuItem_Click);
            // 
            // exitToolStripMenuItem
            // 
            this.exitToolStripMenuItem.Name = "exitToolStripMenuItem";
            this.exitToolStripMenuItem.Size = new System.Drawing.Size(133, 22);
            this.exitToolStripMenuItem.Text = "Exit";
            this.exitToolStripMenuItem.Click += new System.EventHandler(this.exitToolStripMenuItem_Click);
            // 
            // locationToolStripMenuItem
            // 
            this.locationToolStripMenuItem.DropDownItems.AddRange(new System.Windows.Forms.ToolStripItem[] {
            this.searchByToolStripMenuItem1});
            this.locationToolStripMenuItem.Enabled = false;
            this.locationToolStripMenuItem.Name = "locationToolStripMenuItem";
            this.locationToolStripMenuItem.Size = new System.Drawing.Size(65, 20);
            this.locationToolStripMenuItem.Text = "Location";
            // 
            // searchByToolStripMenuItem1
            // 
            this.searchByToolStripMenuItem1.DropDownItems.AddRange(new System.Windows.Forms.ToolStripItem[] {
            this.titleToolStripMenuItem,
            this.typeOfLocationToolStripMenuItem});
            this.searchByToolStripMenuItem1.Name = "searchByToolStripMenuItem1";
            this.searchByToolStripMenuItem1.Size = new System.Drawing.Size(125, 22);
            this.searchByToolStripMenuItem1.Text = "Search By";
            // 
            // titleToolStripMenuItem
            // 
            this.titleToolStripMenuItem.Name = "titleToolStripMenuItem";
            this.titleToolStripMenuItem.Size = new System.Drawing.Size(162, 22);
            this.titleToolStripMenuItem.Text = "Name";
            this.titleToolStripMenuItem.Click += new System.EventHandler(this.findLocationToolStripMenuItem_Click);
            // 
            // typeOfLocationToolStripMenuItem
            // 
            this.typeOfLocationToolStripMenuItem.Name = "typeOfLocationToolStripMenuItem";
            this.typeOfLocationToolStripMenuItem.Size = new System.Drawing.Size(162, 22);
            this.typeOfLocationToolStripMenuItem.Text = "Type of Location";
            this.typeOfLocationToolStripMenuItem.Click += new System.EventHandler(this.findLocationToolStripMenuItem_Click);
            // 
            // recordToolStripMenuItem
            // 
            this.recordToolStripMenuItem.DropDownItems.AddRange(new System.Windows.Forms.ToolStripItem[] {
            this.searchByToolStripMenuItem});
            this.recordToolStripMenuItem.Enabled = false;
            this.recordToolStripMenuItem.Name = "recordToolStripMenuItem";
            this.recordToolStripMenuItem.Size = new System.Drawing.Size(56, 20);
            this.recordToolStripMenuItem.Text = "Record";
            // 
            // searchByToolStripMenuItem
            // 
            this.searchByToolStripMenuItem.DropDownItems.AddRange(new System.Windows.Forms.ToolStripItem[] {
            this.titleWordToolStripMenuItem,
            this.recordNumberToolStripMenuItem1,
            this.uriToolStripMenuItem,
            this.testToolStripMenuItem});
            this.searchByToolStripMenuItem.Name = "searchByToolStripMenuItem";
            this.searchByToolStripMenuItem.Size = new System.Drawing.Size(125, 22);
            this.searchByToolStripMenuItem.Text = "Search By";
            // 
            // titleWordToolStripMenuItem
            // 
            this.titleWordToolStripMenuItem.Name = "titleWordToolStripMenuItem";
            this.titleWordToolStripMenuItem.Size = new System.Drawing.Size(166, 22);
            this.titleWordToolStripMenuItem.Text = "Title";
            this.titleWordToolStripMenuItem.Click += new System.EventHandler(this.searchRecordToolStripMenuItem_Click);
            // 
            // recordNumberToolStripMenuItem1
            // 
            this.recordNumberToolStripMenuItem1.Name = "recordNumberToolStripMenuItem1";
            this.recordNumberToolStripMenuItem1.Size = new System.Drawing.Size(166, 22);
            this.recordNumberToolStripMenuItem1.Text = "Record Number";
            this.recordNumberToolStripMenuItem1.Click += new System.EventHandler(this.searchRecordToolStripMenuItem_Click);
            // 
            // uriToolStripMenuItem
            // 
            this.uriToolStripMenuItem.Name = "uriToolStripMenuItem";
            this.uriToolStripMenuItem.Size = new System.Drawing.Size(166, 22);
            this.uriToolStripMenuItem.Text = "URI";
            this.uriToolStripMenuItem.Click += new System.EventHandler(this.searchRecordToolStripMenuItem_Click);
            // 
            // testToolStripMenuItem
            // 
            this.testToolStripMenuItem.Name = "testToolStripMenuItem";
            this.testToolStripMenuItem.Size = new System.Drawing.Size(166, 22);
            this.testToolStripMenuItem.Text = "Title and Content";
            this.testToolStripMenuItem.Click += new System.EventHandler(this.searchRecordToolStripMenuItem_Click);
            // 
            // statusBox
            // 
            this.statusBox.Anchor = ((System.Windows.Forms.AnchorStyles)((((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Bottom) 
            | System.Windows.Forms.AnchorStyles.Left) 
            | System.Windows.Forms.AnchorStyles.Right)));
            this.statusBox.BorderStyle = System.Windows.Forms.BorderStyle.None;
            this.statusBox.Location = new System.Drawing.Point(0, 27);
            this.statusBox.Multiline = true;
            this.statusBox.Name = "statusBox";
            this.statusBox.ReadOnly = true;
            this.statusBox.ScrollBars = System.Windows.Forms.ScrollBars.Vertical;
            this.statusBox.Size = new System.Drawing.Size(319, 209);
            this.statusBox.TabIndex = 2;
            this.statusBox.Text = "Welcome to the HP TRIM .NET SDK Basics Demonstration.";
            // 
            // StartForm
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(319, 237);
            this.Controls.Add(this.statusBox);
            this.Controls.Add(this.menuStrip1);
            this.Icon = ((System.Drawing.Icon)(resources.GetObject("$this.Icon")));
            this.MainMenuStrip = this.menuStrip1;
            this.Name = "StartForm";
            this.Text = "SDK_Basics_Demo";
            this.menuStrip1.ResumeLayout(false);
            this.menuStrip1.PerformLayout();
            this.ResumeLayout(false);
            this.PerformLayout();

    }

    #endregion

    private System.Windows.Forms.MenuStrip menuStrip1;
    private System.Windows.Forms.ToolStripMenuItem fileToolStripMenuItem;
    private System.Windows.Forms.ToolStripMenuItem connectToolStripMenuItem;
    private System.Windows.Forms.ToolStripMenuItem exitToolStripMenuItem;
    private System.Windows.Forms.TextBox statusBox;
    private System.Windows.Forms.ToolStripMenuItem defaultDBToolStripMenuItem;
    private System.Windows.Forms.ToolStripMenuItem viaDBIDToolStripMenuItem;
    private System.Windows.Forms.ToolStripMenuItem disconnectToolStripMenuItem;
    private System.Windows.Forms.ToolStripMenuItem chooseFromListToolStripMenuItem;
    private System.Windows.Forms.ToolStripMenuItem locationToolStripMenuItem;
    private System.Windows.Forms.ToolStripMenuItem recordToolStripMenuItem;
    private System.Windows.Forms.ToolStripMenuItem searchByToolStripMenuItem1;
    private System.Windows.Forms.ToolStripMenuItem searchByToolStripMenuItem;
    private System.Windows.Forms.ToolStripMenuItem titleWordToolStripMenuItem;
    private System.Windows.Forms.ToolStripMenuItem recordNumberToolStripMenuItem1;
    private System.Windows.Forms.ToolStripMenuItem uriToolStripMenuItem;
    private System.Windows.Forms.ToolStripMenuItem titleToolStripMenuItem;
    private System.Windows.Forms.ToolStripMenuItem testToolStripMenuItem;
    private System.Windows.Forms.ToolStripMenuItem typeOfLocationToolStripMenuItem;
  }
}

