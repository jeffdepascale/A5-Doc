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
					'views/class.xml'
				]
			});
			
			cls.setPluginConfig('MVC', {
				rootController:'Main'
			})
		}		
})

a5.cl.CreateApplication();