
a5.Package('a5.apps.docsGenerator.helpers')

	.Extends('a5.cl.CLBase')
	.Class('TextProcessor', function(self, im){
		
		var classTextObj = {},
			trim = a5.cl.core.Utils.trim,
			includePrivate = false,
			errorOnInvalid = false,
			skipped = ['core'],
			pkgBreakers = ['a5.Package(', 'Package('];
		
		self.TextProcessor = function(){
			self.superclass(this);
		}
		
		self.processFiles = function(array){
			for (var i = 0, l = array.length; i < l; i++) {
				var classArray = parseText(array[i]);
				processClasses(classArray);
			}
			return classTextObj;
		}
		
		var parseText = function(parseString){
			var resp = findFirstIdentifier(parseString, pkgBreakers, true),
				str = null,
				isFirstPass = true,
				ret = [];
			if(resp === null){
				str = parseString;
			} else {
				while (resp) {
					if(resp.pre.length && !isFirstPass)
						ret.push(resp.pre);
					str = resp.post;
					isFirstPass = false;
					resp = findFirstIdentifier(str, pkgBreakers);
				}
			}
			if(str)
				ret.push(str)
			for(var i = 0; i<ret.length; i++){
				if (!ret[i].length) {
					ret.splice(i, 1);
					i--;
				}
			}
			return ret;
		}
		
		var findFirstIdentifier = function(str, identifiers, isFirstPass){
			str = trim(str);
			for(var j = 0, k = identifiers.length; j<k; j++){
				var id = identifiers[j],
					index = str.indexOf(id, isFirstPass ? 0:1);
				if(index !== -1 && (j == 0 || j==1 && str.charAt(index-1) !== '.')){
					var split = str.split(id);
					return {pre:trim(str.slice(0, index)), post:trim(str.slice(index))}
				}
			}
			return null;
		}
		
		var processClasses = function(clsArray){
			for(var i = 0, l = clsArray.length; i<l; i++){
				var isValid = true,
					str = clsArray[i],
					pkg = str.substring(str.indexOf('(') +2, str.indexOf(')')-1),
					ext = null,
					mix = null,
					impl = null,
					imprt = null,
					extIndex = str.indexOf('.Extends('),
					clsIndex = str.indexOf('.Class('),
					mixIndex = str.indexOf('.Mix('),
					importIndex = str.indexOf('.Import('),
					mixinIndex = str.indexOf('.Mixin('),
					interfaceIndex = str.indexOf('.Interface('),
					implementsIndex = str.indexOf('.Implements('),
					protoIndex = str.indexOf('.Prototype('),
					staticIndex = str.indexOf('.Static('),
					type,
					clsName;
				if (clsIndex !== -1) {
					clsName = str.substring(clsIndex + 8, str.indexOf(',', clsIndex)-1);
					type = 'Class';
				} else if(protoIndex !== -1){
					clsName = str.substring(protoIndex + 12, str.indexOf(',', protoIndex)-1);
					type = 'Prototype';
				} else if(mixinIndex !== -1){
					clsName = str.substring(mixinIndex + 8, str.indexOf(',', mixinIndex)-1);
					type = 'Mixin';
				} else if(interfaceIndex !== -1){
					clsName = str.substring(interfaceIndex + 12, str.indexOf(',', interfaceIndex)-1);
					type = 'Interface';
				} else if(staticIndex !== -1){
					clsName = str.substring(staticIndex + 9, str.indexOf(',', staticIndex)-1);
					type = 'Class';
				} else if(clsArray[i].substr(0, 2) !== '//' && 
						  clsArray[i].substr(0, 2) !== '/*'){
							if(errorOnInvalid)
								return self.throwError('invalid class: \n' + str);
							else
								isValid = false;
				}
				if (clsName && isValid) {
					if (extIndex !== -1) {
						ext = str.substring(extIndex + 10, str.indexOf(')', extIndex) - 1);
					}
					if (mixIndex !== -1) {
						mix = str.substring(mixIndex + 6, str.indexOf(')', mixIndex) - 1);
					}
					if(importIndex !== -1){
						imprt = str.substring(importIndex + 9, str.indexOf(')', importIndex) - 1);
					}
					if (implementsIndex !== -1) {
						impl = str.substring(implementsIndex + 13, str.indexOf(')', implementsIndex) - 1);
					}
					if (!pkg.match(/core/)) {
						classTextObj[pkg + '.' + clsName] = {
							cls: str,
							clsName: clsName,
							ext: ext || 'a5.Object',
							mix: mix,
							imprt: imprt,
							impl: impl,
							pkg: pkg,
							nm: pkg + '.' + clsName,
							type: type,
							propsAndMethods: parsePropsAndMethods(str, type, clsName, pkg + '.' + clsName)
						}
					}
				}
			}
			classTextObj['a5.Object'] = {
				cls:'',
				clsName:'Object',
				nm:'a5.Object',
				pkg:'a5',
				type:'Prototype',
				propsAndMethods:{
					Constructor:{
						Object:{definedBy:'a5.Object', details:{},isFinal:false}
					},
					Methods:{
						superclass:{definedBy:'a5.Object', details:{},isFinal:false}
					}
				}
			}
			determineFullPackages();
			determineInherited();
		}
		
		var parsePropsAndMethods = function(str, type, clsName, nm){
			var delimIndex = str.indexOf('function(', str.indexOf('.' + type + '(')) + 9,
				endDelim = str.indexOf(')', delimIndex),
				delimWord = str.substring(delimIndex, endDelim),
				clsStr = str.substr(endDelim),
				retObj = {Properties:null, Methods:null, PrivateMethods:null, Construct:null};
			if(delimWord.indexOf(','))
				delimWord = delimWord.split(',')[0];
			var strArray = str.substr(endDelim).split(/\n|\r|\) *\{/);
			for (var i = 0; i < strArray.length; i++) {
				var checkedDelimWord = delimWord;
				var line = strArray[i] = trim(strArray[i]);
				if(!(line.substr(0, checkedDelimWord.length + 1) === checkedDelimWord + '.'))
					checkedDelimWord = 'this';
				if(line.substr(0, checkedDelimWord.length + 1) === checkedDelimWord + '.' && line.indexOf('=') !== -1) {
					var isMethod = line.search(/function\(|this.Attributes\(/) !== -1,
						methodEndIndex = line.search(isMethod  ? /= *function\(|= *this.Attributes\(/:/=/),
						methodName = methodEndIndex !== -1 ? trim(line.substring(checkedDelimWord.length+1, methodEndIndex)):'',
						commentStart = -1,
						commentsObj = {};
					if (methodName.match(/^[a-zA-Z0-9_]*$/)) {
						if (i > 0 && strArray[i - 1].substr(0, 2) === '*/') {
							for (var j = i - 1; j > -1; j--) {
								if (strArray[j].substr(0, 3) === '/**') {
									commentStart = j;
									break;
								}
							}
						}
						if (methodName && methodName.indexOf('Override.') === -1 && methodName !== 'dealloc') {
							var isFinal = false, isPrivate = false;
							if (methodName.indexOf('Final.') === 0) {
								isFinal = true;
								methodName = methodName.substr(6);
							}
							if (methodName.substr(0, 1) === '_') 
								isPrivate = true;
							if (!isPrivate || includePrivate) {
								if (commentStart !== -1) 
									commentsObj = parseComments(strArray.slice(commentStart + 1, i - 1));
								if (!commentsObj) 
									commentsObj = {};
								var typeStr = isMethod ? (methodName === clsName ? 'Constructor' : 'Methods') : 'Properties';
								if (typeStr === 'construct') {
									retObj.construct = {
										details: commentsObj
									};
								}
								else {
									if(typeStr === 'Methods' && isPrivate)
										typeStr = 'PrivateMethods';
									var obj = retObj[typeStr];
									if (!obj) 
										obj = retObj[typeStr] = {};
									if(!obj[methodName])
										obj[methodName] = {
											isFinal: isFinal,
											definedBy:nm,
											details: commentsObj
										}
								}
							}
						}
					}
				}
			}
			return retObj;
		}
		
		var parseComments = function(commentArray){
			var params = {},
				description = null,
				returns = null,
				foundFirstProp = false;
			for (var i = 0, l = commentArray.length; i<l; i++){
				var line = trim(trim(commentArray[i]).substr(1));
				if(line.charAt(0) === '@'){
					foundFirstProp = true;
					if (line.indexOf('param') === 1) {
						var testStr = trim(line.substr(6)), firstSpaceIndex = testStr.indexOf(' '), paramType = testStr.substr(0, firstSpaceIndex), noDesc = false;
						if (paramType.charAt(0) === '{' && paramType.charAt(paramType.length - 1) === '}') {
							paramType = paramType.substring(1, paramType.length - 1);
							var secondSpaceIndex = testStr.indexOf(' ', firstSpaceIndex + 1);
							if (secondSpaceIndex === -1) {
								secondSpaceIndex = testStr.length;
								noDesc = true;
							}
							if (firstSpaceIndex !== secondSpaceIndex) {
								var name = testStr.substring(firstSpaceIndex + 1, secondSpaceIndex), optional = false;
								if (name.charAt(0) === '[' && name.charAt(name.length - 1) === ']') {
									optional = true;
									name = name.substring(1, name.length - 1);
								}
								
								params[name] = {
									optional: optional,
									type: toEntities(paramType),
									description: noDesc ? null : toEntities(testStr.substr(secondSpaceIndex + 1))
								}
							}
						}
					}
					else 
						if (line.indexOf('return') === 1) {
							var testStr = trim(line.substr(7)), spaceIndex = testStr.indexOf(' '), noDesc = false;
							if (spaceIndex === -1) {
								spaceIndex = testStr.length;
								noDesc = true;
							}
							var paramType = null;
							if (testStr.charAt(0) === '{' && testStr.indexOf('}') !== -1)
								paramType = testStr.substring(1, testStr.indexOf('}'));
							if (paramType || !noDesc) {
								returns = {
									type: paramType,
									description: noDesc ? null : toEntities(testStr.substr(spaceIndex + 1))
								}
							}
						}
				} else {
					if(description === null)
						description = line;
					else
						description += '\n' + line;
				}
			}
			return {
				params:params,
				description:description ? toEntities(description):null,
				returns:returns
			}
		}
		
		var toEntities = function(str){
			return str.replace(/'/g, '&apos;').replace(/"/g, '&quot;').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
		}
		
		var determineFullPackages = function(){
			for (var cls in classTextObj) {
				var clz = classTextObj[cls];
				if(!classTextObj[clz.ext])
					clz.ext = determineFromImport(clz.ext, clz.pkg, clz.imprt);
				if(!classTextObj[clz.impl])
					clz.impl = determineFromImport(clz.impl, clz.pkg, clz.imprt);
				if(!classTextObj[clz.mix])
					clz.mix = determineFromImport(clz.mix, clz.pkg, clz.imprt);
			}
		}
		
		var determineFromImport = function(clsName, pkg, imports){
			if(classTextObj[pkg + '.' + clsName])
				return pkg + '.' + clsName;
			if(!imports)
				return clsName;
			for(var i = 0, l = imports.length; i<l; i++){
				var im = imports[i],
					substr = im.substring(im.lastIndexOf('.'));
				if(substr === '*'){
					var testStr = im.substr(0, im.length-1) + clsName;
					if(classTextObj[testStr])
						return str;
				} else {
					if(substr === clsName && classTextObj[im])
						return im;
				}
			}
			return clsName;
		}
		
		var determineInherited = function(){
			var obj = classTextObj;
			for(var cls in obj){
				var clz = classTextObj[cls];
				if(clz.ext && classTextObj[clz.ext]){
					var parentCls = classTextObj[clz.ext];
					clz.propsAndMethods.InheritedMethods = {};
					clz.propsAndMethods.InheritedProperties = {};
					do{
						for (var meth in parentCls.propsAndMethods.Methods)
							clz.propsAndMethods.InheritedMethods[meth] = parentCls.propsAndMethods.Methods[meth];
						for (var property in parentCls.propsAndMethods.Properties)
							clz.propsAndMethods.InheritedProperties[property] = parentCls.propsAndMethods.Properties[property];
						parentCls = classTextObj[parentCls.ext];
					} while (parentCls);
				}
			}
		}
})