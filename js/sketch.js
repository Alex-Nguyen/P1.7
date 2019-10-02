var canvas;
var webcam;
var weatherUrl;
var btnLogin;
let weatherData;
let icon;
var weatherObj = {
    "coord": {"lon": -101.86, "lat": 33.58},
    "weather": [{"id": 802, "main": "Clouds", "description": "scattered clouds", "icon": "03d"}],
    "base": "stations",
    "main": {"temp": 27, "pressure": 1013, "humidity": 57, "temp_min": 27, "temp_max": 29},
    "visibility": 16093,
    "wind": {"speed": 9.3, "deg": 180},
    "clouds": {"all": 40},
    "dt": 1569702752,
    "sys": {"type": 1, "id": 4670, "message": 0.0069, "country": "US", "sunrise": 1569674368, "sunset": 1569717403},
    "timezone": -18000,
    "id": 5525577,
    "name": "Lubbock",
    "cod": 200
};
var GoogleAPI = "AIzaSyCW2i68Srv4jQHcSHIbDQlkzT5cI4u1nG8";
var creator;

var CLIENT_ID = '470126462623-4fuglh8aupd7q6i815vs60q3u6ebl7rj.apps.googleusercontent.com';
var CLIENT_SECRET = 'DXzFiDHYhUHIUeaRZqpHEQJf';
var API_KEY = 'AIzaSyCtJzTr3KTtbMPC3Aa9uCOOsKnw5Zw44rg';
var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];
var SCOPES = "https://www.googleapis.com/auth/calendar.readonly";

var userProfile1 ={
    name:"Vinh Nguyen"
};
var today, curMonth;
var myDays=
    ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
const months = [`January`, `February`, `March`, `April`, `May`, `June`, `July`, `August`, `September`, `October`, `November`, `December`];
var authorizeButton = document.getElementById('authorize_button');
var signoutButton = document.getElementById('signout_button');
var eventList=[];
jQuery.loadScript = function (url, callback) {
    jQuery.ajax({
        url: url,
        dataType: 'script',
        success: callback,
        async: true
    });
}
function preload() {
    //weatherUrl = "api.openweathermap.org/data/2.5/weather?zip=94040,us&APPID=110d9b8e28093bca1255c95aa342c445";
    // weatherData = loadJSON(weatherUrl, loadIcon);
    weatherData = weatherObj;
    icon = loadImage(`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`);
    let td = new Date();
    today = td.getDay()
    today = myDays[today];
    $.loadScript('https://apis.google.com/js/api.js', function(){
        handleClientLoad();
    });
}

function loadIcon(wt) {
    icon = loadImage(`http://openweathermap.org/img/wn/${wt.weather[0].icon}@2x.png`);
}

function setup() {
    canvas = createCanvas(600, 480);
    webcam = createCapture(VIDEO);
    webcam.loop();
    webcam.hide();
    //Put canvas in center of window
    canvas.position(windowWidth / 2 - width / 2, windowHeight / 2 - height / 2);

    authorizeButton = createButton('Authorize');
    authorizeButton.mousePressed(handleAuthClick);

}
function handleSignoutClick(event) {
    gapi.auth2.getAuthInstance().signOut();
}

function listUpcomingEvents() {
    gapi.client.calendar.events.list({
        'calendarId': 'primary',
        'timeMin': (new Date()).toISOString(),
        'showDeleted': false,
        'singleEvents': true,
        'maxResults': 10,
        'orderBy': 'startTime'
    }).then(function(response) {
        var events = response.result.items;
        creator = response.result.summary;
        if (events.length > 0) {
            for (i = 0; i < events.length; i++) {
                var event = events[i];
                console.log(event)
                var when =  event.start.dateTime.slice(11,16)+'-'+event.end.dateTime.slice(11,16);
                if (!when) {
                    when = event.start.date;
                }
                eventList.push(event.summary + ' (' + when + ')')
            }
        }
    });
}
function handleClientLoad() {
    gapi.load('client:auth2', initClient);
}
function updateSigninStatus(isSignedIn) {
    if (isSignedIn) {
        authorizeButton.style.display = 'none';
        signoutButton.style.display = 'block';
        listUpcomingEvents();
    } else {
        authorizeButton.style.display = 'block';
        signoutButton.style.display = 'none';
    }
}
function handleAuthClick(event) {
    gapi.auth2.getAuthInstance().signIn();
}
function initClient() {
    gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES
    }).then(function () {
        // Listen for sign-in state changes.
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

        // Handle the initial sign-in state.
        updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
        authorizeButton.onclick = handleAuthClick;
        signoutButton.onclick = handleSignoutClick;
    }, function(error) {
        appendPre(JSON.stringify(error, null, 2));
    });
}
function draw() {

    background(220);
    image(webcam, 0, 0, width, height);
    image(icon, 0, 0, 75, 75);

    // Weather section
    textSize(18);
    text(weatherData.main.temp +"°", 80, 10);
    fill(255);
    textSize(12);
    textStyle(BOLD);
    fill(255,255,0)
    text('C', 120, 12);

    textStyle(NORMAL);
    fill(255);
    text(' | F', 130, 12);
    fill(255);
    textSize(12);
    text(`${weatherData.main.temp_max}° / ${weatherData.main.temp_min}°`, 90, 30);
    fill(255);
    text(`Humidity: ${weatherData.main.humidity}%`, 105, 45);
    // End of weather section

    //Time section
    textSize(30);
    text(`${hour()}:${minute()}`, width/2, 20);
    fill(255);
    textSize(12);
    textAlign(CENTER, TOP);
    text(`${today}, ${months[month()-1]}, ${year()} `, width/2, 50);
    fill(255);
    // End of time zone

    textSize(16);

    text(`Hello: ${creator}`, width-100, 10);
    fill(255);
    if(eventList.length !==0){
        textSize(14);
        text(`Upcomming Events`, width-80, 180);
        fill(255);
        eventList.forEach((evt,i)=>{
            textSize(12);
            text(`${evt} `, width-80, 200+i*15);
            fill(255);
        })
    }
}