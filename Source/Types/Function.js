/*
---
name: Function
description: Function prototypes and generics.
...
*/

define('Types/Function', ['Host/Function'], function(Function){
	
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

	attempt: function(args, bind){
		try {
			return this.apply(bind, args);
		} catch (e){}

		return null;
	}

});

return Function;
	
});
