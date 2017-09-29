'use strict';

describe('Service: AltSelectService', function () {
  var AltSelectService, _timeoutMock, _eventoAbreSelect;
  var TEMPO = 99;

  beforeEach(module('alt.select-service'));

  beforeEach(inject(function($injector) {
    AltSelectService = $injector.get('AltSelectService');
    _timeoutMock = $injector.get('$timeout');
  }));

  describe('criação', function() {
    it('deve estar definido', function() {
      expect(AltSelectService).toBeDefined();
      expect(typeof AltSelectService).toBe("object");
    })
  })

  describe('inicializar', function() {
    it('deve chamar o inicializar corretamente - chamando o que é passado por parâmetro', function() {
      var _id = 0;
      var _opcoes = undefined;

      spyOn($.fn, 'select2').and.callFake(angular.noop);

      AltSelectService.inicializar(_id, _opcoes);

      _timeoutMock.flush(TEMPO);

      expect($('a').select2).toHaveBeenCalledWith(_opcoes);
    })

    it('deve chamar o inicializar corretamente - chamando o que é passado por parâmetro', function() {
      var _id = 1;
      var _opcoes = {a: true};

      spyOn($.fn, 'select2').and.callFake(angular.noop);

      AltSelectService.inicializar(_id, _opcoes);

      _timeoutMock.flush(TEMPO);

      expect($('a').select2).toHaveBeenCalledWith(_opcoes);
    })
  })

  describe('inicializarComOpcaoCriarNovo', function(){
    it('Deve trazer mensagem de erro quando o segundo parâmetro da função não é um objeto.', function(){
      var _id = 1;

      expect(function(){
        AltSelectService.inicializarComOpcaoCriarNovo(_id, undefined)
      }).toThrow(TypeError("O segundo parâmetro deve ser um objeto."));
    })

    it('Deve trazer mensagem de erro quando a primeira propriedade do objeto não for strMetodo.', function(){
      var _id = 1;
      var _optCriacaoEntidade = {nEhStrMetodo: "_metodo()",
                                 escopo: "escopo"};

      expect(function(){
        AltSelectService.inicializarComOpcaoCriarNovo(_id, _optCriacaoEntidade)
      }).toThrow(TypeError("A primeira propriedade do objeto deve ser strMetodo."));
    })

    it('Deve trazer mensagem de erro quando a segunda propriedade do objeto não for escopo.', function(){
      var _id = 1;
      var _optCriacaoEntidade = {strMetodo: "_metodo()",
                                 nEhEscopo: "escopo"};

      expect(function(){
        AltSelectService.inicializarComOpcaoCriarNovo(_id, _optCriacaoEntidade)
      }).toThrow(TypeError("A segunda propriedade do objeto deve ser escopo."));
    })

    it('O select deve ser chamado corretamente com as informações passadas por parâmetro.', function(){
      var _id = 1;
      var _optCriacaoEntidade = {strMetodo: "_metodo()",
                                 escopo: "escopo"};

      var _optSelect2 = {attr: "attr"};
      var _esperado = {
          attr: "attr",
          language: {
            noResults: jasmine.any(Function)
          },
          escapeMarkup: jasmine.any(Function)
        }

      spyOn($.fn, 'select2').and.callFake(angular.noop);

      AltSelectService.inicializarComOpcaoCriarNovo(_id, _optCriacaoEntidade, _optSelect2);
      _timeoutMock.flush(TEMPO);

      expect($('a').select2).toHaveBeenCalledWith(jasmine.objectContaining(_esperado));
    })

    it('O select deve ser chamado corretamente mesmo não sendo passado parâmetro.', function(){
      var _id = 1;
      var _optCriacaoEntidade = {strMetodo: "_metodo()",
                                 escopo: "escopo"};

      var _optSelect2 = {};
      var _esperado = {
            language: {
              noResults: jasmine.any(Function)
            },
            escapeMarkup: jasmine.any(Function)
          }

      spyOn($.fn, 'select2').and.callFake(angular.noop);

      AltSelectService.inicializarComOpcaoCriarNovo(_id, _optCriacaoEntidade, _optSelect2);
      _timeoutMock.flush(TEMPO);

      expect($('a').select2).toHaveBeenCalledWith(jasmine.objectContaining(_esperado));
    })
  });

  describe('abrir', function() {
    it('deve chamar o abrir corretamente - chamando o que é passado por parâmetro', function() {
      var _id = 0;
      var _opcoes = undefined;

      spyOn($.fn, 'select2').and.callFake(angular.noop);

      AltSelectService.abrir(_id, _opcoes);

      _timeoutMock.flush(TEMPO);

      expect($('a').select2).toHaveBeenCalledWith('open', _opcoes);
    })

    it('deve chamar o inicializar corretamente - chamando o que é passado por parâmetro', function() {
      var _id = 1;
      var _opcoes = {a: true};

      spyOn($.fn, 'select2').and.callFake(angular.noop);

      AltSelectService.abrir(_id, _opcoes);

      _timeoutMock.flush(TEMPO);

      expect($('a').select2).toHaveBeenCalledWith('open', _opcoes);
    })
  })

  describe('fechar', function(){
    it('Deve fechar o select corretamente não passando o segundo parâmetro', function(){
      var _id = 1;

      spyOn($.fn, 'select2').and.callFake(angular.noop);
      AltSelectService.fechar(_id);
      _timeoutMock.flush(TEMPO);

      expect($('a').select2).toHaveBeenCalledWith('close');
    })
  })
});
