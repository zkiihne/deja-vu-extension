// load history into sync.storage
getAllStorageData().then(console.log("loaded"));


// method to load visited sites into storage
function getAllStorageData(){
  return new Promise((resolve, reject) => {
    // get the last timestamp, default to a year ago
    let millisecondsPerYear = 1000 * 60 * 60 * 24 * 7 * 52; 
    let oneYearAgo = new Date().getTime() - millisecondsPerYear;
    let lastTimeStampUpdated = oneYearAgo;
    chrome.storage.sync.get("lastTimeStampUpdated")
    .then((result) => 
    { if(result != undefined){
      lastTimeStampUpdated = result;
    }})

    // update the last timestamp
    chrome.storage.sync.set({"lastTimeStampUpdated": new Date().getTime()});

    // load from history into storage
    chrome.history.search({'text':'', 'startTime': lastTimeStampUpdated, 'maxResults': 1000})
    .then((historyItems)=>{
      for(const item of historyItems){
        let url = item.url.toString();
        let time = item.lastVisitTime;
        console.log(url + ":" + time);
        chrome.storage.sync.set({[url]:time});
      }
    })
    .then(()=>{resolve();})
  })
}

