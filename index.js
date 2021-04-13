const express = require('express');
const app = express();

const webserver = app.listen(5005, '127.0.0.1', function () {
    console.log('Node web server loaded and listening');
});

var scraper = require('table-scraper');

var data;
//var total_km=0;
//var total_participants=0;

async function scrap() {
    return scraper
  .get('https://prod.chronorace.be/VirtualChallenge/1000Bornes/Challenge1000Bornes.aspx?chal=38&eventId=1188112508252308&lng=FR&hash=OmflMELzaVp8kaSo8DR7O2rODtE#allClubs')
  .then(function(tableData) {
      //console.log(tableData);
    //total_km=0;
    //total_participants=0;
    data = tableData[0];
    //data.shift();
    //console.log(total_km);
    data.forEach(people => {
  
        //console.log(people['Distance'].slice(0,-2));
        //people["4"] = people["4"].slice(0, -2);
        //people["5"] = people["5"].slice(0, -2);
        //total_km = total_km + (people["4"]=='' ? 0.0 : parseFloat(people["4"]));
        //total_participants = total_participants + (people["3"]=='' ? 0 : 1);
    
        people['Distance'] = people['Distance'].slice(0, -2);
        people['Actifs'] = people['Actifs/Inscrits'].split("/")[0];
        people['Inscrits'] = people['Actifs/Inscrits'].split("/")[1];
        people['MPA'] = parseFloat((Math.round(people['Distance'] / people['Actifs'] * 100) / 100).toFixed(2)); 
        people['MPI'] = parseFloat((Math.round(people['Distance'] / people['Inscrits'] * 100) / 100).toFixed(2)); 
        
    });
    //console.log(total_km);
    //console.log(total_participants);
    console.log("Scrapped");
  })
  .catch(function (error) {
      console.log(error);
  });
}

scrap();
setInterval(scrap, 300000);


app.get('/data-all', function (req, res) {
    var dataToSend = {data : data};
    res.send(dataToSend);
});

app.use(express.static('public'));