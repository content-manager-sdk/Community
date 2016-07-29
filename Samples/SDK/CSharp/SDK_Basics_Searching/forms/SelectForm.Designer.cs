namespace SDK_Basics_Searching
{
  partial class SelectForm
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
      System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(SelectForm));
      this.selectListBox = new System.Windows.Forms.ListBox();
      this.selectLabel = new System.Windows.Forms.Label();
      this.okButton = new System.Windows.Forms.Button();
      this.SuspendLayout();
      // 
      // selectListBox
      // 
      this.selectListBox.Anchor = ((System.Windows.Forms.AnchorStyles)((((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Bottom)
                  | System.Windows.Forms.AnchorStyles.Left)
                  | System.Windows.Forms.AnchorStyles.Right)));
      this.selectListBox.FormattingEnabled = true;
      this.selectListBox.Location = new System.Drawing.Point(106, 12);
      this.selectListBox.Name = "selectListBox";
      this.selectListBox.Size = new System.Drawing.Size(174, 147);
      this.selectListBox.TabIndex = 0;
      // 
      // selectLabel
      // 
      this.selectLabel.AutoSize = true;
      this.selectLabel.Location = new System.Drawing.Point(12, 12);
      this.selectLabel.Name = "selectLabel";
      this.selectLabel.Size = new System.Drawing.Size(57, 13);
      this.selectLabel.TabIndex = 1;
      this.selectLabel.Text = "toBeGiven";
      // 
      // okButton
      // 
      this.okButton.Location = new System.Drawing.Point(15, 136);
      this.okButton.Name = "okButton";
      this.okButton.Size = new System.Drawing.Size(75, 23);
      this.okButton.TabIndex = 3;
      this.okButton.Text = "OK";
      this.okButton.UseVisualStyleBackColor = true;
      this.okButton.Click += new System.EventHandler(this.okButton_Click);
      // 
      // SelectForm
      // 
      this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
      this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
      this.ClientSize = new System.Drawing.Size(292, 168);
      this.Controls.Add(this.okButton);
      this.Controls.Add(this.selectLabel);
      this.Controls.Add(this.selectListBox);
      this.Icon = ((System.Drawing.Icon)(resources.GetObject("$this.Icon")));
      this.Name = "SelectForm";
      this.Text = "toBeGiven";
      this.ResumeLayout(false);
      this.PerformLayout();

    }

    #endregion

    private System.Windows.Forms.ListBox selectListBox;
    private System.Windows.Forms.Label selectLabel;
    private System.Windows.Forms.Button okButton;
  }
}