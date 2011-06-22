/*
---
name: Class
description: Contains the Class Function for easily creating, extending, and implementing reusable Classes.
...
*/

define('Class/Class', ['Utility/typeOf', 'Utility/Accessor', 'Utility/clone', 'Utility/merge'], function(typeOf, Accessor, clone, merge){
	
var Class = function(params){

	if (typeOf(params) == 'function') params = {initialize: params};
	
	var newClass = function(){
		reset(this);
		if (newClass.prototyping_) return this;
		this.caller_ = null;
		var value = (this.initialize) ? this.initialize.apply(this, arguments) : this;
		this.caller_ = this.caller = null;
		return value;
	};

	newClass.hidden_ = true;
	
	for (var k in Class.prototype) newClass[k] = Class.prototype[k];

	newClass.implement(params);

	newClass.constructor_ = Class;
	newClass.prototype.constructor_ = newClass;
	newClass.prototype.parent = parent;
	
	return newClass;
};

var parent = function(){
	if (!this.caller_) throw new Error('The method "parent" cannot be called.');
	var name = this.caller_.name_, parent = this.caller_.owner_.parent;
	var previous = (parent) ? parent.prototype[name] : null;
	if (!previous) throw new Error('The method "' + name + '" has no parent.');
	return previous.apply(this, arguments);
};

parent.hidden_ = true;

var reset = function(object){
	for (var key in object){
		var value = object[key];
		switch (typeOf(value)){
			case 'object':
				var F = function(){};
				F.prototype = value;
				var instance = new F;
				object[key] = reset(instance);
			break;
			case 'array': object[key] = clone(value); break;
		}
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

new Accessor('Mutator').apply(Class);

var implement = function(key, value, retainOwner){
	
	var mutator = Class.lookupMutator(key);
	
	if (mutator){
		value = mutator.call(this, value);
		if (value == null) return;
	}
	
	if (typeOf(value) == 'function'){
		if (value.hidden_) return;
		this.prototype[key] = (retainOwner) ? value : wrap(this, key, value);
	} else {
		merge(this.prototype, key, value);
	}
	
};

var implementClass = function(item){
	var instance = new item;
	for (var key in instance) implement.call(this, key, instance[key], true);
};

Class.prototype.implement = function(a, b){
	switch (typeOf(a)){
		case 'string': implement.call(this, a, b); break;
		case 'class': implementClass.call(this, a); break;
		default: for (var p in a) implement.call(this, p, a[p]); break;
	}
	
	return this;
};

Class.defineMutators({

	Extends: function(parent){
		this.parent = parent;
		parent.prototyping_ = true;
		var proto = new parent;
		delete parent.prototyping_;
		this.prototype = proto;
	},

	Implements: function(items){
		if (typeOf(items) != 'array') items = [items];
		for (var i = 0; i < items.length; i++) this.implement(items[i]);
	}

}).defineMutator(/^protected\s(\w+)$/, function(fn, name){
	fn.protected_ = true;
	implement.call(this, name, fn);
}).defineMutator(/^linked\s(\w+)$/, function(value, name){
	this.prototype[name] = value;
});

return Class;

});
