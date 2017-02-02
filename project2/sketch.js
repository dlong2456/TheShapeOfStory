//GLOABL VARIABLES
var stories;
var rg = new RiGrammar();
//An array of tokens.
var tokens = []; 
var inputTokens = new Array();
var ct = 0;
var change = false;

var temp ; // Array to hold the array of story words
var inputTemp ; // Array to hold the array of input sentence words.
var inputStr = "";

  function saveText(){
    inputStr = document.getElementById("textToSave").value;
    return inputStr;
  }


function token()
{
  this.label = "",
  this.pos = ""
};

var c = 0;


//grammar rules

var rule1 = "Once upon a time, there was a <nn>. <prp> <vbz> of a <nn>.| In a land far far away , there lived a <nn>. <prp> <vbz> <nn>";
var rule2 = "prince | princess";
var rule3 = "carriage | bike";
var rule4 = "fell|ate";
var rule5 = "He|She|It";

//SYSTEM DEFINED FUNCTIONS TO CONTROL THE FLOW OF THE PROGRAM
function preload() {
  
  stories = loadStrings('data/cinderella.txt');
  

}

function setup() {

 

  createCanvas(600, 600);
  preAnalysis(); //JOINS THE WHOLE STORY TOGETHER AS A SUNGLE STRING FOR ANALYSIS
  temp = tokenise(stories); // An array of unique words in the story
  //vocubularise(temp); // fills the tokens array with all the generated token properties.
  
  //var inputStr = "orange apple";
 // var inputWordsArray = tokenise(inputStr);
 // InputVocubularise(inputWordsArray);
  //var or = loadJSON("http://api.conceptnet.io/c/en/orange",getData);
  // var ap = loadJSON("http://api.conceptnet.io/c/en/apple",getData);
  //console.log(or);
 
  
}



function draw() {

  frameRate(2);
 // console.log(Object.siz(tokens[0]));
// console.log(RiTa.getPosTags("word")[0]);
text(inputStr,100,100);
inputAnalysis(inputStr)

 background(255);
		createGrammar();
 text(rg.expand(),200,200);




//console.log(inputStr);
   //console.log(inputTokens[0]);
   //console.log(similarityScoreNoun(inputTokens[0],inputTokens[1]));
   
}
function Pressed()
	{
	
	    
	  
	}



function inputAnalysis(something)
{
  if(RiTa.getPosTags(something) == "nn" ||RiTa.getPosTags(something) == "nns" )
  {
    rule2 +=" | "+something;
      change = !change;
  }
  else if(RiTa.getPosTags(something) == "vbd")
  {
    rule4 += " | "+something;
      change = !change;  
  }
   
}

function copied(o) {
   var output, v, key;
   output = Array.isArray(o) ? [] : {};
   for (key in o) {
       v = o[key];
       output[key] = (typeof v === "object") ? copied(v) : v;
   }
   return output;
}

Object.siz = function(obj) {
    var siz = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return siz;
};



function showResult()
{
   console.log(foo.resultString); // log the result
}

//CALL BACK THAT GETS THE DATA FROM THE CALL TO CONCEPTNET
function getData(data)
{
 var token1 = new token();
 token1.label = data["@id"].substring(6);
 token1.pos = RiTa.getPosTags(token1.label)[0];
 
 var x = 0;
  for( var i = 0 ; i < data["edges"].length ; i++)
  { 
    if(!(data["edges"][i]["rel"]["label"] in token1))
     token1[data["edges"][i]["rel"]["label"]] = data["edges"][i]["end"]["label"];
     
     else if(data["edges"][i]["rel"]["label"] in token1)
     {
       x++;
       data["edges"][i]["rel"]["label"] += x.toString();
       token1[data["edges"][i]["rel"]["label"]] = data["edges"][i]["end"]["label"];
     }
  }
  //tokens.push(token1);
  //console.log(token1);
  return token1;
  c++;

}
//to handle the input strings
function getData2(data)
{
 var token1 = new token();
 token1.label = data["@id"].substring(6);
 token1.pos = RiTa.getPosTags(token1.label)[0];
 var x = 0;
  for( var i = 0 ; i < data["edges"].length ; i++)
  { 
    if(!(data["edges"][i]["rel"]["label"] in token1))
     token1[data["edges"][i]["rel"]["label"]] = data["edges"][i]["end"]["label"];
     
     else if(data["edges"][i]["rel"]["label"] in token1)
     {
       x++;
       data["edges"][i]["rel"]["label"] += x.toString();
       token1[data["edges"][i]["rel"]["label"]] = data["edges"][i]["end"]["label"];
     }
  }
  inputTokens.push(token1);
  
 
  c++;

}

