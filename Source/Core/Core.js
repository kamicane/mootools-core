/*
                                   ._                  ._  1.99dev
          .____ ___    .__    .__ /\ \________    .__ /\ \    .___
         /\  __` __`\ / __`\ / __`\ \ ,___  __`\ / __`\ \ \  /',__\
         \ \ \/\ \/\ \\ \Z\ \\ \Z\ \ \ \_ \ \Z\ \\ \Z\ \ \ \_\__, `\
          \ \_\ \_\ \_\\____/ \____/\ \__\ \____/ \____/\ \________/
           \/_/\/_/\/_//___/ \/___/  \/__/\/___/ \/___/  \/_______/
                                           the javascript framework
*/

/*
---
name: Core
description: The heart of MooTools
...
*/

var MooTools = {
	version: '1.99dev',
	build: '%build%'
};

if (typeof define == 'undefined') var define = null;
if (typeof retquire == 'undefined') var require = null;

(function(){//define + require, default basic implementation (subset) of the commonJS AMD spec

var modules = {}, loaded = {};

if (!define) define = function(id, dependancies_, factory_){
	modules[id] = {dependancies: (factory_) ? dependancies_ : [], factory: factory_ || dependancies_};
};

if (!require) require = function(ids, callback_){
	if (typeof ids == 'string') ids = [ids];
	var modules_ = [];
	for (var i = 0; i < ids.length; i++){
		var id = ids[i], module = modules[id];
		if (module && loaded[id] == null){
			var factory = module.factory, ideps = module.dependancies, dependancies = [];
			for (var j = 0; j < ideps.length; j++) dependancies.push(require(ideps[j]));
			loaded[name] = (typeof factory == 'function') ? factory.apply(this, dependancies) : factory;
		}
		modules_.push(loaded[id]);
	}
	if (callback_) callback_.apply(this, modules_);
	return modules_[0];
};
	
})();
