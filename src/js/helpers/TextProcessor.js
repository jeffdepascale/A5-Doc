
a5.Package('a5.apps.docsGenerator.helpers')

	.Extends('a5.cl.CLBase')
	.Class('TextProcessor', function(self, im){
		
		var classTextObj = {},
			trim = a5.cl.core.Utils.trim,
			includePrivate = false,
			errorOnInvalid = false,
			pkgBreakers = ['a5.Package', 'Package'];
		
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
				ret = [];
			if(resp === null){
				str = parseString;
			} else {
				while (resp) {
					if(resp.pre.length)
						ret.push(resp.pre);
					str = resp.post;
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
					extIndex = str.indexOf('.Extends('),
					clsIndex = str.indexOf('.Class('),
					mixIndex = str.indexOf('.Mix('),
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
				} else if(staticIndex !== -1){
					clsName = str.substring(staticIndex + 9, str.indexOf(',', staticIndex)-1);
					type = 'Static';
				} else if(mixinIndex !== -1){
					clsName = str.substring(mixinIndex + 8, str.indexOf(',', mixinIndex)-1);
					type = 'Mixin';
				} else if(interfaceIndex !== -1){
					clsName = str.substring(interfaceIndex + 12, str.indexOf(',', interfaceIndex)-1);
					type = 'Interface';
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
					if (implementsIndex !== -1) {
						impl = str.substring(implementsIndex + 13, str.indexOf(')', implementsIndex) - 1);
					}
					classTextObj[pkg + '.' + clsName] = {
						cls: str,
						clsName: clsName,
						ext: ext,
						mix: mix,
						impl: impl,
						pkg: pkg,
						nm: pkg + '.' + clsName,
						type: type,
						propsAndMethods: parsePropsAndMethods(str, type, clsName)
					}
				}
			}
		}
		
		var parsePropsAndMethods = function(str, type, clsName){
			var delimIndex = str.indexOf('function(', str.indexOf('.' + type + ')')) + 9,
				endDelim = str.indexOf(')', delimIndex),
				delimWord = str.substring(delimIndex, endDelim),
				clsStr = str.substr(endDelim),
				retObj = {};
			if(delimWord.indexOf(','))
				delimWord = delimWord.split(',')[0];
			var strArray = str.substr(endDelim).split('\n');
			for (var i = 0; i < strArray.length; i++) {
				var line = strArray[i] = trim(strArray[i]);
				if(line.substr(0, delimWord.length + 1) === delimWord + '.' && line.indexOf('=') !== -1) {
					var isMethod = line.indexOf('function(') !== -1,
						methodName = trim(line.substring(delimWord.length+1, line.indexOf('= function'))),
						commentStart = -1,
						commentsObj = null;
					if(!methodName.match(/\w*/i))
						break;
					if(i > 0 && strArray[i-1].substr(0, 2) === '*/'){
						for(var j = i-1; j>-1; j--){
							if (strArray[j].substr(0, 3) === '/**') {
								commentStart = j;
								break;
							}
						}		
					}
					if (methodName && methodName.indexOf('Override.') === -1) {
						var isFinal = false,
							isPrivate = false;
						if(methodName.indexOf('Final.') === 0){
							isFinal = true;
							methodName = methodName.substr(6);
						}
						if(methodName.substr(0, 1) === '_')
							isPrivate = true;
						if (!isPrivate || includePrivate) {
							if (commentStart !== -1) 
								commentsObj = parseComments(strArray.slice(commentStart + 1, i - 1));
							retObj[methodName] = {
								type: isMethod ? (methodName === clsName ? 'constructor' : 'method') : 'property',
								isPrivate: isPrivate,
								isFinal: isFinal,
								details: commentsObj
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
					if(line.indexOf('param') === 1){
						var testStr = trim(line.substr(6)),
							firstSpaceIndex = testStr.indexOf(' '),
							paramType = testStr.substr(0, firstSpaceIndex),
							noDesc = false;
						if(paramType.charAt(0) === '{' && paramType.charAt(paramType.length-1) === '}'){
							paramType = paramType.substring(1, paramType.length -1);
							var secondSpaceIndex = testStr.indexOf(' ', firstSpaceIndex+1);
							if(secondSpaceIndex === -1){
								secondSpaceIndex = testStr.length;
								noDesc = true;
							}
							if (firstSpaceIndex !== secondSpaceIndex) {
								var name = testStr.substring(firstSpaceIndex+1, secondSpaceIndex),
									optional = false;
								if(name.charAt(0) === '[' && name.charAt(name.length-1) === ']'){
									optional = true;
									name = name.substring(1, name.length-1);
								}
								params[name] = {
									optional:optional,
									description:noDesc ? null : testStr.substr(secondSpaceIndex+1)
								}
							}
						}
					} else if(line.indexOf('return') === 1){
						var testStr = trim(line.substr(7)),
							spaceIndex = testStr.indexOf(' '),
							noDesc = false;
						if (spaceIndex === -1) {
							spaceIndex = testStr.length;
							noDesc = true;
						}
						var paramType = testStr.substring(0, spaceIndex);
						if (paramType.charAt(0) === '{' && paramType.charAt(paramType.length - 1) === '}') {
							paramType = paramType.substring(1, paramType.length - 1);
							returns = {
								type: paramType,
								description: noDesc ? null : testStr.substr(spaceIndex + 1)
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
				description:description,
				returns:returns
			}
		}
})