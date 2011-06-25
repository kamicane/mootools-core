/*
---
name: Array
description: Custom Array prototypes and generics.
...
*/

define('Types/Array', ['Utility/typeOf', 'Host/Array', 'Types/Object'], function(typeOf, Array, Object){
	
Array.extend('from', function(item){
	if (item == null) return [];
	if (typeOf(item) == 'array') return item;
	if (Object.isEnumerable(item)) return Array.prototype.slice.call(item);
	return [item];
});

Array.implement({

	pair: function(fn, bind){
		var object = {};
		for (var i = 0, l = this.length; i < l; i++){
			if (i in this) object[this[i]] = fn.call(bind, this[i], i, this);
		}
		return object;
	},

	clean: function(){
		return Array.filter(this, function(item){
			return item != null;
		});
	},

	pick: function(){
		for (var i = 0, l = this.length; i < l; i++){
			if (this[i] != null) return this[i];
		}
		return null;
	},

	invoke: function(name){
		var args = Array.slice(arguments, 1), results = [];
		for (var i = 0, j = this.length; i < j; i++){
			var item = this[i];
			results.push(item[name].apply(item, args));
		}
		return results;
	},

	append: function(array){
		this.push.apply(this, array);
		return this;
	},

	contains: function(item, from){
		return Array.indexOf(this, item, from) != -1;
	},

	last: function(){
		var length = this.length;
		return (length) ? this[length - 1] : null;
	},

	random: function(){
		var length = this.length;
		return (length) ? this[Number.random(0, length - 1)] : null;
	},

	include: function(item){
		if (!Array.contains(this, item)) this.push(item);
		return this;
	},

	combine: function(array){
		for (var i = 0, l = array.length; i < l; i++) Array.include(this, array[i]);
		return this;
	},

	erase: function(item){
		for (var i = this.length; i--; i){
			if (this[i] === item) this.splice(i, 1);
		}
		return this;
	},

	empty: function(){
		this.length = 0;
		return this;
	},

	flatten: function(){
		var array = [];
		for (var i = 0, l = this.length; i < l; i++){
			var ti = this[i];
			array = array.concat((Object.isEnumerable(ti)) ? Array.flatten(ti) : ti);
		}
		return array;
	},

	item: function(at){
		var length = this.length;
		if (at < 0) at = (at % length) + length;
		return (at < 0 || at >= length || this[at] == null) ? null : this[at];
	}

});

return Array;
	
});