function getData3(data)
{
 var token1 = new token();
 token1.label = data["@id"].substring(6);
 token1.pos = RiTa.getPosTags(token1.label)[0];
 var x = 0;
  for( var i = 0 ; i < data["edges"].length ; i++)
  { 
    if(!(data["edges"][i]["rel"]["label"] in token1))
     token1[data["edges"][i]["rel"]["label"]] = data["edges"][i]["end"]["label"];
     
     else if(data["edges"][i]["rel"]["label"] in token1)
     {
       x++;
       data["edges"][i]["rel"]["label"] += x.toString();
       token1[data["edges"][i]["rel"]["label"]] = data["edges"][i]["end"]["label"];
     }
  }
  return token1;
  
 
  c++;

}


//makes the stories variable a complete string.
function preAnalysis()
{
  stories = stories.join(" ");
  stories = stories.toLowerCase();
}

//makes an array of unique words from a string
function tokenise(sentence)
{
  var toks = new Array();
  wordArray = RiTa.tokenize(sentence);
  
  for(term in wordArray )
  {
    if((wordArray[term] in toks))
    ;
    else
    {
      //var w = wordArray[term].toLowerCase();
      //toks.push(w);
    toks.push(wordArray[term]);
    }
  }
  toks = toks.filter(function(elem, index, self) {
    return index == self.indexOf(elem);
})
  return toks;
}


//FUNCTION TO CREATE VOCUBULARY
function vocubularise(stuff)
//takes as input an array of words
//returns as output an array of tokens.
{
  var vocab;
  var data;
  for(term in stuff)
  {
    var word = stuff[term];
    var url = "http://api.conceptnet.io/c/en/"+word;
    loadJSON(url,getData);
   
   
}

}

//FUNCTION TO CREATE VOCUBULARY
function InputVocubularise(inputStuff)
//takes as input an array of words
//returns as output an array of tokens.
{
  var vocab;
  var data;
  for(term in inputStuff)
  {
    var word = inputStuff[term];
    var url = "http://api.conceptnet.io/c/en/"+word;
    loadJSON(url,getData2);
   
}



}
//Given two NOUN tokens v and w, calculate how similar they are.
function similarityScoreNoun(v,w)
{
  var score = 0;
  if(v["label"] == w["label"])
  ;
  else
  {
    vkeys = v.keys();
    wkeys = w.keys();
    for(var t in vkeys)
    {
      for(var x in wkeys )
      {
        if(wkeys[x] == vkeys[t])
        {
          if(v[vkeys[t]] == w[wkeys[x]])
          score++;
        }
      }
    }
  }
  return score;
}

function createGrammar()
{
  
   
    //rg.addRule("<start>","Once upon a time, there was a <pN>. <Personal Pronoun> <V> of a <N>.| In a land far far away , there lived a <pN>. <Personal Pronoun> <V> <N>");
     rg.addRule("<start>",rule1);
    rg.addRule("<nn>",rule2);
    
    rg.addRule("<nn>",rule3);
    rg.addRule("<vbz>",rule4);
    rg.addRule("<prp>",rule5)
    
    
}



function testJSONLD()
{
  var data1 ;
  data1 = loadJSON(url,getData);
 
 // console.log(data1.view["@id"]);
  
  /*
  var entries = 20;
 var offset = 20;
 var count = 0;
 if("nextPage" in data["view"])
 {
   count++;
   console.log(count);
   url = url+"?offset="+offset+"&limit="+entries;
   data =loadJSON(url,getData);
   offset+=20;
}
 if("nextPage" in data["view"])
 {
   count++;
   console.log(count);
   url = url+"?offset="+offset+"&limit="+entries;
   data =loadJSON(url,getData);
   offset+=20;
}
 if("nextPage" in data["view"])
 {
   count++;
   console.log(count);
   url = url+"?offset="+offset+"&limit="+entries;
   data = loadJSON(url,getData);
   offset+=20;
  
}
*/ 

}



//UTILITY FUNCTIONS

function analyse()
{
  ri = new RiLexicon();
   var rs = new RiString("Thou had a cat. I had a dog");
   rs.analyze();
   console.log(rs.get(RiTa.POS));
   var words = RiTa.tokenize(stories)
    for (var i=0, j = words.length; i<j; i++) {
        text(words[i], 50, 50 + i*20);
    }
    
    
}


function conceptAnalyse()
{
  
}

function createSentence()
{
  
}

/*
function reportingDialgues()
{
  var temp = stories;
  var dialogues = new Array();
  for(literal in temp)
  {
    if(literal ==='\"')
    {
      while()
    }
  }
  console.log(dialogues[0]);
  
}
*/
//FUNCTION TO TOKENISE A STRING















/*
//RETURNING ELEMEMTS UNIQUELY FROM AN ARRAY
var unique = arr.filter(function(elem, index, self) {
    return index == self.indexOf(elem);
})



 // loadJSON("http://api.conceptnet.io/c/en/cinderella",getData);
*/
