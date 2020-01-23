import './storyboard.scss';

import angular from 'angular';
import uirouter from '@uirouter/angularjs';

import routes from './storyboard.routes';

import StoryboardController from './storyboard.controller';
import storySummary from './directives/story-summary/story-summary.directive';

export default angular.module('app.storyboard', [uirouter, storySummary])
    .config(routes)
    .controller('StoryboardController', StoryboardController)
    .name
