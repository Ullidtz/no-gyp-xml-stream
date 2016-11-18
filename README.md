#no-gyp-xml-stream
This module lets you stream an XML file and delivers a Json object for each child of a certain type.

##Why?
I realise there are a lot of similar modules, the reason I made this was that I was looking for a way to stream an XML file to Json and the only options I could find all depended on GYP or didn't allow gradually reading the file.
As some windows user may know GYP can be a bit of an obstacle and force you to install things you would normally not want on your production server.
So this will allow you to import very large XML files gradually into Json, using sax, without any dependency on GYP.

##Is it any good?
Probably not. I'm new to Node.js and this is my first attempt at an NPM module.

##So why?
Maybe others can find a use for this and I'm willing to improve it as instructed. We all have to start somewhere.
So far this fill my personal needs. It does occur to me the children in the root element could have different names and I should probably support this.
Please let me know if there is something else wrong/missing.