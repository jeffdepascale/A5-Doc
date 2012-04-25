a5.Package('apps.streamer')

	.Extends('a5.cl.CLMain')
	.Class('Main', function(cls, im){
		
		cls.Main = function(){
			cls.superclass(this);
			cls.setConfig({
				dependencies:[
					'js/3rdparty/A5-CL-MVC.js',
					'js/3rdparty/A5-CL-UI.js',
					'js/3rdparty/plugins/IOSSetup.js',
					'js/3rdparty/plugins/Audio.js',
					'js/controllers/TabController.js',
					'js/views/RadioPlayerView.js',
					'js/views/IOSTabView.js'
				]
			});
			cls.setPluginConfig('IOSSetup', {
				appleIconPath:'images/ios/icon.png',
				appleStartupImagePath:'images/ios/loading.png'
			});	
		}	
		
		cls.Override.pluginsLoaded = function(){
			cls.setMappings(
				{desc:'/', controller:'Tab'}
			)
		}
})	

a5.cl.CreateApplication();


a5.Package('apps.streamer.controllers')
	
	.Import('a5.cl.ui.UIImage',
			'apps.streamer.views.*')
	.Extends('a5.cl.ui.controllers.UITabViewController')
	.Class('TabController', function(cls, im){
		
		cls.TabController = function(){
			cls.tabViewClass(im.IOSTabView);
			cls.superclass(this, ['Main.xml']);
			cls.tabBarBG().addSubView(cls.create(im.UIImage, ['images/tab_bar.png']));
			cls.tabBarHeight(50);
		}
		
		cls.Override.viewReady = function(){
			cls.superclass().viewReady.call(this);
			cls.tabBarLocation('bottom');
		}
		
		cls.Override.index = function(){
			cls.render();
		}
		
		cls.Override.tabsReady = function(){
			cls.getTabAtIndex(0, true).setImage('images/FTNS_OnAir_Icon.png');
			cls.getTabAtIndex(1, true).setImage('images/FTNS_VisitFTNS_Icon.png');
		}
})


a5.Package('apps.streamer.views')
	.Import('a5.cl.*',
			'a5.cl.ui.*', 
			'a5.cl.ui.interfaces.ITabView')
	.Extends('UIControl')
	.Implements('ITabView')
	.Class('IOSTabView', function(cls, im){
		
		var image,
			label,
			bgView,
			contentView;
		
		cls.IOSTabView = function(){
			cls.superclass(this);
			bgView = cls.create(im.CLView);
			bgView.backgroundColor('#fff').alpha(0).borderRadius(5);
			cls.addSubView(bgView);
			contentView = cls.create(im.UIContainer);
			contentView.relY(true);
			cls.addSubView(contentView);
			image = cls.create(im.UIImage);
			label = cls.create(im.UITextField);
			label.textColor('#fff').fontSize(11).bold(true);
			image.alignX('center');
			label.textAlign('center');
			contentView.addSubView(cls.create(im.UIFlexSpace));
			contentView.addSubView(image);
			contentView.addSubView(label);
			cls.usePointer(true);
		}
		
		cls.setImage = function(src){
			image.src(src);
		}
		
		cls.label = function(value){
			label.text(value);
		};
		
		cls.activated = function(){
			bgView.alpha(.2);
		};
		
		cls.deactivated = function(){
			bgView.alpha(0);
		};
		
		cls.staticWidth = function(){};
		
		cls.Override.clickEnabled = function(){
			cls.superclass().clickEnabled.apply(cls, arguments);
		};		
		
})


a5.Package('apps.streamer.views')
	
	.Import('a5.cl.ui.events.UIMouseEvent')
	.Extends('a5.cl.CLViewContainer')
	.Class('RadioPlayerView', function(cls, im){
		
		var onOffToggle,
			audioPlayer,
			spinner;
		
		cls.RadioPlayerView = function(){
			cls.superclass(this);
			audioPlayer = cls.plugins().Audio();
		}
		
		cls.Override.childrenReady = function(){
			onOffToggle = cls.getChildView('onOffToggle');
			cls.getChildView('onOffToggle').addEventListener(im.UIMouseEvent.CLICK, eToggleClick);
			spinner = cls.getChildView('spinner');
			audioPlayer.addEventListener('LOADING', eLoadingHandler);
			audioPlayer.addEventListener('LOADED', eLoadedHandler);
			audioPlayer.src("http://mobilelive.ftns.co/");
			audioPlayer.play();
		}
		
		var eLoadingHandler = function(){
			onOffToggle.visible(false);
			spinner.visible(true);
		}
		
		var eLoadedHandler = function(){
			onOffToggle.visible(true);
			spinner.visible(false);
		}	
		
		var eToggleClick = function(e){
			e.target().toggled() ? audioPlayer.play() : audioPlayer.pause();
		}
})
