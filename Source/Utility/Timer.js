/*
---
name: Timer
description: The basic Timer logic.
requires: Array
provides: Timer
...
*/

(function(){

var timerCallBacks = {}, timerRunners = {};

var Timer = this.Timer = function(fps){
	
	var ms = Math.round(1000 / fps);
	
	var fpsCallBacks = timerCallBacks[fps] || (timerCallBacks[fps] = []);
	
	var step = function(){
		if (!timerRunners[fps]) timerRunners[fps] = setTimeout(function(){
			delete timerRunners[fps];
			var now = Date.now();
			for (var i = fpsCallBacks.length; i--; i) fpsCallBacks[i](now);
			if (fpsCallBacks.length) step();
		}, ms);
	};
	
	var push = function(callBack){
		fpsCallBacks.include(callBack);
		step();
	};
	
	var pull = function(callBack){
		fpsCallBacks.erase(callBack);
	};
	
	var running = function(){
		return !!(fpsCallBacks.length);
	};
	
	return {push: push, pull: pull, running: running};
	
};

})();
