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
                TrimClient trimClient = new TrimClient("http://[IPaddress]/HPECMServiceAPI");  // Change [IPaddress] to match your ServiceAPI machine
                trimClient.Credentials = System.Net.CredentialCache.DefaultCredentials;

                Location myloc = new Location() { Uri = [PersonUri] };  // Change [PersonUri] to the person location you want to the member of a group location
                myloc.AddAction(
                    new AddRelationship()
                    {
                        RelatedLocation = new LocationRef() { Uri = [GroupUri] },  // Change [GroupUri] to the group location you want to add the membership to
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
                    MessageBox.Show("Association Updated");
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message);
            }
        }
    }
}
