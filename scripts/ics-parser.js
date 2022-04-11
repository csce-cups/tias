const fs = require("fs")
let inFile = "testics.ics"
let icsdata = fs.readFileSync(inFile).toString().split("\n");

//ASSUMPTIONS:
    //EVERY event has the same number of lines
    //every invalid event is marked by the RRULE line having '=' at the end of the line
    //the header is always 5 lines
let line = 5;
let dayLine = -1;
let startLine = -1;
let endLine = -1
let len = 1;
let temp;
let r = false;
while((temp=icsdata[line+len].split(':'))[0]!='END'){
    if(icsdata[line+len].charAt(icsdata[line+len].length-1)==='\r'){
        r=true;
    }
    if(temp[0]==='RRULE'){
        dayLine=len;
    }else if(temp[0]==='DTSTART'){
        startLine=len;
    }else if(temp[0]==='DTEND'){
        endLine=len;
    }
    len++;
}
len++; //for the END line
if(r){
    icsdata = fs.readFileSync(inFile).toString().split("\r\n");
}
let data = []
while(line<icsdata.length-1){
    let byday = icsdata[line+dayLine]
    let start = icsdata[line+startLine];
    let end = icsdata[line+endLine];
    let lastchr = byday.charAt(byday.length-1);
    if(lastchr!=='='){ //then this is a good event
        let days = byday.split('=')
        let event = {
            DTSTART: start.split(':')[1],
            DTEND: end.split(':')[1],
            BYDAY: days[days.length-1]
        }
        data.push(event)
    }
    line+=len;
}
console.log(data)