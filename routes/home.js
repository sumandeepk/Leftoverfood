/**
 * New node file
 */
var ejs = require("ejs");

var mysql = require('./mysql');
var session= require("express-session");

//vijay twitter module //
var Twitter = require('twitter');
var sentiment = require('sentiment');

//client.search

exports.index = function(req,res){
var client = new Twitter({
	  consumer_key: 'DMJsdjLzEbhumIv9SvlE12ytI',
	  consumer_secret: 'QOVp5YEVCX5rGbvJIpvWwTU7YIpXdTLspmLkM3svHHbrznAOLQ',
	  access_token_key: '1646031889-P2rKBDRBKpGgI6hD1HMEUy5TimPrzXuq9pVzI0H',
	  access_token_secret: 'irldYxm2U8Jz07WCu6AkzL3ItSrau4kasQMefH6LXrStW'
	});
	 
	client.stream('statuses/filter', {track: 'Gogglebox'},  function(stream){
	  stream.on('data', function(tweet) {
		 
			
		 // res.render('index', { title: {'id':tweet.id,'name':tweet.user.name,'screen_name':tweet.user.screen_name,'tweet':tweet.text} });
		  tweet.user.name=tweet.user.name.replace(/[^a-zA-Z0-9&\/\\#,+()$~%.'":*?<>{}]/g, "");
		  tweet.user.screen_name=tweet.user.screen_name.replace(/[^a-zA-Z0-9&\/\\#,+()$~%.'":*?<>{}]/g, "");
		  tweet.user.location=tweet.user.location.replace(/[^a-zA-Z0-9&\/\\#,+()$~%.'":*?<>{}]/g, "");
		  
		console.log(tweet.id);
	    console.log(tweet.user.name);
	    console.log(tweet.user.screen_name);
	    console.log(tweet.text);
	    console.log(tweet.created_at);
	    console.log(tweet.user.location);
	    
	    var r= sentiment(tweet.text);
	  //  var x=JSON.stringify(r.score);
	  //  z = tweet.text.replace( new RegExp( "'", "" ), " " );
	    
	    var q = tweet.user.name.replace(/'/gi, " ");
	    var a = tweet.user.screen_name.replace(/'/gi, " ");
	    var z = tweet.text.replace(/'/gi, " ");
	    tweet.user.location = tweet.user.location.replace(/'/gi, " ");
	    
	    
	    z= z.replace(/[^a-zA-Z0-9&\/\\#,+()$~%.'":*?<>{}]/g, "");
	    
	    var day = tweet.created_at.substring(0, 4);
	    console.log(day);
	    var month = tweet.created_at.substring(4, 7);
	    console.log(month);
	    var date = tweet.created_at.substring(8, 10);
	    console.log(date);
	    var time = tweet.created_at.substring(11, 19);
	    console.log(time);
	    var year = tweet.created_at.substring(26, 31);
	    console.log(year);
	    
	    
	    console.log(tweet.created_at);
	    
	    
	   // tweet.user.name = tweet.user.name.split("'").join(' ');
	    //tweet.user.screen_name = tweet.user.screen_name("'").join(' ');
	   // tweet.text = tweet.text.split("'").join(' ');
	   // var y= r.comparative;
	    
	    //var e=JSON.stringify(q);
	    //var d=JSON.stringify(a);
	    //var c=JSON.stringify(z);
	   // console.log(y);
	    //console.log(q);
	    //console.log(a);
	   // console.log(q);
	    
	    if ((r.score > 0) && (r.score< 4)) {
	    	var tweet_sentiment = 'postive';
	    } else if (r.score >= 4) {
	    	var tweet_sentiment = 'very postive';
	    }
	    else if ((r.score < 0) && (r.score > -4)) {
	    	var tweet_sentiment = 'negative';
	    }
	    else if (r.score <= -4) {
	    	var tweet_sentiment = 'very negative';
	    }else {
	    	var tweet_sentiment = 'neutral';
	    }
	    
	    
	    
	    
	    
	   console.dir(r.score);
	   console.dir(tweet_sentiment);
	   console.log(r.comparative);
	   console.log(r.positive);
	   console.log(tweet.text);
	  var con=mysql.getConnection();
	  var insert="insert into twitterdata(name,screen_name,tweettext,id,score,comparative,tweet_sentiment,day,month,time,year,location)values('"+q+" ',' "+a+" ','"+z+"','"+tweet.id+"','"+r.score+"','"+r.comparative+"','"+tweet_sentiment+"','"+day+"','"+month+"','"+time+"','"+year+"','"+tweet.user.location+"')";	
	  console.log("Query is:"+insert);
			
		
	   con.query(insert);
		
	  });

	  stream.on('error', function(error) {
	    console.log(error);
	  });
	   
	});
}

//twitter module end

exports.reward=function(req,res)
{
res.render('rewards', function (err,result)
		{
	if(!err)
			{
		res.end(result);
			}
	else
			{
		res.end('An error occured');
		console.log(err);
			}
		}
		);	

}

exports.afterReward=function(req,res)
{
	var count = [];
	var value = req.param("userName");
	console.log(value);
	
	var connection=mysql.getConnection();
	var query = connection.query("select count(*) as count from twitterdata where isCompleted='1'and screen_name = '"+value+"'", function(err, results)
			{
		if(!err)
			{
			
			for(var i=0;i<results.length;i++)
			 {
		 count[i]=(results[i].count);
		 console.log(count[i]);
			 if(count[i]>2)
				 {
			console.log("check sucess");
			res.render('choicesAvailable');
				 }
			 else{res.render('noteligible');}
			}
			}
		else
			{
			console.log("insert failure");
			}
			}
	);
		

}

	
exports.twitteroutput= function(req,res)
{   
		var name=[];
		var screen_name=[];
		var tweettext=[];
		var id=[];
		var location=[];
		var contactno=[];
		
		var getUser="select * from twitterdata t ,donor d where d.twitterUserName= t.screen_name and t.isTaskTaken = '0'";
		var con=mysql.getConnection();
		
		
		con.query(getUser,function(err,results)
				{
			
				 if(!err)
					 {
				console.log(results.length);
				 for(var i=0;i<results.length;i++)
					 {
				 name[i]=(results[i].name);
				 screen_name[i]=(results[i].screen_name);
				 tweettext[i]=(results[i].tweettext);
				 id[i]=(results[i].id);
				 location[i]=(results[i].location);
				 contactno[i]=(results[i].contactno);
				 console.log(name[i],screen_name[i],tweettext[i],id[i],location[i],contactno[i]);
					 }
			
			
				//var jsonparse=JSON.parse(str);
				res.render('tasks',{data1:name,data2:screen_name,data3:tweettext,data4:id,data5:location,data6:contactno},function(err,result)
						{
					if(!err){
						
						res.end(result);
						
					}
					else
						{
						res.end('An error in file occured occured');
						console.log(err);
						}
					      
						});	
					 }
				
			  if(err)
				  {
				  res.send("error");
				  console.log("error");
				  }

				});
	}
exports.myactivity=function(req,res)
{
	var email=req.session.email;
	console.log(email);
	
	var value=req.session.value;
	console.log(value);
	
	var name=[];
	var screen_name=[];
	var tweettext=[];
	var id=[];
	var location=[];
	var contactno=[];
	
	var getUser="select * from twitterdata t ,donor d where d.twitterUserName= t.screen_name and t.isTaskTaken = '1' and volunteerEmail='"+email+"' and isCompleted='0' ";
	var con=mysql.getConnection();
	
	
	con.query(getUser,function(err,results)
			{
		
			 if(!err)
				 {
			//console.log(results.length);
			 for(var i=0;i<results.length;i++)
				 {
			 name[i]=(results[i].name);
			 screen_name[i]=(results[i].screen_name);
			 tweettext[i]=(results[i].tweettext);
			 id[i]=(results[i].id);
			 location[i]=(results[i].location);
			 contactno[i]=(results[i].contactno);
			 console.log(name[i],screen_name[i],tweettext[i],id[i],location[i],contactno[i]);
				 }
		
		
			//var jsonparse=JSON.parse(str);
			res.render('tasks2',{data1:name,data2:screen_name,data3:tweettext,data4:id,data5:location,data6:contactno},function(err,result)
					{
				if(!err){
					
					res.end(result);
					
				}
				else
					{
					res.end('An error in file occured occured');
					console.log(err);
					}
				      
					});	
				 }
			
		  if(err)
			  {
			  res.send("error");
			  console.log("error");
			  }

			});
}
	
exports.mycompleted=function(req,res)
{
	var email=req.session.email;
	console.log(email);
	
	var value=req.session.value;
	console.log(value);
	
	var name=[];
	var screen_name=[];
	var tweettext=[];
	var id=[];
	var location=[];
	var contactno=[];
	
	var getUser="select * from twitterdata t ,donor d where d.twitterUserName= t.screen_name and t.isTaskTaken = '1' and volunteerEmail='"+email+"' and isCompleted='1' ";
	var con=mysql.getConnection();
	
	
	con.query(getUser,function(err,results)
			{
		
			 if(!err)
				 {
			//console.log(results.length);
			 for(var i=0;i<results.length;i++)
				 {
			 name[i]=(results[i].name);
			 screen_name[i]=(results[i].screen_name);
			 tweettext[i]=(results[i].tweettext);
			 id[i]=(results[i].id);
			 location[i]=(results[i].location);
			 contactno[i]=(results[i].contactno);
			 console.log(name[i],screen_name[i],tweettext[i],id[i],location[i],contactno[i]);
				 }
		
		
			//var jsonparse=JSON.parse(str);
			res.render('tasks3',{data1:name,data2:screen_name,data3:tweettext,data4:id,data5:location,data6:contactno},function(err,result)
					{
				if(!err){
					
					res.end(result);
					
				}
				else
					{
					res.end('An error in file occured occured');
					console.log(err);
					}
				      
					});	
				 }
			
		  if(err)
			  {
			  res.send("error");
			  console.log("error");
			  }

			});
}
	

exports.tasktaken=function(req,res)
{
	var email = req.session.email;
	console.log(email);
	
	
	req.session.value=req.param("button");
	var value = req.param("button");
	console.log(value);
	
	var connection=mysql.getConnection();
	var query = connection.query("update twitterdata SET isTaskTaken='1',volunteerEmail = '"+email+"' where id='"+value+"'", function(err, rows)
			{
		if(!err)
			{
			console.log("insert sucess");
			res.render('tasktaken');
			
			}
		else
			{
			console.log("insert failure");
			}
			}
	);
			
	
	
}
	
exports.revertTask=function(req,res)
{
	var email = req.session.email;
	console.log(email);
	
	
	req.session.value=req.param("button");
	var value = req.param("button");
	console.log(value);
	
	var connection=mysql.getConnection();
	var query = connection.query("update twitterdata SET isTaskTaken='0',volunteerEmail = '"+null+"' where id='"+value+"'", function(err, rows)
			{
		if(!err)
			{
			console.log("insert sucess");
			res.render('tasktaken');
			
			}
		else
			{
			console.log("insert failure");
			}
			}
	);
			
	
	
}

exports.completeTask=function(req,res)
{
	var email = req.session.email;
	console.log(email);
	
	
	req.session.value=req.param("button");
	var value = req.param("button");
	console.log(value);
	
	var connection=mysql.getConnection();
	var query = connection.query("update twitterdata SET isCompleted='1' where id='"+value+"' and isTaskTaken ='1' and volunteerEmail = '"+email+"'", function(err, rows)
			{
		if(!err)
			{
			console.log("insert sucess");
			res.render('tasktaken');
			
			}
		else
			{
			console.log("insert failure");
			}
			}
	);
			
	
	
}
	

function feedback(req,res)
{
res.render('feedback', function (err,result)
		{
	if(!err)
			{
		res.end(result);
			}
	else
			{
		res.end('An error occured');
		console.log(err);
			}
		}
		);	

}
function afterfeedback(req,res)
{
var key1 = req.session.email;
console.log(key1);
var key2 = req.session.usrname;
console.log(key2);

	var rating1 = req.param("rating1");
	console.log('i am in afterfeedback 1');
	console.log(rating1);
	
	var rating2 = req.param("rating2");
	console.log('i am in afterfeedback 2');
	console.log(rating2);
	
	if ((rating1 !==undefined && rating2 !== undefined) && (rating1 !== "" && rating2 !== ""))
	{
		console.log('feedback action');
		var connection=mysql.getConnection();
		var query = connection.query("insert into feedback (key1,key2,rating1,rating2)values('"+key1+"','"+key2+"','"+rating1+"','"+rating2+"')",function(err, rows)
				{
			console.log(query);
			 
				if(!err)
							{
					res.send('insert success');
					
					//console.log(key1 ,'after session destroy');
							}
				else
							{
					res.send('An error occured');
					console.log(err);
							}
			    });
	}
}


function authuser(req,res)
{
req.session.email=req.param("email");	
var email=req.param("email");
req.session.usrname=req.param("usrname");
var usrname=req.param("usrname");
console.log(email);

if (email !== "" && usrname !== "")
{
res.send('Cannot enter both at the same time....Please choose one method');
}
else if (email !== undefined && email !== "")
	{
	console.log('i am checking email');
var connection=mysql.getConnection();
var query = connection.query("select * from donor where email=?", email, function(err, rows)
		{
	console.log(query);
	 if (rows.length > 0)
		 	{
		 console.log('the user was valid');
		  res.render('afterfeedback', function (err,result)
	    		  {
		if(!err)
					{
			res.end(result);
					}
		else
					{
			res.end('An error occured');
			console.log(err);
					}
	    		  });
		 	}
	 else 
		 {
		 res.send('not eligible for feedback');
		 }
		});
	}
else if (usrname!== undefined && usrname!== "")
	{
	console.log(usrname);
	console.log('i am checking twitter');
var connection=mysql.getConnection();
var query = connection.query("select * from twitterdata where screen_name=?", usrname, function(err, rows)
		{
	console.log(query);
	 if (rows.length > 0)
		 	{
		 console.log('the user was valid');
		  res.render('afterfeedback', function (err,result)
	    		  {
		if(!err)
					{
			res.end(result);
					}
		else
					{
			res.end('An error occured');
			console.log(err);
					}
	    		  });
		 	}
	 else 
		 {
		 res.send('not eligible for feedback');
		 }
		});
	}

else
	{
	res.send('Please enter atleast one field ');
	}
	

}

function delivery(req,res)
{
 
	res.render('delivery',function(err, result) {
		   // render on success
		   if (!err) {
		            res.end(result);
		   }
		   // render or error
		   else {
		            res.end('An error occurred');
		            console.log(err);
		   }
	   });
}

function startpage(req,res)
{
 
	res.render('index',function(err, result) {
		   // render on success
		   if (!err) {
		            res.end(result);
		   }
		   // render or error
		   else {
		            res.end('An error occurred');
		            console.log(err);
		   }
	   });

	var client = new Twitter({
	  consumer_key: 'DMJsdjLzEbhumIv9SvlE12ytI',
	  consumer_secret: 'QOVp5YEVCX5rGbvJIpvWwTU7YIpXdTLspmLkM3svHHbrznAOLQ',
	  access_token_key: '1646031889-P2rKBDRBKpGgI6hD1HMEUy5TimPrzXuq9pVzI0H',
	  access_token_secret: 'irldYxm2U8Jz07WCu6AkzL3ItSrau4kasQMefH6LXrStW'
	});
	 
	client.stream('statuses/filter', {track: 'leftoverfood'},  function(stream){
	  stream.on('data', function(tweet) {
		 
			
		 // res.render('index', { title: {'id':tweet.id,'name':tweet.user.name,'screen_name':tweet.user.screen_name,'tweeet':tweet.text} });
		  tweet.user.name=tweet.user.name.replace(/[^a-zA-Z0-9&\/\\#,+()$~%.'":*?<>{}]/g, "");
		  tweet.user.screen_name=tweet.user.screen_name.replace(/[^a-zA-Z0-9&\/\\#,+()$~%.'":*?<>{}]/g, "");
		  tweet.user.location=tweet.user.location.replace(/[^a-zA-Z0-9&\/\\#,+()$~%.'":*?<>{}]/g, "");
		 
		console.log(tweet.id);
	    console.log(tweet.user.name);
	    //console.log(tweet.user.screen_name);
	    //console.log(tweet.text);
	    //console.log(tweet.created_at);
	    //console.log(tweet.user.location);
	    
	    var r= sentiment(tweet.text);
	  //  var x=JSON.stringify(r.score);
	  //  z = tweet.text.replace( new RegExp( "'", "" ), " " );
	    
	    var q = tweet.user.name.replace(/'/gi, " ");
	    var a = tweet.user.screen_name.replace(/'/gi, " ");
	    var z = tweet.text.replace(/'/gi, " ");
	    tweet.user.location = tweet.user.location.replace(/'/gi, " ");
	    
	    
	    z= z.replace(/[^a-zA-Z0-9&\/\\#,+()$~%.'":*?<>{}]/g, "");
	    
	    var day = tweet.created_at.substring(0, 4);
	  // console.log(day);
	    var month = tweet.created_at.substring(4, 7);
	    //console.log(month);
	    var date = tweet.created_at.substring(8, 10);
	    //console.log(date);
	    var time = tweet.created_at.substring(11, 19);
	    //console.log(time);
	    var year = tweet.created_at.substring(26, 31);
	    //console.log(year);
	    
	    
	   // console.log(tweet.created_at);
	    
	    
	   // tweet.user.name = tweet.user.name.split("'").join(' ');
	    //tweet.user.screen_name = tweet.user.screen_name("'").join(' ');
	   // tweet.text = tweet.text.split("'").join(' ');
	   // var y= r.comparative;
	    
	    //var e=JSON.stringify(q);
	    //var d=JSON.stringify(a);
	    //var c=JSON.stringify(z);
	   // console.log(y);
	    //console.log(q);
	    //console.log(a);
	   // console.log(q);
	    
	    if ((r.score > 0) && (r.score< 4)) {
	    	var tweet_sentiment = 'postive';
	    } else if (r.score >= 4) {
	    	var tweet_sentiment = 'very postive';
	    }
	    else if ((r.score < 0) && (r.score > -4)) {
	    	var tweet_sentiment = 'negative';
	    }
	    else if (r.score <= -4) {
	    	var tweet_sentiment = 'very negative';
	    }else {
	    	var tweet_sentiment = 'neutral';
	    }
	    
	    
	    
	    
	    
	/*   console.dir(r.score);
	   console.dir(tweet_sentiment);
	   console.log(r.comparative);
	   console.log(r.positive);
	   console.log(tweet.text);*/
	  var con=mysql.getConnection();
	  var insert="insert into twitterdata(name,screen_name,tweettext,id1,score,comparitive,tweet_sentiment,day,month,time,year,location,date)values('"+q+" ',' "+a+" ','"+z+"','"+tweet.id+"','"+r.score+"','"+r.comparative+"','"+tweet_sentiment+"','"+day+"','"+month+"','"+time+"','"+year+"','"+tweet.user.location+"', '"+date+"')";	
	  console.log("Query is:"+insert);
			
		
	   con.query(insert);
	   con.end();
		
	  });

	  stream.on('error', function(error) {
	    console.log(error);
	  });
	   
	});
	
	
}

function faq(req,res)
{
	res.render('faq',function(err, result) {
		   // render on success
		   if (!err) {
		            res.end(result);
		   }
		   // render or error
		   else {
		            res.end('An error occurred');
		            console.log(err);
		   }
	   });
	
}

function aboutus(req,res)
{
	res.render('about-us',function(err, result) {
		   // render on success
		   if (!err) {
		            res.end(result);
		   }
		   // render or error
		   else {
		            res.end('An error occurred');
		            console.log(err);
		   }
	   });
	
}


function signup(req,res)
{
	res.render('signup',function(err, result) {
		   // render on success
		   if (!err) {
		            res.end(result);
		   }
		   // render or error
		   else {
		            res.end('An error occurred');
		            console.log(err);
		   }
	   });
	
}

function login(req,res)
{
	
res.render('login',function(err,result){
	
	if(!err){
		
		res.end(result);
	}
	else
		{
		res.end('An error occured');
		console.log(err);
		}
	
});

}
function afterLogin(req,res)
{
	
	req.session.email=req.param("emailid");
	var email=req.param("emailid");
    var password=req.param("password");
	var time=Date();
	console.log(time.substr(0,25));
	var update="update volunteer SET time='"+time.substr(0,25)+"' where email='"+email+"'";
	var getUser="select * from volunteer where email='"+email+"' and password='"+password+"'";
	var con=mysql.getConnection();
	//var details="select * from review where email='"+req.session.email+"'";
	
	con.query(getUser, function(err,results){
		
		if(results.length>0)
			{
			console.log(results[0].time);
			var str=JSON.stringify(results[0].time);
			  
			//var jsonparse=JSON.parse(str);
			res.render('dashboard',{time:results[0].time,fname:results[0].fname,lname:results[0].lname,email:results[0].email},function(err,result)
					{
				if(!err){
					
					res.end(result);
				}
				else
					{
					res.end('An error in file occured occured');
					console.log(err);
					}
				      
					});
			}
		else
			{
			res.end("enter correct details");
			console.log(err);
			}
		
		
		
		
	});
	
	con.query(update,function(err,results)
			{
		
		    if(!err)
		    	{
		    	
		    	console.log("inserted time");
		    	}
		    else
		    	{
		    	console.log("error in time");
		    	}
		
		
			});
	

}



function afterSignup(req,res)
{
    var fname=req.body.firstname;
    console.log(fname);
    var lname=req.param("lastname");
    var emailid=req.param("email");
    var pass=req.param("password");
  
    var insert="insert into volunteer(fname,lname,email,password)values(' "+fname+" ',' "+lname+" ','"+emailid+"','"+pass+"')";
	
	console.log("Query is:"+insert);
	
	var con=mysql.getConnection();
	con.query(insert);
	res.render('login',function(err,result)
			{
		if(!err){
			
			
			res.end(result);
		}
		else
			{
			res.end('An error in file occured occured');
			console.log(err);
			}
		
			});
}


function logout(req,res)
{  req.session.destroy();
	res.render('startpage',function(err, result) {
		   // render on success
		   if (!err) {
		            res.end(result);
		   }
		   // render or error
		   else {
		            res.end('An error occurred');
		            console.log(err);
		   }
	   });
		
}
function aboutme(req,res)
{   
	console.log("in query");
	var name=[];
	var screen_name=[];
	var tweettext=[];
	var location=[];
	var id=[];
	
	
	var getUser="select name,screen_name, tweettext,id,location from twitterdata";
	var con=mysql.getConnection();
	
	
	con.query(getUser,function(err,results)
			{
		alert("hi");
		
			 if(!err)
				 {
			 console.log(results.length);
			 for(var i=0;i<results.length;i++)
				 {
			 name[i]=(results[i].name);
			 screen_name[i]=(results[i].screen_name);
			 tweettext[i]=(results[i].tweettext);
			 id[i]=(results[i].id);
			 location[i]=(results[i].location);
			 console.log(name[i]+ ""+screen_name[i]+" "+tweettext[i]+" "+id[i]);
				 }
			 
		
			 
			 
			
		
			//var jsonparse=JSON.parse(str);
			res.render('aboutme',{data1:name,data2:screen_name,data3:tweettext,data4:id},function(err,result)
					{
				if(!err){
					
					res.end(result);
				}
				else
					{
					res.end('An error in file occured occured');
					console.log(err);
					}
				      
					});	
				 }
			
		  if(err)
			  {
			  res.send("error");
			  console.log("error");
			  }

			});
}
function createCategory(req,res)
{   res.render('category',function(err,result)
		{
	if(!err){
		
		res.end(result);
	}
	else
		{
		res.end('An error in file occured occured');
		console.log(err);
		}
	      
		});	
}
function saveCategory(req,res)
{
	var fname= req.param("fname");
	var lname=req.param("lname");
	var email=req.param("email");
	var contactno=req.param("contactno");
	var adress=req.param("adress");
	var twitterUserName=req.param("twitterUserName");

	
	var insert="insert into donor(fname,lname,email,contactno,adress,twitterUserName)VALUES('"+fname+"','"+lname+"','"+email+"','"+contactno+"','"+adress+"','"+twitterUserName+"')";
	console.log("Query is:"+insert);
	var con=mysql.getConnection();
	con.query(insert);
	res.render('thankyou');
	
}
function updateForm(req,res)
{ejs.renderFile('./views/update.ejs',function(err,result)
		{
	if(!err){
		
		res.end(result);
	}
	else
		{
		res.end('An error in file occured occured');
		console.log(err);
		}
	      
		});	
	
}
function updateReview(req,res)
{
	var category= req.param("Category");
	var name=req.param("Name");
	var comments=req.param("Review");
	var rating=req.param("Rating");
	var update="update adminoperations set element='"+name+"',rating='"+rating+"',comments='"+comments+"' where category='"+category+"'";
	console.log("Query is:"+update);
	var con=mysql.getConnection();
	con.query(update);
	res.send("done");
}
function deleteForm(req,res)
{ejs.renderFile('./views/delete.ejs',function(err,result)
		{
	if(!err){
		
		res.end(result);
	}
	else
		{
		res.end('An error in file occured occured');
		console.log(err);
		}
	      
		});	
	
}
function deleteCategory(req,res)
{
	var category= req.param("category");
	var name=req.param("Name");
	var comments=req.param("Review");
	var rating=req.param("Rating");
	var update="delete from review where category='"+category+"' and name='"+name+"'";
	console.log("Query is:"+update);
	var con=mysql.getConnection();
	con.query(update);
	res.send("done");
}
  
function start(req,res)
{   
	var getUser="select * from volunteer where email='"+req.session.email+"'";
	var con=mysql.getConnection();
	
	con.query(getUser, function(err,results){
		
		if(results.length>0)
			{
			console.log(results[0].time);
			var str=JSON.stringify(results[0].time);
			  
			//var jsonparse=JSON.parse(str);
			res.render('dashboard',{time:results[0].time,fname:results[0].fname,lname:results[0].lname,email:results[0].email},function(err,result)
					{
				if(!err){
					
					res.end(result);
				}
				else
					{
					res.end('An error in file occured occured');
					console.log(err);
					}
				      
					});
			}
		else
			{
			res.end("enter correct details");
			console.log(err);
			}
		
		
		
		
	});	
}
function adminstart(req,res)
{
	ejs.renderFile('./views/Admin.ejs',function(err,result)
	{
		if(!err)
		{
			
			res.end(result);
		}
		else
			{
			res.end('An error in file occured occured');
			console.log(err);
			}
		      
	});	
}
exports.afterfeedback=afterfeedback;
exports.authuser=authuser;
exports.feedback=feedback;
exports.startpage=startpage;
exports.updateReview=updateReview;
exports.updateForm=updateForm;	
exports.createCategory=createCategory;
exports.aboutme=aboutme;
exports.logout=logout;
exports.saveCategory=saveCategory;
exports.deleteForm=deleteForm;
exports.deleteCategory=deleteCategory;
exports.signup=signup;
exports.afterSignup=afterSignup;
exports.start=start;
exports.adminstart=adminstart;
exports.login=login;
exports.afterLogin=afterLogin;
exports.aboutus=aboutus;
exports.faq=faq;
exports.delivery=delivery;