namespace SDK_Basics_Searching
{
  partial class InputForm
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
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(InputForm));
            this.inputLabel = new System.Windows.Forms.Label();
            this.inputTextBox = new System.Windows.Forms.TextBox();
            this.inputSendButton = new System.Windows.Forms.Button();
            this.SuspendLayout();
            // 
            // inputLabel
            // 
            this.inputLabel.AutoSize = true;
            this.inputLabel.Location = new System.Drawing.Point(12, 9);
            this.inputLabel.Name = "inputLabel";
            this.inputLabel.Size = new System.Drawing.Size(0, 13);
            this.inputLabel.TabIndex = 0;
            // 
            // inputTextBox
            // 
            this.inputTextBox.Location = new System.Drawing.Point(91, 7);
            this.inputTextBox.Name = "inputTextBox";
            this.inputTextBox.Size = new System.Drawing.Size(227, 20);
            this.inputTextBox.TabIndex = 1;
            // 
            // inputSendButton
            // 
            this.inputSendButton.Location = new System.Drawing.Point(324, 7);
            this.inputSendButton.Name = "inputSendButton";
            this.inputSendButton.Size = new System.Drawing.Size(37, 20);
            this.inputSendButton.TabIndex = 2;
            this.inputSendButton.Text = "OK";
            this.inputSendButton.UseVisualStyleBackColor = true;
            this.inputSendButton.Click += new System.EventHandler(this.inputSendButton_Click);
            // 
            // InputForm
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.AutoSize = true;
            this.ClientSize = new System.Drawing.Size(385, 38);
            this.Controls.Add(this.inputSendButton);
            this.Controls.Add(this.inputTextBox);
            this.Controls.Add(this.inputLabel);
            this.FormBorderStyle = System.Windows.Forms.FormBorderStyle.FixedSingle;
            this.Icon = ((System.Drawing.Icon)(resources.GetObject("$this.Icon")));
            this.MaximizeBox = false;
            this.MaximumSize = new System.Drawing.Size(401, 100);
            this.MinimizeBox = false;
            this.MinimumSize = new System.Drawing.Size(401, 55);
            this.Name = "InputForm";
            this.ResumeLayout(false);
            this.PerformLayout();

    }

    #endregion

    private System.Windows.Forms.Label inputLabel;
    private System.Windows.Forms.TextBox inputTextBox;
    private System.Windows.Forms.Button inputSendButton;
  }
}