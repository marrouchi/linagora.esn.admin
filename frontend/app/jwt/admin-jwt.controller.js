'use strict';

angular.module('linagora.esn.admin')

.controller('adminJwtController', function($stateParams, adminConfigApi, adminDomainConfigService, asyncAction, esnFileSaver, ADMIN_JWT_AVAILABLE_ALGORITHMS) {
  var self = this;
  var domainId = $stateParams.domainId;
  var CONFIG_NAME = 'jwt';

  adminDomainConfigService.get(domainId, CONFIG_NAME)
    .then(function(data) {
      self.config = data || {};
      self.expiration = _convertExpiration(self.config.expiresIn);
    });

  self.availableAlgorithms = ADMIN_JWT_AVAILABLE_ALGORITHMS;

  self.save = function() {
    return asyncAction('Modification of JWT configuration', _saveConfiguration);
  };

  self.onExpirationChange = function() {
    if (self.expiration) {
      self.config.expiresIn = self.expiration + ' days';
    }
  };

  self.downloadPublicKey = function() {
    esnFileSaver.saveText(self.config.publicKey, 'publicKey.txt');
  };

  self.downloadPrivateKey = function() {
    esnFileSaver.saveText(self.config.privateKey, 'privateKey.txt');
  };

  self.generate = function(form) {
    return asyncAction('Generating new keys', _generateKeyPair)
      .then(function(resp) {
        self.config.publicKey = resp.data.publicKey;
        self.config.privateKey = resp.data.privateKey;
        form.$setDirty();
      });
  };

  function _saveConfiguration() {
    return adminDomainConfigService.set(domainId, CONFIG_NAME, self.config);
  }

  function _convertExpiration(expiration) {
    var match = expiration && String(expiration).match(/^([0-9]+) days$/);

    if (match) {
      return parseInt(match[1], 10);
    }
  }

  function _generateKeyPair() {
    return adminConfigApi.generateJwtKeyPair(domainId);
  }
});
