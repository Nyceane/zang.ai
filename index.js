var express = require('express');
var apiai = require('apiai');
var aiapp = apiai("");
var bodyParser = require('body-parser')



var app = express();

// parse application/x-www-form-urlencoded 
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json 
app.use(bodyParser.json())

	var zang = require('zang-node');
	var enums = zang.enums;

	var connector = new zang.SmsConnector({
	    accountSid: '',
	    authToken: ''
	});

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
x
app.get('/', function(request, response) {
  response.render('pages/index');
});

app.get('/trigger', function(request, response) {
  
	//send sms message
	connector.sendSmsMessage({
	    to: '+123456',
	    from: '+123457',
	    body: 'trigger text',
	    statusCallbackMethod: enums.HttpMethod.GET,
	    allowMultiple: true
	}).then(function (data) {
	    console.log(data);
	});

	response.send("success");
});

app.post('/getmsg', function(req, res) {

	var options = {
	    sessionId: 'test'
	};

	var request = aiapp.textRequest(req.body.Body, options);

	request.on('response', function(response) {
	    //console.log(response);
	    //console.log(response.result.fulfillment.speech);
		connector.sendSmsMessage({
		    to: '+123456',
		    from: '+123457',
		    body: response.result.fulfillment.speech,
		    statusCallbackMethod: enums.HttpMethod.GET,
		    allowMultiple: true
		}).then(function (data) {
		    console.log(data);
		});
	});

	request.on('error', function(error) {
	    console.log(error);
	});

	request.end();
	//response.send("success");

	res.send("success");

});



app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


