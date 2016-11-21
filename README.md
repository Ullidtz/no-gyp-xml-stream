#no-gyp-xml-stream
This module lets you stream an XML file and delivers a Json object for each child of a certain type.

##What?
* Converts XML to Json
* Doe not convert back from Json to XML yet. (Structure is reversible though)
* Takes a stream or a file path
* Does not depend on GYP (For Windows users)

##Installing

```
$ npm install no-gyp-xml-stream
```

##Usage Example

### Simple
```javascript
var parser = require('../lib/no-gyp-xml-stream');
parser.getXmlStreamChildren('big-root-element', 'more-manageable-child-element', 'test-xml.xml', function(childObject){
    console.log(childObject);
});
```

### Advanced
```javascript
var parser = require('../lib/no-gyp-xml-stream');
var options = { attributesVariableName: 'elementAttributes', textVariableName: 'elementText', flatten: true, dontFlatten: ['child-of-child-of-child'] };
parser.getXmlStreamChildren('big-root-element', 'more-manageable-child-element', 'test-xml.xml', function(childObject){
    console.log(childObject);
    console.log('STRINGIFIED: ' + JSON.stringify(childObject) + '\r\n');
}, options, function(parentObject){
    console.log('And finally the root object: ');
    console.log(parentObject);
    console.log('STRINGIFIED: ' + JSON.stringify(parentObject) + '\r\n');
});
```

##Options

```javascript
var options = {
	attributesVariableName = '$',
	textVariableName = '_',
	flatten = false,
	dontFlatten = []
}
```

* **attributesVariableName**: Name of the property containing an elements attributes.
* **textVariableName**: Name of the property containing an elements text.
* **flatten**: If true elements with a single child will be flattened to an object instead of an array, elements with no children and no attributes but with text will be flattened to single property containign the text of the element.
* **dontFlatten**: If flatten is true elements in this list will not be flattened. (Useful for cases where element should always be an array regardless of the amount of children.)


##Why?
I realise there are a lot of similar modules, the reason I made this was that I was looking for a way to stream an XML file to Json and the only options I could find all depended on GYP or didn't allow gradually reading the file.

As some windows user may know GYP can be a bit of an obstacle and force you to install things you would normally not want on your production server. So this will allow you to import very large XML files gradually into Json, using sax, without any dependency on GYP.

##Is it any good?
Probably not. I'm new to Node.js and this is my first attempt at an NPM module.

##So why?
Maybe others can find a use for this and I'm willing to improve it as instructed. We all have to start somewhere.

So far this fills my personal needs. It does occur to me the children in the root element could have different names and I should probably support this. (Also converting the json back to XML would be a plus...)

Please let me know if there is something else wrong/missing.