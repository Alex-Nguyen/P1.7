var HCIG7 ={};
var currentProfile;
var btnBrighness
let slider;
var canvas;
let sliderVisible = false;
var webcam;
!function(e) {
    let t = Backbone.Model.extend({
        init:function () {
            if(!this.get('isInitialized')){
                this.set('isInitialized',true)
                this.set('canvasWidth',window.innerWidth);
                this.set('canvasHeight',window.innerHeight);
                this.loadIcon  = this.loadIcon.bind(this)
                this.weatherData = loadJSON("http://api.openweathermap.org/data/2.5/weather?zip=79415,us&APPID=110d9b8e28093bca1255c95aa342c445&units=metric", this.loadIcon);
                this.weatherData.mainX = 350;
                this.weatherData.mainY = 20;
                const myDays=
                    ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
                this.months = [`January`, `February`, `March`, `April`, `May`, `June`, `July`, `August`, `September`, `October`, `November`, `December`];
                let td = new Date();
                let today = td.getDay()
                this.today = myDays[today];
                this.name = 'Vinh Nguyen';
                this.connectToGoogleAccount();

                currentProfile = this;
            }

        },
        connectToGoogleAccount:function(){
            let that = this;
            jQuery.loadScript = function (url, callback) {
                jQuery.ajax({
                    url: url,
                    dataType: 'script',
                    success: callback,
                    async: true
                });
            }
            $.loadScript('https://apis.google.com/js/api.js', function(){
                gapi.load('client:auth2', function () {
                    gapi.client.init({
                        apiKey: "AIzaSyCtJzTr3KTtbMPC3Aa9uCOOsKnw5Zw44rg",
                        clientId: '470126462623-4fuglh8aupd7q6i815vs60q3u6ebl7rj.apps.googleusercontent.com',
                        discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"],
                        scope: "https://www.googleapis.com/auth/calendar.readonly"
                    }).then(function () {
                        // Listen for sign-in state changes.
                        let authorizeButton = document.getElementById('authorize_button');
                        let signoutButton = document.getElementById('signout_button');
                        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

                        // Handle the initial sign-in state.
                        updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
                        authorizeButton.onclick = handleAuthClick;
                        signoutButton.onclick = handleSignoutClick;
                    }, function(error) {
                        appendPre(JSON.stringify(error, null, 2));
                    });
                });
            });
            function listUpcomingEvents() {
                that.eventList = [];

                gapi.client.calendar.events.list({
                    'calendarId': 'primary',
                    'timeMin': (new Date()).toISOString(),
                    'showDeleted': false,
                    'singleEvents': true,
                    'maxResults': 10,
                    'orderBy': 'startTime'
                }).then(function(response) {
                    var events = response.result.items;
                    if (events.length > 0) {
                        for (i = 0; i < events.length; i++) {
                            var event = events[i];

                            var when =  event.start.dateTime.slice(11,16)+'-'+event.end.dateTime.slice(11,16);
                            if (!when) {
                                when = event.start.date;
                            }

                            that.eventList.push(event.summary + ' (' + when + ')')
                        }
                    }
                });
            }
            function handleSignoutClick(event) {
                gapi.auth2.getAuthInstance().signOut();
                let step = document.getElementById('step')
                step.style.display = 'none'
                let sleep = document.getElementById('sleep')
                sleep.style.display = 'none'
                let twitter = document.getElementById('twitter-widget-0');
                if(twitter) twitter.style.display = 'none';
                currentProfile = null;
            }
            function updateSigninStatus(isSignedIn) {
                let authorizeButton = document.getElementById('authorize_button');
                let signoutButton = document.getElementById('signout_button');
                if (isSignedIn) {

                    authorizeButton.style.display = 'none';
                    signoutButton.style.display = 'block';
                    let twitter = document.getElementById('twitter-widget-0');
                    if(twitter) twitter.style.display = 'inline';

                    let step = document.getElementById('step')
                    step.style.display = 'inline'
                    let sleep = document.getElementById('sleep')
                    sleep.style.display = 'inline'
                   listUpcomingEvents();
                } else {
                    authorizeButton.style.display = 'block';
                    signoutButton.style.display = 'none';
                }
            }
            function handleAuthClick(event) {
                let step = document.getElementById('step')
                step.style.display = 'inline'
                let sleep = document.getElementById('sleep')
                sleep.style.display = 'inline'
                let twitter = document.getElementById('twitter-widget-0');
                if(twitter) twitter.style.display = 'inline';
                gapi.auth2.getAuthInstance().signIn();

                currentProfile = that;
            }
        },
        loadIcon:function(){


            this.weatherIcon = loadImage(`http://openweathermap.org/img/wn/${this.weatherData.weather[0].icon}@2x.png`);
            this.weatherIcon.x =75;
            this.weatherIcon.y = 75;
        },
        _onRAF:function () {
           // console.log("Hello world")
        }
    });
    e.vinhProfile = new t()
}(HCIG7 || (HCIG7 = {}));

