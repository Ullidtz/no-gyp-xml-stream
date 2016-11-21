'use strict';

var fs = require('fs');
var sax = require("sax");

var NoGypXmlStream = NoGypXmlStream || {};
NoGypXmlStream.defaults = NoGypXmlStream.defaults || {};
NoGypXmlStream.defaults.attributesVariableName = '$'; // Allows you to change the name of the property containing the element attributes.
NoGypXmlStream.defaults.textVariableName = '_'; //Allows you to change the name of the property containing element texts.
NoGypXmlStream.defaults.flatten = false; //If True single objects are no longer placed in an array, and elements with only text turn into a property with the text.
NoGypXmlStream.defaults.dontFlatten = []; //Specific elements that should not be flattened, if you know it should always be an array for instance
NoGypXmlStream.options = {
    attributesVariableName: NoGypXmlStream.defaults.attributesVariableName,
    textVariableName: NoGypXmlStream.defaults.textVariableName,
    flatten: NoGypXmlStream.defaults.flatten,
    dontFlatten: NoGypXmlStream.defaults.dontFlatten
};

NoGypXmlStream.getChildrenFromPath = function(parentName, childName, path, childCallBack, options, parentCallBack){
    let readStream = fs.createReadStream(path);
    NoGypXmlStream.getChildrenFromReadStream(parentName, childName, readStream, childCallBack, options, parentCallBack);
};

NoGypXmlStream.getChildrenFromReadStream = function(parentName, childName, readStream, childCallBack, options, parentCallBack){
    let saxStream = sax.createStream(true, { strictEntities: false });
    readStream.pipe(saxStream);
    NoGypXmlStream.getChildrenFromSaxStream(parentName, childName, saxStream, childCallBack, options, parentCallBack);
};

NoGypXmlStream.getChildrenFromSaxStream = function(parentName, childName, saxStream, childCallBack, options, parentCallBack){
    let elementStack = [];
    let parentElement = null;
    let parentNameFilter = parentName.toLowerCase();
    let childNameFilter = childName.toLowerCase();

    let opts = NoGypXmlStream.options;
    if(options) {
        if (options.attributesVariableName && options.attributesVariableName.length > 0) {
            opts.attributesVariableName = options.attributesVariableName;
        }

        if (options.textVariableName && options.textVariableName.length > 0) {
            opts.textVariableName = options.textVariableName;
        }

        if(options.flatten){
            opts.flatten = options.flatten;
        }

        if(options.dontFlatten && options.dontFlatten.length > 0){
            opts.dontFlatten = options.dontFlatten;
        }
    }

    saxStream.on("opentag", function (node) {
        if(node.name.toLowerCase() == parentNameFilter){
            parentElement = {};
            parentElement[opts.attributesVariableName] = node.attributes;
            return;
        }
        if(node.name.toLowerCase() == childNameFilter) {
            elementStack = [];
            let newElem = {};
            newElem[opts.attributesVariableName] = node.attributes;
            elementStack.push(newElem);
        } else {
            var elem = {};
            if(node.attributes && !(Object.keys(node.attributes).length === 0 && node.attributes.constructor === Object)){
                elem[opts.attributesVariableName] = node.attributes;
            }
            elementStack.push(elem);
        }
    });

    saxStream.on("closetag", function (nodeName) {
        if(nodeName.toLowerCase() == parentNameFilter) {
            if(parentCallBack){
                parentCallBack(parentElement);
            }
            return;
        }
        if(nodeName.toLowerCase() == childNameFilter) {
            var jsonObject = elementStack.pop();
            childCallBack(jsonObject);
        } else{
            var elemc = elementStack.pop();
            var elemp = elementStack.pop();
            var dontFlatten = false;
            for(var idx in opts.dontFlatten) {
                if(opts.dontFlatten[idx] == nodeName){
                    dontFlatten = true;
                    break;
                }
            }
            if(!opts.flatten || dontFlatten){ //Don't flatten, always use attr and text vars and arrays everywhere
                if(!elemp[nodeName]){
                    elemp[nodeName] = [];
                }
                elemp[nodeName].push(elemc);
                elementStack.push(elemp);
            }
            else{
                //Flatten text if it's the only value
                if(Object.keys(elemc).length == 1 && elemc[opts.textVariableName]) {
                    elemc = elemc[opts.textVariableName];
                }

                //Flatten arrays if only one object
                if(!elemp[nodeName]) {
                    elemp[nodeName] = elemc;
                }
                else{
                    if(Array.isArray(elemp[nodeName])){ //If already array just push
                        elemp[nodeName].push(elemc);
                    }
                    else{ //Expand to array where needed
                        let existingElem = elemp[nodeName];
                        elemp[nodeName] = [];
                        elemp[nodeName].push(existingElem);
                        elemp[nodeName].push(elemc);
                    }
                }

                elementStack.push(elemp);
            }
        }
    });

    saxStream.on("text", function (txt) {
        if (!NoGypXmlStream.isNullOrWhitespace(txt)) {
            var elemc = elementStack.pop();
            if(!elemc[opts.textVariableName])elemc[opts.textVariableName] = "";
            elemc[opts.textVariableName] += txt.trim();
            elementStack.push(elemc);
        }
    });

    saxStream.on("error", function (e) {
        console.error("error!", e);
        this._parser.error = null;
        this._parser.resume();
    });
};

NoGypXmlStream.isNullOrWhitespace = function(input) {
    return !input || !input.trim();
};

exports.getXmlStreamChildren = function(parentName, childName, path, childCallBack, options, parentCallBack){
    return NoGypXmlStream.getChildrenFromPath(parentName, childName, path, childCallBack, options, parentCallBack);
};

