// ----------------------------------------------------------------
// Objetos y Variables globales
function doClave(){
  clave = document.getElementById('clave').value;
  var c = mrythm.parse(clave,true);
  c = c[1];
  for (var i = 0; i < 5; i++) {
    if(i<c.length){
      c[i] = String(c[i]).split('.');
      pol[i]['activo']=true;
      pol[i]['nmax']=c[i][0];
      pol[i]['patron']=c[i][1].split('');
    }else{
      pol[i]['activo']=false;
    }
  }
  interfaz();
  drawClock();
}
function readClave(){
  var c = [];
  for (var i = 0; i < 5; i++) {
    if(pol[i]['activo']){
      c.push(pol[i]['nmax']+'.'+mrythm.juntar(mrythm.binary2clave(pol[i]['patron'])));
    }
  }
  clave = c.join('/');
  document.getElementById('clave').value=clave;
}
document.getElementById('clave').onkeyup = function(event){
  this.value = mrythm.filtrar(this.value);
  if (event.keyCode === 13) {
    doClave();
    event.preventDefault();
  }
};
// Defaults de Configuración
volu = [1.0,1.0]; // Volumen default de configuración

// -- VERSION 1.9 con oscilador --
// notu = [0,5]; // Nota default de configuración

// Canvas y contexto
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
// clave inicial
var clavel = document.getElementById("clave");
clavel.value=clave;
// Más variables
var colores = [
  ['#099','#9ff'],
  ['#eb0','#fc9'],
  ['#e0e','#f9f'],
  ['#4e4','#9f9'],
  ['#44e','#99f'],
];
// ----------------------- CAMBIOS v.2 - ini -----------------------
// -- VERSION 1.9 con oscilador --
/*
var actx = null; // Web audio context
*/
// ----------------------- CAMBIOS v.2 - fin -----------------------

var regiones = [];
var isPlaying = false;
var radius = canvas.height / 2;
var angulo = 0;
var cpm = 30;
var duracompas = 60/cpm; // Duración del compás en segundos
// DEFINE SEGS --------------
// var segs = 70; // Pasos en el círculo
// var ti = Math.round( (duracompas*1000*1000) / segs ) / 1000; // En microsegundos (millonésimas)
// DEFINE TI   --------------

var segs = Math.round( (duracompas*1000) / ti ); // Pasos en el círculo
// --------------------------
var compas = 0;
var sto;
var vol = 0.8;
var ss,sti;
ctx.translate(radius, radius); // Movemos el centro
var bordep = 0.05; // Porcentaje de borde (0 - 1)
radius = radius * (1-bordep); // Un poco más pequeño que el canvas
// Variables para mantener la precisión en el tiempo
var start = null,  
    time = 0,  
    elapsed = '0.0';
var precisionmax = 0;

// Definiciones interfaz ----------
// Simples
document.getElementById("ti").value=ti;
document.getElementById("segs").value=segs;
document.getElementById("vol").value=vol;
// 60000/(ti*segs) // Tiempo por vuelta en ms / minuto
document.getElementById("cpm").value=cpm;
document.getElementById("cpmslide").value=cpm;
document.getElementById("cpmr").value=Math.round(60000000/(ti*segs))/1000;
document.getElementById("compas").value=compas;

document.getElementById("volu1").value=volu[0];
document.getElementById("volu2").value=volu[1];

// -- VERSION 1.9 con oscilador --
// document.getElementById("notu1").value=notu[0];
// document.getElementById("notu2").value=notu[1];

