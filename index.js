'use strict';
const PAGE_ACCESS_TOKEN=process.env.PAGE_ACCESS_TOKEN;;
// Imports dependencies and set up http server

const request = require('request');
const
  express = require('express'),
  bodyParser = require('body-parser'),
  app = express().use(bodyParser.json()); // creates express http server
  app.use(bodyParser.urlencoded({
    extended:true
  }));

//---------------------------------------------------------------
//some real quick stuff

var social=["https://www.facebook.com/iamjarvis11","https://www.instagram.com/beingmilanbavishi/","https://twitter.com/me_milan_11","https://www.linkedin.com/in/milan-bavishi-809a20131/","https://www.quora.com/profile/Milan-Bavishi-1"];
var coding=["https://www.codechef.com/users/me_milan_11","http://codeforces.com/profile/milan11","https://www.hackerrank.com/imjarvis11","https://www.hackerearth.com/@milanbavishi","https://github.com/jarvisdev"];
//-----------------------------------------------------------------------
//for the verification of webhook
// Adds support for GET requests to our webhook
app.get('/webhook', (req, res) => {

  // Your verify token. Should be a random string.
    
  // Parse the query params
  let mode = req.query['hub.mode'];
  let token = req.query['hub.verify_token'];
  let challenge = req.query['hub.challenge'];
    
  // Checks if a token and mode is in the query string of the request
  if (mode && token) {
  
    // Checks the mode and token sent is correct
    if (mode === 'subscribe' && token === process.env.VERIFY_TOKEN) {
      
      // Responds with the challenge token from the request
      console.log('WEBHOOK_VERIFIED');
      res.status(200).send(challenge);
    
    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      console.log("403 firbidden make sure the tokens are matched");
      res.sendStatus(403);      
    }
  }
});

//---------------------------------------------------------------------------------
//for homepage of my heroku website

app.get('/',(req,res)=>{

  res.writeHead('content-type','text/plain');
  res.write("hello");
  res.end();

});

//----------------------------------------------------------------------------------
// Creates the endpoint for our webhook 
app.post('/webhook', (req, res) => {  
 
  let body = req.body;

  // Checks this is an event from a page subscription
  if (body.object === 'page') {

    // Iterates over each entry - there may be multiple if batched
    body.entry.forEach(function(entry) {

      entry.messaging.forEach(function(event){

        if (event.message) {
        handleMessage(event);        
        } 
        else if (event.postback) {
          handlePostback(event);
        }
        else{
            console.log("unknown event "+event);
        } 

      });
		  
    });
    // Returns a '200 OK' response to all requests
    res.status(200).send('EVENT_RECEIVED');
  }
 else {
    // Returns a '404 Not Found' if event is not from a page subscription
    res.sendStatus(404);
  }

});

//---------------------------------------------------------------------------
// Handles messages events
function handleMessage(event) {
  var sender_psid=event.sender.id;
  var received_message=event.message;
  console.log(JSON.stringify(received_message));
	var response;

  // Check if the message contains text
  if (received_message.text) {  

      var text=received_message.text;
      // Create the payload for a basic text message
      typingIndicatorEnable(sender_psid);
      setTimeout(typingIndicatorDisable,4000);
      sendGenericSocialTemplateCarousel(sender_psid);
  }
  else if(received_message.attachments){

    let attachment_url=received_message.attachments[0].payload.url;

      response = {
        "attachment": {

          "type": "template",

          "payload": {

              "template_type": "generic",
              "elements": [{
              "title": "Is this the right picture?",
              "subtitle": "Tap a button to answer.",
              "image_url": attachment_url,
              "buttons": [
                {
                  "type": "postback",
                  "title": "Yes!",
                  "payload": "yes",
                },
                {
                  "type": "postback",
                  "title": "No!",
                  "payload": "no",
                }
              ],
            }]
          }
        }
      }
    }; 
      
    sendGenericTemplate(sender_psid,response);  
}  

//-------------------------------------------------------------------------------------------
// Handles messaging_postbacks events
function handlePostback(event) {
  var sender_psid=event.sender.id;
  var received_postback=event.postback;
    let response;
    let payload=received_postback.payload;

    if(payload==='yes'){
      response={'text':'thanx!!'};
    }
    else if(payload==='no'){
      response={'text':'oops! send it again'};
    }

    var request_body = {
      "recipient": {
        "id": sender_psid
      },
      "message": response
    };
    callSendAPI(request_body);
}

