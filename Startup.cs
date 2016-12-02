using System;
using System.Threading.Tasks;
using Microsoft.Owin;
using Owin;
using Microsoft.Owin.Security;
using Microsoft.Owin.Security.Cookies;
using Microsoft.Owin.Security.OpenIdConnect;
using System.Threading.Tasks;
using System.Configuration;
using System.Globalization;


[assembly: OwinStartup(typeof(S3PWebUI.Startup))]

namespace S3PWebUI
{
    public class Startup
    {
        private static string clientId = ConfigurationManager.AppSettings["ida:ClientId"];
        private static string addInstance = ConfigurationManager.AppSettings["ida:AADInstance"];
        private static string tenant = ConfigurationManager.AppSettings["ida:Tenant"];
        private static string postLogoutRedirectUri = ConfigurationManager.AppSettings["ida:PostLogoutRedirectUri"];
        string authority = string.Format(CultureInfo.InvariantCulture, addInstance, tenant);
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
        private void ConfigureAuth(IAppBuilder app)
        {
            app.SetDefaultSignInAsAuthenticationType(CookieAuthenticationDefaults.AuthenticationType);
            app.UseCookieAuthentication(new CookieAuthenticationOptions());

            //app.UseOpenIdConnectAuthentication(new OpenIdConnectAuthenticationOptions
            //{
            //    ClientId = clientId,
            //    Authority = authority,
            //    PostLogoutRedirectUri = postLogoutRedirectUri,
            //    Notifications = new OpenIdConnectAuthenticationNotifications
            //    {
            //        AuthenticationFailed = context =>
            //        {
            //            context.HandleResponse();
            //            context.Response.Redirect("Error.aspx?Message=" + context.Exception.Message);
            //            return Task.FromResult(0);
            //        },
            //        AuthorizationCodeReceived = async n =>
            //        {
            //            // Enforce the reference/redirect to be HTTPS
            //            var builder = new UriBuilder(n.AuthenticationTicket.Properties.RedirectUri);
            //            builder.Scheme = "https";
            //            builder.Port = 443;
            //            n.AuthenticationTicket.Properties.RedirectUri = builder.ToString();
            //        }
            //    }
            //});
        }
    }
}
