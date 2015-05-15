var browserify  = require('browserify');
var watchify    = require('watchify');
var path        = require('path');
var fs          = require('fs');
var minimatch   = require('minimatch');

var pathmod = require('pathmodify');

function writeBundle(bundle, outputName, callback) {
    outputName = path.join('build', outputName);
    console.log('Start bundling ' + outputName);
    bundle.bundle()
        .on('end', function() {
            console.log('Done bundling ' + outputName);
            if (callback) {
                callback();
            }
        })
        .pipe(fs.createWriteStream(outputName));
}

function createBundle(baseDir, outputName) {
    // Create bundler.
    var bundle = watchify(browserify({
        cache: {}, packageCache: {}, fullPaths: true, // Required watchify args
        debug: true,
        entries: [],
        basedir: path.join(__dirname, 'src')
    }));

    // Rebundle on change.
    bundle.on('update', function() {
        writeBundle(bundle, outputName);
    });

    return bundle;
}

function main() {
    // Copy index.html
    var indexHtmlIn  = fs.createReadStream('src/index.html');
    var indexHtmlOut = fs.createWriteStream('build/index.html');
    indexHtmlIn.pipe(indexHtmlOut);

    // Create bundler.
    var mainOutputName = 'index.bundle.js';
    var baseDir = path.join(__dirname, 'src');
    var mainBundle = createBundle(baseDir, mainOutputName);
    mainBundle.add('index.js');

    // Create vendor bundle.
    var vendorOutputName = 'vendor.bundle.js';
    var vendorBundle = createBundle(baseDir, vendorOutputName);

    mainBundle.plugin(pathmod());
    mainBundle.on('pathmodify:resolved', function (data) {
      // You can test `data.rec.id` here, as in `require('id')` or resolved
      // pathname in `rec.file`.
      if (! /^[\/.]/.test(data.rec.id)) {
      // if (minimatch(rec.file, '**/node_modules/**')) {

        mainBundle.external(data.file);
        vendorBundle.require(data.file, {expose: data.rec.id});
      }
    });

    // Write initial bundle.
    writeBundle(mainBundle, mainOutputName, function() {
        writeBundle(vendorBundle, vendorOutputName);
    });
}

if (require.main === module) {
    main();
}