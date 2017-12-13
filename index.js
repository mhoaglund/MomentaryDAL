'use strict';

var mysql = require('mysql');

var maxKeys = 1000;
var fromTime = 0;
var operation = "insert"
var key = null
var authenticated = false;

exports.handler = (event, context, callback) => {
    var reply = ""
    console.log(event)
    if(event["auth"] != "TS"){
        var reply = "Authentication Failed."
        callback(null, {"statusCode": 404, "body": JSON.stringify(reply)})
        return;
    } else {authenticated = true}
    if(authenticated){
        parseParams(event)
        var connection = mysql.createConnection({
            host     : process.env.dbhost,
            port: 3306,
            user     : process.env.dbuser,
            password : process.env.dbpw,
            database : process.env.dbname
        });
        connection.connect(function(err){
        if (err) {
                reply = 'error connecting: ' + err.stack
                console.log(reply)
                callback(null, {"statusCode": 404, "body": JSON.stringify(reply)})
            }
        console.log('db connection open')
        reply = "Business as Usual"
            switch(operation){
                case "insert":
                    var record = {
                        id: 0
                        //TODO parse post body
                    };
                    // var query = connection.query('INSERT INTO ch_orders SET ?', record,
                    //     function(err, result) {
                    //         if(!err) console.log(result)
                    //         else console.log(err)
                    // });
                    reply = "Insert successful"
                    wrapUp(connection, reply, 200, callback)
                    break;
                case "getfrom":
                    if(!fromTime) reply = "Please enclose a valid timestamp."
                    else{
                        
                    }
                    break;
                case "getall":
                    break;
                case "getlatest":
                    break;
                case "getby":
                    if(!key) reply = "Please enclose a valid key field."
                    else{
        
                    }
                    break;
                }
            wrapUp(connection, reply, 200, callback)
        });
    }
};

function wrapUp(connection, reply, code, callback){
    connection.end(function(err) {
        callback(null, {"statusCode": code, "body": JSON.stringify(reply)})
    });
}

function parseParams(qstring){
    if(qstring["items"] < maxKeys) maxKeys = qstring["items"]
    if(qstring["from"]) fromTime = qstring["from"]
    if(qstring["op"]) operation = qstring["op"]
    if(qstring["key"]) key = qstring["key"]
}
