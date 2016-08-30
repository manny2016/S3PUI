module.exports = function ($scope) {
    console.log($scope)
     $scope.isSmall=true;
            $(window).resize(function(){
                // debugger;
                console.log(window.innerWidth);
                if(window.innerWidth<1200){
                    // $scope.$apply(function(){
                        $scope.isSmall = false;
                    // });
                }else{
                    // $scope.$apply(function(){
                        $scope.isSmall = true;
                    // });
                }
                console.log($scope.isSmall)
            })
}