//--------------------------------------------------------------------------
//send a text message

function sendTextMessage(sender_psid,text){

  var request_body = {
      "recipient": {
        "id": sender_psid
      },
      "message": text
    };
  callSendAPI(request_body);

}

//--------------------------------------------------------------------------
//send a generic template

function sendGenericTemplate(sender_psid,response){

  var request_body = {
      "recipient": {
        "id": sender_psid
      },
      "message": response
    };
  callSendAPI(request_body);

}

function sendGenericSocialTemplateCarousel(sender_psid){

    var response = {
        "attachment": {

          "type": "template",

          "payload": {

              "template_type": "generic",
              "elements": [

                {
                "title": "Milan's Facebook Profile",
                "subtitle": "Be my friend buddy :)",
                "image_url": "https://drive.google.com/file/d/1IC4NLQ_uGfHCp0leVhreOinkvnEc8Mzr/view?usp=sharing",
                "buttons": [
                  {
                    "type": "web_url",
                    "title": "View Profile",
                    "url": social[0]
                  }
                ]
              },

              {
                "title": "Milan's Twitter Profile",
                "subtitle": "Follow Me :P",
                "image_url": "https://drive.google.com/file/d/1IC4NLQ_uGfHCp0leVhreOinkvnEc8Mzr/view?usp=sharing",
                "buttons": [
                  {
                    "type": "web_url",
                    "title": "View Profile",
                    "url": social[2]
                  }
                ]
              },

              {
                "title": "Milan's Instagram Profile",
                "subtitle": "Follow Me :P",
                "image_url": "https://drive.google.com/file/d/1IC4NLQ_uGfHCp0leVhreOinkvnEc8Mzr/view?usp=sharing",
                "buttons": [
                  {
                    "type": "web_url",
                    "title": "View Profile",
                    "url": social[1]
                  }
                ]
              },

              {
                "title": "Milan's LinkedIn Profile",
                "subtitle": "Connect With Me :) ",
                "image_url": "https://www.facebook.com/photo.php?fbid=635791393289005&l=b5b72610dd",
                "buttons": [
                  {
                    "type": "web_url",
                    "title": "View Profile",
                    "url": social[3]
                  }
                ]
              },

              {
                "title": "Milan's Quora Profile",
                "subtitle": "Ask me :)",
                "image_url": "https://drive.google.com/file/d/0BzCLIO-wlP20YnpuOVRTVlcwcWF2OUFOMFBiOGk4Wl9vNlZR/view?usp=sharing",
                "buttons": [
                  {
                    "type": "web_url",
                    "title": "View Profile",
                    "url": social[4]
                  }
                ]
              }

            ]
          }
        }
      }

      var request_body = {
      "recipient": {
        "id": sender_psid
      },
      "message": response
    };

    callSendAPI(request_body);
}


function sendGenericCodingTemplateCarousel(sender_psid){

    var response = {
        "attachment": {

          "type": "template",

          "payload": {

              "template_type": "generic",
              "elements": [

                {
                "title": "Milan's Codeforces Profile",
                "subtitle": "Codeforces is Love",
                "image_url": "https://drive.google.com/file/d/1bYSZn1cHGNaDAM6t7X0Ts-155NIGAzQk/view?usp=sharing",
                "buttons": [
                  {
                    "type": "web_url",
                    "title": "View Profile",
                    "url": coding[1],
                  },
                ],
              },

              {
                "title": "Milan's Codechef Profile",
                "subtitle": "wanna be red :P",
                "image_url": "https://drive.google.com/file/d/19loH9A38cJX1gQHY0jWsjZlYIh-qg8ZQ/view?usp=sharing",
                "buttons": [
                  {
                    "type": "web_url",
                    "title": "View Profile",
                    "url": coding[0],
                  },
                ],
              },

              {
                "title": "Milan's hackerearth Profile",
                "subtitle": "Fan of CodeMonk",
                "image_url": "https://drive.google.com/file/d/1vmtmU5P2ajls3o1rIa7aEgwpHzu0FPFz/view?usp=sharing",
                "buttons": [
                  {
                    "type": "web_url",
                    "title": "View Profile",
                    "url": coding[3],
                  },
                ],
              },

              {
                "title": "Milan's Hackerrank Profile",
                "subtitle": "I started my coding journey here",
                "image_url": "https://drive.google.com/file/d/1M0NyzqpLdZ08dGjdpJn_ffrWrtjNyp3x/view?usp=sharing",
                "buttons": [
                  {
                    "type": "web_url",
                    "title": "View Profile",
                    "url": coding[2],
                  },
                ],
              },

              {
                "title": "Milan's Github Profile",
                "subtitle": "My development stuff",
                "image_url": "https://drive.google.com/file/d/1ZpvSrFx2dNiSi5cDD3Wj-sHorv7P913K/view?usp=sharing",
                "buttons": [
                  {
                    "type": "web_url",
                    "title": "View Profile",
                    "url": coding[4],
                  },
                ],
              }

            ]
          }
        }
      }

      var request_body = {
      "recipient": {
        "id": sender_psid
      },
      "message": response
    };

    callSendAPI(request_body);
}


