;(function(ng) {
  'use strict';

  ng
    .module('alt.select-service', [])
    .service('AltSelectService', ['$timeout', '$compile', function($timeout, $compile) {
      var TIMEOUT = 33;

      // $timeout: necessário para remover problema de tempo de execução entre o angular e o select2
      // antes da modificação, por mais que o select estivesse selecionado no html, o select2 não atualizava

      this.inicializar = function(id, opt) {
        $timeout(function() {
          $(id).select2(opt);
        }, TIMEOUT);
      };

      this.inicializarComOpcaoDeNaoEncontrado = function(id, optCriacaoEntidade, optSelect2) {
        /*
            strMetodo: string,
            escopo: $scope
        */

        if (!ng.isObject(optCriacaoEntidade)) {
          throw new TypeError("O segundo parâmetro deve ser um objeto.");
        }

        if (!optCriacaoEntidade.strMetodo) {
          throw new TypeError("A primeira propriedade do objeto deve ser strMetodo.");
        }

        if (!optCriacaoEntidade.escopo) {
          throw new TypeError("A segunda propriedade do objeto deve ser escopo.");
        }

        var _msgBase = `
        <div>
          <span>Nenhum resultado encontrado...</span>
          <button class="btn btn-link alt-select-botao-criacao-entidade alt-espacamento-left"
                  ng-click="${optCriacaoEntidade.strMetodo}">
                  <span>Criar</span>
          </button>
          <script>
            ;(function() {
              document.querySelector(".alt-select-botao-criacao-entidade").addEventListener("click", function() {
                $("${id}").select2("close");
              });
            }());
          </script>
        </div>`;

        var _optExtendido = ng.extend(optSelect2, {
          language: {
            noResults: function(s) {
              return $compile(angular.element(_msgBase))(optCriacaoEntidade.escopo);
            }
          },
          escapeMarkup: function(m) {return m;}
        });

        $timeout(function() {
          $(id).select2(_optExtendido);
        }, TIMEOUT);
      };

      this.abrir = function(id, opt) {
        $timeout(function() {
          $(id).select2('open', opt);
        }, TIMEOUT);
      }

      this.fechar = function(id) {
        $timeout(function() {
          $(id).select2('close');
        }, TIMEOUT);
      }
  }]);
}(angular));
