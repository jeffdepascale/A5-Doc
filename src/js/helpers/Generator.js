
a5.Package('a5.apps.docsGenerator.helpers')
	
	.Import('a5.cl.plugins.Zip')
	.Extends('a5.cl.CLBase')
	.Class('Generator', function(self, im, Generator){
	
		self.Generator = function(){
			self.superclass(this);
		}
		
		self.generateOutput = function(docsObj){
			
		}

})