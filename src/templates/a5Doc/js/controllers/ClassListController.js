
a5.Package('apps.docs.controllers')

	.Extends('a5.cl.CLController')
	.Class('ClassListController', function(self){
		
		self.ClassListController = function(){
			self.superclass(this, ['ClassList.xml']);
		}
		
		self.Override.viewReady = function(){
			self.superclass().viewReady.apply(this, arguments);
			self.view().width('100%');
		}
});
