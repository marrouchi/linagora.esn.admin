'use strict';

angular.module('linagora.esn.admin')

.controller('adminModulesDisplayerController', function($stateParams, $scope, $timeout, ADMIN_MODULES, ADMIN_FORM_EVENT, _, adminDomainConfigService, asyncAction, adminModulesApi) {
  var self = this;
  var moduleMetaData = ADMIN_MODULES[self.module.name];
  var domainId = $stateParams.domainId;
  var HOMEPAGE_KEY = 'homePage';
  var timeoutDuration = 500;

  self.title = moduleMetaData.title;
  self.template = moduleMetaData.template;
  self.hasConfiguration = moduleMetaData.configurations.length > 0;
  self.icon = moduleMetaData.icon;
  self.isEnabled = true;
  self.configurations = {};

  self.setHome = function(event) {

    event.stopPropagation();

    if (moduleMetaData.homePage !== self.currentHomepage) {
      var currentHomePage = self.currentHomepage;

      self.currentHomepage = moduleMetaData.homePage;

      return asyncAction('Setting ' + moduleMetaData.title + ' as home', function() {
        return adminDomainConfigService.set(domainId, HOMEPAGE_KEY, moduleMetaData.homePage);
      }).catch(function() {
        $timeout(function() {
          self.currentHomepage = currentHomePage;
        }, timeoutDuration);
      });
    }
  };

  self.isHomePage = function() {
    return self.currentHomepage === moduleMetaData.homePage;
  };

  angular.forEach(moduleMetaData.configurations, function(name) {
    var feature = _.find(self.module.configurations, { name: name });

    if (!feature) {
      feature = { name: name };
      self.module.configurations.push(feature);
    }

    self.configurations[name] = feature;
  });

  self.save = function() {
    var modules = [];

    modules.push(self.module);

    return asyncAction('Modification of ' + moduleMetaData.title + ' module\'s settings', function() {
      return adminModulesApi.set(domainId, modules).then(function() {
        $scope.$broadcast(ADMIN_FORM_EVENT.submit);
        $scope.form.$setPristine();
      });
    });
  };

  self.reset = function() {
    $scope.$broadcast(ADMIN_FORM_EVENT.reset);
    $scope.form.$setPristine();
  };
});
