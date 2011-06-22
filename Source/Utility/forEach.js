/*
---
name: forEach
description: for each
...
*/

define('Utility/forEach', ['Utility/typeOf', 'Host/Array', 'Host/Object'], function(typeOf, Array, Object){
	
	var enumerables = 'hasOwnProperty,valueOf,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,constructor'.split(',');
	for (var i in {toString: 1}) enumerables = null;
	
	var forEach = function(self, fn, context){
		for (var key in self) if (self.hasOwnProperty(key)) fn.call(context, self[key], key, self);
	};

	Object.implement('forEach', (!enumerables) ? function(fn, context){
		return forEach(this, fn, context);
	}: function(fn, context){
		forEach(this, fn, context);
		for (var i = enumerables.length; i--;){
			var key = enumerables[i];
			if (this.hasOwnProperty(key)) fn.call(context, this[key], key, this);
		}
	});

	return function(self, fn, context){
		switch(typeOf(self)){
			case 'object': return Object.forEach(self, fn, context);
			case 'array': return Array.forEach(self, fn, context);
		}
		return null;
	};

});
