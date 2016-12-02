using Microsoft.Owin.Security;
using Microsoft.Owin.Security.Cookies;
using Microsoft.Owin.Security.OpenIdConnect;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace S3PWebUI
{
    public partial class _default : System.Web.UI.Page
    {
        public string UserAlias;
        protected void Page_Load(object sender, EventArgs e)
        {
            if (Request.IsAuthenticated)
            {
                this.UserAlias = HttpContext.Current.User.Identity.Name.Replace("live.com#", string.Empty);
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