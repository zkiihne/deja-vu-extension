console.log("Google page loaded, looking for matches");

// filter for elements with links to annotate 
let linkClassNames = ['yuRUbf', "wrBvFf OSrXXb", "usJj9c"];
let matches = [];
for(i = 0; i < linkClassNames.length; i++){
  nameMatches = document.getElementsByClassName(linkClassNames[i]);
  matches.push.apply(matches, nameMatches);
}

// kick off the method to annotate links
getStamps(matches)
.then(() => {console.log("done everything")});

// method to annotate a list of both valid/invalid links
async function getStamps(matches){
  let validMatches = [];
  for(var i = 0; i < matches.length; i++){
    let div = matches[i];
    let link = div.children[0].href;
    if(link == undefined){
      try{

        link = div.children[0].children[0].href;
      }
      catch{
        // if link is not valid
        link = "";
      }
    }
    if(link != ""){
      // get the timestamp and add to valid matches
      await chrome.storage.sync.get(link)
      .then((result) => {    
        let stamp = result[link];
        console.log("link " + link + " result " + stamp);
        if(stamp != undefined){
          validMatches.push([stamp, div]);
        }
      })
    }
  }
  let sortedMatches = validMatches.sort( (a, b) => {return b[0] - a[0]}); // -> most recent first
  //  sortedMatches = sortedMatches.sort( (a, b) => {return a[0] - b[0]}); -> least recent first

  // annotate the links with the timestamp and count
  let count = 1;
  let prev = 0;
  for(var i = 0; i < sortedMatches.length; i++){
    let stamp = sortedMatches[i][0];
    if(stamp == prev){
      count--;
    }
    let div = sortedMatches[i][1];
    console.log("s " + stamp + " c " + count)
    swapDiv(div, stamp, count)
    count++;
    prev = stamp;
  }
  // annotate the topbar with the total already visited
  addTotal(count-1);
}


// method to add timestamp and count to element
function swapDiv(div, stamp, order){
    console.log("count" + order);
    div.append(makeElement(stamp, order));
}

// method to create element with timestamp and count 
function makeElement(stamp, order){
  let newElement = document.createElement('div');
  newElement.classList.add('deja-vu-bold');
  let stampstring = getTimeObject(stamp);
  stampstring += " | #" + order
  newElement.textContent = stampstring
  return newElement;
}

// method to prettify timestamp
function getTimeObject(stamp){
  var date = new Date(stamp);
  let difference = (Date.now() - date.getTime());
  let days = Math.floor(difference / (1000 * 60 * 60 * 24));
  let hours = Math.floor(difference % (1000 * 60 * 60 * 24)  / (1000 * 60 * 60));
  let minutes = Math.floor(difference % (1000 * 60 * 60)  / (1000 * 60));
  let returnString = " \u27F2 ";
  if(days > 0){returnString += "" + days + "d"}
  if(hours > 0){returnString += "" + hours + "h"}
  else if(days > 0 && minutes > 0){returnString += "0h"}
  if(minutes > 0){returnString += "" + minutes + "m"}
  returnString += ""
  console.log(returnString);
  return returnString;
}

// method to add total visited to top bar
function addTotal(total){
  let resultElement = document.getElementById("result-stats");
  let newElement = document.createElement('div');
  newElement.classList.add('deja-vu');
  newElement.textContent = " " + total + " already visited";
  resultElement.append(newElement);
}




