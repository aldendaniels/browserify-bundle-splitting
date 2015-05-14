# Browserify Split Vendor Modules

Ths demonstrates an approach to using Browserify to split out `node_modules` into a separate `vendor` bundle. The repo exists to reproduce what appears to be an issue with Browserify's API keeping `require()` calls from resolving across bundles.

###WARNING
This is a proof-of-problem, not yet a proof-of-concept. Don't try this. It won't work.

###Usage
 1. `npm install`
 2. `node builder.js`
 3. `cd build/`
 4. `python -m SimpleHTTPServer <port>` (or your webserver of choice)

###Problem
Require calls in `index.bundle.js` sporadically fail to locate the modules in `vendor.bundle.js`. In this example the `require('react')` in `index.js` works while the same call in `component.js` fails.