#!/usr/bin/env node

var crypto = require("crypto"),
    argv = require("optimist").argv;

if (argv.e && argv.password) {
    var cipher = crypto.createCipher("aes192", argv.password),
        msg = [];

    argv._.forEach( function (phrase) {
        msg.push(cipher.update(phrase, "binary", "hex"));
    });

    msg.push(cipher.final("hex"));
    console.log(msg.join(""));

} else if (argv.d && argv.password) {
    var decipher = crypto.createDecipher("aes192", argv.password),
        msg = [];

    argv._.forEach( function (phrase) {
        msg.push(decipher.update(phrase, "hex", "binary"));
    });

    msg.push(decipher.final("binary"));
    console.log(msg.join(""));   
}