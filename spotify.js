const request = require('request');
const spotify=require('spotify');
const express=require('express');
const app=express();


app.get("/",function(req,res){

	spotify.search({ type: 'track', query: 'despacito' }, function(err, data) {
	    if ( err ) {
	        console.log('Error occurred: ' + err);
	        return;
	    }
	 
	    // Do something with 'data' 
	    res.write(data);
	    console.log(data);
	});
	//res.write("hello");
	// console.log("hello0");
});
	

app.listen(8000,()=>{
	console.log("listening on 8000");
});