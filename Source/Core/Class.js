/*
---
name: Class
description: Contains the Class Function for easily creating, extending, and implementing reusable Classes.
...
*/

define('Core/Class', [
	'Utility/typeOf', 'Host/Object', 'Host/Array', 'Data/Accessor', 'Utility/merge'// , 'Utility/clone', 'Utility/merge', 'Utility/forEach'
], function(typeOf, Object, Array, Accessor){

var prototyping = false;

var Class = function(params){
	
	if (prototyping){
		prototyping = false;
		return this;
	}
	
	var newClass = function(){
		reset(this);
		if (prototyping){
			prototyping = false;
			return this;
		}
		this.caller_ = null;
		var value = (this.initialize) ? this.initialize.apply(this, arguments) : this;
		this.caller_ = this.caller = null;
		return value;
	};
	
	//Extends "embedded" mutator
	
	var ParentClass = (params && params.Extends) ? params.Extends : Class;
	prototyping = true;
	var instance = new ParentClass;
	if (!instance instanceof Class) return new Error('"Extends" cannot be called with a function not inheriting from "Class"');
	newClass.parent = ParentClass;
	newClass.prototype = instance;
	delete params.Extends;

	newClass.implement = implement;
	newClass.implement(params);
	
	return newClass;
};

Class.prototype.parent = function(){
	if (!this.caller_) throw new Error('The method "parent" cannot be called.');
	var name = this.caller_.name_, parent = this.caller_.owner_.parent;
	var previous = (parent) ? parent.prototype[name] : null;
	if (!previous) throw new Error('The method "' + name + '" has no parent.');
	return previous.apply(this, arguments);
};

Class.implement = function(key, fn){
	if (typeof key != 'string') for (var k in key) this.implement(k, key[k]); else {
		this.prototype[key] = fn;
	}
};

var reset = function(object){
	for (var key in object){
		var value = object[key];
		if (typeOf(value) == 'object') object[key] = reset(Object.create(value));
	}
	return object;
};

var wrap = function(self, key, method){
	if (method.origin_) method = method.origin_;
	
	var wrapped = function(){
		if (method.protected_ && this.caller_ == null) throw new Error('The method "' + key + '" cannot be called.');
		var caller = this.caller, current = this.caller_;
		this.caller = current; this.caller_ = wrapped;
		var result = method.apply(this, arguments);
		this.caller_ = current; this.caller = caller;
		return result;
	};
	
	wrapped.owner_ = self;
	wrapped.name_ = key;
	wrapped.origin_ = method;
	
	return wrapped;
};

Accessor.call(Class, 'Mutator');

var implement_ = function(self, key, value, nowrap){
	var mutator = Class.lookupMutator(key);
	if (mutator) value = mutator.call(self, value);

	if (typeOf(value) == 'function'){
		self.prototype[key] = (nowrap) ? value : wrap(self, key, value);
	} else Object.merge(self.prototype, key, value);
};

var implement = function(item){
	switch (typeOf(item)){
		case 'string': implement_(this, item, arguments[1]); break;
		case 'function':
			prototyping = true;
			var instance = new item;
			for (var k in instance) implement_(this, k, instance[k], true);
		break;
		case 'object': for (var o in item) implement_(this, o, item[o]); break;
	}
	return this;
};

Class.defineMutator('Implements', function(items){
	if (typeOf(items) != 'array') items = [items];
	for (var i = 0; i < items.length; i++) implement.call(this, items[i]);
}).defineMutator(/^protected\s(\w+)$/, function(fn, name){
	fn.protected_ = true;
	implement_(this, name, fn);
}).defineMutator(/^linked\s(\w+)$/, function(value, name){
	this.prototype[name] = value;
});

return Class;

});
