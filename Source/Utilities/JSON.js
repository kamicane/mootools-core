/*
---
name: JSON
description: JSON encoder and decoder
...
*/

define('JSON', ['Utility/typeOf', 'Host/Array'], function(typeOf, Array){
	
var json = function(){}, JSON = (typeof JSON == 'undefined') ? {} : JSON;

var special = {'\b': '\\b', '\t': '\\t', '\n': '\\n', '\f': '\\f', '\r': '\\r', '"' : '\\"', '\\': '\\\\'};

var escape = function(chr){
	return special[chr] || '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
};

json.validate = function(string){
	string = string.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@').
					replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
					replace(/(?:^|:|,)(?:\s*\[)+/g, '');

	return (/^[\],:{}\s]*$/).test(string);
};

json.encode = JSON.stringify || function(obj){
	if (obj && obj.toJSON) obj = obj.toJSON();

	switch (typeOf(obj)){
		case 'string':
			return '"' + obj.replace(/[\x00-\x1f\\"]/g, escape) + '"';
		case 'array':
			return '[' + Array.filter(Array.map(obj, json.encode), function(item){
				return item != null;
			}) + ']';
		case 'object':
			var string = [];
			for (var key in obj){
				var json = json.encode(obj[key]);
				if (json) string.push(json.encode(key) + ':' + json);
			}
			return '{' + string + '}';
		case 'number': case 'boolean': return '' + obj;
		case 'null': return 'null';
	}

	return null;
};

json.decode = function(string, secure){
	if (!string || typeOf(string) != 'string') return null;

	if (secure || json.secure){
		if (JSON.parse) return JSON.parse(string);
		if (!json.validate(string)) throw new Error('JSON could not decode the input; security is enabled and the value is not secure.');
	}

	return eval('(' + string + ')');
};

return json;

});
