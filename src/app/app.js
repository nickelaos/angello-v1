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

import home from './components/home';
import blog from './components/blog';
import grids from './components/grids';
import album from './components/album';
import auth from './components/auth';
import storyboard from './components/storyboard';

import toolbar from './directives/toolbar/toolbar.directive';

import StoriesService from './services/stories.service';
import ListsService from './services/lists.service';
import STORY_TYPES from './services/storyTypes.service'; // temp

angular
    .module('app', [
        ngAria,
        ngMaterial,
        ngMessages,
        ngAnimate,
        collapse,
        uirouter,
        home,
        blog,
        grids,
        album,
        auth,
        storyboard,
        toolbar
    ])
    .config(appConfig.routing)
    .run(appRun)
    .controller('AppController', AppController)
    .service('StoriesService', StoriesService)
    .service('ListsService', ListsService)
    .value('STORY_TYPES', STORY_TYPES);
