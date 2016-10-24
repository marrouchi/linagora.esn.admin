'use strict';

angular.module('linagora.esn.admin')

.component('adminJwtSubheader', {
  templateUrl: '/admin/app/jwt/admin-jwt-subheader',
  bindings: {
    onSaveButtonClick: '&',
    disableSaveButton: '<'
  }
});
