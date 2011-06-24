define('Core/SandBox', [
	'Utility/typeOf', 'Host/Array', 'Host/Date', 'Host/Function', 'Host/Number', 'Host/Object', 'Host/RegExp', 'Host/String'
], function(typeOf, A, D, F, N, O, R, S){
	
	var hosts = {ARRAY: A, DATE: D, FUNCTION: F, NUMBER: N, OBJECT: O, REGEXP: R, STRING: S},
		sandboxes = {};
	
	for (var h in hosts){
		var host = hosts[h], proto = new host, sandbox = sandboxes[h] = function(o){
			this.self = o;
		};
	
		for (var p in proto) (function(key, method){
			sandbox.prototype[key] = function(){
				return sb(method.apply(this.self, arguments));
			};
		})(p, proto[p]);
		
		sandbox.prototype.valueOf = function(){
			return this.self.valueOf();
		};
		
		sandbox.prototype.toString = function(){
			return this.self.toString();
		};
	}
	
	return function sb(item){
		if (item == null) return null;
		item = item.valueOf();
		var type = typeOf(item).toUpperCase(), sandbox = sandboxes[type];
		return (sandbox) ? new sandbox(item) : item;
	};
	
});
