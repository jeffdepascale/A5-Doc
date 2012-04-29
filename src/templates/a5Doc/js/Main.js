a5.Package('apps.docs')

	.Extends('a5.cl.CLMain')
	.Class('Main', function(cls, im){
		
		cls.Main = function(){
			cls.superclass(this);
			cls.setConfig({
				dependencies:[
					'js/controllers/MainController.js',
					'js/controllers/ContentController.js',
					'js/controllers/ClassListController.js',
					'views/doc.xml'
				]
			});
			
			cls.setPluginConfig('MVC', {
				rootController:'Main'
			})
		}
		
		cls.Override.pluginsLoaded = function(){
			cls.setMappings({desc:':id', controller:'Main', action:'content'})
		}
})

a5.cl.CreateApplication();