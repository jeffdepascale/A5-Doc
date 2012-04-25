a5.Package('a5.apps.docsGenerator.helpers')
	
	.Import('a5.cl.plugins.FileAPI')
	.Extends('a5.cl.CLBase')
	.Class('FileLoader', function(self, im, FileLoader){
		
		FileLoader.COMPLETE = 'complete';
		
		var reader, files, _view, script, fileCache = [];
		
		self.FileLoader = function(){
			self.superclass(this);
			_view = self.plugins().FileAPI().getInputView(im.FileAPI.MIME_JS);
			self.plugins().FileAPI().addEventListener(im.FileAPI.FILES_CHOSEN, eFilesChosenHandler);
		}
		
		self.view = function(){
			return _view;
		}
		
		self.getFileContents = function(){
			return fileCache;
		}
		
		var eFilesChosenHandler = function(e){
			files = Array.prototype.slice.call(e.data().files);
			reader = self.plugins().FileAPI().getReader(eFileReadHandler);
			readNextFile();
		}
		
		var eFileReadHandler = function(fileContents){
			fileCache.push(fileContents);
			if(files.length)
				readNextFile();
			else
				self.dispatchEvent(FileLoader.COMPLETE, {files:fileCache});
		}
		
		var readNextFile = function(){
			var file = files.shift();
			reader.readAsText(file);
		}

})
