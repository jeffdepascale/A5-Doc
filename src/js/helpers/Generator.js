
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
		
		self.generateOutput = function(docArray){
			var classListResult = self.plugins().TemplateEngine().populateTemplate(classListTmpl, {docArray:docArray});
			var classResult = self.plugins().TemplateEngine().populateTemplate(classTmpl, {docArray:docArray});
			return '<!--CL: id=views/ClassList.xml type=xml  :CL-->' + classListResult +  classResult;
		}
		
		
	

})