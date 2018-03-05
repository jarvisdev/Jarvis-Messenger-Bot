const request = require('request');
const search=require('youtube-search');
const express=require('express');
const app=express();

const YOUTUBE_API_KEY="AIzaSyCnE7SPVOgaJ2yvVNx0Hp4P8DI8nfGZqaw";
var youtubeopts={
    maxResults:3,
    key:YOUTUBE_API_KEY
};

app.get("/",function(req,res){

	search('despacito',youtubeopts,function(err,response){
        if(err)
        {
            console.log("error while getting video: "+err);
        }
        else
        {
            //do nothing 
            console.log(JSON.stringify(response));  
        }
    });
});
	

app.listen(8000,()=>{
	console.log("listening on 8000");
});