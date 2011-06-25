define('Core/SandBox', [
	'Utility/typeOf', 'Host/Array', 'Host/Date', 'Host/Function', 'Host/Number', 'Host/Object', 'Host/RegExp', 'Host/String'
], function(typeOf, A, D, F, N, O, R, S){
	
var hosts = {ARRAY: A, DATE: D, FUNCTION: F, NUMBER: N, OBJECT: O, REGEXP: R, STRING: S},
	sandboxes = {};

for (var h in hosts){
	var host = hosts[h], proto = new host, sandbox = sandboxes[h] = function(o, type){
		this.self = o;
		this.type = type;
	};

	for (var p in proto) (function(key, method){
		sandbox.prototype[key] = function(){
			return sb(method.apply(this.self, arguments), this);
		};
	})(p, proto[p]);

	sandbox.prototype.valueOf = function(){
		return this.self.valueOf();
	};
	
	sandbox.prototype.toString = function(){
		return this.self.toString();
	};
}

var sb = function(item, sb_){
	if (item == null) return null;
	item = item.valueOf();
	var type = typeOf(item).toUpperCase(), sandbox;
	return (sb_ && sb_.type == type) ? (sb_.self = item, sb_)
		: ((sandbox = sandboxes[type]) ? new sandbox(item, type) : item);
};

return sb;
	
});
