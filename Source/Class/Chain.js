/*
---
name: Chain
description: Chain
...
*/

define(['../Core/Class'], function(Class, Array){

return new Class({

	chain: function(fn){
		if (!this.$chain) this.$chain = [];
		this.$chain.push(fn);
		return this;
	},

	callChain: function(){
		return (this.$chain && this.$chain.length) ? this.$chain.shift().apply(this, arguments) : null;
	},

	clearChain: function(){
		delete this.$chain;
		return this;
	}

});

});
