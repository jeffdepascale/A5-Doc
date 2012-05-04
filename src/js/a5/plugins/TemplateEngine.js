
/*
Simple JavaScript Templating
John Resig - http://ejohn.org/ - MIT Licensed
*/
a5.Package('a5.cl.plugins.htmlTemplate')

	.Import('a5.cl.CLPlugin',
			'a5.cl.interfaces.IHTMLTemplate')
	
	.Extends('CLPlugin')
	.Implements('IHTMLTemplate')
	.Class('TemplateEngine', function(self){
		
		this.TemplateEngine = function(){
			self.superclass(this);
		}
		
		this.Override.initializePlugin = function(){
			//self.registerForProcess('htmlTemplate');
		}
	  	
		this.populateTemplate = function tmpl(str, data){
			var ta=document.createElement("textarea");
			str = str.replace(/'/g, "[SEMI_REPLACE]");
			ta.innerHTML=str.replace(/</g,"&lt;").replace(/>/g,"&gt;");
			str = ta.value;
			ta = null;
			var fn = new Function("obj",
			"var p=[];" +
			"with(obj){p.push('" +
			str
			.replace(/[\r\t\n]/g, " ")
			.split("<%").join("\t")
			.replace(/((^|%>)[^\t]*)'/g, "$1\r")
			.replace(/\t=(.*?)%>/g, "',$1,'")
			.split("\t").join("');")
			.split("%>").join("p.push('")
			.split("\r").join("\\'")
			+ "');}return p.join('');");
			try {		
				var str = fn(data);
				str = str.replace(/\[SEMI_REPLACE\]/g, "'");
				return str;
			} catch (e) {
				self.MVC().redirect(500,'Template engine error: ' + e);
			}
		};
  
});