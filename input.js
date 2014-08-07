/*jshint node:true */

var keypress = require('keypress');

// make `process.stdin` begin emitting "keypress" events
keypress(process.stdin);

var myOutput = "";

// Sample command list for command completion.
// in the future it will hold the commands available
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

//Clears console output so that previous contents of myOutput does not show
var clearCmd = function(){
  var clearChars = new Array(lastWordLength + 1).join( " " );
  process.stdout.write("\r" + clearChars + "\r");
};

var tabPressed = function(){
  clearCmd();
  //If tab has been pressed before
  if (lastKeyPressed === "tab") {
    //and completionArray has contents
    if (completionArray.length > 0){
      myOutput = completionArray[completionArrayIndex];
      lastWordLength = myOutput.length;
      //increment completionArrayIndex if the index is no larger than length.
      if (completionArray.length > completionArrayIndex + 1) {
        completionArrayIndex = completionArrayIndex + 1;
      } else {
        //or reset index to 0
        completionArrayIndex = 0;
      }
    }
  } else {
    //else if tab has not been pressed before
    //filter out the commands tha begin with myOutput
    completionArray = [];
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

var getLongest = function(length){
  if (length > lastWordLength){
    return length;
  } else {
    return lastWordLength;
  }
};

var processInput = function(ch, key){
  if (key && key.ctrl && key.name === 'c') {
    process.exit();
  } else if (key && key.name === 'return'){
    console.log("\n");
  } else if (key && key.name === 'tab') {
    tabPressed();
  } else if(key && key.name === 'backspace'){
    clearCmd();
    myOutput = myOutput.slice(0, -1);
    lastWordLength = myOutput.length;
  } else if(key && key.name === 'space'){
    myOutput = myOutput + " ";
  } else if(key){
    myOutput = myOutput + ch;
    lastWordLength = getLongest(myOutput.length);
  }
  if (key) { lastKeyPressed = key.name; }
};

console.log("CTRL-C to exit");

process.stdin.on('keypress', function (ch, key) {
  processInput(ch, key);
  lastWordLength = myOutput.length;
  clearCmd();
  process.stdout.write(myOutput);
});

process.stdin.setRawMode(true);
process.stdin.resume();