!function(e) {
    let t = Backbone.Model.extend({
        init:function () {
            HCIG7.vinhProfile.init();
            // this.loadFaceAPI();
        },
        loadFaceAPI:async function() {
            await faceapi.loadMtcnnModel('model/')
            await faceapi.loadFaceRecognitionModel('model/')
            let minConfidence = 0.5
            await faceapi.loadFaceLandmarkModel('model/')
            await faceapi.loadSsdMobilenetv1Model('model/')
            this.runDetection();
        },
        runDetection: async function(){
            console.log("Running detection....")
            const mtcnnForwardParams = {
                // limiting the search space to larger faces for webcam detection
                minFaceSize: 100
            };
            this.options = new faceapi.MtcnnOptions(mtcnnForwardParams)

            this.on('faceDetection', this.onDetection)
        },
        onDetection: async function () {
            let inputVideo = document.getElementById('inputVideo');
            const labels = ['vinhProfile']
            let fullFaceDescriptions = await faceapi.detectAllFaces(inputVideo, this.options).withFaceLandmarks().withFaceDescriptors()
            let labeledFaceDescriptors = await Promise.all(
                labels.map(async label => {

                    const imgUrl = `images/${label}.png`
                    const img = await faceapi.fetchImage(imgUrl)

                    // detect the face with the highest score in the image and compute it's landmarks and face descriptor
                    const fullFaceDescription = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor()

                    if (!fullFaceDescription) {
                        throw new Error(`no faces detected for ${label}`)
                    }

                    const faceDescriptors = [fullFaceDescription.descriptor]
                    return new faceapi.LabeledFaceDescriptors(label, faceDescriptors)
                })
            )
            const maxDescriptorDistance = 0.6;
            const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, maxDescriptorDistance)

            const results = fullFaceDescriptions.map(fd => faceMatcher.findBestMatch(fd.descriptor))
            for(let i =0; i<results.length;i++){
                if(results[i]._label==='vinhProfile'){
                    HCIG7[results[i]._label].init();
                    this.off('faceDetection', this.onDetection)
                    return null;
                }
            }
        }
    });
    e.globalSpace = new t()
}(HCIG7 || (HCIG7 = {}));
function preload() {
    HCIG7.globalSpace.init();
    // currentProfile =  HCIG7.vinhProfile;
    // currentProfile.init();

}
function setup() {
    canvas = createCanvas(windowWidth, windowHeight);
    btnBrighness = createButton('Brighness')
    btnBrighness.position(19, height-60)
    btnBrighness.style("background-color","#000");
    btnBrighness.style("color","#fff");
    btnBrighness.size(100,40)
    btnBrighness.mousePressed(btnBrighnessMousePressed)
    slider = createSlider(0, 255, 200);
    slider.position(19, height-90);
    slider.style('width', '100px');
    slider.hide()
    webcam = createCapture(VIDEO);
    webcam.id('inputVideo')
    webcam.loop();
    webcam.hide();
    canvas.position(0, 0);
}

function btnBrighnessMousePressed() {

    sliderVisible = !sliderVisible;
    sliderVisible===true? slider.show():slider.hide()
    let c = sliderVisible ===true?"#00f":"#000";
    btnBrighness.style("background-color",c);
    btnBrighness.style("color","#fff");
}
function draw() {
    let val = slider.value();
    tint( val); // Display at half opacity
    image(webcam, 0, 0, width, height);
    HCIG7.globalSpace.trigger('faceDetection', deltaTime)
    if(currentProfile){
        if(currentProfile.weatherData.main){
            if(currentProfile.weatherIcon){
                image(currentProfile.weatherIcon, currentProfile.weatherData.mainX -100, 0, currentProfile.weatherIcon.x, currentProfile.weatherIcon.y);
            }
            textSize(18);
            text(currentProfile.weatherData.main.temp +"°", currentProfile.weatherData.mainX, currentProfile.weatherData.mainY);
            fill(255);
            textSize(12);
            textStyle(BOLD);
            fill(255,255,0)
            text('C', currentProfile.weatherData.mainX + 70, currentProfile.weatherData.mainY-3);

            textStyle(NORMAL);
            fill(255);
            text(' | F', currentProfile.weatherData.mainX + 80, currentProfile.weatherData.mainY-3);
            fill(255);
            textSize(12);
            text(`${currentProfile.weatherData.main.temp_max}° / ${currentProfile.weatherData.main.temp_min}°`, currentProfile.weatherData.mainX + 10, currentProfile.weatherData.mainY + 15);
            fill(255);
            text(`Humidity: ${currentProfile.weatherData.main.humidity}%`, currentProfile.weatherData.mainX + 10, currentProfile.weatherData.mainY + 30);

            textSize(30);
            text(`${hour()}:${minute()}`, width/2, 20);
            fill(255);
            textSize(12);
            textAlign(CENTER, TOP);

            text(`${currentProfile.today}, ${currentProfile.months[month()-1]}, ${year()} `, width/2, 50);
            fill(255);

            textSize(16);

            text(`Hello: ${currentProfile.name}`, width-150, 10);
            fill(255);

            if(currentProfile.eventList){
                textSize(14);
                text(`Upcomming Events`, width-100, 180);
                fill(255);
                currentProfile.eventList.forEach((evt,i)=>{
                    textSize(12);
                    text(`${evt} `, width-100, 200+i*15);
                    fill(255);
                })
            }
        }
        // Weather section

        // End of weather section

    }
}