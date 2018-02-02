# Al If Editor

This repository contains the code for the AL IF Editor.


The Squiffy Compiler is in a [separate repository](https://github.com/textadventures/squiffy).

To build the desktop version:

- install Node
- install Bower: `npm install bower -g`
- install Gulp: `npm install gulp-cli -g`
- clone this repository
- run `npm install` to get the Node packages
- run `bower install` to get the Bower packages

You can now run the Al IF Editor using `npm start`. (You can also run it in a web browser using `npm run-script web`
and going to `http://localhost:8282`)

To package the desktop app, a script is provided for each platform:

- `gulp windows` creates `Squiffy-win32-ia32\Squiffy.exe`
