var Juego = {

  cantidadDePiezasPorLado: null, //lo modifica el usuario desde la interfaz
  anchoDeRompecabezas: 0,
  altoDeRompecabezas: 0,
  imagen: null,
  piezas: [], //almacena los objetos pieza
  anchoPiezas: 0,
  altoPiezas: 0,
  grilla: [],
  contexto: null,
  filaPosicionVacia: null,
  columnaPosicionVacia: null,
  contadorDeMovimientos: null,
  movimientosTotales: null,


  /*Se redefine la forma en como se crea la grilla porque ahora su tamaño es variable.
  La cantidad de piezas del tablero se va a definir en función de la propiedad cantidadDePiezasPorLado*/
  crearGrilla: function() {
    for (var i = 0; i < this.cantidadDePiezasPorLado; i++) {
      var fila = [];
      for (var j = 0; j < this.cantidadDePiezasPorLado; j++) {
        fila.push((i * this.cantidadDePiezasPorLado) + j);
      }
      this.grilla.push(fila);
    }
  },


  //antes tenia function grillaOrdenada. Lo que hago es poner "this" a grilla.
  grillaOrdenada: function(){
    // guardo la cantidad de filas de la grilla en una variable
    var cantidadFilas = this.grilla.length;
    var cantidadColumnas = this.grilla[0].length;

    // En esta variable vamos a guardar el ultimo valor visto en la grilla
    var ultimoValorVisto = 0;
    var valorActual = 0;
    // recorro cada fila columna por columna chequeando el orden de sus elementos
    for(var fila=0; fila < cantidadFilas; fila++){
      for(var columna=0; columna < cantidadColumnas; columna++){
        valorActual = this.grilla[fila][columna]
        // si el valorActual es menor al ultimoValorVisto entonces no est&aacute; ordenada
        if(valorActual < ultimoValorVisto) return false;

        // actualizamos el valor del ultimoValorVisto
        ultimoValorVisto = valorActual;
      }
    }
    // si llegamos hasta aca; quiere decir que esta ordenada
    return true;
  },

  //CHEQUEAR SI EL ROMPECABEZAS ESTÁ EN LA POSICIÓN CORRECTA.
  //antes tenia function chequearSiGano(), ahora agregué "this" a grillaOrdenada.
  chequearSiGano: function(){
    return this.grillaOrdenada();
  },

  //MOSTRAR CARTELES.
  /*Se reemplaza las alertas del rompecabezas original (función alert()) por una de SweetAlert.*/
  /*en este caso habrán 2 alertas: una para ganador y otra para perdedor
  (cuando el jugador se quede sin movimientos).*/
  mostrarCartelGanador: function() {
    var self = this;
    $(document).ready(function() {
      swal({
        title: "¡Ganaste!",
        text: "Jugar otra vez",
        type: "success" //tipo de alerta
      },
      //una vez mostrado el alerta, se reinicia el juego
      function() {
        self.iniciar(self.movimientosTotales);
      })
    });
  },

  mostrarCartelPerdedor: function() {
    var self = this;
    $(document).ready(function() {
      swal({
        title: "Perdiste",
        text: "Intentar de nuevo",
        type: "error" //tipo de alerta
      },
      function() {
        self.iniciar(self.movimientosTotales);
      })
    });
  },

  /*Actualiza la posición actual de cada pieza involucrada para saber dónde se
  ubica cada una de ellas. Lueg, cada pieza es dibujada en su nueva posición.*/
  intercambiarPosiciones: function(fila1, columna1, fila2, columna2){
    var posicionGrilla1 = this.grilla[fila1][columna1];
    var posicionGrilla2 = this.grilla[fila2][columna2];
    this.grilla[fila1][columna1] = posicionGrilla2;
    this.grilla[fila2][columna2] = posicionGrilla1;

    var pieza1 = this.piezas[posicionGrilla1];
    var pieza2 = this.piezas[posicionGrilla2];

    var sx1 = pieza1.sx
    var sy1 = pieza1.sy
    var sx2 = pieza2.sx
    var sy2 = pieza2.sy

    // Actualizo la posición destino
    pieza1.sx = sx2
    pieza1.sy = sy2

    pieza2.sx = sx1
    pieza2.sy = sy1

    // Actualizo las piezas
    this.piezas[posicionGrilla1] = pieza1;
    this.piezas[posicionGrilla2] = pieza2;

    /* Se dibuja la pieza en la posicion correspondiente. Se va a buscar a la imagen
    y se configura el ancho y el alto de lo que se va a recortar de acuerdo al
    tamaño de las piezas*/
    this.contexto.drawImage(this.imagen, pieza2.x, pieza2.y, this.anchoPiezas, this.altoPiezas, pieza2.sx, pieza2.sy, this.anchoPiezas, this.altoPiezas);
    //Se dibuja el cuadrado blanco en el lugar que estaba la pieza que se movió
    this.contexto.fillStyle = "white";
    this.contexto.fillRect(pieza1.sx, pieza1.sy, this.anchoPiezas, this.altoPiezas);
  },


  //ACTUALIZAR LA POSICION DE LA PIEZA VACIA: se agregó "this" a la función original
  actualizarPosicionVacia: function(nuevaFila,nuevaColumna) {
    this.filaPosicionVacia = nuevaFila;
    this.columnaPosicionVacia = nuevaColumna;
  },

  //FUNCION: CHEQUEAR SI LA POSICION ESTÁ DENTRO DE LA GRILLA.
  /*Lo que cambia es que fila y columna ahora tienen que ser <= a la
  cantidad de piezas establecidas por el usuario */
  posicionValida: function(fila, columna) {
    return (fila >= 0 && fila < this.cantidadDePiezasPorLado) && (columna >= 0 && columna < this.cantidadDePiezasPorLado);
  },

  //REALIZAR EL MOVIMIENTO DE FICHAS.
  /* En este caso la que se mueve es la pieza vacia (la blanca) intercambiando
  su posición con otro elemento.*/
  moverEnDireccion: function(direccion) {
    var nuevaFilaPiezaBlanca;
    var nuevaColumnaPiezaBlanca;

    // Intercambia pieza blanca con la pieza que está arriba suyo
    if (direccion == 40) {
      nuevaFilaPiezaBlanca = this.filaPosicionVacia - 1;
      nuevaColumnaPiezaBlanca = this.columnaPosicionVacia;
    }
    // Intercambia pieza blanca con la pieza que está abajo suyo
    else if (direccion == 38) {
      nuevaFilaPiezaBlanca = this.filaPosicionVacia + 1;
      nuevaColumnaPiezaBlanca = this.columnaPosicionVacia;
    }
    // Intercambia pieza blanca con la pieza que está a su ize
    else if (direccion == 39) {
      nuevaFilaPiezaBlanca = this.filaPosicionVacia;
      nuevaColumnaPiezaBlanca = this.columnaPosicionVacia - 1;
    }
    // Intercambia pieza blanca con la pieza que está a su der
    else if (direccion == 37) {
      nuevaFilaPiezaBlanca = this.filaPosicionVacia;
      nuevaColumnaPiezaBlanca = this.columnaPosicionVacia + 1;
    }
    /*Se verifica si la nueva posición es válida, de ser así, se intercambia*/
    if (this.posicionValida(nuevaFilaPiezaBlanca, nuevaColumnaPiezaBlanca)) {
      this.intercambiarPosiciones(this.filaPosicionVacia, this.columnaPosicionVacia,
        nuevaFilaPiezaBlanca, nuevaColumnaPiezaBlanca);
        this.actualizarPosicionVacia(nuevaFilaPiezaBlanca, nuevaColumnaPiezaBlanca);
      }
    },

    /* Venia dada en el rompecabezas original*/
    mezclarPiezas: function(veces) {
      var that = this;
      if (veces <= 0) {
        that.capturarTeclas();
        return;
      }
      var direcciones = [40, 38, 39, 37];
      var direccion = direcciones[Math.floor(Math.random() * direcciones.length)];
      this.moverEnDireccion(direccion);
      setTimeout(function() {
        that.mezclarPiezas(veces - 1);
      }, 1);
      //se modifica el tiempo de 100 por 1 porque si las piezas son muchas entonces va a tardar mucho en mezclarlas.
    },

    /* Venia dada en el rompecabezas original*/
    capturarTeclas: function() {
      var that = this;
      document.body.onkeydown = (function(evento) {
        if (evento.which == 40 || evento.which == 38 || evento.which == 39 || evento.which == 37) {
          that.moverEnDireccion(evento.which);
          that.restarMovimientoYverSiGano();
        }
      });
    },

    capturarMouse: function(event) {
      event = event || window.event;
      x = event.offsetX;
      y = event.offsetY;
      //se verifica que la posicion que se clickea sea una pieza valida para mover
      var nuevaFilaPiezaBlanca;
      var nuevaColumnaPiezaBlanca;
      var cambioAlgo = false;
      if (y > this.filaPosicionVacia * this.altoPiezas && y < (this.filaPosicionVacia * this.altoPiezas + this.altoPiezas)) {
        if (x > (this.columnaPosicionVacia * this.anchoPiezas - this.anchoPiezas) && x < this.columnaPosicionVacia * this.anchoPiezas) {
          this.moverEnDireccion(39);
          cambioAlgo = true;
        } else if (x > (this.columnaPosicionVacia * this.anchoPiezas + this.anchoPiezas) && x < (this.columnaPosicionVacia * this.anchoPiezas + 2 * this.anchoPiezas)) {
          this.moverEnDireccion(37);
          cambioAlgo = true;
        }
      }
      if (x > this.columnaPosicionVacia * this.anchoPiezas && x < (this.columnaPosicionVacia * this.anchoPiezas + this.anchoPiezas)) {
        if (y > this.filaPosicionVacia * this.anchoPiezas - this.anchoPiezas && y < this.filaPosicionVacia * this.anchoPiezas) {
          this.moverEnDireccion(40);
          cambioAlgo = true;
        } else if (y > (this.filaPosicionVacia * this.anchoPiezas + this.anchoPiezas) && y < (this.filaPosicionVacia * this.anchoPiezas + 2 * this.anchoPiezas)) {
          this.moverEnDireccion(38);
          cambioAlgo = true;
        }
      }
      //actualiza el contador de movimientos
      if (cambioAlgo) {
        this.restarMovimientoYverSiGano();
      }
    },

    /*Se redefine la función "chequear movimiento"*/
    restarMovimientoYverSiGano: function() {
      this.contadorDeMovimientos--; ///resta la cantidad de movimientos de los permitidos
      document.getElementById("contadorDeMovimientos").innerHTML = this.contadorDeMovimientos;
      if (this.contadorDeMovimientos == 0) {
        this.mostrarCartelPerdedor();
      }
      var gano = this.chequearSiGano();
      var that = this;
      if (gano) {
        setTimeout(function() {
          that.mostrarCartelGanador();
        }, 500);
      }
    },

    //CREACIÓN DE PIEZAS DINÁMICAS
    /*Para esto usamos Canvas.Las piezas van a ser objetos.
    1º creamos un arreglo "piezas" como propiedad para almacenarlas y poder recurrir a ellas cuando necesitemos moverlas.*/
    crearPieza: function(xPos, yPos) {
      var pieza = {};
      pieza.x = xPos;
      pieza.y = yPos;
      pieza.sx = xPos;
      pieza.sy = yPos;
      return pieza;
    },

    /*2º construimos las piezas en funcion de la cantidad de piezas por lado y
    la dimension de la imagen que se usa para tal fin*/
    construirPiezas: function() {
      var i;
      var pieza;
      var xPos = 0;
      var yPos = 0;
      for (i = 0; i < this.cantidadDePiezasPorLado * this.cantidadDePiezasPorLado; i++) {
        var pieza = this.crearPieza(xPos, yPos);
        this.piezas.push(pieza);
        //se van creando las piezas por filas, para eso se suma el ancho de las piezas hasta llegar al ancho del rompecabezas.
        xPos += this.anchoPiezas;
        if (xPos >= this.anchoDeRompecabezas) {
          //cuando se llega al ancho del rompecabezas se pasa a la fila siguiente
          xPos = 0;
          yPos += this.altoPiezas;
        }
      }
      //se crea la pieza blanca y se la ubica en la ultima posicion del rompecabezas
      this.contexto.fillStyle = "white";
      this.contexto.fillRect(this.piezas[this.filaPosicionVacia * this.cantidadDePiezasPorLado + this.columnaPosicionVacia].sx, this.piezas[this.filaPosicionVacia * this.cantidadDePiezasPorLado + this.columnaPosicionVacia].sy, this.anchoPiezas, this.altoPiezas)
    },


    //se carga la imagen del rompecabezas
    cargarImagen: function(e) {
      //se calcula el ancho y el alto de las piezas de acuerdo al tamaño del canvas (600).
      this.anchoPiezas = Math.floor(600 / this.cantidadDePiezasPorLado);
      this.altoPiezas = Math.floor(600 / this.cantidadDePiezasPorLado);
      //se calcula el ancho y alto del rompecabezas de acuerdo al ancho y alto de cada pieza y la cantidad de piezas por lado
      this.anchoDeRompecabezas = this.anchoPiezas * this.cantidadDePiezasPorLado;
      this.altoDeRompecabezas = this.altoPiezas * this.cantidadDePiezasPorLado;
      this.configurarCanvas();
    },

    configurarCanvas: function() {
      //1º obtener el tag con getElementById del Canvas
      var canvas = document.getElementById('canvas');
      /*2º llamar a la función getContext para poder usar todas las funciones y propiedades provenientes del Canvas*/
      this.contexto = canvas.getContext('2d');
      canvas.width = this.anchoDeRompecabezas;
      canvas.height = this.altoDeRompecabezas;
      //dibujamos la imagen desde la posicion x=0 e y=0 del eje. Sus dimensiones van a hacer las del rompecabezas.
      this.contexto.drawImage(this.imagen, 0, 0, this.anchoDeRompecabezas, this.altoDeRompecabezas, 0, 0, this.anchoDeRompecabezas, this.altoDeRompecabezas);
    },

    //funcion que carga la imagen
    iniciarImagen: function(callback) {
      this.imagen = new Image();
      var self = this;
      //se espera a que se termine de cargar la imagen antes de ejecutar la siguiente funcion
      this.imagen.addEventListener('load', function() {
        self.cargarImagen.call(self);
        callback();
      }, false);
      this.imagen.src = "images/imagen.jpg";
    },

    //una vez elegido el nivel, se inicia el juego
    iniciar: function(cantMovimientos) {
      this.movimientosTotales = cantMovimientos;
      this.contadorDeMovimientos = cantMovimientos;
      this.piezas = [];
      this.grilla = [];
      document.getElementById("contadorDeMovimientos").innerHTML = this.contadorDeMovimientos;
      this.cantidadDePiezasPorLado = document.getElementById("cantidadPiezasPorLado").value;
      //se guarda el contexto en una variable para que no se pierda cuando se ejecute la funcion iniciarImagen (que va a tener otro contexto interno)
      var self = this;
      this.crearGrilla();
      //se instancian los atributos que indican la posicion de las fila y columna vacias de acuerdo a la cantidad de piezas por lado para que sea la ultima del tablero
      this.filaPosicionVacia = this.cantidadDePiezasPorLado - 1;
      this.columnaPosicionVacia = this.cantidadDePiezasPorLado - 1;
      //se espera a que este iniciada la imagen antes de construir las piezas y empezar a mezclarlas
      this.iniciarImagen(function() {
        self.construirPiezas();
        //la cantidad de veces que se mezcla es en funcion a la cantidad de piezas por lado que tenemos, para que sea lo mas razonable posible.
        var cantidadDeMezclas = Math.max(Math.pow(self.cantidadDePiezasPorLado, 3), 100);
        self.mezclarPiezas(cantidadDeMezclas);
      });
    },

  }
