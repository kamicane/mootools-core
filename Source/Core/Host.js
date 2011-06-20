/*
---
name: Host
description: The Host object
...
*/

define('Core/Host', function(){

	var slice = Array.slice || function(self){
		return Array.prototype.slice.call(self);
	};

	// Host class

	return function Host(native_){
	
		var prototyping = false, prototypes = {}, generics = {}, host = function(){
			var self = this;
			if (!(this instanceof host)){
				prototyping = true;
				self = new host;
				prototyping = false;
			}
			if (!prototyping) self.self_ = native_.apply(native_, arguments);
			return self;
		};
	
		host.install = function(object){
			object = object || native_;
			for (key in generics) if (!object[key]) native_[key] = generics[key];
			for (key in prototypes) if (!object.prototype[key]) object.prototype[key] = prototypes[key];
			return this;
		};
	
		host.implement = function(key, fn){
			if (typeof key != 'string') for (var k in key) this.implement(k, key[k]); else if (!this.prototype[key] && fn){
				var proto = (native_.prototype[key]) ? native_.prototype[key] : null;
				if (!proto) proto = prototypes[key] = fn;
				this.prototype[key] = function(){
					return proto.apply(this.self_, arguments);
				};
				this.extend(key, function(){
					var args = slice(arguments);
					return proto.apply(args.shift(0), args);
				});
			}
			return this;
		};
	
		host.extend = function(key, fn){
			if (typeof key != 'string') for (var k in key) this.extend(k, key[k]); else if (!this[key] && fn){
				var generic = (native_[key]) ? native_[key] : null;
				if (!generic) generic = generics[key] = fn;
				this[key] = generic;
			}
			return this;
		};
	
		host.prototype.valueOf = function(){
			return this.self_;
		};
	
		return host;
	
	};

});
