module.exports = function () {
    return {
        restrict: 'A',
        scope: {},
        link: function (scope, e, a) {
                console.log(window.innerWidth);
            // scope.isSmall=true;
            // $(window).resize(function(){
            //     // debugger;
            //     console.log(window.innerWidth);
            //     if(window.innerWidth<1200){
            //         scope.$apply(function(){
            //             scope.isSmall = false;
            //         });
            //     }else{
            //         scope.$apply(function(){
            //             scope.isSmall = true;
            //         });
            //     }
            // })
        },
        controller:'scrollCtrl'
    }
}