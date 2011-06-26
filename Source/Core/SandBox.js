
define('Core/SandBox', [
	'Utility/typeOf', 'Host/Array', 'Host/Date', 'Host/Function', 'Host/Number', 'Host/Object', 'Host/RegExp', 'Host/String'
], function(typeOf, A, D, F, N, O, R, S){
	
var hosts = {ARRAY: A, DATE: D, FUNCTION: F, NUMBER: N, OBJECT: O, REGEXP: R, STRING: S},
	sandboxes = {};

var implement = function(sandbox, key, method){
	sandbox.prototype[key] = function(){
		return sb(method.apply(this.self, arguments), this);
	};
};

for (var h in hosts) (function(host, h){

	var proto = new host, hostImplement = host.implement, sandbox = sandboxes[h] = function(o, type){
		this.self = o;
		this.type = type;
	};

	for (var p in proto) implement(sandbox, p, proto[p]);

	host.implement = function(key, fn){
		if (typeof key == 'string') implement(sandbox, key, fn);
		return hostImplement.call(this, key, fn);
	};

	sandbox.prototype.valueOf = function(){
		return this.self.valueOf();
	};
	
	sandbox.prototype.toString = function(){
		return this.self.toString();
	};

})(hosts[h], h);

var sb = function(item, sb_){
	if (item == null) return null;
	item = item.valueOf();
	var type = typeOf(item).toUpperCase(), sandbox;
	return (sb_ && sb_.type == type) ? (sb_.self = item, sb_)
		: ((sandbox = sandboxes[type]) ? new sandbox(item, type) : item);
};

return sb;
	
});
