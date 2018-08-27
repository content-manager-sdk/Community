using HP.HPRM.OfficeIntegration.ServiceAPI;
using HP.HPTRIM.Service.Client;


namespace ThinOfficePlugin
{
    public class ThinOfficePlugin : IRequestPlugin
    {
        private static string authHeader = null;

        public bool BeforeRequest(TrimClient trimClient)
        {
            PasswordWindow window = new PasswordWindow();

            if (authHeader == null)
            {
                if (window.ShowDialog() == true)
                {
                    var plainTextBytes = System.Text.Encoding.UTF8.GetBytes($"{window.Username.Text}:{window.Password.Password}");
                    authHeader = System.Convert.ToBase64String(plainTextBytes);
                }

            }

            if (authHeader != null)
            {
                trimClient.AddHeader("Authorization", $"Basic {authHeader}");

                return true;
            }
            return false;
        }
    }
}
