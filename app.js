
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path');
//var mysql=require('./mysql');
var home=require('./routes/home');
var app = express();
//var session=require('express-session');

// all environments
app.set('port', process.env.PORT || 8081);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.cookieParser());
app.use(express.session({secret: '1234567890QWE'}));
app.use(app.router);
// development only
if ('development' === app.get('env')) {
  app.use(express.errorHandler());
}


app.get('/', home.startpage);
app.get('/startpage',home.startpage);
app.get('/volunteer',home.signup);
app.get('/donor',home.createCategory);
app.post('/afterSignup', home.afterSignup);
app.get('/login',home.login);
app.post('/afterLogin',home.afterLogin);
app.get('/home',home.start);
app.get('/aboutme',home.twitteroutput);
app.get('/logout',home.logout);
app.post('/saveCategory',home.saveCategory);
app.get('/feedback',home.feedback);
app.get('/authuser',home.authuser);
app.get('/fbsubmit',home.afterfeedback);
app.get('/taskTaken',home.tasktaken);
app.get('/myactivity',home.myactivity);
app.get('/revertTask',home.revertTask);
app.get('/completeTask',home.completeTask);
app.get('/mycompleted',home.mycompleted);
app.get('/aboutus',home.aboutus);
app.get('/faq',home.faq);

app.get('/delivery',home.delivery);
app.get('/dashboard',home.start);
app.get('/reward',home.reward);
app.get('/checkApplicable',home.afterReward);


//app.post('/displayChoices',home.displayChoices);

//app.get('/', home.start);
//app.post('/signup', home.signup);
//app.post('/adminhome',home.adminstart);
//app.post('/create',home.createCategory);
//app.post('/updateForm',home.updateForm);
//app.post('/updateCategory',home.updateReview);
//app.post('/adminLogin',home.adminLogin);
//app.post('/deleteForm',home.deleteForm);
//app.post('/deleteCategory',home.deleteCategory);
//app.post('/review',home.review);
//app.post('/saveReview',home.saveReview);


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
