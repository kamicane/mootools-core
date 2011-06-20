/*
---
name: Object
description: ES5 Object methods
...
*/

define('Host/Object', ['Core/Host'], function(Host){
	
	var Object = Object, Object_ = Host(Object);
	
	Object_.extend({
		defineProperty: Object.defineProperty, defineProperties: Object.defineProperties, getPrototypeOf: Object.getPrototypeOf,
		getOwnPropertyDescriptor: Object.getOwnPropertyDescriptor, getOwnPropertyNames: Object.getOwnPropertyNames,
		preventExtensions: Object.preventExtensions, isExtensible: Object.isExtensible, seal: Object.seal, isSealed: Object.isSealed, freeze: Object.freeze,
		isFrozen: Object.isFrozen
	});
	
	Object_.implement({
		
		create: function(){
			var F = function(){};
			F.prototype = this;
			return new F;
		},

		keys: function(object){
			var keys = [];
			for (var key in object){
				if (object.hasOwnProperty(key)) keys.push(key);
			}
			return keys;
		}

	});
	
	return Object_;

});
