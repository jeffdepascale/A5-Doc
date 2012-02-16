a5.cl.Config({
	trapErrors:true,
	dependencies:[
		'/src/cl/plugins/FileAPI.js',
		'/src/cl/plugins/Zip.js',
		'js/helpers/FileLoader.js',
		'js/helpers/DocProcessor.js',
		'js/helpers/TextProcessor.js',
		'js/helpers/LiveCodeProcessor.js',
		'js/helpers/Generator.js',
		'js/controllers/MainController.js'
	]
})

a5.cl.Mappings([
	{desc:'/', controller:'Main'}
])

a5.cl.CreateApplication({
	applicationPackage:'a5.apps.docsGenerator'
})