//---------------------------------------------------------------------------
//send an video

function sendVideo(sender_psid,video_url){
    var request_body={

        "recipient":{
          "id":sender_psid
        },
        "message":{

            "attachment":{
              "type":"video",
              "payload":{
                "url":video_url
              }
            }
        }
    };

    callSendAPI(request_body);
}

//---------------------------------------------------------------------------
//send an image

function sendImage(sender_psid,image_url){
    var request_body={

        "recipient":{
          "id":sender_psid
        },
        "message":{

            "attachment":{
              "type":"image",
              "payload":{
                "url":image_url
              }
            }
        }
    };

    callSendAPI(request_body);
}
//---------------------------------------------------------------------------
//send social media quick reply

function sendSocialMediaQuickReply(sender_psid){
    var request_body={
        "recipient":{
            "id":sender_psid
        },
        "message":{
            "text":"My Social media profiles. Meet me there dude. :)",
            "quick_replies":[
                {
                  "content-type":"text",
                  "title":"facebook",
                  "payload":"facebook"
                },
                {
                  "content-type":"text",
                  "title":"twitter",
                  "payload":"twitter"
                },
                {
                  "content-type":"text",
                  "title":"instagram",
                  "payload":"instagram"
                },
                {
                  "content-type":"text",
                  "title":"linkedin",
                  "payload":"linkedin"
                }
            ]
        }
    };

    callSendAPI(request_body);
}

//---------------------------------------------------------------------------
//send coding profiles quick reply

function sendCodingProfilesQuickReply(sender_psid){
    var request_body={
        "recipient":{
            "id":sender_psid
        },
        "message":{
            "text":"My Social media profiles. Meet me there dude. :)",
            "quick_replies":[
                {
                  "content-type":"text",
                  "title":"codeforces",
                  "payload":"cf"
                },
                {
                  "content-type":"text",
                  "title":"codechef",
                  "payload":"cc"
                },
                {
                  "content-type":"text",
                  "title":"hackerearth",
                  "payload":"he"
                },
                {
                  "content-type":"text",
                  "title":"hackerrank",
                  "payload":"hr"
                },
                {
                  "content-type":"text",
                  "title":"github",
                  "payload":"gh"
                }
            ]
        }
    };
    callSendAPI(request_body);
}

//---------------------------------------------------------------------------
//for enabling typing indicator
function typingIndicatorEnable(sender_psid){

    var request_body = {
        "recipient": {
          "id": sender_psid
        },
        "sender_action":"typing_on"
    };
    callSendAPI(request_body);
}
//for disabling typing indicator
function typingIndicatorDisable(sender_psid){

    var request_body = {
        "recipient": {
          "id": sender_psid
        },
        "sender_action":"typing_off"
    };
    callSendAPI(request_body);
}

//--------------------------------------------------------------
// Sends response messages via the Send API
function callSendAPI(request_body) {
	  
	  // Send the HTTP request to the Messenger Platform
	  request({
	    "uri": "https://graph.facebook.com/v2.6/me/messages",
	    "qs": { "access_token": PAGE_ACCESS_TOKEN },
	    "method": "POST",
	    "json": request_body
	  }, (err, res, body) => {
	    if (!err) {
	      console.log('message sent!')
	    } else {
	      console.error("Unable to send message:" + err);
	    }
	  }); 
  
}
//-----------------------------------------------------------------------------------------
// Sets server port and logs message on success
app.listen(process.env.PORT || 1337, () => console.log('webhook is listening'));