import './auth.scss'

import angular from 'angular'
import uirouter from '@uirouter/angularjs'

import holder from '../../directives/holder.directive'
import routes from './auth.routes'

import AuthController from './auth.controller'

export default angular.module('app.auth', [uirouter, holder])
    .config(routes)
    .controller('AuthController', AuthController)
    .name
