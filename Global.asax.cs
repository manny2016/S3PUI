using Microsoft.Owin;
using Microsoft.Owin.Security;
using Microsoft.Owin.Security.OpenIdConnect;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Security;
using System.Web.SessionState;

namespace S3PWebUI
{
    public class Global : System.Web.HttpApplication
    {

        protected void Application_Start(object sender, EventArgs e)
        {

        }

        protected void Session_Start(object sender, EventArgs e)
        {

        }

        protected void Application_BeginRequest(object sender, EventArgs e)
        {
            HttpContext.Current.Response.AddHeader("Access-Control-Allow-Origin", "*");
            if (HttpContext.Current.Request.HttpMethod == "OPTIONS")
            {
                HttpContext.Current.Response.AddHeader("Access-Control-Allow-Methods", "GET, POST");
                HttpContext.Current.Response.AddHeader("Access-Control-Allow-Headers", "Content-Type, Accept");
                HttpContext.Current.Response.AddHeader("Access-Control-Max-Age", "17280000");
                HttpContext.Current.Response.End();
            }
        }
        //protected void Application_AcquireRequestState(object sender, EventArgs e)
        //{
        //    if (!Request.IsAuthenticated)
        //    {
        //        if (Request.Url.ToString().Contains("LoginRequird.aspx?returnurl="))
        //        {
        //            string returnUrl = Request.Url.ToString().Substring(Request.Url.ToString().IndexOf("=") + 1);
        //            HttpContext.Current.GetOwinContext().Authentication.Challenge(
        //               new AuthenticationProperties { RedirectUri = returnUrl }, OpenIdConnectAuthenticationDefaults.AuthenticationType
        //               );
        //        }
        //        else
        //        {
        //            HttpContext.Current.GetOwinContext().Authentication.Challenge(
        //                new AuthenticationProperties { RedirectUri = Request.Url.AbsoluteUri }, OpenIdConnectAuthenticationDefaults.AuthenticationType
        //                );
        //        }
        //    }
        //}
        //protected void Application_AuthenticateRequest(object sender, EventArgs e)
        //{
        //    if (!Request.IsAuthenticated && Request.Url.ToString().Contains("S3PDataService.svc") && !Request.Url.ToString().Contains("returnurl="))
        //    {
        //        HttpContext.Current.Response.Redirect("~/LoginRequird.aspx?returnurl=" + Request.Url.ToString());
        //    }
        //}

        protected void Application_Error(object sender, EventArgs e)
        {

        }

        protected void Session_End(object sender, EventArgs e)
        {

        }

        protected void Application_End(object sender, EventArgs e)
        {

        }
    }
}