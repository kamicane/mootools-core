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

if (!require) require = function(names, callback_){
	if (typeof names == 'string') names = [names];
	var modules_ = [];
	for (var i = 0; i < names.length; i++){
		var name = names[i], module = modules[name], factory = module.factory, dependancies = module.dependancies;
		if (module && loaded[name] == null) loaded[name] = (typeof factory == 'function') ? factory.apply(this, dependancies) : factory;
		modules_.push(loaded[name]);
	}
	if (callback_) callback_.apply(this, modules_);
	return modules_[0];
};
	
})();
