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

      this.inicializarComOpcaoCriarNovo = function(idSelect, optCriacaoEntidade, optSelect2) {
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

        var idSelectMsgBase = "alt-select2-id-msg-base";
        var idSelectOpcaoCriarNovo;
        var idInputSelectPesquisa;
        var _criarNovoAppendado = false;
        var _naoTemResultadoSelect = false;
        var _idsInputGerados = false;

        var _msgBase = `
        <div>
          <span>Nenhum resultado encontrado...</span>
          <a style="color: #6e3076;" class="alt-espacamento-left alt-select-botao-criacao-entidade" id="${idSelectMsgBase}"
                  ng-click="${optCriacaoEntidade.strMetodo}">
                  <i class="fa fa-plus-circle alt-hand" aria-hidden="true"></i>
                  <strong class='alt-select-botao-abrir-modal alt-hand'>Criar Novo</strong>
          </a>
        </div>`

        var _opcaoCriarNovo = `
          <div>
            <ul style="padding-left: 10px;" class='alt-espacamento-top alt-cor-principal select2-cor-opcao-criar-novo alt-hand' ng-click="${optCriacaoEntidade.strMetodo}" id="${idSelectOpcaoCriarNovo}">
              <i class="fa fa-plus-circle" aria-hidden="true"></i>
              <a class="select2-cor-opcao-criar-novo"><strong class='alt-select-botao-abrir-modal alt-hand'>Criar Novo</strong></a>
            </ul>
          </div>`

        var _optExtendido = ng.extend(optSelect2, {
          language: {
            noResults: function(s) {
              _naoTemResultadoSelect = true;
              var el = $compile(angular.element(_msgBase))(optCriacaoEntidade.escopo);
              $(el).find("#" + idSelectMsgBase).on("click", function(){
                $(idSelect).select2('close');
              })

              return el;
            }
          },
          escapeMarkup: function(m) {return m;}
        });

          $timeout(function() {
            $(idSelect).select2(_optExtendido);
          }, TIMEOUT);

          $(idSelect).off("select2:open");
          $("#" + idInputSelectPesquisa).off("input");

          $(idSelect).on("select2:open", function(){
            $timeout(function() {
              _appendCriarNovo(idSelectOpcaoCriarNovo, idSelect, idInputSelectPesquisa, _opcaoCriarNovo, optCriacaoEntidade);
            }.bind(this), TIMEOUT);

            if (_idsInputGerados === false) {
              let i = 1;
              $('.select2-search__field').each(function(){
                idInputSelectPesquisa = "alt-select2-id-campo-pesquisa-" + parseInt(Date.now() + i);
                $(this).attr('id', idInputSelectPesquisa);
                i++;
              })

              $("#" + idInputSelectPesquisa).on('input', function(){
                if (!!_naoTemResultadoSelect) {
                  $('.select2-cor-opcao-criar-novo').remove();
                  _criarNovoAppendado = false;
                  return _naoTemResultadoSelect = false;
                } else {
                  _appendCriarNovo(idSelectOpcaoCriarNovo, idSelect, idInputSelectPesquisa, _opcaoCriarNovo, optCriacaoEntidade);
                  _criarNovoAppendado = true;
                }
              }.bind(this))

              $(idSelect).on("select2:close", function(){
                $('#' + idSelectOpcaoCriarNovo).remove();
              })

              _idsInputGerados = true;
            }
          }.bind(this))

          function _appendCriarNovo (idSelectPesquisa, idSelect2, _idInputSelectPesquisa, _opcaoCriarNovo, optCriacaoEntidade) {
            if (_liberadoParaCriacao()) {
              $timeout(function(){
                idSelectOpcaoCriarNovo = "alt-select2-id-criar-novo-" + Date.now();
                $("#" + _idInputSelectPesquisa).parent().append($compile(angular.element(_opcaoCriarNovo))(optCriacaoEntidade.escopo));
                $("#" + idSelectPesquisa).on("click", function(){
                  $(idSelect2).select2('close');
                })
              }, TIMEOUT);
              _criarNovoAppendado = true;
            }
          };

          function _liberadoParaCriacao (){
            return !_criarNovoAppendado;
          };
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
