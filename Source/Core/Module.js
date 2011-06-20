/*
---
name: Module
description: simple Module Definition implementation
...
*/

if (typeof define == 'undefined') var define = null;
if (typeof require == 'undefined') var require = null;

(function(){//define + require, default basic implementation (subset) of the commonJS AMD spec

var modules = {}, loaded = {};

if (!define) define = function(id, dependencies_, factory_){
	modules[id] = {dependencies: (factory_) ? dependencies_ : [], factory: factory_ || dependencies_};
};

if (!require) require = function(ids, callback_){
	if (typeof ids == 'string') ids = [ids];
	var modules_ = [];
	for (var i = 0; i < ids.length; i++){
		var id = ids[i], module = modules[id];
		if (module && loaded[id] == null){
			var factory = module.factory, ideps = module.dependencies, dependencies = [];
			for (var j = 0; j < ideps.length; j++) dependencies.push(require(ideps[j]));
			loaded[id] = (typeof factory == 'function') ? factory.apply(this, dependencies) : factory;
		}
		modules_.push(loaded[id]);
	}
	if (callback_) callback_.apply(this, modules_);
	return modules_[0];
};
	
})();
