/*
---
name: Table
description: LUA-Style table implementation.
requires: [Array.indexOf]
provides: Table
...
*/
	
define('Utility/Table', ['Host/Array'], function(Array){
	
return function(){

	this.length = 0;
	var keys = [], values = [];

	this.set = function(key, value){
		var index = Array.indexOf(keys, key);
		if (index == -1){
			var length = keys.length;
			keys[length] = key;
			values[length] = value;
			this.length++;
		} else {
			values[index] = value;
		}
		return this;
	};

	this.get = function(key){
		var index = Array.indexOf(keys, key);
		return (index == -1) ? null : values[index];
	};

	this.unset = function(key){
		var index = Array.indexOf(keys, key);
		if (index != -1){
			this.length--;
			keys.splice(index, 1);
			return values.splice(index, 1)[0];
		}
		return null;
	};

	this.erase = function(value){
		for (var i = 0, l = this.length; i < l; i++){
			if (values[i] === value){
				this.length--;
				keys.splice(i, 1);
				values.splice(i, 1);
			}
		}
		return this;
	};

	this.forEach = function(fn, context){
		for (var i = 0, l = this.length; i < l; i++) fn.call(context, values[i], keys[i], this);
	};

};

});
