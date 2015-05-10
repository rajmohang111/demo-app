/**
 * Created with JetBrains WebStorm.
 * User: Anoj
 * Date: 9/13/13
 * Time: 2:00 PM
 * Angular Directives
 */
define([
    'angular',
], function (angular) {
    var directiveApp = angular.module('io.admin.directives', []);


    /**
     * Directive for showing the action popup.
     * params : popup container class name to show and hide the pop-up.
     */
    directiveApp.directive('reportOptionPopup', function() {
        // return the directive link function.
        return function(scope, element, attrs) {
            var className = attrs.reportOptionPopup;
            element.on('mouseenter', function() {
                if ( navigator.appName=='Microsoft Internet Explorer' ) {
                    var scrollTop = (document.documentElement ? document.documentElement.scrollTop :
                        document.body.scrollTop);
                }
                else{
                    var scrollTop = (angular.element('body').scrollTop());
                }
                var top = (element.find('span:eq(0)').offset().top) - scrollTop;
                element.find('.'+className).css("top",parseInt(top-20,10)).show();
            });
            element.on('mouseleave', function() {
                element.find('.'+className).hide();
            });
        }
    });



    directiveApp.directive('a', function() {
        return {
            restrict: 'E',
            link: function(scope, elem, attrs) {
                if(attrs.ngClick || attrs.href === '' || attrs.href === '#'){
                    elem.on('click', function(e){
                        e.preventDefault();
                        if(attrs.ngClick){
                            scope.$eval(attrs.ngClick);
                        }
                    });
                }
            }
       };
    });

});




