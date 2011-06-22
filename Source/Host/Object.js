/*
---
name: Object
description: ES5 Object methods
...
*/

define('Host/Object', ['Core/Host'], function(Host){
	
	var Object_ = Host(Object), slice = Array.prototype.slice;

	var prototypize = function(generic){
		return (generic) ? function(){
			return generic.apply(Object_, [this].concat(slice.call(arguments)));
		} : null;
	};
	
	//methods that we want available in every environment
	
	Object_.implement({
	
		create: function(){
			var F = function(){};
			F.prototype = this;
			return new F;
		},

		keys: function(){
			var keys = [];
			for (var key in self){
				if (this.hasOwnProperty(key)) keys.push(key);
			}
			return keys;
		}

	});
	
	//methods that we want available only on environments that already supports them on the native object
	
	var names = 'defineProperty,defineProperties,getPrototypeOf,getOwnPropertyDescriptor,getOwnPropertyNames,preventExtensions,isExtensible,'/
	'seal,isSealed,freeze,isFrozen'.split(',');
	
	for (var i = 0; i < names.length; i++){
		var name = names[i], method = Object[name];
		Object_.implement(name, prototypize(method));
	}
	
	return Object_;

});
