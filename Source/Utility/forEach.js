/*
---
name: forEach
description: for each
...
*/

define('Utility/forEach', ['Utility/typeOf', 'Host/Array', 'Host/Object'], function(typeOf, Array, Object){
	
Object.implement('forEach', function(fn, context){
	for (var key in this) if (this.hasOwnProperty(key)) fn.call(context, this[key], key, this);
});

return function(self, fn, context){
	switch(typeOf(self)){
		case 'object': Object.forEach(self, fn, context); break;
		case 'array': Array.forEach(self, fn, context); break;
		case 'number': for (var i = 0; i < self; i++) fn.call(context, i); break;
	}
};

});
