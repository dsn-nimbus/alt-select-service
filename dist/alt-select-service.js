;(function() {
  'use strict';

  angular
    .module('alt.select-service', [])
    .service('AltSelectService', ['$timeout', function($timeout) {
      this.inicializar = function(id, opt) {
      // $timeout: necessário para remover problema de tempo de execução entre o angular e o select2
      // antes da modificação, por mais que o select estivesse selecionado no html, o select2 não atualizava

        $timeout(function() {
          $(id).select2(opt);
        }, 33);
      };
  }]);
}());
