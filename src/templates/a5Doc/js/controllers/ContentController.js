
a5.Package('apps.docs.controllers')

	.Extends('a5.cl.CLController')
	.Class('ContentController', function(cls, im){
		
		cls.ContentController = function(){
			cls.superclass(this, arguments);
		}
		
		cls.Override.viewReady = function(){
			var inhMethBtn = cls.view().getChildView('inheritedMethodsBtn');
			if(inhMethBtn)
				inhMethBtn.addEventListener(a5.cl.ui.events.UIMouseEvent.CLICK, eInhMethodsHandler);
			cls.MVC().application().view().redraw(true); 
		}
		
		var eInhMethodsHandler = function(e){
			cls.view().getChildView('inheritedMethods').show();
			cls.view().getChildView('inheritedMethodsBtn').hide();
			cls.MVC().application().view().redraw(true); 
		}
		
});