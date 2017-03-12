var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const session = require('express-session');//sessiion
const RedisStore = require('connect-redis')(session);//redis
const RedisOptions = require('./conf/config-redis');//redis配置文件

var index = require('./routes/index');
var users = require('./routes/users');
var wxsub = require('./app_weixinsub/routers/subb');//服务号路由-微信
var subpage = require('./app_weixinsub/routers/subpage');//服务号测试页面
var subpro = require('./app_weixinsub/routers/subpro');
var payment = require('./app_weixinsub/routers/payment');
var couponsActivity = require('./app_weixinsub/routers/couponsActivity');
var backart = require('./app_backstage/routers/back_article_controller');
var backartpage = require('./app_backstage/routers/back_article_page');
var backorder = require('./app_backstage/routers/back_order_controller');
var backorderpage = require('./app_backstage/routers/back_order_page');
var backpromoter = require('./app_backstage/routers/back_promoter');
var app = express();

//app.all('*', function(req, res, next) {
//  res.header("Access-Control-Allow-Origin", "*");
//  res.header("Access-Control-Allow-Headers", "X-Requested-With");
//  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
//  res.header("X-Powered-By",' 3.2.1')
//  res.header("Content-Type", "application/json;charset=utf-8");
//  next();
//});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  store:new RedisStore(RedisOptions),
  secret:'yufanthoughtsession',
  resave:false,
  saveUninitialized:true,
  cookie: {maxAge: 60 * 60 * 1000}
}));
app.use('/', index);
app.use('/wx',wxsub);//服务号对应路由
app.use('/wx',subpage);
app.use('/wx',subpro);
app.use('/wx/payment',payment);//微信支付测试
app.use('/wx/ca',couponsActivity);
app.use('/bk',backart);
//app.use('/bk',backartpage);
app.use('/bk',backorder);
app.use('/bk',backpromoter);
//app.use('/bk',backorderpage);
//配置session

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

//让ejs读取session文件
app.use(function(req, res, next){
  res.locals.session = req.session;
  next();
});
// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
