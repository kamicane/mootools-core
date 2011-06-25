/*
---
name: String
description: ES5 String methods
...
*/

define('Host/String', ['Core/Host'], function(Host){

var proto = String.prototype;
return Host(String).implement({
	charAt: proto.charAt, charCodeAt: proto.charCodeAt, concat: proto.concat, indexOf: proto.indexOf, lastIndexOf: proto.lastIndexOf, match: proto.match,
	quote: proto.quote, replace: proto.replace, search: proto.search, slice: proto.slice, split: proto.split, substr: proto.substr,
	substring: proto.substring, toLowerCase: proto.toLowerCase, toUpperCase: proto.toUpperCase
});

});
