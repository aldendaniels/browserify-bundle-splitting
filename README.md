# Browserify Split Vendor Modules

Ths demonstrates an approach to splitting out `node_modules` into a separate `vendor` bundle. This approach is quite generic and could be used to split up browserify bundles in other ways as well. Please note that this is sample code - not a library. If you encounter problems using this pattern in production, please open an issue.

Huge thanks to [@jjm](https://github.com/jmm) for his help designing this solution as well as for the [pathmodify](https://github.com/jmm/pathmodify) plugin this depends on.

###Usage
 1. `npm install`
 2. `mkdir build`
 3. `node builder.js`
 4. `cd build/`
 5. `python -m SimpleHTTPServer <port>` (or your webserver of choice)
