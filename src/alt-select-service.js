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

      this.inicializarComOpcaoCriarNovo = function(id, optCriacaoEntidade, optSelect2) {
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

        var idSelectMsgBase = "alt-select2-id-" + Date.now();
        var idSelectOpcaoCriarNovo = "alt-select2-id-" + Date.now();
        var idInputSelectPesquisa;
        var _criarNovoAppendado = false;

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
            <ul class='select2-results__option alt-cor-principal select2-cor-opcao-criar-novo' ng-click="${optCriacaoEntidade.strMetodo}" id="${idSelectOpcaoCriarNovo}">
              <i class="fa fa-plus-circle alt-hand" aria-hidden="true"></i>
              <a class="select2-cor-opcao-criar-novo"><strong class='alt-select-botao-abrir-modal alt-hand'>Criar Novo</strong></a>
            </ul>
          </div>`

        var _optExtendido = ng.extend(optSelect2, {
          language: {
            noResults: function(s) {
              var el = $compile(angular.element(_msgBase))(optCriacaoEntidade.escopo);
              $(el).find("#" + idSelectMsgBase).on("click", function(){
                $(id).select2('close');
              })

              return el;
            }
          },
          escapeMarkup: function(m) {return m;}
        });

          $timeout(function() {
            $(id).select2(_optExtendido);
          }, TIMEOUT);

          $(id).off("select2:open");
          $("#" + idInputSelectPesquisa).off("input");

          var _idsInputPesquisaCriados = false;

          $(id).on("select2:open", function(){
            $timeout(function() {
              this._appendCriarNovo(idSelectOpcaoCriarNovo, id, _opcaoCriarNovo, optCriacaoEntidade);
            }.bind(this), TIMEOUT);

            if (_idsInputPesquisaCriados === false) {
              $('.select2-search__field').each(function(){
                idInputSelectPesquisa = parseInt(Date.now() + ((Math.random() * 1000) + 1));
                $(this).attr('id', idInputSelectPesquisa);
              })
              _idsInputPesquisaCriados = true;
            }

            $("#" + idInputSelectPesquisa).on('input', function(){
              if ($("#" + idInputSelectPesquisa).val() === "" || $("#" + idInputSelectPesquisa).val() === undefined){
                this._appendCriarNovo(idSelectOpcaoCriarNovo, id, _opcaoCriarNovo, optCriacaoEntidade);
              } else if (!!$("#" + idInputSelectPesquisa).val() && $("#" + idInputSelectPesquisa).val() !== "") {
                _criarNovoAppendado = false;
              }
            }.bind(this))
          }.bind(this))

          $(id).on("select2:closing", function(){
            _criarNovoAppendado = false;
          })

          function _appendCriarNovo (idSelectPesquisa, idSelect2, _opcaoCriarNovo, optCriacaoEntidade) {
            if (this._liberadoParaCriacao()) {
              var _id = idSelect2.replace('#', "-");
              $timeout(function(){
                $("#select2" + _id + "-results").prepend($compile(angular.element(_opcaoCriarNovo))(optCriacaoEntidade.escopo));
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
