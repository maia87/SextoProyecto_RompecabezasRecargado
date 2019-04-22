var expect = chai.expect;

describe('Creación', function() {
  'use strict';

  describe('Juego', function() {
    it('El Objeto Juego está definido', function(done) {
      if (!window.Juego){
        done(err);
      }
      else{
        done();
      }
    });
  });

  describe('Tamaño de la grilla', function() {
    it('La grilla tiene el tamaño correcto', function() {
      //se crea la grilla con un valor de cantidad de piezas por lado
      Juego.cantidadDePiezasPorLado = 5;
      Juego.crearGrilla();
      //se evalua si el tamaño de la grilla creada es correcto
      expect(Juego.grilla.length).to.equal(Juego.cantidadDePiezasPorLado);
      expect(Juego.grilla[0].length).to.equal(Juego.cantidadDePiezasPorLado);
    });
  });

  describe('Posicion Valida', function() {
    it('La pieza está dentro de la grilla', function(done) {
      Juego.cantidadDePiezasPorLado = 2;
      if (Juego.posicionValida(-1,1)||Juego.posicionValida(1,-1)||Juego.posicionValida(2,1)||Juego.posicionValida(1,2)) {
        done(err);
      }
      else{
        done();
      }
    });
  });

});

describe('Canvas', function(){
  describe('Cargar Imagen', function() {
    it('La imagen se carga correctamente',function(done) {
      if (!Juego.cargarImagen) {
        done(err);
      }
      else {
        done();
      }
    });
  });

  describe('Configurar Canvas', function(){
    it('Canvas configurado correctamente', function(done){
      if (!Juego.configurarCanvas) {
        done(err);
      }
      else {
        done();
      }
    });
  });
});
