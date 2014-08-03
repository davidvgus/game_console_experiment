/*jshint node:true */

var keypress = require('keypress');

// make `process.stdin` begin emitting "keypress" events
keypress(process.stdin);
//process.stdin.setEncoding( 'utf8' );

var myOutput = "";
var myCommandList = ["apple",
                      "app",
                      "battery",
                      "bar",
                      "bog",
                      "dog",
                      "dig",
                      "damn"
                    ];
var lastKeyPressed;
var completionArray = [];
var completionArrayIndex = 0;
var lastWordLength = 0;

var clearCmd = function(){
  var clearChars = new Array(lastWordLength + 1).join( " " );
  process.stdout.write("\r" + clearChars + "\r");
};

var tabPressed = function(){
  if (lastKeyPressed === "tab") {
    if (completionArray.length > 0){
      lastWordLength = myOutput.length;
      myOutput = completionArray[completionArrayIndex];
      if (completionArray.length > completionArrayIndex + 1) {
        completionArrayIndex = completionArrayIndex + 1;
      } else {
        completionArrayIndex = 0;
      }
    }
  } else {
    completionArrayIndex = 0;
    var tempArray = myCommandList.map(function(item){
      if (item.match(myOutput)) {
        return item;
      }
    });

    completionArray = tempArray.filter(function(filterItem){
      return filterItem !== undefined;
    });
  }
};

var processInput = function(ch, key){
  if (key && key.ctrl && key.name === 'c') {
    process.exit();
  } else if (key.name === 'return'){
    myCommandList.push(myOutput);
    console.log("\n");
  } else if (key.name === 'tab') {
    tabPressed();
  } else if(key.name === 'backspace'){
    myOutput = myOutput.slice(0, -1);
  } else if(key.name === 'space'){
    myOutput = myOutput + " ";
  } else {
    myOutput = myOutput + key.name;
    lastWordLength = myOutput.length;
  }
  lastKeyPressed = key.name;
};

process.stdin.on('keypress', function (ch, key) {
  processInput(ch, key);
  //var clearChars = new Array(lastWordLength + 1).join( " " );
  //process.stdout.write("\r" + clearChars + "\r");
  clearCmd();
  process.stdout.write(myOutput);
});

process.stdin.setRawMode(true);
process.stdin.resume();
