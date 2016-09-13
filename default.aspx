<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="default.aspx.cs" Inherits="S3PWebUI._default" %>

    <!DOCTYPE html>

    <html xmlns="http://www.w3.org/1999/xhtml" ng-app="app">

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

    <body>
        <sub-window></sub-window>
        <form id="form1" runat="server">
            <div>
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
                            <!--<a href="/" ng-class="{ active: isActive('/')}" class="item">S3P Dashboard</a>
                    <a href="/social" ng-class="{ active: isActive('/social')}"class="item">Social Media</a>
                    <a href="/stackexchange" ng-class="{ active: isActive('/stackexchange')}" class="item">StackExchange</a>
                    <a href="/msdn" ng-class="{ active: isActive('/msdn')}" class="item">MSDN/TN Fourms</a>-->

                            <div class="ui dropdown simple item" ng-class="{select: $state.includes('home')}">
                                S3P <i class="dropdown icon"></i>
                                <div class="menu">
                                    <a class="item" ui-sref="home.about">What's S3P</a>
                                    <a class="item" ui-sref="home.dashboard">Dashboard</a>
                                </div>
                            </div>

                            <div class="ui dropdown simple item" ng-class="{select: $state.includes('social')}">
                                Social Media <i class="dropdown icon"></i>
                                <div class="menu">
                                    <a class="item" ui-sref="social.platform({platform:'twitter'})">Twitter</a>
                                </div>
                            </div>

                            <div class="ui dropdown simple item" ng-class="{select: $state.includes('thirdParty')}">
                                Third Party Forums <i class="dropdown icon"></i>
                                <div class="menu">
                                    <a class="item" ui-sref="thirdParty.platform({platform:'so'})">Stackoverflow</a>
                                    <a class="item" ui-sref="thirdParty.platform({platform:'su'})">SuperUser</a>
                                    <a class="item" ui-sref="thirdParty.platform({platform:'sf'})">ServerFault</a>
                                    <a class="item" ui-sref="thirdParty.platform({platform:'lithium'})">Lithium</a>
                                </div>
                            </div>

                            <div class="ui dropdown simple item" ng-class="{select: $state.includes('msPlatform')}">
                                MS Platforms <i class="dropdown icon"></i>
                                <div class="menu">
                                    <a class="item" ui-sref="msPlatform.platform({platform:'msdn'})">MSDN Forums</a>
                                    <a class="item" ui-sref="msPlatform.platform({platform:'tn'})">Technet Forums</a>
                                </div>
                            </div>

                            <div class="item ui label simple dropdown" style="display: flex !important;">
                                <%=UserAlias %>
                                    <i class="dropdown icon"></i>
                                    <div class="menu">
                                        <a class="item" ui-sref="/">Profile</a>
                                        <!--<a class="item">Subscription</a>-->
                                        <a class="item" runat="server" id="btnSignOut" onserverclick="signoutBtn_Click">Sign Out</a>
                                    </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!--top menu end-->

            </div>
            <div id="main">
                <!--<div ng-view></div>-->
                <div ui-view></div>
                <!--contain body-->
            </div>
        </form>
        <script type="text/javascript" src="/public/main.min.js"></script>
    </body>

    </html>