// math+rythm
class mrythm {
	// BASE 62 -------------------------------------------------------------
	static base62encode(integer) {
		const chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
		var arrayOfChars = chars.split("");
		if (integer === 0) {return '0';}
		var s = '';
		while (integer > 0) {
			s = arrayOfChars[integer % 62] + s;
			integer = Math.floor(integer/62);
		}
		return s;
	}
	static base62decode(base62String) {
		const chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
		var arrayOfChars = chars.split("");
		var val = 0, base62Chars = base62String.split("").reverse();
		base62Chars.forEach(function(character, index){
			val += arrayOfChars.indexOf(character) * Math.pow(62, index);
		});
		return val;
	}
	static base62expand(clave) { // a2d => 10_2_13
		clave = String(clave).split('.');
		var silencio=''; //inicial
		if(clave[0].charAt(0)==='-'){
			silencio='-';
			clave[0]=clave[0].replace(/^\-+/,"");
		}
		clave[1] = clave[1].split('');
		for (var i = 0; i < clave[1].length; i++) {
			clave[1][i]=this.base62decode(clave[1][i]);
		}
		clave[1] = clave[1].join('_');
		return silencio+clave.join('.');
	}
	static base62contract(clave) { // 10_2_13 => a2d 
		clave = String(clave).split('.');
		var silencio=''; //inicial
		if(clave[0].charAt(0)==='-'){
			silencio='-';
			clave[0]=clave[0].replace(/^\-+/,"");
		}
		clave[1] = clave[1].split('_');
		for (var i = 0; i < clave[1].length; i++) {
			clave[1][i]=this.base62encode(clave[1][i]);
		}
		clave[1] = clave[1].join('');
		return silencio+clave.join('.');
	}

	// PARSER --------------------------------------------------------------
	static clean(a) {
		for(var i = 0; i < a.length; i++) {
			if(a[i] === "") {
				a.splice(i, 1);
			}
		}
		return a;
	}
	static infixToPostfix(infix) {
		var outputQueue = "";
		var operatorStack = [];
		var operators = {
			// "^": {
			// 	precedence: 4,
			// 	associativity: "Right"
			// },
			"*": {
				precedence: 4,
				associativity: "Left"
			},
			"/": {
				precedence: 3,
				associativity: "Left"
			},
			"+": {
				precedence: 2,
				associativity: "Left"
			},
			// "-": {
			// 	precedence: 2,
			// 	associativity: "Left"
			// }
		};
		infix = infix.replace(/\s+/g, "");
		// infix = this.clean(infix.split(/([\+\-\*\/\^\(\)])/));
		infix = this.clean(infix.split(/([\+\*\/\(\)])/));
		for(var i = 0; i < infix.length; i++) {
			var token = infix[i];
			// if("^*/+-".indexOf(token) !== -1) {
			if("*/+".indexOf(token) !== -1) {
				var o1 = token;
				var o2 = operatorStack[operatorStack.length - 1];
				// while("^*/+-".indexOf(o2) !== -1 && ((operators[o1].associativity === "Left" && operators[o1].precedence <= operators[o2].precedence) || (operators[o1].associativity === "Right" && operators[o1].precedence < operators[o2].precedence))) {
				while("*/+".indexOf(o2) !== -1 && ((operators[o1].associativity === "Left" && operators[o1].precedence <= operators[o2].precedence) || (operators[o1].associativity === "Right" && operators[o1].precedence < operators[o2].precedence))) {
					outputQueue += operatorStack.pop() + " ";
					o2 = operatorStack[operatorStack.length - 1];
				}
				operatorStack.push(o1);
			} else if(token === "(") {
				operatorStack.push(token);
			} else if(token === ")") {
				while(operatorStack[operatorStack.length - 1] !== "(") {
					outputQueue += operatorStack.pop() + " ";
				}
				operatorStack.pop();
			} else {
				outputQueue += token + " ";
			}
		}
		while(operatorStack.length > 0) {
			outputQueue += operatorStack.pop() + " ";
		}
		return outputQueue;
	}
	static solvePostfix(postfix) {
		var resultStack = [];
		postfix = postfix.trim().split(" ");
		// console.log('postfix:',postfix);
		for(var i = 0; i < postfix.length; i++) {
			if(postfix[i] === "") {
				continue;
			// } else if("^/*+-".indexOf(postfix[i]) !== -1) {
			} else if("/*+".indexOf(postfix[i]) !== -1) {
				const a = resultStack.pop();
				const b = resultStack.pop();
				const c = this.operar(a,b,postfix[i]);
				resultStack.push(c);
			} else {
				resultStack.push(postfix[i]);
			}
		}
		if(resultStack.length > 1) {
			return "error";
		} else {
			return resultStack.pop();
		}
	}
	static esClave(s) {
		s = String(s);
		if("*/+".indexOf(s) !== -1)return false;
		else {
			s=s.split(".");
			if(s.length===1)return false;
			else return true;
		}
	}
	static compareClaves(a, b) {
		a=String(a).split('.');
		a=parseInt(a[0]);
		b=String(b).split('.');
		b=parseInt(b[0]);
		return b-a;
	}
	static parse(expression,reducir=false,asarray=false) {
		var infix = this.filtrar(expression); // filtrar
		const postfix = this.infixToPostfix(infix);
		// con(postfix);
		var pf = postfix.split(' ');
		console.log("pf:",pf);
		pf = pf.filter(this.esClave);
		console.log("pff:",pf);
		for (var i = 0; i < pf.length; i++) {
			console.log("pf["+i+"]:",pf[i]);
			pf[i] = this.completarClave(pf[i]);
			pf[i] = this.clave2binary(pf[i]);
		}
		pf.sort(this.compareClaves);
		// con(pf.join('|'),true);
		return [this.completarClave(this.solvePostfix(postfix),asarray,reducir),pf];
	}

