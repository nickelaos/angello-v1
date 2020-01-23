import angular from 'angular';
import StorySummaryController from './story-summary.controller';
import StorySummaryTemplate from './story-summary.html';

function storySummary() {
    return {
        restrict: 'E',
        scope: {
            data: '='
        },
        controller: StorySummaryController,
        controllerAs: 'storySummary',
        template: StorySummaryTemplate
    }
}

export default angular.module('directives.storySummary', [])
    .directive('storySummary', storySummary)
    .name
