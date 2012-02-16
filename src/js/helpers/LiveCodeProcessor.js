
a5.Package('a5.apps.docsGenerator.helpers')

	.Extends('a5.cl.CLBase')
	.Class('LiveCodeProcessor', function(self, im, LiveCodeProcessor){
		
		var trim = a5.cl.core.Utils.trim;
		
		self.LiveCodeProcessor = function(){
			self.superclass(this);
		}
		
		self.processClasses = function(pkgArray, clsInfoObj){
			var procArray = [];
			for(var i = 0, l = pkgArray.length; i<l; i++){
				var nmStr = trim(pkgArray[i]);
				var nm = a5.GetNamespace(nmStr, false, true),
					pkgObj = {};
				for(var prop in clsInfoObj)
					if(prop.substr(0, nmStr.length) === nmStr)
						pkgObj[prop] = clsInfoObj[prop];
				procArray.push({nm:nm, pkgObj:pkgObj});
			}
		}
})