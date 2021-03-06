
a5.Package('a5.apps.docsGenerator.helpers')

	.Import('a5.cl.ui.buttons.UIButton',
			'a5.cl.ui.events.*')
	.Extends('a5.cl.CLBase')
	.Class('DocProcessor', function(self, im, DocPressor){
		
		var fileLoader,
			textProcessor,
			generator,
			fileGenerator,
			packageInput,
			clsInfoObj,
			trim = a5.cl.core.Utils.trim;
		
		self.DocProcessor = function(){
			self.superclass(this);
		}
		
		self.initialize = function(){
			fileLoader = im.FileLoader.instance(true);
			fileLoader.addEventListener(im.FileLoader.COMPLETE, eFilesCompleteHandler);
			textProcessor = self.create(im.TextProcessor);
			generator = self.create(im.Generator);
			fileGenerator = self.create(im.FileGenerator);
			var vc = self.create(a5.cl.CLViewContainer);
			vc.relY(true);
			vc.addSubView(fileLoader.view());
			return vc;
		}
		
		var eFilesCompleteHandler = function(e){
			docArray = textProcessor.processFiles(e.data().files);
			var output = generator.generateOutput(docArray);
			fileGenerator.createDownloadFile(output, 'doc.xml');
		}
})