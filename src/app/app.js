import '../styles/app.scss';

import angular from 'angular';

import ngAria from 'angular-material';
import ngMaterial from 'angular-material';
import ngMessages from 'angular-material';

import ngAnimate from 'angular-animate';

import collapse from 'ui-bootstrap4/src/collapse';
import uirouter from '@uirouter/angularjs';

import appConfig from './app.config';
import appRun from './app.run';
import AppController from './app.controller';

import auth from './components/auth';
import storyboard from './components/storyboard';

import toolbar from './directives/toolbar/toolbar.directive';

import StoriesService from './services/stories.service';
import ListsService from './services/lists.service';
import DNDService from './services/dnd.service.js';
import STORY_TYPES from './services/storyTypes.service'; // temp

angular
    .module('app', [
        ngAria,
        ngMaterial,
        ngMessages,
        ngAnimate,
        collapse,
        uirouter,
        auth,
        storyboard,
        toolbar
    ])
    .config(appConfig.routing)
    .run(appRun)
    .controller('AppController', AppController)
    .service('StoriesService', StoriesService)
    .service('ListsService', ListsService)
    .service('DNDService', DNDService)
    .value('STORY_TYPES', STORY_TYPES);
