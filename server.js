const http = require('http');
const fs = require('fs');
var urlmodule = require('url');
var path = require('path')
const config = require('./config/config').config;
const controllers = require('./app/controller');
const { resolve } = require('path');

const mimeType = {
    html: 'text/html',
    txt: 'text/plain',
    json: 'application/json',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    ico: 'image/vnd.microsoft.icon',
    css: 'text/css',
    js: 'text/javascript'
}

const server = http.createServer((req, res) => {

    // console.log(req.url);
    var reqfile = false;

    let { controllerName, methodName, urlParams, extension } = parseUrl(req.url);


    const obj = {};

    function isEmpty(object) {
        for (const property in object) {
            return false;
        }
        return true;
    }

    console.log(isEmpty(urlParams));


    // console.log(urlParams);


    // console.log(urlParams.length);

    if (urlParams != null) {
        // console.log("sssssssssssss");
        // urlParams.forEach(elem => {
        //     console.log(elem);
        // });
    }


    if (extension.length > 0) {
        reqfile = true;
        fs.readFile(__dirname + req.url, (err, data) => {
            if (err) {
                res.writeHead(404);
                res.end(JSON.stringify(err));
                return;
            }
            res.writeHead(200, { "Content-Type": mimeType[extension] });
            res.write(data, "binary");
            res.end();
        })
        return;
    }


    // console.log("con :", controllerName);
    // console.log("meth :", methodName);

    // console.log(typeof controllers[controllerName][methodName]);
    // isfunc



    if (controllers[controllerName] != undefined) {

        if (typeof controllers[controllerName][methodName] == 'function') {
            let response = controllers[controllerName][methodName]();
            res.writeHead(200, { "Content-Type": "application/json" });
            res.write(response);
            res.end();
        } else {
            res.writeHead(404);
            res.end("method yaft nashod");
            return;
        }

    } else {
        res.writeHead(404);
        res.write("controller not found!");
        res.end();
    }



    // parseUrl(req.url);
    // console.log("-----------------");
    // console.log("con :", controllerName);
    // console.log("meth :", methodName);
    // console.log("par :", urlParams);


})

server.listen(3000);




function parseUrl(url) {

    var q = urlmodule.parse(url, true);
    // console.log('local: '+q.host); //returns 'localhost:8080'
    // console.log('path: '+q.pathname); //returns '/default.htm'
    // console.log('query: '+q.search); 
    // console.log('ext: '+q.extname); 

    let extension = path.extname(url).slice(1);
    // console.log('ext:', extension);
    // console.log('ext.;engh : ', extension.length);

    var urlPath = (q.pathname).split('/');
    let controllerName = (urlPath[1] == undefined || urlPath[1] == '') ? 'index' : urlPath[1];
    let methodName = (urlPath[2] == undefined || urlPath[2] == '') ? 'index' : urlPath[2];
    let urlParams = q.query;


    return { controllerName, methodName, urlParams, extension }
}



