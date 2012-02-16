
a5.Package('a5.apps.docsGenerator.helpers')

	.Import('a5.cl.ui.buttons.UIButton',
			'a5.cl.ui.events.*')
	.Extends('a5.cl.CLBase')
	.Class('DocProcessor', function(self, im, DocPressor){
		
		var fileLoader,
			textProcessor,
			liveCodeProcessor,
			generator,
			packageInput,
			clsInfoObj,
			hasFiles,
			hasPackageText,
			trim = a5.cl.core.Utils.trim,
			runBtn;
		
		self.DocProcessor = function(){
			self.superclass(this);
		}
		
		self.initialize = function(){
			fileLoader = im.FileLoader.instance(true);
			fileLoader.addEventListener(im.FileLoader.COMPLETE, eFilesCompleteHandler);
			textProcessor = self.create(im.TextProcessor);
			liveCodeProcessor = self.create(im.LiveCodeProcessor);
			generator = self.create(im.Generator);
			var vc = self.create(a5.cl.CLViewContainer);
			vc.relY(true);
			packageInput = self.create(a5.cl.ui.form.UIInputField); 
			packageInput.addEventListener(im.UIEvent.CHANGE, ePackageChangeHandler);
			packageInput.width(300).label('package name:');
			packageInput.labelView().width('auto');
			runBtn = self.create('a5.cl.ui.buttons.UIButton');
			runBtn.label('Build Documentation').width(200);
			runBtn.enabled(false);
			runBtn.addEventListener(im.UIMouseEvent.CLICK, eRunClickHandler);
			vc.addSubView(packageInput);
			var v = fileLoader.view();
			vc.addSubView(fileLoader.view());
			vc.addSubView(runBtn);
			return vc;
		}
		
		var ePackageChangeHandler = function(e){
			var text = e.target().value(),
				dotIndex = text.indexOf('.');
			hasPackageText = text.length >2 && dotIndex > 0 && dotIndex < text.length-1 ;
			updateBtnState();
		}
		
		var eFilesCompleteHandler = function(e){
			hasFiles = true;
			clsInfoObj = textProcessor.processFiles(e.data().files);
			updateBtnState();
		}
		
		var updateBtnState = function(){
			runBtn.enabled(hasFiles && hasPackageText);
		}
		
		var eRunClickHandler = function(e){
			var packageStr = packageInput.value();
			console.log(clsInfoObj);
			if (packageStr) {
				var pkgArray = packageStr.split(','),
					docObj = liveCodeProcessor.processClasses(pkgArray, clsInfoObj);
				generator.generateOutput(docObj);
			} else {
				//error
			}
		}
})