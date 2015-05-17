# Browserify Bundle Splitting

This demonstrates an approach to splitting code into multiple bundles using Browserify. This example splits out `node_modules` into a separate `vendor` bundle. The approach is generic, however, and can be used to split code using arbitrary criteria. If you encounter problems using this pattern in production, please open an issue.

The bundle splitting logic is contained in `builder.js`.

Huge thanks to [@jjm](https://github.com/jmm) for his help designing this solution as well as for the [pathmodify](https://github.com/jmm/pathmodify) plugin this depends on.

###Usage
 1. `npm install`
 2. `mkdir build`
 3. `node builder.js`
 4. `cd build/`
 5. `python -m SimpleHTTPServer <port>` (or your webserver of choice)
