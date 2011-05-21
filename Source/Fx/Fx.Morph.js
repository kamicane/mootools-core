/*
---
name: Fx.Morph
description: Morph styles of Elements.
requires: [Fx, Element.Style]
provides: Fx.Morph
...
*/

(function(){

Fx.Morph = new Class({

	Extends: Fx,
	
	initialize: function(element, options){
		this.item = DOM.$(element);
		this.parent(options);
	},
	
	/* public methods */
	
	start: function(data){
		if (!this.check.apply(this, arguments)) return this;
		var matchColor = /^rgb/, matchUnit = /^[\d.]+[a-zA-Z]+$/, matchFloat = /^[\d.]+$/, matchString = /^\w+$/;
		
		if (typeOf(data) == 'string'){
			data = {};
			data[arguments[0]] = (arguments[2] == null) ? {to: arguments[1]} : {from: arguments[1], to: arguments[2]};
		}
		
		var length = 0;
		this.all = {};
		
		main: for (var style in data){

			var from = null, to = null, camel = style.camelCase(), current = data[style];
			var parse = DOM.Element.lookupStyleParser(camel);
			if (!parse) continue;
			
			if (typeOf(current) == 'object'){
				from = current.from; to = current.to;
			} else {
				to = current;
			}

			if (from == null) from = this.item.getStyle(camel);
			var froms = Array.from(parse(from)), tos = Array.from(parse(to));
			if (!froms || !tos) continue;
			
			var l = froms.length;
			if (l != tos.length) continue;
			
			var cData = [], cFroms = [], cTos = [];
			
			sub: for (var i = 0; i < l; i++){

				var f = froms[i], t = tos[i];

				if (f.match(matchColor) && t.match(matchColor)){
	
					var cf = new Color(f), ct = new Color(t);
					cData.push({type: 'array', from: cf.toRGB(true), to: ct.toRGB(true)});
					f = cf.toString();
					t = ct.toString();
	
				} else if (f.match(matchUnit) && t.match(matchUnit)){
					
					var regexp = /^([\d.]+)(%|px|em|pt)$/, match;
					if (!(match = String(f).match(regexp))) continue main;
					f = match.slice(1);
					if (!(match = String(t).match(regexp))) continue main;
					t = match.slice(1);
					if (!f[1]) f[1] = 'px';
					if (!t[1]) t[1] = 'px';

					if (f[1] == 'px' && t[1] == 'em') f[0] = this.item.PXToEM(f[0]);
					else if (f[1] == 'em' && t[1] == 'px') f[0] = this.item.EMToPX(f[0]);
					else if (f[1] != t[1]) continue main;
					
					var u = t[1];

					f = parseFloat(f[0]);
					t = parseFloat(t[0]);
					
					cData.push({type: 'number', from: f, to: t, unit: u});
					
					f = f + u;
					t = t + u;
					
				} else if (f.match(matchFloat) && t.match(matchFloat)){

					f = parseFloat(f);
					t = parseFloat(t);
					cData.push({type: 'number', from: f, to: t});

				} else if (f.match(matchString) && t.match(matchString)){
				
					cData.push({type: 'string', from: f, to: t});
					
				} else continue main; //TODO: don't quit here. Could be a string in a (border) shorthand?

				cFroms.push(f);
				cTos.push(t);
				
			}
			
			if (cFroms.toString() != cTos.toString()){
				this.all[camel] = cData;
				length++;
			}
			
		}
		
		return (length) ? this.parent() : this;
		
	},
	
	morph: function(selector){
		if (!this.check(selector)) return this;
		var element = DOM.$(document).build(selector).setStyles({visibility: 'hidden', position: 'absolute'}).injectAfter(this.item), styles = {};
		DOM.Element.eachStyleParser(function(parser, name){
			if (!parser.shortHand) styles[name] = element.getStyle(name);
		});
		element.eject();
		return this.start(styles);
	},
	
	/* overrides */
	
	'protected compute': function(delta){
		var styles = {};
		
		for (var style in this.all){
			var current = this.all[style];
			var results = [];

			main: for (var i = 0; i < current.length; i++){
				
				var c = current[i], from = c.from, to = c.to, unit = c.unit, result;
					
				switch (c.type){
					case 'number': result = (from == to) ? to : Fx.compute(from, to, delta); break;
					case 'string': result = to; break;
					case 'array': result = from.map(function(fj, j){
						var tj = to[j];
						return (fj == tj) ? tj : Fx.compute(fj, tj, delta);
					}); break;
				}
				
				results.push((unit) ? result + unit : result);
			}
			
			styles[style] = results;
		}
		
		return styles;
	},
	
	'protected render': function(styles){
		this.item.setStyles(styles);
	},
	
	/* $ */
	
	toElement: function(){
		return this.item;
	}
	
});

})();

DOM.Element.implement('morph', function(data, options){
	var fx = this._fxMorph || (this._fxMorph = new Fx.Morph(this));
	if (options) fx.setOptions(options);
	fx.start(data);
	return this;
});
