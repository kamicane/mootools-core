/*
---
name: Number
description: custom Number prototypes and generics.
...
*/

define('Types/Number', ['Host/Number', 'Host/Array'], function(Number, Array){

Number.extend('from', function(item){
	var number = parseFloat(item);
	return isFinite(number) ? number : null;
});

Number.extend({
	
	random: function(min, max){
		return Math.floor(Math.random() * (max - min + 1) + min);
	}

});

Number.implement({

	limit: function(min, max){
		return Math.min(max, Math.max(min, this));
	},

	round: function(precision){
		precision = Math.pow(10, precision || 0);
		return Math.round(this * precision) / precision;
	},

	times: function(fn, bind){
		for (var i = 0; i < this; i++) fn.call(bind, i, null, this);
	},

	toInt: function(base){
		return parseInt(this, base || 10);
	},

	toFloat: function(){
		return parseFloat(this);
	}

});

Array.forEach(['abs', 'acos', 'asin', 'atan', 'atan2', 'ceil', 'cos', 'exp', 'floor', 'log', 'max', 'min', 'pow', 'sin', 'sqrt', 'tan'], function(name){
	Number.extend(name, Math[name]).implement(name, function(){
		return Math[name].apply(null, [this].concat(Array.slice(arguments)));
	});
});

return Number;

});
