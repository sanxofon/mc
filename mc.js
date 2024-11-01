// ----------------------- CAMBIOS v.2 - ini -----------------------
// -- VERSION 1.9 con oscilador --
/*
//Sonido con ocilador
var beep = (function () {
  return function (duration, golpe, type, vo, nota, n, oct, finishedCallback) {
    duration = +duration;

    // Only 0-3 are valid types.
    if(type<=0 || type>3) type=0;

    if (typeof finishedCallback != "function") {
        finishedCallback = function () {};
    }

    if(notu[golpe]>11) { // AUTO
      var hertz = getFrequency(nota,n,oct);
    } else {
      var hertz = getFrequency(notu[golpe],12,oct);
    }
    // console.log('golpe',golpe);
    // console.log('notu[golpe]',notu[golpe]);
    // console.log('oct',oct);
    // console.log('hertz',hertz);

    var osc = actx.createOscillator();
    // songolpe
    var types = [
      'sine', // A sine wave. This is the default value.
      'square', // A square wave with a duty cycle of 0.5; that is, the signal is "high" for half of each period.
      'sawtooth', // A sawtooth wave.
      'triangle', // A triangle wave.
    ];
    osc.type = types[type];
    //osc.type = "sine";


    // osc.connect(actx.destination);
    var gainNode = actx.createGain();
    osc.connect(gainNode);
    gainNode.connect(actx.destination);
    gainNode.gain.value = Math.pow(vol,2)*vo*volu[golpe];
    // if (osc.noteOff) {
    //   try{osc.noteOff(0);}
    //   catch(error) {console.log("No osc.noteOff");}
    // }
    // if (osc.stop) {
    //   try{osc.stop();}
    //   catch(error){console.log("No osc.stop");}
    // }
    osc.frequency.setValueAtTime(hertz, actx.currentTime);
    // gainNode.gain.exponentialRampToValueAtTime(vol, actx.currentTime+0.1);
    if (osc.noteOn) osc.noteOn(0);
    if (osc.start) osc.start();

    setTimeout(function () {
      // gainNode.gain.exponentialRampToValueAtTime(0.0001, actx.currentTime+0.1);
      if (osc.noteOff) osc.noteOff(0);
      if (osc.stop) osc.stop();
      finishedCallback();
    }, duration);

  };
})();
function getFrequency(nota,n,oct) {
  // console.log("IN:",nota,n,oct);
  nota -= -oct*n;
  // console.log("OT:",nota,n,oct);
  return 32.70 * Math.pow(2, (nota-1) / n);
}
*/
// ----------------------- CAMBIOS v.2 - fin -----------------------


function getMousePos(c, e) {
    var rect = c.getBoundingClientRect();
    return {
        x: (800*e.clientX/rect.width) - rect.left - (800/2),
        y: (800*e.clientY/rect.height) - rect.top - (800/2)
    };
}

// FUNCIONES ----------------------
function playStart() {
  // Loop del intervalo
  clearInterval(sto);
  clearTiempo();
  angulo = 0;
  for (var i = 0; i < pol.length; i++) {
    var e = i-(-1);
    pol[i]['pulso'] = 0;
  }
  drawClock();
}
function playStop() {
  // Loop del intervalo
  clearInterval(sti);
  clearInterval(sto);
}

// Funciones del reloj
function drawClock() {
  var redo=true;
  if(!isPlaying)redo=false;
  clearInterval(sto);
  localStorage.setItem('polMC', JSON.stringify(pol));
  localStorage.setItem('claveMC', JSON.stringify(clave));
  drawFace(ctx, radius);
  if(redo)drawTime(ctx, radius);
  regiones=[];
  for (var i = 0; i < pol.length; i++) {
    var e = i-(-1);
    if(pol[i]['activo'])drawNumbers(ctx, radius*((5-i)/5), pol[i]['nmax'], angulo, i);
  }
  var t = tiempo();
  // console.log('drawClock:',ti,t);
  if(redo)sto=setTimeout(drawClock,t);
}

