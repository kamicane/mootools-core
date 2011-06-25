/*
---
name: Array
description: ES5 Array methods
...
*/

define('Host/Array', ['Core/Host'], function(Host){
	
var proto = Array.prototype;

return Host(Array).implement({
	
	//methods that we want available only on environments that already supports them on the native object
	
	pop: proto.pop, push: proto.push, reverse: proto.reverse, shift: proto.shift, sort: proto.sort, splice: proto.splice, unshift: proto.unshift,
	concat: proto.concat, join: proto.join, slice: proto.slice, lastIndexOf: proto.lastIndexOf, reduce: proto.reduce, reduceRight: proto.reduceRight,
	
	//methods that we want available in every environment

	filter: function(fn, bind){
		var results = [];
		for (var i = 0, l = this.length; i < l; i++){
			if ((i in this) && fn.call(bind, this[i], i, this)) results.push(this[i]);
		}
		return results;
	},

	indexOf: function(item, from){
		for (var l = this.length, i = (from < 0) ? Math.max(0, l + from) : from || 0; i < l; i++){
			if (this[i] === item) return i;
		}
		return -1;
	},

	map: function(fn, bind){
		var results = [];
		for (var i = 0, l = this.length; i < l; i++){
			if (i in this) results[i] = fn.call(bind, this[i], i, this);
		}
		return results;
	},

	every: function(fn, bind){
		for (var i = 0, l = this.length; i < l; i++){
			if ((i in this) && !fn.call(bind, this[i], i, this)) return false;
		}
		return true;
	},

	some: function(fn, bind){
		for (var i = 0, l = this.length; i < l; i++){
			if ((i in this) && fn.call(bind, this[i], i, this)) return true;
		}
		return false;
	},

	forEach: function(fn, context){
		for (var i = 0, l = this.length; i < l; i++){
			if (i in this) fn.call(context, this[i], i, this);
		}
	}

});
	
});
