'use strict';

const aws = require('aws-sdk');
const s3 = new aws.S3();
var maxKeys = 1000;
var fromTime = 0;
var operation = "enumerate"
var key = null
var authenticated = false;

exports.handler = (event, context, callback) => {
    //console.log(event);
    var reply = ""
    var qs = event["queryStringParameters"]
    if(!qs["auth"] === "TS"){
        var reply = "Authentication Failed."
        return;
    } else {authenticated = true}
    if(authenticated){
        parseParams(qs)
        switch(operation){
            case "enumerate":
                var params = {
                    Bucket: qs["bucket"],
                    Delimiter: '',
                    Prefix: ''
                }
                s3.listObjects(params, function (err, data) {
                    if(err)callback(err)
                    console.log(data)
                    reply = data
                    callback(null, {"statusCode": 200, "body": JSON.stringify(reply)})
                })
                break
            case "getfrom":
                if(!fromTime) reply = "Please enclose a valid timestamp."
                else{

                }
                break
            case "getall":
                break
            case "getlatest":
                break
            case "getby":
                if(!key) reply = "Please enclose a valid key field."
                else{

                }
                break
        }
        callback(null, {"statusCode": 404, "body": JSON.stringify(reply)})
    }
    
};

function parseParams(qstring){
    if(qstring["items"] < maxKeys) maxKeys = qstring["items"]
    if(qstring["from"]) fromTime = qstring["from"]
    if(qstring["op"]) operation = qstring["op"]
    if(qstring["key"]) key = qstring["key"]
}