// Dibuja la cara del reloj
function drawFace(ctx, radius) {
  ctx.strokeStyle = '#999'; // Color de borde
  // Dibuja el círculo fondo y el borde exterior
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, 2*Math.PI);
  ctx.fillStyle = '#000'; // Color del fondo del reloj
  ctx.fill();
  ctx.lineWidth = radius*bordep; // Lo que sobra es borde
  ctx.stroke();
  ctx.closePath();

  // Círculos Niveles
  var rad = radius*0.83/5;
  var ra1 = radius*0.1;
  for (var i = 1; i < 6; i++) {
    ctx.beginPath();
    ctx.arc(0, 0, ra1+rad*(5-i), 0, 2*Math.PI);
    if(i==5)ctx.fillStyle = '#999'; //Circulo central
    else if(i/2!=Math.floor(i/2))ctx.fillStyle = '#222'; // Claro
    else ctx.fillStyle = '#000'; // Obscuro
    ctx.fill();
    ctx.closePath();
  }
}
function drawNumbers(ctx, radi, n, a, ii) {
  var ang,p;
  ctx.font = radius*0.15 + "px arial";
  ctx.textBaseline="middle";
  ctx.textAlign="center";
  p = Math.ceil(a*n/segs);
  for(var num = 1; num <= n; num++){
    ang = (n+num-1) * Math.PI / (n/2);

    ctx.beginPath();
    ctx.arc(Math.sin(ang)*radi*0.85,-Math.cos(ang)*radi*0.85, radius*0.08, 0, 2*Math.PI);
    if (p==num)ctx.fillStyle = colores[ii][0];
    else ctx.fillStyle = '#444';
    ctx.fill();
    ctx.closePath();

    ctx.rotate(ang);
    ctx.translate(0, -radi*0.85);
    ctx.rotate(-ang);
    if(pol[ii]['patron'][num-1]==0) {
      ctx.fillStyle = '#333';
      ctx.fillText('X', 0, 0);
    } else if(pol[ii]['patron'][num-1]==2) {
      ctx.fillStyle = '#f33';
      ctx.fillText(num.toString(), 0, 0);
    } else {
      if (p==num)ctx.fillStyle = '#fff';
      else ctx.fillStyle = colores[ii][1];
      ctx.fillText(num.toString(), 0, 0);
    }

    var posi = {
      x:Math.sin(ang)*radi*0.85,
      y:-Math.cos(ang)*radi*0.85
    };
    // console.log(posi);
    regiones.push({e:ii,n:n,i:num-1,pos:posi});
    ctx.rotate(ang);
    ctx.translate(0, radi*0.85);
    ctx.rotate(-ang);
  }
}
function drawTime(ctx, radius){
  angulo++;
  if(angulo>segs) {
    angulo=1;
    compas++;
    document.getElementById("compas").value=compas;
  }
  // document.getElementById("angulo").value=parseInt(angulo*360/segs);
  // document.getElementById("angulo").value=angulo;

  lista = document.getElementsByClassName('pulso');
  for (var i = 0; i < pol.length; i++) {
    var e = i-(-1);
    pol[i]['pulso'] = Math.ceil(angulo*pol[i]['nmax']/segs);
    if(pol[i]['pulso']!=lista[i].value){

      // ----------------------- CAMBIOS v.2 - ini -----------------------
      // -- VERSION 1.9 con oscilador --
      /* 
      if(pol[i]['activo']){
        if(pol[i]['patron'][pol[i]['pulso']-1]==0) {
        } else  {
          beep(150, pol[i]['patron'][pol[i]['pulso']-1]-1, pol[i]['songolpe'], pol[i]['vol'], pol[i]['pulso'], pol[i]['nmax'], pol[i]['sonacento']);
        }
      }
      */

      // -- VERSION 2.0 con Howler.js --
      if(pol[i]['activo']){
        if(pol[i]['patron'][pol[i]['pulso']-1] !== 0) { // Si no es silencio
          let indiceSonido = pol[i]['patron'][pol[i]['pulso']-1] - 1;
          // Verificar si el índice de sonido es válido
          if (indiceSonido >= 0 && indiceSonido < sonidos.length) {
            const tambor = indiceSonido=='0' ? pol[i]['songolpe']:pol[i]['sonacento'];
            sonidos[tambor].volume(Math.pow(vol,2) * pol[i]['vol'] * volu[pol[i]['patron'][pol[i]['pulso']-1]-1]); // Ajustar el volumen como antes.
            sonidos[tambor].play();
          } else if(indiceSonido!=-1) {
            console.error("Índice de sonido fuera de rango:", indiceSonido);
          }
        }
      }
      // ----------------------- CAMBIOS v.2 - fin -----------------------

      lista[i].value=pol[i]['pulso'];
    } 
  }
  var second=((angulo-1)*Math.PI/(segs/2));
  drawHand(ctx, second, radius*0.9, radius*0.02);
}

// Dibuja la manecilla del reloj
function drawHand(ctx, second, length, width) {
  ctx.beginPath();
  ctx.lineWidth = width;
  ctx.lineCap = "round";
  ctx.moveTo(0,0);
  ctx.rotate(second);
  ctx.lineTo(0, -length);
  ctx.stroke();
  ctx.rotate(-second);
  ctx.closePath();
}
// --------------------------------

// Funciones para mantener la precisión en el tiempo
function tiempo() {  
    time += ti;  
    elapsed = Math.floor(time / ti) / 10;  
    if(Math.round(elapsed) == elapsed) { elapsed += '.0'; }  
    var diff = (new Date().getTime() - start) - time;
    // document.getElementById('precision').value=Math.round(diff);
    if(diff>precisionmax){
      precisionmax=diff;
      if(precisionmax>1000)document.getElementById('precisionmax').value=-1;
      else document.getElementById('precisionmax').value=Math.round(precisionmax);
      if(precisionmax>ti)document.getElementById('precisionmax').style.backgroundColor='#a00';
      else document.getElementById('precisionmax').style.backgroundColor='#222';
    }
    var r = (ti - diff);
    // console.log("t:",ti,"r:",r);
    if(r<0)r=0;
    return r;
}
function clearTiempo(){
  start = new Date().getTime(); 
  time = 0;
  elapsed = '0.0';
  precisionmax=0;
  // document.getElementById('precision').value=0;
  document.getElementById('precisionmax').value=0;
}
// SyncStart funciones
function playSync(n=20) {
  ss = Math.round((new Date().getTime()+(n*1000))/1000)*1000;
  sti = setTimeout(syncStart,ti);
}
function syncStart() {
  clearInterval(sti);
  var s = new Date().getTime();
  document.getElementById('ss').value=Math.round((ss-s)/1000);
  if(ss<=s)playStart();
  else sti=setTimeout(syncStart,ti);
}
// --------------------------------
function changeCPM(v) {
  cpm = v;
  document.getElementById('cpmslide').value = cpm;
  document.getElementById('cpm').value = cpm;
  duracompas = 60/cpm; // Duración del compás en segundos
  segs = Math.round( (duracompas*1000) / ti ) ; // En microsegundos (millonésimas)
  document.getElementById('segs').value = segs;
  document.getElementById("cpmr").value=Math.round(60000000/(ti*segs))/1000;
  updateBPM();
}
function updateBPM() {
  var lista = document.getElementsByClassName('bpm');
  for (var i = 0; i < lista.length; ++i) {
    lista[i].value=Math.round(pol[i]['nmax']*60000/(ti*segs));
  }
}
// ----------------------------------------------------------------