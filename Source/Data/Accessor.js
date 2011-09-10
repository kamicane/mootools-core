/*
---
name: Accessor
description: Access things
...
*/

define(['../Utility/typeOf', '../Host/Array'], function(typeOf, Object, Array){
	

return function(singular, plural, _accessor, _matcher){

	var singular = singular || '', plural = plural || singular + 's', accessor = _accessor || {}, matcher = _matcher || {},
	
	define = 'define', lookup = 'lookup', match = 'match', each = 'each',
	
	self = function(){
		return new Accessor(singular, plural, Object.create(accessor), Object.create(matcher));
	};

	var defineSingular = self[define + singular] = function(key, value){
		if (typeOf(key) == 'regexp') matcher[String(key)] = {'regexp': key, 'value': value, 'type': typeOf(value)};
		else accessor[key] = value;
		return this;
	};
	
	var definePlural = self[define + plural] = function(object){
		for (var key in object) accessor[key] = object[key];
		return this;
	};
	
	var lookupSingular = self[lookup + singular] = function(key){
		if (accessor[key]) return accessor[key];
		for (var m in matcher){
			var current = matcher[m], matched = key.match(current.regexp);
			if (matched && (matched = matched.slice(1))){
				if (current.type == 'function') return function(){
					return current.value.apply(this, Array.slice(arguments).concat(matched));
				}; else return current.value;
			}
		}
		return null;
	};
 
	var lookupPlural = self[lookup + plural] = function(){
		var results = {};
		for (var i = 0; i < arguments.length; i++){
			var argument = arguments[i];
			results[argument] = lookupSingular(argument);
		}
		return result;
	};
	
	var eachSingular = self[each + singular] = function(fn, context){
		for (var key in accessor) fn.call(context, this[key], key, this);
	};
	
	return self;
};

});
