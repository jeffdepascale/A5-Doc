a5.Package('a5.apps.docsGenerator.controllers')
	
	.Import('a5.apps.docsGenerator.helpers.*',
			'a5.cl.ui.events.UIMouseEvent')
	.Extends('a5.cl.CLController')
	.Class('MainController', function(self, im, MainController){

		var docProcessor;
		
		self.MainController = function(){
			self.superclass(this, [true]);
		}
		
		self.Override.index = function(){
			if ('BlobBuilder' in window || 'WebKitBlobBuilder' in window) {
			
				docProcessor = self.create(im.DocProcessor);
				self.render(docProcessor.initialize());
				var dlAppButton = self.create(a5.cl.ui.buttons.UIButton);
				dlAppButton.label('Download App Wrapper').width(150).y(30).fontSize(10);
				dlAppButton.labelView().y(-5);
				dlAppButton.addEventListener(im.UIMouseEvent.CLICK, eDLClickHandler);
				self.view().addSubView(dlAppButton);
			} else {
				var badBrowserText = self.create(a5.cl.ui.UITextField);
				badBrowserText.text('Docs Generator requires Google Chrome or another HTML5 Blob capable browser.');
				self.view().addSubView(badBrowserText);
			}
		}
		
		var eDLClickHandler = function(){
			window.location = "http://a5js.com/wp-content/uploads/2012/08/a5Doc.zip";
		}
		
		

})