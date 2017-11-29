namespace Record_Update_SDKSample
{
    partial class SampleForm
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
            this.btnSearch = new System.Windows.Forms.Button();
            this.label3 = new System.Windows.Forms.Label();
            this.RecordNum = new System.Windows.Forms.TextBox();
            this.Save = new System.Windows.Forms.Button();
            this.RecordGroupBox = new System.Windows.Forms.GroupBox();
            this.AssigneeVal = new System.Windows.Forms.TextBox();
            this.DateCreatedVal = new System.Windows.Forms.TextBox();
            this.RecTitleVal = new System.Windows.Forms.TextBox();
            this.RecAssignee = new System.Windows.Forms.Label();
            this.RecDateCreated = new System.Windows.Forms.Label();
            this.RecTitle = new System.Windows.Forms.Label();
            this.RecNumVal = new System.Windows.Forms.Label();
            this.RecNum = new System.Windows.Forms.Label();
            this.button1 = new System.Windows.Forms.Button();
            this.label2 = new System.Windows.Forms.Label();
            this.RecordGroupBox.SuspendLayout();
            this.SuspendLayout();
            // 
            // btnSearch
            // 
            this.btnSearch.Location = new System.Drawing.Point(168, 109);
            this.btnSearch.Name = "btnSearch";
            this.btnSearch.Size = new System.Drawing.Size(75, 23);
            this.btnSearch.TabIndex = 1;
            this.btnSearch.Text = "Search";
            this.btnSearch.UseVisualStyleBackColor = true;
            this.btnSearch.Click += new System.EventHandler(this.btnSearch_Click);
            // 
            // label3
            // 
            this.label3.AutoSize = true;
            this.label3.Location = new System.Drawing.Point(22, 68);
            this.label3.Name = "label3";
            this.label3.Size = new System.Drawing.Size(82, 13);
            this.label3.TabIndex = 11;
            this.label3.Text = "Record Number";
            // 
            // RecordNum
            // 
            this.RecordNum.Location = new System.Drawing.Point(168, 68);
            this.RecordNum.Name = "RecordNum";
            this.RecordNum.Size = new System.Drawing.Size(100, 20);
            this.RecordNum.TabIndex = 12;
            this.RecordNum.Text = "1";
            // 
            // Save
            // 
            this.Save.Location = new System.Drawing.Point(408, 331);
            this.Save.Name = "Save";
            this.Save.Size = new System.Drawing.Size(75, 23);
            this.Save.TabIndex = 13;
            this.Save.Text = "Save";
            this.Save.UseVisualStyleBackColor = true;
            this.Save.Click += new System.EventHandler(this.Save_Click);
            // 
            // RecordGroupBox
            // 
            this.RecordGroupBox.Controls.Add(this.AssigneeVal);
            this.RecordGroupBox.Controls.Add(this.DateCreatedVal);
            this.RecordGroupBox.Controls.Add(this.RecTitleVal);
            this.RecordGroupBox.Controls.Add(this.RecAssignee);
            this.RecordGroupBox.Controls.Add(this.RecDateCreated);
            this.RecordGroupBox.Controls.Add(this.RecTitle);
            this.RecordGroupBox.Controls.Add(this.RecNumVal);
            this.RecordGroupBox.Controls.Add(this.RecNum);
            this.RecordGroupBox.Location = new System.Drawing.Point(27, 155);
            this.RecordGroupBox.Name = "RecordGroupBox";
            this.RecordGroupBox.Size = new System.Drawing.Size(456, 150);
            this.RecordGroupBox.TabIndex = 14;
            this.RecordGroupBox.TabStop = false;
            this.RecordGroupBox.Text = "Record Properties";
            // 
            // AssigneeVal
            // 
            this.AssigneeVal.Location = new System.Drawing.Point(123, 103);
            this.AssigneeVal.Name = "AssigneeVal";
            this.AssigneeVal.Size = new System.Drawing.Size(315, 20);
            this.AssigneeVal.TabIndex = 7;
            // 
            // DateCreatedVal
            // 
            this.DateCreatedVal.Location = new System.Drawing.Point(123, 77);
            this.DateCreatedVal.Name = "DateCreatedVal";
            this.DateCreatedVal.Size = new System.Drawing.Size(315, 20);
            this.DateCreatedVal.TabIndex = 6;
            // 
            // RecTitleVal
            // 
            this.RecTitleVal.Location = new System.Drawing.Point(123, 53);
            this.RecTitleVal.Name = "RecTitleVal";
            this.RecTitleVal.Size = new System.Drawing.Size(315, 20);
            this.RecTitleVal.TabIndex = 5;
            // 
            // RecAssignee
            // 
            this.RecAssignee.AutoSize = true;
            this.RecAssignee.Location = new System.Drawing.Point(36, 110);
            this.RecAssignee.Name = "RecAssignee";
            this.RecAssignee.Size = new System.Drawing.Size(50, 13);
            this.RecAssignee.TabIndex = 4;
            this.RecAssignee.Text = "Assignee";
            // 
            // RecDateCreated
            // 
            this.RecDateCreated.AutoSize = true;
            this.RecDateCreated.Location = new System.Drawing.Point(36, 85);
            this.RecDateCreated.Name = "RecDateCreated";
            this.RecDateCreated.Size = new System.Drawing.Size(70, 13);
            this.RecDateCreated.TabIndex = 3;
            this.RecDateCreated.Text = "Date Created";
            // 
            // RecTitle
            // 
            this.RecTitle.AutoSize = true;
            this.RecTitle.Location = new System.Drawing.Point(36, 56);
            this.RecTitle.Name = "RecTitle";
            this.RecTitle.Size = new System.Drawing.Size(27, 13);
            this.RecTitle.TabIndex = 2;
            this.RecTitle.Text = "Title";
            // 
            // RecNumVal
            // 
            this.RecNumVal.AutoSize = true;
            this.RecNumVal.Location = new System.Drawing.Point(148, 28);
            this.RecNumVal.Name = "RecNumVal";
            this.RecNumVal.Size = new System.Drawing.Size(35, 13);
            this.RecNumVal.TabIndex = 1;
            this.RecNumVal.Text = "label5";
            // 
            // RecNum
            // 
            this.RecNum.AutoSize = true;
            this.RecNum.Location = new System.Drawing.Point(36, 28);
            this.RecNum.Name = "RecNum";
            this.RecNum.Size = new System.Drawing.Size(82, 13);
            this.RecNum.TabIndex = 0;
            this.RecNum.Text = "Record Number";
            // 
            // button1
            // 
            this.button1.Location = new System.Drawing.Point(27, 25);
            this.button1.Name = "button1";
            this.button1.Size = new System.Drawing.Size(120, 23);
            this.button1.TabIndex = 15;
            this.button1.Text = "Select Database";
            this.button1.UseVisualStyleBackColor = true;
            this.button1.Click += new System.EventHandler(this.button1_Click);
            // 
            // label2
            // 
            this.label2.AutoSize = true;
            this.label2.Location = new System.Drawing.Point(165, 30);
            this.label2.Name = "label2";
            this.label2.Size = new System.Drawing.Size(35, 13);
            this.label2.TabIndex = 17;
            this.label2.Text = "label2";
            // 
            // SampleForm
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(495, 385);
            this.Controls.Add(this.label2);
            this.Controls.Add(this.button1);
            this.Controls.Add(this.RecordGroupBox);
            this.Controls.Add(this.Save);
            this.Controls.Add(this.RecordNum);
            this.Controls.Add(this.label3);
            this.Controls.Add(this.btnSearch);
            this.Name = "SampleForm";
            this.Text = "Record Update SDK Sample";
            this.RecordGroupBox.ResumeLayout(false);
            this.RecordGroupBox.PerformLayout();
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.Button btnSearch;
        private System.Windows.Forms.Label label3;
        private System.Windows.Forms.TextBox RecordNum;
        private System.Windows.Forms.Button Save;
        private System.Windows.Forms.GroupBox RecordGroupBox;
        private System.Windows.Forms.TextBox AssigneeVal;
        private System.Windows.Forms.TextBox DateCreatedVal;
        private System.Windows.Forms.TextBox RecTitleVal;
        private System.Windows.Forms.Label RecAssignee;
        private System.Windows.Forms.Label RecDateCreated;
        private System.Windows.Forms.Label RecTitle;
        private System.Windows.Forms.Label RecNumVal;
        private System.Windows.Forms.Label RecNum;
        private System.Windows.Forms.Button button1;
        private System.Windows.Forms.Label label2;
    }
}

