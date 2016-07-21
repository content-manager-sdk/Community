namespace CreateNewDocument
{
    partial class CreateDoc
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
            this.txtFilePath = new System.Windows.Forms.TextBox();
            this.lblFilepath = new System.Windows.Forms.Label();
            this.btnCreateDoc = new System.Windows.Forms.Button();
            this.brnBrowse = new System.Windows.Forms.Button();
            this.openFileDialog1 = new System.Windows.Forms.OpenFileDialog();
            this.SuspendLayout();
            // 
            // txtFilePath
            // 
            this.txtFilePath.Location = new System.Drawing.Point(118, 56);
            this.txtFilePath.Name = "txtFilePath";
            this.txtFilePath.Size = new System.Drawing.Size(100, 20);
            this.txtFilePath.TabIndex = 0;
            // 
            // lblFilepath
            // 
            this.lblFilepath.AutoSize = true;
            this.lblFilepath.Location = new System.Drawing.Point(64, 59);
            this.lblFilepath.Name = "lblFilepath";
            this.lblFilepath.Size = new System.Drawing.Size(51, 13);
            this.lblFilepath.TabIndex = 1;
            this.lblFilepath.Text = "FilePath: ";
            // 
            // btnCreateDoc
            // 
            this.btnCreateDoc.Location = new System.Drawing.Point(67, 114);
            this.btnCreateDoc.Name = "btnCreateDoc";
            this.btnCreateDoc.Size = new System.Drawing.Size(167, 23);
            this.btnCreateDoc.TabIndex = 2;
            this.btnCreateDoc.Text = "Create New Document";
            this.btnCreateDoc.UseVisualStyleBackColor = true;
            this.btnCreateDoc.Click += new System.EventHandler(this.btnCreateDoc_Click);
            // 
            // brnBrowse
            // 
            this.brnBrowse.Location = new System.Drawing.Point(224, 56);
            this.brnBrowse.Name = "brnBrowse";
            this.brnBrowse.Size = new System.Drawing.Size(75, 23);
            this.brnBrowse.TabIndex = 3;
            this.brnBrowse.Text = "Browse...";
            this.brnBrowse.UseVisualStyleBackColor = true;
            this.brnBrowse.Click += new System.EventHandler(this.brnBrowse_Click);
            // 
            // openFileDialog1
            // 
            this.openFileDialog1.FileName = "openFileDialog1";
            // 
            // CreateDoc
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(353, 209);
            this.Controls.Add(this.brnBrowse);
            this.Controls.Add(this.btnCreateDoc);
            this.Controls.Add(this.lblFilepath);
            this.Controls.Add(this.txtFilePath);
            this.Name = "CreateDoc";
            this.Text = "Create New Document";
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.TextBox txtFilePath;
        private System.Windows.Forms.Label lblFilepath;
        private System.Windows.Forms.Button btnCreateDoc;
        private System.Windows.Forms.Button brnBrowse;
        private System.Windows.Forms.OpenFileDialog openFileDialog1;
    }
}