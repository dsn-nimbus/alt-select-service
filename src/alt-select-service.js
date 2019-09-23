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

      /**
       * @description Inicializa o select com opções de ações (criar, editar, limpar).
       * @param optAcoes - object (obrigatório)
       * @param optSelect2 - object (opcional)
       */
      this.inicializarComAcoes = function(idSelect, optAcoes, optSelect2) {
        /*
        optAcoes: {
          criar: {
            metodo: string
          },
          editar: {
            metodo: string,
            exibe: string
          },
          limpar: boolean
        }
        */

        if (!ng.isObject(optAcoes)) {
          throw new TypeError("O segundo parâmetro deve ser um objeto.");
        }

        if (!optAcoes.escopo) {
          throw new TypeError("A propriedade escopo é obrigatória nas opções.");
        }

        var idSelectMsgBase = "alt-select2-id-msg-base";
        var idInputSelectPesquisa;

        var _msgBase = `
        <div>
          <span>Nenhum resultado encontrado...</span>
          ${!!optAcoes.criar ? `
            <a style="color: #6e3076;" class="alt-espacamento-left alt-select-botao-criacao-entidade" id="${idSelectMsgBase}"
              ng-click="${optAcoes.criar.metodo}">
              <i class="fa fa-plus-circle alt-hand" aria-hidden="true"></i>
              <strong class='alt-select-botao-abrir-modal alt-hand'>Criar novo</strong>
            </a>` : ''}
        </div>`;

        var _optExtendido = ng.extend(optSelect2, {
          language: {
            noResults: function(s) {
              _naoTemResultadoSelect = true;
              var el = $compile(angular.element(_msgBase))(optAcoes.escopo);
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

          $timeout(function() {
            var elSelect2 = $(idSelect).next('.select2');
            elSelect2.addClass('alt-select2-with-actions');

            if (elSelect2.find('.selection .alt-btn-select2-wrap-ations').length > 0) {
              elSelect2.find('.selection .alt-btn-select2-wrap-ations button').remove();
            }
            else {
              elSelect2.find('.selection .alt-btn-select2-wrap-ations').remove();
              elSelect2.find('.selection').append('<div class="alt-select2-wrap-ations"></div>');
            }

            var acoes = 0;
            if (!!optAcoes.limpar) {
              var elemento = elSelect2.find('.alt-select2-wrap-ations');
              if(!elemento.find('.fa-eraser').length) {
                acoes++;
                elSelect2.find('.alt-select2-wrap-ations').append($compile(angular.element(`
                <button type="button" class="btn btn-default alt-btn-select2"
                  data-original-title="Limpar"
                  tabindex="-1"
                  onclick="$('${idSelect}').select2('val', '');">
                  <i class="fa fa-eraser"></i>
                </button>`))(optAcoes.escopo));
              }
            }

            if (!!optAcoes.criar) {
              var elemento = elSelect2.find('.alt-select2-wrap-ations');
              if(!elemento.find('.fa-plus').length) {
                acoes++;
                elSelect2.find('.alt-select2-wrap-ations').append($compile(angular.element(`
                <button type="button" class="btn btn-default alt-btn-select2"
                  data-original-title="Criar&nbsp;novo"
                  tabindex="-1"
                  ng-click="${optAcoes.criar.metodo}"
                  ng-disabled="${optAcoes.criar.desabilitado}">
                  <i class="fa fa-plus"></i>
                </button>`))(optAcoes.escopo));
              }
            }

            if (!!optAcoes.editar) {
              var elemento = elSelect2.find('.alt-select2-wrap-ations');
              if(!elemento.find('.fa-pencil').length) {
                acoes++;
                elSelect2.find('.alt-select2-wrap-ations').append($compile(angular.element(`
                <button type="button" class="btn btn-default alt-btn-select2"
                  data-original-title="Editar"
                  tabindex="-1"
                  ng-click="${optAcoes.editar.metodo}"
                  ng-disabled="${optAcoes.editar.desabilitado}">
                  <i class="fa fa-pencil"></i>
                </button>`))(optAcoes.escopo));
              }
            }

            elSelect2.find('.selection .select2-selection').addClass(`alt-select2-padding-${acoes}`);

            $timeout(function() {
              $(elSelect2.find('.alt-btn-select2')).tooltip();
            }, TIMEOUT);

          }, TIMEOUT);
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

      this.obterConteudoBusca = function(id) {
        return $(id).data('select2').$dropdown.find("input").val();
      }
  }]);
}(angular));
