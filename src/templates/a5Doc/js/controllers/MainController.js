
a5.Package('apps.docs.controllers')
	
	.Import('a5.cl.ui.events.*')
	.Extends('a5.cl.ui.controllers.UISplitViewController')
	.Class('MainController', function(cls, im){
		
		var clr = null;
		
		cls.MainController = function(){
			cls.superclass(this, arguments);
		}
		
		this.content = function(id){
			cls.contentView().removeAllSubViews();
			if(clr)
				clr.destroy();
			clr = cls.create(im.ContentController, [id]);
			/*cls.cl().include('views/'+ id, function(xml){
				console.log(xml.replace(/\>/g, '>\n'));
			});*/
			clr.render(function(){
				cls.contentView().addSubView(clr.view());
				cls.view().redraw();
			})
		}
		
		this.Override.viewReady = function(){
			cls.superclass().viewReady.apply(this, arguments);
			var classListController = cls.create(im.ClassListController);
			cls.menuView().scrollYEnabled(true);
			cls.menuView().setCoordinates(['e']);
			cls.contentView().scrollYEnabled(true);
			cls.contentView().addEventListener(im.UIMouseEvent.CLICK, eClickHandler);
			classListController.render(function(){
				cls.menuView().addSubView(classListController.view());
				classListController.view().addEventListener(im.UIListEvent.ITEM_SELECTED, eItemSelectedHandler);
			});
		}
		
		var eClickHandler = function(e){
			if(e.target() instanceof a5.cl.ui.UILink){
				var txt = e.target().text();
				cls.redirect(txt.substring(txt.lastIndexOf(' ') + 1).replace(/\./g, '_'));
			}
		}
		
		var eItemSelectedHandler = function(e){
			cls.redirect(e.listItem().data());
		}
	
});