// --------------------------------------------------
// Definiciones interfaz ----------
function interfaz(){
  // Complejas
  var claNames = ['nmax','sonacento','songolpe','vol'];
  var lista;
  for (var j = 0; j < claNames.length; j++) {
    lista = document.getElementsByClassName(claNames[j]);
    for (var i = 0; i < lista.length; ++i) {
      lista[i].value=pol[i][claNames[j]];
    }
  }
  lista = document.getElementsByClassName('activo');
  for (var i = 0; i < lista.length; ++i) {
    lista[i].checked=pol[i]['activo'];
  }
  updateBPM();
  lista = document.getElementsByClassName('nmax');
  for (var i = 0; i < lista.length; ++i) {
    (function(index){
      lista[index].onchange = function() {
        pol[index]['nmax']=this.value;
        var mem = pol[index]['patron'];
        pol[index]['patron']=[];
        for (var i = 0; i < pol[index]['nmax']; i++) {
          if(mem[i]>=0)pol[index]['patron'].push(mem[i]);
          else pol[index]['patron'].push(1);
        }
        document.getElementsByClassName('bpm')[index].value=Math.round(this.value*60000/(ti*segs));
        drawClock();
        readClave();
      };
    }(i));
  }
  lista = document.getElementsByClassName('sonacento');
  for (var i = 0; i < lista.length; ++i) {
    (function(index){
      lista[index].onchange = function() {
        pol[index]['sonacento']=this.value;
      };
    }(i));
  }
  lista = document.getElementsByClassName('songolpe');
  for (var i = 0; i < lista.length; ++i) {
    (function(index){
      lista[index].onchange = function() {
        pol[index]['songolpe']=this.value;
      };
    }(i));
  }
  lista = document.getElementsByClassName('vol');
  for (var i = 0; i < lista.length; ++i) {
    (function(index){
      lista[index].onchange = function() {
        pol[index]['vol']=parseFloat(this.value);
      };
      lista[index].ondblclick = function() {
        this.value=1.0;
        pol[index]['vol']=1.0;
      };
    }(i));
  }
  lista = document.getElementsByClassName('activo');
  for (var i = 0; i < lista.length; ++i) {
    (function(index){
      lista[index].onchange = function() {
        pol[index]['activo']=this.checked;
        drawClock();
        readClave();
      };
    }(i));
  }
}

// --------------------------------------------------
// Iniciar
doClave();
drawFace(ctx,radius);
interfaz();
drawClock();

// --------------------------------------------------
// Listeners ----------------------
// canvas onclick
canvas.onclick=function (evt) {
    var mousePos = getMousePos(canvas, evt);
    for (var i = 0; i < regiones.length; i++) {
      if(Math.abs(regiones[i].pos.x-mousePos.x)<radius*0.08 && Math.abs(regiones[i].pos.y-mousePos.y)<radius*0.08) {
        // console.log("Poli: ",pol[regiones[i].e]['patron']);
        if(pol[regiones[i].e]['patron'][regiones[i].i]>1)pol[regiones[i].e]['patron'][regiones[i].i]=0;
        else if(pol[regiones[i].e]['patron'][regiones[i].i]==1)pol[regiones[i].e]['patron'][regiones[i].i]=2;
        else pol[regiones[i].e]['patron'][regiones[i].i]=1;
        // console.log("Poli: ",pol[regiones[i].e]['patron']);
        drawClock();
        readClave();
      }
    }
};
// Mas listeners
document.getElementById('canvasResizer').onclick = function(){
  this.style.width=this.style.height;
};

document.getElementById('compas').onchange = function() {
  compas=this.value;
};
document.getElementById('vol').onchange = function() {
  vol=this.value;
};
document.getElementById('vol').ondblclick = function() {
  this.value = 0.8;
  vol = 0.8;
};
document.getElementById('volu1').onchange = function() {
  volu[0]=this.value;
};
document.getElementById('volu2').onchange = function() {
  volu[1]=this.value;
};

// -- VERSION 1.9 con oscilador --
/* document.getElementById('notu1').onchange = function() {
  notu[0]=this.value;
};
document.getElementById('notu2').onchange = function() {
  notu[1]=this.value;
}; */

document.getElementById('cpmslide').onchange = function() {
  changeCPM(this.value);
};
document.getElementById('cpm').onchange = function() {
  changeCPM(this.value);
};
document.getElementById('playButton').onclick = function() {
  if(isPlaying){
    this.textContent="PLAY";
    toggleClass('playButton',"w3-green");
    toggleClass('playButton',"w3-red");
    isPlaying=false;
    playStop();
  }else{
    // ----------------------- CAMBIOS v.2 - ini -----------------------
    // -- VERSION 1.9 con oscilador --
    /*
    actx = new AudioContext();
    */
    // ----------------------- CAMBIOS v.2 - fin -----------------------
    this.textContent="STOP";
    toggleClass('playButton',"w3-green");
    toggleClass('playButton',"w3-red");
    isPlaying=true;
    compas = 1;
    document.getElementById('compas').value=compas;
    playStart();
  }
};
document.getElementById('playSync').onclick = function() {
  playSync(document.getElementById('ss').value);
};
document.getElementById('ti').onchange = function() {
  ti=this.value;
  segs = Math.round( (duracompas*1000) / ti ) ;
  document.getElementById("segs").value=segs;
  document.getElementById("cpmr").value=Math.round(60000000/(ti*segs))/1000;
  updateBPM();
};
document.getElementById('segs').onchange = function() {
  segs=this.value;
  ti = Math.round( (duracompas*1000*1000) / segs ) / 1000 ;
  document.getElementById("ti").value=ti;
  document.getElementById("cpmr").value=Math.round(60000000/(ti*segs))/1000;
  updateBPM();
};