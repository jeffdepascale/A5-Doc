a5.cl.Config({
	trapErrors:true,
	dependencies:[
		'../lib/A5-CL-MVC.js',
		//'/src/cl/plugins/FileAPI.js',
		//'/src/cl/plugins/Zip.js',
		'../src/js/helpers/FileLoader.js',
		'../src/js/helpers/DocProcessor.js',
		'../src/js/helpers/TextProcessor.js',
		'../src/js/helpers/LiveCodeProcessor.js',
		'../src/js/helpers/Generator.js',
		'../src/js/controllers/MainController.js'
	]
})

a5.cl.Mappings([
	{desc:'/', controller:'Main'}
])

a5.cl.CreateApplication({
	applicationPackage:'a5.apps.docsGenerator'
})