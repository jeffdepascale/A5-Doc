
a5.Package('a5.apps.icloud.domains')

	.Extends('a5.cl.CLDomain')
	.Class('Test', function(self, im){
		
		self.Test = function(){
			self.superclass(this);
		}
		
		self.initialize = function(){
			self.setProperties({
				type:'number',
				foo:'bool',
				str:'string',
				date:'date'
			})
		}
})


a5.Package('a5.apps.icloud.controllers')

	.Import('a5.apps.icloud.domains.Test',
			'a5.cl.CLQuery')
	.Extends('a5.cl.CLController')
	.Class('MainController', function(self, im){
		
		self.MainController = function(){
			self.superclass(this);
		}
		
		/**
		 * Sample description copy for viewReady.
		 * Some line 2 copy.
		 * @param {Boolean} name A Boolean value.
		 * @param {String} [optionalValue] 
		 * @return {String} A return value.
		 */
		self.viewReady = function(){
			var signInView = self.view().getChildView('signIn');
			self.bind(im.Test, signInView.updateTest, im.CLQuery.where('id <> 10 AND foo === false').select('id'), {value:'id'});
				
		}
		
		/**
		 * Sample description copy for index.
		 * @return Boolean
		 */
		self.index = function(){
			im.Test.instance().add({type:-1, foo:false, date:new Date(), str:'foobar'});
		}
})


a5.Package('a5.apps.icloud.views')

	.Extends('a5.cl.ui.UICanvas')
	.Mix('a5.cl.mixins.CSS3Props')
	.Class('BGCanvasView', function(self, im){
		
		var bgImg, bgLoaded,
			context;
		
		self.BGCanvasView = function(){
			self.superclass(this);
			self.overflowHeight(200).overflowWidth(200);
			bgLoaded = false;
			bgImg = new Image();
			bgImg.src = "images/bg_tile.jpg";
		}
		
		self.fooVal = 'bar';
		
		self.viewReady = function(){
			self.superclass().viewReady.call(this);
			context = self.context();
		}
		
		self.viewRedrawn = function(){
			if (!bgLoaded) {
				bgLoaded = true;
				bgImg.onload = function(){
					drawPattern();
				}
			} else {
				drawPattern();
			}
		}
		
		var drawPattern = function(){
			var pattern = context.createPattern(bgImg, "repeat");
	        context.rect(0, 0, self.width() + 200, self.height() + 200);
	        context.fillStyle = pattern;
	        context.fill();
		}
})