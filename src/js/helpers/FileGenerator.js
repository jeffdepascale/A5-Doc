
a5.Package('a5.apps.docsGenerator.helpers')

	.Extends('a5.cl.CLBase')
	.Class('FileGenerator', function(cls, im, FileGenerator){

		cls.FileGenerator = function(){
			cls.superclass(this);
		}
		
		cls.createDownloadFile = function(content, fileName, type, charset){
			try {
				var BlobBuilder = null;
				if ('BlobBuilder' in window) 
					BlobBuilder = window.BlobBuilder;
				if ('WebKitBlobBuilder' in window) 
					BlobBuilder = window.WebKitBlobBuilder;
				var bb = new BlobBuilder;
				bb.append(content);
				saveAs(bb.getBlob((type || "text/plain") + ";charset=" + (charset || "utf-8")), fileName);
			} catch(e){
				var lb = a5.cl.ui.modals.UILightBox.show();
				var view = cls.create(a5.cl.CLHTMLView);
				view.drawHTML(toEntities(content));
				lb.contentView().addSubView(view);
				lb.contentView().scrollYEnabled(true).height('100%');
				lb.contentWidth('90%').contentHeight('90%');
			}
	    }
		
		var toEntities = function(str){
			return str.replace(/</g, '&lt;').replace(/>/g, '&gt;');
		}
})

