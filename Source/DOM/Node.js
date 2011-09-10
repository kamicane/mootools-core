/*
---
name: DOM
description: DOM
...
*/

define([
	'../Core/Class', '../Utility/typeOf', '../Utility/Object', '../Utility/Array', '../Utility/String', 'Slick/Finder', '../Data/Accessor'
], function(Class, typeOf, Object, Array, String, Slick, Accessor){

// node

var html = document.documentElement;

var Node = Class({

	initialize: function(node){
		this.node = node;
	},
	
	find: function(expression){
		return select(Slick.find(this.node, expression));
	},
	
	search: function(expression){
		var elements = new Elements, nodes = Slick.search(this.node, expression);
		for (var i = 0; i < nodes.length; i++) elements[elements.length++] = select(nodes[i]);
		return elements;
	},
	
	addEventListener: ((html.addEventListener) ? function(type, fn){
		this.node.addEventListener(type, fn, false);
		return this;
	} : function(type, fn){
		this.node.attachEvent('on' + type, fn);
		return this;
	}),

	removeEventListener: ((html.removeEventListener) ? function(type, fn){
		this.node.removeEventListener(type, fn, false);
		return this;
	} : function(type, fn){
		this.node.detachEvent('on' + type, fn);
		return this;
	})

});

Node.prototype.valueOf = function(){
	return this.node;
};

var wrappers = {}, matchers = [];

Class.defineMutator('Matches', function(match){
	matchers.push({match: match, construct: this, type: typeOf(match)});
});

// select

var select = Node.select = function(node){
	if (node != null){
		if (typeof node == 'string') return select(Slick.find(document, node));
		if (node instanceof Node) return node;
		var uid = node.uniqueNumber || Slick.uidOf(node), wrapper = wrappers[uid];
		if (wrapper) return wrapper;
		for (var l = matchers.length; l--; l){
			var current = matchers[l], match = current.match, type = current.type, construct = current.construct;
			if ((type == 'string' && Slick.match(node, match)) || (type == 'function' && match(node))) return (wrappers[uid] = new construct(node));
		}
	}
	return null;
};

// collect

var collect = Node.collect = function(){
	var list = new Elements;
	for (var i = 0, l = arguments.length; i < l; i++){
		var argument = arguments[i];
		if (typeof argument == 'string') Slick.search(document, argument, list);
		else list.push(argument);
	}
	return list;
};

// document

var Document = Node.Document = Class({

	Extends: Node,
	
	createElement: function(tag){
		return select(this.node.createElement(tag));
	},
	
	createTextNode: function(text){
		return this.node.createTextNode(text);
	},
	
	build: function(){}

});

Document.prototype.toString = function(){
	return '<document>';
};

// window

var Window = Node.Window = Class({Extends: Node});

Window.prototype.toString = function(){
	return '<window>';
};

// element

var Element = Node.Element = new Class({
	Extends: Node,
	Matches: '*'
});

// element methods to elements

var elementImplement = Element.implement;

Element.implement = function(key, fn){
	if (typeof key != 'string') for (var k in key) this.implement(k, key[k]); else {
		if (!Elements.prototype[key]) Elements.prototype[key] = function(){
			var elements = new Elements, results = [];
			for (var i = 0; i < this.length; i++){
				var node = this[i], result = node[key].apply(node, arguments);
				if (elements && !(result instanceof Element)) elements = false;
				results[i] = result;
			}

			if (elements){
				elements.push.apply(elements, results);
				return elements;
			}
			
			return results;
		};

		elementImplement.call(Element, key, fn);
	}
};

Element.prototype.toString = function(){
	var tag = this.get('tag'), id = this.get('id'), className = this.get('class');
	var str = '<' + tag;
	if (id) str += '#' + id;
	if (className) str += '.' + className.replace(/\s+/, '.');
	return str + '>';
};

// elements

var Elements = Node.Elements = function(){
	this.uids = {};
	if (arguments.length) this.push.apply(this, arguments);
};

Elements.implement = function(key, fn){
	if (typeof key != 'string') for (var k in key) this.implement(k, key[k]); else this.prototype[key] = fn;
};

Elements.prototype = Object.create(Array.prototype);

Elements.implement({
	
	length: 0,
	
	push: function(){
		for (var i = 0, l = arguments.length; i < l; i++){
			var node = arguments[i], item = select(arguments[i]);
			if (item && item instanceof Element){
				node = item.node;
				var uid = node.uniqueNumber || Slick.uidOf(node);
				if (!this.uids[uid]) this[this.length++] = item;
			}
		}
		return this.length;
	}
	
});

// standard methods

Element.implement({

	appendChild: function(child){
		if ((child = select(child))) this.node.appendChild(child.valueOf());
		return this;
	},

	setAttribute: function(name, value){
		this.node.setAttribute(name, value);
		return this;
	},

	getAttribute: function(name){
		return this.node.getAttribute(name);
	},
	
	removeAttribute: function(name){
		this.node.removeAttribute(name);
		return this;
	},

	contains: function(node){
		return ((node = select(node))) ? Slick.contains(this.node, node.valueOf()) : false;
	},

	match: function(expression){
		return Slick.match(this.node, expression);
	}

});

// className methods

var classRegExps = {};
var classRegExpOf = function(string){
	return classRegExps[string] || (classRegExps[string] = new RegExp('(^|\\s)' + Slick.escapeRegExp(string) + '(?:\\s|$)'));
};

Element.implement({

	hasClass: function(className){
		return classRegExpOf(className).test(this.node.className);
	},

	addClass: function(className){
		var node = this.node;
		if (!this.hasClass(className)) node.className = String.clean(node.className + ' ' + className);
		return this;
	},

	removeClass: function(className){
		var node = this.node;
		node.className = String.clean(node.className.replace(classRegExpOf(className), '$1'));
		return this;
	}

});

/* Injections / Ejections */

var inserters = {

	before: function(context, element){
		var parent = element.parentNode;
		if (parent) parent.insertBefore(context, element);
	},

	after: function(context, element){
		var parent = element.parentNode;
		if (parent) parent.insertBefore(context, element.nextSibling);
	},

	bottom: function(context, element){
		element.appendChild(context);
	},

	top: function(context, element){
		element.insertBefore(context, element.firstChild);
	}

};

Element.implement({

	inject: function(element, where){
		if ((element = select(element))) inserters[where || 'bottom'](this.node, element.valueOf());
		return this;
	},

	eject: function(){
		var parent = this.node.parentNode;
		if (parent) parent.removeChild(this.node);
		return this;
	},

	adopt: function(){
		Array.forEach(arguments, function(element){
			if ((element = select(element))) this.node.appendChild(element.valueOf());
		}, this);
		return this;
	},

	appendText: function(text, where){
		inserters[where || 'bottom'](document.createTextNode(text), this.node);
		return this;
	},

	grab: function(element, where){
		if ((element = select(element))) inserters[where || 'bottom'](element.valueOf(), this.node);
		return this;
	},

	replace: function(element){
		if ((element = select(element))){
			element = element.valueOf();
			element.parentNode.replaceChild(this.node, element);
		}
		return this;
	},

	wrap: function(element, where){
		return this.replace(element).grab(element, where);
	}

});

var methods = {};

Object.forEach(inserters, function(inserter, where){

	var Where = String.capitalize(where);

	methods['inject' + Where] = function(el){
		return this.inject(el, where);
	};

	methods['grab' + Where] = function(el){
		return this.grab(el, where);
	};

});

Element.implement(methods);

/* Tree Walking */

methods = {
	find: {
		getNext: '~',
		getPrevious: '!~',
		getFirst: '^',
		getLast: '!^',
		getParent: '!'
	},
	search: {
		getAllNext: '~',
		getAllPrevious: '!~',
		getSiblings: '~~',
		getChildren: '>',
		getParents: '!'
	}
};

Object.forEach(methods, function(getters, method){
	Element.implement(Object.map(getters, function(combinator){
		return function(expression){
			return this[method](combinator + (expression || '*'));
		};
	}));
});

/* Attribute Getters, Setters, using Slick */

Accessor.call(Element, 'Getter');
Accessor.call(Element, 'Setter');

var properties = {};

Array.forEach([
	'checked', 'defaultChecked', 'type', 'value', 'accessKey', 'cellPadding', 'cellSpacing', 'colSpan',
	'frameBorder', 'maxLength', 'readOnly', 'rowSpan', 'tabIndex', 'useMap',
	// Attributes
	'id', 'attributes', 'childNodes', 'className', 'clientHeight', 'clientLeft', 'clientTop', 'clientWidth', 'dir', 'firstChild',
	'lang', 'lastChild', 'name', 'nextSibling', 'nodeName', 'nodeType', 'nodeValue',
	'offsetHeight', 'offsetLeft', 'offsetParent', 'offsetTop', 'offsetWidth',
	'ownerDocument', 'parentNode', 'prefix', 'previousSibling', 'scrollHeight', 'scrollWidth', 'tabIndex', 'tagName',
	'textContent', 'innerHTML', 'title'
], function(property){
	properties[property] = property;
});

Object.append(properties, {
	'html': 'innerHTML',
	'class': 'className',
	'for': 'htmlFor',
	'text': (function(){
		var temp = document.createElement('div');
		return (temp.innerText == null) ? 'textContent' : 'innerText';
	})()
});

Object.forEach(properties, function(real, key){
	Element.defineSetter(key, function(value){
		return this.node[real] = value;
	}).defineGetter(key, function(){
		return this.node[real];
	});
});

var booleans = ['compact', 'nowrap', 'ismap', 'declare', 'noshade', 'checked', 'disabled', 'multiple', 'readonly', 'selected', 'noresize', 'defer'];

Array.forEach(booleans, function(bool){
	Element.defineSetter(bool, function(value){
		return this.node[bool] = !!value;
	}).defineGetter(bool, function(){
		return !!this.node[bool];
	});
});

Element.defineGetters({

	'class': function(){
		var node = this.node;
		return ('className' in node) ? node.className : node.getAttribute('class');
	},

	'for': function(){
		var node = this.node;
		return ('htmlFor' in node) ? node.htmlFor : node.getAttribute('for');
	},

	'href': function(){
		var node = this.node;
		return ('href' in node) ? node.getAttribute('href', 2) : node.getAttribute('href');
	},

	'style': function(){
		var node = this.node;
		return (node.style) ? node.style.cssText : node.getAttribute('style');
	}

}).defineSetters({

	'class': function(value){
		var node = this.node;
		return ('className' in node) ? node.className = value : node.setAttribute('class', value);
	},

	'for': function(value){
		var node = this.node;
		return ('htmlFor' in node) ? node.htmlFor = value : node.setAttribute('for', value);
	},

	'style': function(value){
		var node = this.node;
		return (node.style) ? node.style.cssText = value : node.setAttribute('style', value);
	}

});

/* get, set */

Element.implement({

	set: function(name, value){
		if (typeof name != 'string') for (var k in name) this.set(k, name[k]); else {
			var setter = Element.lookupSetter(name = String.camelCase(name));
			if (setter) setter.call(this, value);
			else if (value == null) this.node.removeAttribute(name);
			else this.node.setAttribute(name, value);
		}
		return this;
	},

	get: function(name){
		if (arguments.length > 1) return Array.map(arguments, function(v, i){
			return this.get(v);
		}, this);
		var getter = Element.lookupGetter(name = String.camelCase(name));
		if (getter) return getter.call(this);
		return this.node.getAttribute(name);
	}

});

Element.defineGetter('tag', function(){
	return this.node.tagName.toLowerCase();
});

// return

return Node;

});
