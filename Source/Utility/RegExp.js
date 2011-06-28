/*
---
name: RegExp
description: Custom RegExp prototypes and generics.
...
*/

define(['../Host/RegExp'], function(RegExp){

RegExp.implement('escape', function(){
	return this.toString().replace(/([-.*+?^${}()|[\]\/\\])/g, '\\$1');
});

return RegExp;

});