	// OPERACIONES ---------------------------------------------------------
	static mcm(a,b) {
		var r = a * b;
		var m = Math.max(a,b);
		var n = Math.min(a,b);
		m = m/n;
		if (Number.isInteger(m)) r = r/n;
		return r;
	}
	static mcd(a, b) {
		if ((typeof a !== 'number') || (typeof b !== 'number')) 
			return false;
		a = Math.abs(a);
		b = Math.abs(b);
		while(b) {
			var t = b;
			b = a % b;
			a = t;
		}
		return a;
	}
	static multimcd(lista) {
		if (toString.call(lista) !== "[object Array]")  
			return  false;  
		var len, a, b;
		len = lista.length;
		if ( !len ) {
			return null;
		}
		a = lista[ 0 ];
		for ( var i = 1; i < len; i++ ) {
			b = lista[ i ];
			a = this.mcd( a, b );
		}
		return a;
	}
	static juntar(c) {
		// return c.join('-');//si se quiere leer humano
		for (var i = 0; i < c.length; i++) {
			c[i]=this.base62encode(c[i]);
		}
		return c.join('');
	}
	static romper(c) {
		c = String(c).split('');
		for (var i = 0; i < c.length; i++) {
			c[i]=this.base62decode(c[i]);
		}
		return c;
	}
	static completarClave(c,asarray=false,reducir=false) {
		c = String(c);
		var silencio=''; //inicial
		if(c.charAt(0)=='-'){
			silencio='-';
			c=c.replace(/^\-+/,"");
		}
		c = c.trim('.').split('.');
		var n = parseInt(c[0]);
		if(c.length==1)c.push(c[0]); // FIX: 7 => 7.7
		c = this.romper(c[1]);
		var s = [];
		var m = 0,i = 0;
		while(m<n) {
			var x = parseInt(c[i]);
			if(x==0) m+=1;
			else m+=x;
			if(m>n)s.push(x-(m-n));
			else s.push(x);
			i++;
			if(i>=c.length)i=0;
		}
		// console.log("s:",s);
		// Reducir a mínima expresión
		if(reducir){
			var divs=[];
			for (var i = 0; i < s.length; i++) {
				const d = this.mcd(n,s[i]);
				if(d===1){
					reducir=false;
					break;
				} else {
					if(divs.indexOf(d)===-1)divs.push(d);
				}
			}
			if(reducir){
				// console.log("Reducir:",n,s);
				reducir = this.multimcd(divs);
				if(reducir>1){
					n=n/reducir;
					for (var i = 0; i < s.length; i++) {
						s[i]=s[i]/reducir;
					}
				}
			}
		}

		if(asarray)return [n,s,(silencio!=='' ? 1:0)]; // array
		else return silencio+n+'.'+this.juntar(s);
	}
	static multiplo(m,a) {
		// console.log('antes:',a);
		var x = 0;
		var z = a[0]*m; // No puede empezar con cero!!
		for (var i = 0; i < a.length; i++) {
			x+=parseInt(a[i])*m;
			a[i]=x;
		}
		// console.log('despu:',a);
		return a;
	}
	static binary2clave(b) {
		var x = 1,c = [];
		for (var i = b.length - 1; i >= 0; i--) {
			if(b[i]==0)x++;
			else{
				c.push(x);
				x = 1;
			}
		}
		return c.reverse();
	}
	static clave2binary(c) {
		// console.log("IN:",c);
		c = String(c).split('.');
		if(c.length===1)c.push(c[0]); // 7 => 7.7
		c[1]=c[1].split('');
		var b = [];
		for (var i = 0; i < c[1].length; i++) {
			var x = parseInt(c[1][i]);
			if(x==0 || x==1)b.push(x);
			else{
				b.push(1);
				for (var j = 1; j < x; j++) {
					b.push(0);
				}
			}
		}
		var co = c[0]+"."+b.join('');
		// console.log("OUT:",co);
		return co;
	}
	static conjugar(a,b,asarray=false) {
		a = this.completarClave(a,true);
		b = this.completarClave(b,true);
		a[0]=parseInt(a[0]);
		b[0]=parseInt(b[0]);
		const n = this.mcm(a[0],b[0]);
		const na = this.multiplo(n/a[0],a[1]);
		const nb = this.multiplo((n/b[0]),b[1]);
		// Patrón binario
		var bin=[1];// no puede empezar en cero
		var ja=0,jb=0;
		var dopush=false;
		for (var i = 1; i < n; i++) {
			// no puede empezar en cero
			dopush=false;
			if(i==na[ja]){ // El pulso i está en la clave a
				dopush=true;
				ja++;
			}
			if(i==nb[jb]){ // El pulso i está en la clave b
				dopush=true;
				jb++;
			}
			if(dopush)bin.push(1);
			else bin.push(0);
		}
		const c = this.binary2clave(bin);
		if(asarray)return [n,c];
		else return n+'.'+this.juntar(c);
	}
	static apilar(a,b,asarray=false) {
		a = this.completarClave(a,true);
		b = this.completarClave(b,true);
		const n = parseInt(a[0])+parseInt(b[0]);
		if(asarray)return [n,a.concat(b)];
		else return n+'.'+this.juntar(a[1])+this.juntar(b[1]);
	}
	static multiplicar(a,x,asarray=false) {
		a = this.completarClave(a,true);
		x = x.split('.');
		x=parseInt(x[0]);
		const n = parseInt(a[0])*x;
		var y=[];
		for (var j = 0; j < x; j++) {
			for (var i = 0; i < a[1].length; i++) {
				y.push(a[1][i]);
			}
		}
		if(asarray)return [n,y];
		else return n+'.'+this.juntar(y);
	}
	static operar(a,b,op='+') {
		if(op==='/') {
			return this.conjugar(a,b);
		} else if(op==='+') {
			return this.apilar(b,a);//Ojo con el orden!
		} else if(op==='*') {
			return this.multiplicar(b,a);//Ojo con el orden! a=x
		} else {
			console.log("ERROR: Operacion desconocida: ",op);
			console.log("a: ",a);
			console.log("b: ",b);
		}
	}
	static filtrar(c) {
		return c.replace(/[^a-zA-Z0-9\.+\-*\/()]/gi, '');
	}
}