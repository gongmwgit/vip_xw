const fs = require('fs')

function getDestination(req, file, cb) {
  cb(null, './images')
}
function UniversityFileStorage(opts) {
  console.log('opts==',opts)
  this.getDestination = (opts.destination || getDestination)
}

UniversityFileStorage.prototype._handleFile = function _handleFile(req, file, cb) {
  this.getDestination(req, file, function (err, path) {
    if (err) return cb(err)
    const outStream = fs.createWriteStream(path)
    file.stream.pipe(outStream)
    outStream.on('error', cb)
    outStream.on('finish', function () {
      cb(null, {
        path: path,
        size: outStream.bytesWritten
      })
    })
  })
}

UniversityFileStorage.prototype._removeFile = function _removeFile(req, file, cb) {
  fs.unlink(file.path, cb)
}

module.exports = function (opts) {
  return new UniversityFileStorage(opts)
}