var router = require('koa-router')();

router.post('/', function *(next) {
  console.log('Receved the upload content');
  //console.dir(this.req.body)
  console.dir(this.req.files)  
  this.status = 200;
});

module.exports = router;
