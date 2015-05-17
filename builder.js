var browserify  = require('browserify');
var watchify    = require('watchify');
var path        = require('path');
var fs          = require('fs');
var minimatch   = require('minimatch');
var pathmodify  = require('pathmodify');

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
    cache: {}, packageCache: {}, // Required watchify args
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
  var indexHtmlIn = fs.createReadStream('src/index.html');
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

  // Exclude contents of `node_modules`.
  mainBundle.plugin(pathmodify());
  mainBundle.on('pathmodify:resolved', function(data) {
    var requireId = data.rec.id; // As in `require('id')`
    var filePath = data.file; // The absolute path to the required file
    if (minimatch(filePath, '**/node_modules/**')) {
      mainBundle.external(filePath);
      mainBundle.external(requireId); // Watchify breaks without this.
      vendorBundle.require(filePath, { expose: requireId });
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
