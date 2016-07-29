using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using HP.HPTRIM.Service.Client;
using HP.HPTRIM.ServiceModel;

namespace AddingGroupMemberships
{
    public partial class Form1 : Form
    {
        public Form1()
        {
            InitializeComponent();
        }

        private void button1_Click(object sender, EventArgs e)
        {
            try
            {
                TrimClient trimClient = new TrimClient("http://15.146.221.186/HPECMServiceAPI");
                trimClient.Credentials = System.Net.CredentialCache.DefaultCredentials;

                Location myloc = new Location() { Uri = 1011 };
                myloc.AddAction(
                    new AddRelationship()
                    {
                        RelatedLocation = new LocationRef() { Uri = 179879 },
                        RelationshipType = LocRelationshipType.MemberOf,
                        MakeThisTheDefaultRelationship = false
                    }
                );
                LocationsResponse locresp1 = trimClient.Post<LocationsResponse>(myloc);

                if (locresp1.ResponseStatus.Message != null)
                {
                    MessageBox.Show(locresp1.ResponseStatus.Message);
                }
                else
                {
                    MessageBox.Show("Group Updated");
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message);
            }
        }
    }
}
