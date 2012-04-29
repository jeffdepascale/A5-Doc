
a5.Package('a5.apps.docsGenerator.helpers')
	
	.Import('a5.cl.plugins.Zip')
	.Extends('a5.cl.CLBase')
	.Class('Generator', function(self, im, Generator){
		
		var classListTmpl,
			classTmpl,
			classListOutput,
			classOutputArray = [];
		
		self.Generator = function(){
			self.superclass(this);
			self.cl().include('templates/a5Doc/fileTmpl/classList.xml', function(str){
				classListTmpl = str;
			})
			self.cl().include('templates/a5Doc/fileTmpl/class.xml', function(str){
				classTmpl = str.replace('{{CLASS_BREAK}}', '<!--CL: id=views/<%=cls.nm.replace(/\\./g, "_")%> type=xml  :CL-->');
			})
		}
		
		self.generateOutput = function(docsObj){
			parseClassList(docsObj);
		}
		
		var parseClassList = function(docsObj){
			var clsArray = [],
				nmObj = {};
			for (var prop in docsObj) {
				var obj = docsObj[prop];
				if(!nmObj[obj.pkg])
					nmObj[obj.pkg] = {};
				nmObj[obj.pkg][obj.clsName] = docsObj[prop];
			}
			console.log(nmObj)
			var result = self.plugins().TemplateEngine().populateTemplate(classListTmpl, {nmObj:nmObj});
			console.log(result);
			var classResult = self.plugins().TemplateEngine().populateTemplate(classTmpl, {nmObj:nmObj});
			//console.log(classResult);
			//window.open('data:text/plain;charset=utf-8,'+classResult);
			var lb = a5.cl.ui.modals.UILightBox.show();
			var view = self.create(a5.cl.CLHTMLView);
			view.drawHTML(toEntities(classResult));
			lb.contentView().addSubView(view);
			lb.contentView().scrollYEnabled(true).height('100%');
			lb.contentWidth('90%').contentHeight('90%');
		}
		
		var toEntities = function(str){
			return str.replace(/</g, '&lt;').replace(/>/g, '&gt;');
		}
	

})