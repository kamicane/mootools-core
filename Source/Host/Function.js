/*
---
name: Function
description: ES5 Function methods
...
*/

define('Host/Function', ['Core/Host'], function(Host){

var proto = Function.prototype, slice = Array.prototype.slice;

return Host(Function).implement({
	
	apply: proto.apply,
	call: proto.call,

	bind: function(bind){
		var self = this, args = (arguments.length > 1) ? slice.call(arguments, 1) : null;

		return function(){
			if (!args && !arguments.length) return self.call(bind);
			if (args && arguments.length) return self.apply(bind, args.concat(slice.call(arguments)));
			return self.apply(bind, args || arguments);
		};
	}

});

});
