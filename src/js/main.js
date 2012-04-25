
a5.Package('a5.apps.docsGenerator')

	.Extends('a5.cl.CLMain')
	.Class('Main', function(cls, im){
		
		cls.Main = function(){
			cls.superclass(this);
			cls.setConfig({
				dependencies:[
					'js/a5/A5-CL-MVC.js',
					'js/a5/A5-CL-UI.js',
					'js/a5/plugins/FileAPI.js',
					'js/a5/plugins/Zip.js',
					'js/a5/plugins/TemplateEngine.js',
					'js/helpers/FileLoader.js',
					'js/helpers/DocProcessor.js',
					'js/helpers/TextProcessor.js',
					'js/helpers/LiveCodeProcessor.js',
					'js/helpers/Generator.js',
					'js/controllers/MainController.js'
				]
			});
			cls.setPluginConfig("MVC", {
				rootController:'Main'
			})
		}		
})	

a5.cl.CreateApplication();