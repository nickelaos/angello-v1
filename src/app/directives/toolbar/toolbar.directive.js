import angular from 'angular';
import ToolbarController from './toolbar.controller';
import template from './toolbar.html';

function toolbar() {
    return {
        restrict: 'E',
        scope: {},
        controller: ToolbarController,
        controllerAs: 'toolbar',
        template: template
    }
}

export default angular.module('directives.toolbar', [])
    .directive('toolbar', toolbar)
    .name
