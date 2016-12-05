module.exports = function ($scope, $location, $timeout, $filter,$http) {
    var socket = new WebSocket("ws://localhost:8888/");
    $scope.notifications = [{date: "12/01/2016", dataSource: "su", messageType: 4, link: "somelink"}];
    socket.addEventListener('message',function(m){
        // console.log(JSON.parse(m.data))
        $scope.$apply($scope.notifications.push(JSON.parse(m.data)));
    })
    console.log($scope.CONST.MESSAGE_TYPES);
    $scope.date = $filter('date')(new Date(), 'yyyy-MM-dd');
    $scope.selectPlatform = function (platform) {
        $scope.selectedPlatform = platform;
        $scope.$broadcast('admin-select-platform', platform)
    }
    $scope.getPlatforms = function () {
        //simulate api calling
        $timeout(function () {
            // $scope.platforms = [{
            //     key: 'twitter',
            //     name: 'Twitter'
            // }, {
            //     key: 'so',
            //     name: 'Stackoverflow'
            // }, {
            //     key: 'sf',
            //     name: c
            // }, {
            //     key: 'su',
            //     name: 'Superuser'
            // }, {
            //     key: 'msdn',
            //     name: 'MSDN'
            // }, {
            //     key: 'tn',
            //     name: 'Telnet'
            // }];
            $scope.platforms = {
                'twitter':'Twitter',
                'so':'Stackoverflow',
                'sf':'Serverfault',
                'su':'Superuser',
                'msdn':'MSDN',
                'tn':'Telnet'
            };
            $('select.ui.fluid.dropdown').dropdown({
                onChange: function (value, text, $choice) {
                    console.log(value);
                }
            });
        }, 50)
    }();
    // $('.admin.cards .card').dimmer({
    //     on: 'hover'
    // });
    $scope.adaltest = function(){
    $http({url:'https://garyphp.azurewebsites.net/api.php',method:'get'}).then(function(data){
        console.log(data);
    })}
}