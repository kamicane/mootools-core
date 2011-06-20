/*
---
name: Function
description: ES5 Function methods
...
*/

define('Host/Function', ['Core/Host', 'Host/Array'], function(Host, Array){
	
	var proto = Function.prototype;

	return Host(Function).implement({
		
		apply: proto.apply,
		call: proto.call,

		bind: function(bind){
			var self = this, args = (arguments.length > 1) ? Array.slice(arguments, 1) : null;

			return function(){
				if (!args && !arguments.length) return self.call(bind);
				if (args && arguments.length) return self.apply(bind, args.concat(Array.slice(arguments)));
				return self.apply(bind, args || arguments);
			};
		}
	
	});

});
