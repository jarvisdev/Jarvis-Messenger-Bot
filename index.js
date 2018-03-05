'use strict';
const PAGE_ACCESS_TOKEN=process.env.PAGE_ACCESS_TOKEN;
const YOUTUBE_API_KEY=process.env.YOUTUBE_API_KEY;
// Imports dependencies and set up http server

const request = require('request');
const youtube = require('youtube-search');
const spotify=require('spotify');
const
  express = require('express'),
  bodyParser = require('body-parser'),
  app = express().use(bodyParser.json()); // creates express http server
  app.use(bodyParser.urlencoded({
    extended:true
  }));

var youtubeopts={
    maxResults:3,
    key:YOUTUBE_API_KEY
};

//app.use(express.static(__dirname+'/public'));
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

  //res.writeHead('content-type','text/plain');
  res.write("hello");
  //res.end();

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
  //console.log(JSON.stringify(received_message));
    var response;

  // Check if the message contains text
  if (received_message.text) {  

      var text=received_message.text;
      text=text.trim();
      if(text.match(/^(youtube)\s.+/i))
      {
            var query=text.slice(7).trim();
            getYoutubeVideo(sender_psid,query);
      }
      else if(text.match(/^(music)\s.+/i))
      {
            var query=text.slice(5).trim();
            getMusic(sender_psid,query);
      }
      else if(text.match(/^(hey|hi+|hola|hello|hel+o|)\s.*/i))
      {
            var gifurl="https://media.giphy.com/media/3o7TKMt1VVNkHV2PaE/giphy.gif";
            sendImage(sender_psid,gifurl);    
            var hellomsg="Hello there. Its me Jarvis Milan's Messenger bot.";
            sendTextMessage(sender_psid,hellomsg); 
      }
      else if(text.match(/^(whats|what's|wass|what is)\s*(your|ur)\s*name.*/i))
      {
            var name="I am Jarvis currently working as Milan's bot. 😎 ";
            sendTextMessage(sender_psid,name);
      }
      else if(text.match(/^(how\s*are\s*you|wass\s*up|whats\s*up|what's up|how you doin.*).*/i))
      {
            var fine="yeah I am fine as always 😇😃 ";
            sendTextMessage(sender_psid,fine);
      }
      else if(text.match(/^(will\s*you\s*be\s*my\s*friend).*/i))
      {
            var sure="Yeah. I and Milan would love to be your friend.🙂";
            sendTextMessage(sender_psid,sure);
      }
      else if(text.match(/^(do\s*you\s*like\s*me).*/i))
      {
            var yess="yass I like you very much. I enjoy your company always.😊 ";
            sendTextMessage(sender_psid,yess);
      }
      else if(text.match(/^(.*(i\s*(luv|love|like)\s*(u+|you|yu))).*/i))
      {
            var lovegif="https://media.giphy.com/media/l39765g6zcASQXGMg/giphy.gif";
            sendImage(sender_psid,lovegif);
            var love="awwww...thats sweet☺❤!!I love you too. I love everyone.I and Milan would like to meet you."
            sendTextMessage(sender_psid,love);
      }
      else if(text.match(/.*(b+ye+|see\s*(u+|you|yu)\s*(again|so+n|later)|ciao|brb|ttyl).*$/i))
      {
            var byee="oh its too soon😟...okk no problem.It was nice to be with you.Ciao soon.Jai shree krishna 🙌👐"
            sendTextMessage(sender_psid,byee);
            sendImage(sender_psid,"https://media.giphy.com/media/JDTsqJhvLOq9G/giphy.gif");
      }
      else
      {
            var randomreplies=["I don't get you!!","did you mean %%&%$%^$^?","try out other questions","Did you speak it in english?",":/","-_-","😶😵","try youtube despacito","try music despacito","you can always send me your location when you are in trouble or when you are giving a treat"];
            var ind=Math.floor(Math.random()*randomreplies.length);
            sendTextMessage(sender_psid,randomreplies[ind]);
      }
  }
  else if(received_message.attachments){
        var nice="oh wow! that is nice.";
        sendTextMessage(sender_psid,nice);
  }

    
}  

//-------------------------------------------------------------------------------------------
// Handles messaging_postbacks events
function handlePostback(event) {
      var sender_psid=event.sender.id;
      var received_postback=event.postback;
      var payload=received_postback.payload;

      if(payload=='get_started_payload')
      {
          var gifurl="https://media.giphy.com/media/3o7TKMt1VVNkHV2PaE/giphy.gif";
          sendImage(sender_psid,gifurl);
          // typingIndicatorEnable(sender_psid);
          // setTimeout(typingIndicatorDisable,4000,sender_psid);
          var greettext="Hello I am Milan's Messenger bot. You know what Milan is a simple but good guy.He is kind of studious and nerdy guy. You can see his social and academic profiles here. Also Milan has configured me in such a way that I can provide you some amazing stuff from *youtube* and *spotify* so tap the menu near the textbox and play with me. :) ";
          sendTextMessage(sender_psid,greettext);
      }

      else if(payload=='youtube_payload')
      {
            // typingIndicatorEnable(sender_psid);
            // setTimeout(typingIndicatorDisable,4000,sender_psid);
            var instructions="So do you like surfing on youtube? Milan uses youtube a lot and is a daily visitor of youtube.He has told me to help you to get videos from youtube according to your wish.So all you have to do is to type *youtube your_search_query* for example *youtube despacito* .I will provide you top 3 results for your query.So go give it a try...";
            sendTextMessage(sender_psid,instructions);
      }

      else if(payload=='spotify_payload')
      {
            // typingIndicatorEnable(sender_psid);
            // setTimeout(typingIndicatorDisable,4000,sender_psid);
            var instructions="Hey do you like music? Milan is a huge fan of music.He is also a good singer. He has told me to help you to find your favourite music on Spotify.Spotify is a famous online music database. So all you have to do is So all you have to do is to type *music your_search_query* for example *music despacito* .I will provide you top 3 results for your query.So go give it a try...";
            sendTextMessage(sender_psid,instructions);
      }
      else if(payload=='social_profiles')
      {
            // typingIndicatorEnable(sender_psid);
            // setTimeout(typingIndicatorDisable,4000,sender_psid);
            sendGenericSocialTemplateCarousel(sender_psid);
      }
      else if(payload=='coding_profiles')
      {
            // typingIndicatorEnable(sender_psid);
            // setTimeout(typingIndicatorDisable,4000,sender_psid);
            sendGenericCodingTemplateCarousel(sender_psid);
      }
      else
      {
            sendTextMessage(sender_psid,"You sent something that is not recognisable");
      }

}

// ____________________
//|helper functions    |
//|____________________|

//--------------------------------------------------------------------------
//send a text message

function sendTextMessage(sender_psid,text){

  var request_body = {
      "recipient": {
        "id": sender_psid
      },
      {"message": text}
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
                "image_url": "https://www.seeklogo.net/wp-content/uploads/2016/09/facebook-icon-preview.png",
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
                "image_url": "https://patriciaannbridewell.files.wordpress.com/2014/04/official-twitter-logo-tile.png",
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
                "image_url": "https://www.seeklogo.net/wp-content/uploads/2016/05/instagram-logo-vector-download.jpg",
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
                "image_url": "http://1000logos.net/wp-content/uploads/2017/03/Color-of-the-LinkedIn-Logo.jpg",
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
                "image_url": "http://image.flaticon.com/icons/png/512/185/185976.png",
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
                "image_url": "https://www.ime.usp.br/~arcjr/image/codeforces.png",
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
                "image_url": "https://pbs.twimg.com/profile_images/470882849885667329/X48adYnt.jpeg",
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
                "image_url": "https://upload.wikimedia.org/wikipedia/commons/e/e8/HackerEarth_logo.png",
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
                "image_url": "http://www.iamwire.com/wp-content/uploads/2014/06/hackerrank_g7yq8.png",
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
                "image_url": "https://major.io/wp-content/uploads/2014/08/github.png",
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
//--------------------------------------------------------------------------
//spotify music search

function getMusic(query)
{
    // spotify.search({type:'track '})
    //do nothing
}

//---------------------------------------------------------------------------
//youtube video search

function getYoutubeVideo(sender_psid,query)
{
    search(query,youtubeopts,function(err,response){
        if(err)
        {
            console.log("error while getting video: "+err);
        }
        else
        {
            //do nothing   
        }
    });
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