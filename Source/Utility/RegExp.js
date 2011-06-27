/*
---
name: RegExp
description: Custom RegExp prototypes and generics.
...
*/

define('Utility/RegExp', ['Host/RegExp'], function(RegExp){

RegExp.implement('escape', function(){
	return this.replace(/([-.*+?^${}()|[\]\/\\])/g, '\\$1');
});

});
