var app = require('koa')(),
    koa = require('koa-router')(),
    logger = require('koa-logger'),
    json = require('koa-json'),
    views = require('koa-views'),
    onerror = require('koa-onerror');

////////////
var multer = require('koa-multer');
//var uploadTest = multer({ dest: './uploads' }).single('123');

var index = require('./routes/index');
var users = require('./routes/users');
var execAutoTest = require('./routes/execRouter');
var upload = require('./routes/upload');

// global middlewares


app.use(views('views', {
  root: __dirname + '/views',
  default: 'jade'
}));
app.use(require('koa-bodyparser')());
app.use(json());
app.use(logger());

//https://cnodejs.org/topic/5470a385a3e2aee40698de20
app.use(multer({
    dest: './uploads',
    rename: function(fieldname, filename, req, res) {
        console.log('fieldname: ' + fieldname);
        console.log('filename: ' + filename);
        console.log('req: ' + req);
        console.log('originalname: ' + req.files.originalname);

        return filename;
    }
}));


app.use(function *(next){
    var start = new Date;
    yield next;
    var ms = new Date - start;
    console.log('%s %s - %s', this.method, this.url, ms);
});

app.use(require('koa-static')(__dirname + '/public'));

// routes definition
koa.use('/', index.routes(), index.allowedMethods());
koa.use('/users', users.routes(), users.allowedMethods());
koa.use('/execRouter', execAutoTest.routes(), execAutoTest.allowedMethods());
koa.use('/upload', upload.routes(), upload.allowedMethods());

// mount root routes  
app.use(koa.routes());

app.on('error', function(err, ctx){
  log.error('server error', err, ctx);
});

module.exports = app;
