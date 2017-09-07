var express = require('express');
var router = express.Router();
const path = require('path');
const formidable = require('formidable');
const fs = require('fs');
const querystring = require('querystring');
const uploadDir = path.join(__dirname, '../uploads');
const jsonPath = path.join(uploadDir, 'list.json');

function bytesToSize(bytes) {
  console.log(bytes)
  var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes == 0) return '0 Byte';
  var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
};

/* GET home page. */
router.get('/upload-files', function(req, res, next) {
  res.render('index', { title: 'Upload Files' });
});

router.get('/', function(req, res) {
  var files = require(jsonPath);
  // var filesT = [];
  // var count = 0;
  // fs.readdirSync(uploadDir).forEach(file => {
  //   files.push({name: file, type: (file+' ').slice(-4, -1), link: `/download/${querystring.escape(file)}`});
    // count++;
    // if(!(count % 3))
    // {
    //   files.push(filesT)
    //   filesT = [];
    // }
  //   console.log(file);
  // });
  res.render('allfiles',{ files, title: 'All Files' });
})

router.get('/download/:id', function(req, res) {
  res.download(`${uploadDir}/${req.params['id']}`);
})
router.post('/upload/:author', function(req, res){
  var json = require(jsonPath)
  var author = req.params.author || 'Ghulam Mustafa Raza';
  // create an incoming form object
  var form = new formidable.IncomingForm();

  // specify that we want to allow the user to upload multiple files in a single request
  form.multiples = true;

  // store all uploads in the /uploads directory
  form.uploadDir = uploadDir;

  // every time a file has been uploaded successfully,
  // rename it to it's orignal name
  form.on('file', function(field, file) {
    console.log(file.path)
    let newName = file.path + path.extname(file.name)
    fs.rename(file.path, newName);
    json.push({
      type: file.type,
      name: file.name,
      path: newName,
      author,
      size: bytesToSize(file['_writeStream']['bytesWritten']),
      download: `/download/${path.basename(newName)}`
    })
  });
  // log any errors that occur
  form.on('error', function(err) {
    console.log('An error has occured: \n' + err);
  });

  // once all the files have been uploaded, send a response to the client
  form.on('end', function() {
    res.end('success');
    console.log('end')
    fs.writeFileSync(jsonPath,JSON.stringify(json, null, '\t'),'utf8', () => {
      console.log(json)
    })
  });

  // parse the incoming request containing the form data
  form.parse(req);

});


module.exports = router;
