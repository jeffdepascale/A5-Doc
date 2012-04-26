
a5.Package('apps.docs.controllers')

	.Extends('a5.cl.ui.controllers.UISplitViewController')
	.Class('MainController', function(cls, im){
		
		var clr = null;
		
		cls.MainController = function(){
			cls.superclass(this, arguments);
		}

		
		this.Override.viewReady = function(){
			cls.superclass().viewReady.apply(this, arguments);
			var classListController = cls.create(im.ClassListController);
			cls.menuView().scrollYEnabled(true);
			cls.contentView().scrollYEnabled(true);
			classListController.render(function(){
				cls.menuView().addSubView(classListController.view());
				classListController.view().addEventListener(a5.cl.ui.events.UIListEvent.ITEM_SELECTED, eItemSelectedHandler);
			});
		}
		
		var eItemSelectedHandler = function(e){
			cls.contentView().removeAllSubViews();
			if(clr)
				clr.destroy();
			clr = cls.create(im.ContentController, [e.listItem().data()]);
			clr.render(function(){
				cls.contentView().addSubView(clr.view());
			})
		}
	
});
