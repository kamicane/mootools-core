/*
---
name: Fx
description: Contains the basic animation logic to be extended by all other Fx Classes.
requires: [Type, Array, String, Number, Function, Class, Options, Events, Timer]
provides: Fx
...
*/

(function(){

var Fx = this.Fx = new Class({

	Implements: [Options, Events],

	options: {
		/*
		onStart: nil,
		onCancel: nil,
		onComplete: nil,
		*/
		duration: '500ms',
		equation: 'default',
		behavior: 'cancel',
		fps: 60,
		frames: null,
		frameSkip: true
	},

	initialize: function(options){
		this.setOptions(options);
		this.queue = [];
		this.boundStep = this.step.bind(this);
	},
	
	start: function(from, to){
		if (!this.check(from, to)) return this;
		this.from = from;
		this.to = to;
		this.frame = (this.getOption('frameSkip')) ? 0 : -1;
		this.time = null;
		this.equation = parseEquation(this.getOption('equation'));
		this.duration = parseDuration(this.getOption('duration'));
		var frames = this.getOption('frames'), fps = this.getOption('fps');
		this.timer = Timer(fps);
		this.frameInterval = 1000 / fps;
		this.frameSkip = this.getOption('frameSkip');
		this.frames = frames || Math.round(this.duration / this.frameInterval);
		this.timer.push(this.boundStep);
		this.fire('start');
		return this;
	},

	step: function(now){
		if (this.frameSkip){
			var diff = (this.time != null) ? (now - this.time) : 0, frames = diff / this.frameInterval;
			this.time = now;
			this.frame += frames;
		} else {
			this.frame++;
		}
		
		if (this.frame < this.frames){
			var delta = this.equation(this.frame / this.frames);
			this.render(this.compute(delta));
		} else {
			this.frame = this.frames;
			this.render(this.compute(1));
			this.stop();
		}
	},
	
	stop: function(){
		if (this.running()){
			this.halt();
			if (this.frames == this.frame){
				//fx is complete, call and remove next item in queue.
				this.fire('complete');
				if (this.queue.length) this.queue.shift()();
			} else {
				this.frames = this.frame;
				//fx is not complete, resets the queue.
				this.queue = [];
				this.fire('cancel');
			}
		}
		return this;
	},
	
	pause: function(){
		if (this.running()){
			this.halt();
			this.fire('pause');
		}
		return this;
	},
	
	resume: function(){
		if ((this.frame < this.frames) && !this.running()){
			this.timer.push(this.boundStep);
			this.fire('resume');
		}
		return this;
	},
	
	running: function(){
		return !!(this.timer && this.timer.running());
	},
	
	// internal API
	
	'protected halt': function(){
		if (this.running()){
			this.time = null;
			this.timer.pull(this.boundStep);
			this.timer = null;
		}
		return this;
	},
	
	'protected check': function(){
		if (!this.running()) return true;
		switch (this.getOption('behavior')){
			case 'cancel': this.stop(); return true;
			case 'queue': this.queue.push(this.caller.pass(arguments, this)); return false;
		}
		return false;
	},
	
	'protected compute': function(delta){
		return Fx.compute(this.from, this.to, delta);
	},
	
	'protected render': function(value){
		return value;
	}

});

// Fx.parseEquation, preliminary parameter support (1 parameter)

var parseEquation = function(name){
	var t = typeOf(name);
	if (t == 'function') return name;
	if (t != 'string') name = 'linear';
	var match = name.match(/^([\w]+)([:inout]+)?(\(([\d.]+)\))?$/);
	var n = match[1], equation = Fx.lookupEquation(n);
	if (!equation) return null;
	var end = equation(1), param = parseFloat(match[4]), type = match[2];
	switch (type){
		case ':out': return function(pos){
			return end - equation(1 - pos, param);
		};
		case ':in:out': return function(pos){
			return (pos <= 0.5) ? equation(2 * pos, param) / 2 : (2 * end - equation(2 * (1 - pos), param)) / 2;
		};
		default: return (param != null) ? function(pos){
			return equation(pos, param);
		} : equation;
	}
};

var parseDuration = function(duration){
	if (typeOf(duration) == 'number') return duration;
	var n = parseFloat(duration);
	if (n == duration) return n;
	var d = Fx.lookupDuration(duration);
	if (d != null) return d;
	d = duration.match(/^[\d.]+([ms]{1,2})?$/);
	if (!d) return 0;
	if (d[1] == 's') return n * 1000;
	return n;
};

Fx.extend('compute', function(from, to, delta){
	return (to - from) * delta + from;
});

Fx.extend(new Accessor('Duration')).extend(new Accessor('Equation'));

// duration

Fx.defineDurations({'short': 250, 'normal': 500, 'long': 1000});

// equations

Fx.defineEquations({
	
	'linear': function(p){
		return p;
	},
	
	'default': function(p){
		return -(Math.cos(Math.PI * p) - 1) / 2;
	},

	'pow': function(p, x){
		return Math.pow(p, (x != null) ? x : 6);
	},

	'expo': function(p){
		return Math.pow(2, 8 * (p - 1));
	},

	'circ': function(p){
		return 1 - Math.sin(Math.acos(p));
	},

	'sine': function(p){
		return 1 - Math.sin((1 - p) * Math.PI / 2);
	},

	'back': function(p, x){
		x = (x != null) ? x : 1.618;
		return Math.pow(p, 2) * ((x + 1) * p - x);
	},

	'bounce': function(p){
		var value;
		for (var a = 0, b = 1; 1; a += b, b /= 2){
			if (p >= (7 - 4 * a) / 11){
				value = b * b - Math.pow((11 - 6 * a - 11 * p) / 4, 2);
				break;
			}
		}
		return value;
	},

	'elastic': function(p, x){
		x = (x != null) ? x : 1;
		return Math.pow(2, 10 * --p) * Math.cos(20 * p * Math.PI * x / 3);
	}

});

['quad', 'cubic', 'quart', 'quint'].each(function(name, i){
	Fx.defineEquation(name, function(pos){
		return Math.pow(pos, i + 2);
	});
});

})();
