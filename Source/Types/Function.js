/*
---
name: Function
description: Function prototypes and generics.
...
*/

define('Types/Function', ['Utility/typeOf', 'Host/Function', 'Host/Array'], function(typeOf, Function, Array){
	
Function.extend({

	from: function(item){
		return (typeOf(item) == 'function') ? item : function(){
			return item;
		};
	},
	
	attempt: function(){
		for (var i = 0, l = arguments.length; i < l; i++){
			try {
				return arguments[i]();
			} catch (e){}
		}
		return null;
	}
	
});

Function.implement({

	attempt: function(bind){
		var args = Array.slice(arguments);
		try {
			return this.apply(args.shift(0), args);
		} catch (e){}

		return null;
	}

});

return Function;
	
});
