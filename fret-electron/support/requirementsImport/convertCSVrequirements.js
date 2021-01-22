const csv2json=require("csvtojson");
const fs=require("fs");

let path = "../../../research/requirements/Applications/VIPER/"
let fileInputName = 'ViperReqsDimitra.csv';
let fileOutputName = 'ViperFret.json';
var projectName = 'VIPER-L3L4s';
var fretreqs = [];
var fake = false;
if (fake) fileOutputName = "fake" + fileOutputName;


// change so that everything goes to rationale by default except what is in map
const translate = new Map([
  ['reqid', 'Requirement ID'],
  ['fulltext', 'Description']
]);

csv2json().fromFile(path+fileInputName).then(manipulate).catch(err => {
        // log error if any
        console.log(err);
    });

function createFretObject(name) {
  return {project: name, reqid: "", fulltext: "", rationale: ""};
}

function manipulate(viperReqs) {
  var viperFields = Object.keys(viperReqs[0]);

  var count = 1;
  for (req of viperReqs) {
      if (count > 200) break;
      var newFretReq = createFretObject(projectName);

      for (var field of ['reqid', 'fulltext']) {
        var mapsTo = translate.get(field);
        if (mapsTo)
          newFretReq[field] = (fake) ? `REQ${count}`: req[mapsTo];
      }
      // all fields except for reqId go to Rationale
      var correspondsTo = 'rationale';
      for (key of viperFields) {
        if (key == translate.get('reqid')) continue; // we don't want this added again
        if (req[key]) {
          newFretReq[correspondsTo] += (`\n${key}: `.toUpperCase());
          if (!fake)
            newFretReq[correspondsTo] += (req[key]);
          else
            newFretReq[correspondsTo] += `Fake ${key}.`;
        }
      }

      console.log(newFretReq);
      fretreqs.push(newFretReq);
      count++;
  }

  // now save fretreqs to a json file for fret to import
  fs.writeFile(path+fileOutputName, JSON.stringify(fretreqs, null, 4), (err) => {
    if (err) {
        console.log("An error occured while writing JSON Object to File.");
        return console.log(err);
    }

    console.log("JSON file has been saved.");
});


}



// sometimes the text we get has invalid JSON
function cleanup (req) {
  // preserve newlines, etc - use valid JSON
//req = req.replace(/\\n/g, "\\n")
               // .replace(/\\'/g, "\\'")
               // .replace(/\\"/g, '\\"')
               // .replace(/\\&/g, "\\&")
               // .replace(/\\r/g, "\\r")
               // .replace(/\\t/g, "\\t")
               // .replace(/\\b/g, "\\b")
               // .replace(/\\f/g, "\\f");
// remove non-printable and other non-valid JSON chars
req = req.replace(/\"/g,"*");
req = req.replace(/[\u0000-\u0019]+/g,"");
return req;
}
