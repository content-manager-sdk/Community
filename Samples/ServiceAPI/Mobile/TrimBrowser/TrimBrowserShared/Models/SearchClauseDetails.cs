using HP.HPTRIM.ServiceModel;
using System;
using System.Collections.Generic;
using System.Text;

namespace TrimBrowser
{
    public class SearchClauseDetails
    {
        private SearchClauseDetails() { }
        public SearchClauseDetails(SearchClauseDef clauseDef) {
            Name = clauseDef.Name;
            Caption = clauseDef.Caption;
        }


        public string Name { get; set; }

        public string Caption { get; set; }


        public override string ToString()
        {
            return Caption;
        }
    }
}
