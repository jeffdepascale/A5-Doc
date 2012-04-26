
a5.Package('a5.cl.plugins')

	.Import('a5.cl.CLPlugin')
	
	.Extends('CLPlugin')
	.Class('FileAPI', function(self, im, FileAPI){

		FileAPI.MIME_JS = 'application/x-javascript';
		FileAPI.MIME_TEXT = 'text/plain';
		FileAPI.MIME_IMAGES = 'images/*';
		FileAPI.MIME_IMAGES_JPEG = 'images/jpeg';
		FileAPI.MIME_IMAGES_PNG = 'images/png';
		FileAPI.MIME_IMAGES_GIF = 'images/gif';
		FileAPI.MIME_AUDIO = 'audio/*';
		FileAPI.MIME_AUDIO_MP3 = 'audio/mpeg';
		FileAPI.MIME_AUDIO_MP4 = 'audio/mp4';
		FileAPI.MIME_AUDIO_OGG = 'audio/ogg';
		
		FileAPI.FILES_CHOSEN = 'FileAPIFilesChosen';
		
		
		var _canRead = (window.File && window.FileReader && window.FileList && window.Blob);
		var _canWrite = false;//(_canRead && im.Utils.getVendorWindowMethod(''));
		
		this.FileAPI = function(){
			self.superclass(this);
		}
		
		this.Override.initializePlugin = function(){
			
		}
		
		this.canRead = function(){
			return _canRead;
		}
		
		this.canWrite = function(){
			return _canWrite;
		}
		
		this.getReader = function(callback, error){
			if(self.canRead()){
				var reader = new FileReader();
				reader.onload = function(e){
					callback(e.target.result);
				}
				reader.onerror = function(e){
					if(error)
						error.call(e);
					else 
						self.throwError(e);
				}
				return reader;
			} else {
				self.throwError('Cannot read file using FileAPI plugin, FileReader not implemented in browser environment.');
			}
		}
		
		this.getInputView = this.Attributes(
		["a5.Contract", {types:'string', multiple:'boolean=false'}, {types:'array', multiple:'boolean=false'}], 
		function(args){
			var view = self.create(a5.cl.CLHTMLView),
				typeStr = "",
				input = document.createElement('input');
			if(args.overloadID === 0){
				typeStr = args.types;
			} else {
				for(var i = 0, l=args.types.length; i<l; i++){
					typeStr += args.types[i];
					if(i<= l-1)
						typeStr += ',';
				}
			}
			input.type = 'file';
			input.accept = typeStr;
			if(args.multiple === true)
				input.multiple = true;
			input.addEventListener('change', eHandleFileSelect, false);
			view.width('auto').height(20);
			view.drawHTML(input);
			return view;
		})
		
		var eHandleFileSelect = function(e){
			self.dispatchEvent(FileAPI.FILES_CHOSEN, {files:e.target.files});
		}
		
})
