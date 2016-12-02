using Owin;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Globalization;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using Microsoft.Owin.Security;
using Microsoft.Owin.Security.Cookies;
using Microsoft.Owin.Security.OpenIdConnect;
using System.Threading.Tasks;


namespace S3PWebUI
{
    public partial class Index : System.Web.UI.Page
    {

        protected void Page_Load(object sender, EventArgs e)
        {
            this.SignedPH.Visible = false;
            this.SignInPH.Visible = false;
            if (!IsPostBack)
            {
                if (Request.IsAuthenticated)
                {
                    this.lblUserName.Text = HttpContext.Current.User.Identity.Name;
                    this.SignedPH.Visible = true; ;
                }
                else
                {
                    this.SignInPH.Visible = true;
                }
            }
        }

        private bool CheckLogin()
        {
            return true;
        }

        protected void signBtn_Click(object sender, EventArgs e)
        {
            if (!Request.IsAuthenticated)
            {
                HttpContext.Current.GetOwinContext().Authentication.Challenge(
                    new AuthenticationProperties { RedirectUri = "index.aspx"}, OpenIdConnectAuthenticationDefaults.AuthenticationType
                    );
            }
        }

        protected void signoutBtn_Click(object sender, EventArgs e)
        {
            HttpContext.Current.GetOwinContext().Authentication.SignOut(
                   OpenIdConnectAuthenticationDefaults.AuthenticationType, CookieAuthenticationDefaults.AuthenticationType
                   );
        }
    }
}