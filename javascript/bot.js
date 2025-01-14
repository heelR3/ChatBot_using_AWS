const AWS = require('aws-sdk');
const botName = "FAQBot";
const lambda = new AWS.Lambda({region: 'us-west-2'});

const availableCommands = ["usage", "show", "help"];
const availableHelp = {"show": ["services", "<servicename>"],
                       "help": ["<servicename>"]}
const availableOptions = ["pricing", "regions", "faq [default]"];

const services = AWS.Service._serviceMap;
const serviceMap = [];
for (var service in AWS.Service._serviceMap) { serviceMap.push(service); }

exports.handler = (event, context, callback) => {
    var returnMessage = "";
    params = {
        FunctionName: botName
    }
    runTimePromise = lambda.getFunction(params).promise();
    runTimePromise.then(function(data) {
        runTime = data['Configuration']['Runtime'];
        returnMessage += "[" + runTime + "] "
        var triggerWord = event['trigger_word'];
        var words = event['text'].split(triggerWord);
        var words = words[1].trim().split(" ");

        if (words.length == 1) {
            if (words[0] === "help") {
                returnMessage += "`Available commands: " + availableCommands.join(",") + "`";
            }
           if (words[0] === "usage") {
                returnMessage += "`Usage: " + triggerWord + " <command> <service_name> <option>`";
            }
        }
        
        if (words.length >= 2) {
            if (words[0] === "help" && availableHelp.hasOwnProperty(words[1])) {
                returnMessage += "`Usage: " + words[1] + " " + availableHelp[words[1]] + "`";
            }
            if (words[0] === "help" && services.hasOwnProperty(words[1])) {
                returnMessage += "`Usage: show " + words[1] + " <" + availableOptions.join(",") + ">`";
            }
            if (words[0] === "help" && availableHelp.hasOwnProperty(words[1]) == false && services.hasOwnProperty(words[1]) == false) {
                returnMessage += "Invalid Service/Command -- `Available commands: " + availableCommands.join(",") + "`";
            }
            if (words[0] === "show" && words[1] === "services") {
                returnMessage += "Available services: `" + JSON.stringify(serviceMap) + "`";
            }
            if (words[0] === "show" && words[1] === "commands") {
                
            }
        }
        
        callback(null, {"text": returnMessage});
    })
}
