/*
---
name: String
description: custom String prototypes and generics.
...
*/

define('Utility/String', ['Host/String'], function(String){

String.implement({

	contains: function(string, separator){
		return ((separator) ? (separator + this + separator).indexOf(separator + string + separator) : this.indexOf(string)) > -1;
	},

	trim: function(){
		return this.replace(/^\s+|\s+$/g, '');
	},

	clean: function(){
		return String.trim(this.replace(/\s+/g, ' '));
	},

	camelCase: function(){
		return this.replace(/-\D/g, function(match){
			return match.charAt(1).toUpperCase();
		});
	},

	hyphenate: function(){
		return this.replace(/[A-Z]/g, function(match){
			return '-' + match.toLowerCase();
		});
	},

	capitalize: function(){
		return this.replace(/\b[a-z]/g, function(match){
			return match.toUpperCase();
		});
	}

});

return String;

});
