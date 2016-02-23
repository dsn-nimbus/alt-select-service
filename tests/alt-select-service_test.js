'use strict';

describe('Service: AltSelectService', function () {
  var AltSelectService, _timeoutMock;
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
});
