/*
---
name: merge
description: merge things
...
*/

define('Utility/merge', ['Utility/typeOf', 'Utility/clone', 'Host/Array', 'Host/Object'], function(typeOf, clone, Array, Object){
	
	var merge = function(source, key, current){
		switch (typeOf(current)){
			case 'object':
				if (typeOf(source[key]) == 'object') Object.merge(source[key], current);
				else source[key] = clone.object(current);
			break;
			case 'array': source[key] = Array.clone(current); break;
			default: source[key] = current;
		}
		return source;
	};
	
	Object.implement('merge', function(k, v){
		if (typeof k == 'string') return merge(this, k, v);
		for (var i = 1, l = arguments.length; i < l; i++){
			var object = arguments[i];
			for (var key in object) merge(this, key, object[key]);
		}
		return this;
	});
	
	return Object.merge;
	
});
