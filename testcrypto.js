#!/usr/bin/env node

var crypto = require("crypto");

function _encrypt(plaintext, password) {
    var cipher = crypto.createCipher("aes192", password);
    var msg = [];
    msg.push(cipher.update(plaintext, "binary", "hex"));
    msg.push(cipher.final("hex"));

    return msg;
}

function _decrypt(ciphertext, password) {
    var decipher = crypto.createDecipher("aes192", password);
    var msg = [];

    msg.push(decipher.update(ciphertext, "hex", "binary"));
    msg.push(decipher.final("binary"));

    return msg;
}

var password = "consciousindia";

var encryptedData = {
    passphrase: "hello",
    client: {
        name: "consciousindia website",
        id: "12345"
    },
    expire: new Date(2013,12,30)
}
var cipher = "8823bcf0dfc6ba33e87ef92a39a29960cec1577f306b8efd827b62edceeb8f0d926f2e8259f5d1237d22ca9527b4f53836ba57a68ff0a14cf88b6ceef7931cd454bac298a5dcc098cf632e7ed42e220b40a73aabcfe2ef5ee20b81d828c7b6b5d7fe32d3a12aa6e3d49e225ab0fa106741f189376ed1fe84b909dab4db824bd4";

var plaintext = JSON.stringify(encryptedData);

var ciphertext = _encrypt(plaintext, password).join("");
console.log("ciphertext: " + ciphertext);
var decryptedText = _decrypt(ciphertext, password).join("");
console.log("text: " + decryptedText);
