'use strict'
var path = require('path');

var noGypXmlStream = require('../lib/no-gyp-xml-stream');
var options = { attributesVariableName: 'elementAttributes', textVariableName: 'elementText', flatten: true, dontFlatten: ['child-of-child-of-child'] };
noGypXmlStream.getXmlStreamChildren(path.join(__dirname, './test-xml.xml'), function(childObject){
    console.log(childObject);
    console.log('STRINGIFIED: ' + JSON.stringify(childObject) + '\r\n');
}, options, function(parentObject){
    console.log('And finally the root object: ');
    console.log(parentObject);
    console.log('STRINGIFIED: ' + JSON.stringify(parentObject) + '\r\n');
});