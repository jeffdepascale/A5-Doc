a5.Package('a5.apps.docsGenerator.controllers')
	
	.Import('a5.apps.docsGenerator.helpers.*')
	.Extends('a5.cl.CLController')
	.Class('MainController', function(self, im, MainController){

		var docProcessor;
		
		self.MainController = function(){
			self.superclass(this, [true]);
		}
		
		self.Override.index = function(){
			docProcessor = self.create(im.DocProcessor);
			self.render(docProcessor.initialize());
		}
		
		
		
		

})