'use strict';

/* global chai: false */
/* global sinon: false */

var expect = chai.expect;

describe('The adminUserQuickFormController', function() {
  var $controller, $rootScope, $scope;
  var domainAPI;
  var domainId = '123456';

  beforeEach(function() {
    module('linagora.esn.admin');

    inject(function(_$controller_, _$rootScope_, _domainAPI_) {
      $controller = _$controller_;
      $rootScope = _$rootScope_;
      domainAPI = _domainAPI_;
    });
  });

  function initController(scope) {
    $scope = scope || $rootScope.$new();

    var controller = $controller('adminUserQuickFormController', { $scope: $scope }, { domainId: domainId });

    $scope.$digest();

    return controller;
  }

  describe('The save fn', function() {
    var userMock;

    beforeEach(function() {
      userMock = {
        password: 'password',
        accounts: [{
          type: 'email',
          emails: ['test@linagora.com']
        }],
        domains: [
          { domain_id: domainId }
        ]
      };
    });

    it('shoud reject if form is invalid', function(done) {
      var form = {
        $valid: false
      };

      var controller = initController();
      domainAPI.createMember = sinon.stub().returns($q.when());

      controller.save(form).catch(function() {
        expect(domainAPI.createMember).to.have.not.been.called;
        done();
      });

      $scope.$digest();
    });

    it('shoud call domainAPI.createMember to create member of domain', function(done) {
      var form = {
        $valid: true,
        $setPristine: sinon.spy()
      };

      var controller = initController();
      domainAPI.createMember = sinon.stub().returns($q.when({data: 'value'}));
      controller.user = userMock;

      controller.save(form).then(function() {
        expect(domainAPI.createMember).to.have.been.calledWith(domainId, userMock);
        expect(form.$setPristine).to.have.been.called;
        done();
      });

      $scope.$digest();
    });
  });
});
