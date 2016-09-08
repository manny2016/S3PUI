<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="default.aspx.cs" Inherits="S3PWebUI._default" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>Service Status and Sentiment Predictor (S3P)</title>
    <base href="/" />
    <link rel="stylesheet" href="/public/semantic.css" />
    <link rel="stylesheet" href="/public/css/style.css" />
    <link rel="stylesheet" href="/public/css/Animated.css" />
    <script type="text/javascript" src="/public/jquery-2.2.4.min.js"></script>
    <script type="text/javascript" src="/public/semantic.min.js"></script>
    <script type="text/javascript" src="/public/echarts.min.js"></script>
    <script type="text/javascript" src="/public/macarons.js"></script>
    <script type="text/javascript" src="/public/echarts-wordcloud.min.js"></script>
</head>

<body ng-app="app">
     <form id="form1" runat="server">
    <div ng-controller="navCtrl">
        <!--********-->
        <!--Top Menu-->
        <!--********-->
        <div class="ui top menu">
            <div class="ui container">
                <div class="ui header item">
                    <!--<img class="logo" src="assets/images/logo.png">-->
                    S3P
                    <div class="text tiny" style="margin-left:10px;">
                        Service Status and Sentiment Predictor
                    </div>
                </div>
                <div class="menu right">
                    <a href="/" ng-class="{ active: isActive('/')}" class="item">What's S3P</a>
                    <a href="/social" ng-class="{ active: isActive('/social')}"class="item">Social Community</a>
                    <a href="/" ng-class="{ active: isActive('/stackexchange')}" class="item">StackExchange</a>
                    <a href="/" ng-class="{ active: isActive('/msdn')}" class="item">MSDN/TN Fourms</a>

                    <div class="right item ui label simple dropdown" style="display: flex !important;">
                        <%--<img class="ui mini circular image avator right spaced" src="public/images/patrick.png">--%>
                            <div class="text tiny"><%=UserAlias %></div>
                        <i class="dropdown icon"></i>
                        <div class="menu">
                            <a class="item">Profile</a>
                            <!--<a class="item">Subscription</a>-->
                            <a class="item" runat="server" id="btnSignOut" onserverclick="signoutBtn_Click">Sign Out</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!--top menu end-->
        <div id="main">
            <div ng-view></div>
            <!--contain body-->
        </div>
    </div>
   </form>
    <script type="text/javascript" src="/public/main.min.js"></script>
</body>
</html>
