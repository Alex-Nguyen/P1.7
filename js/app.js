var HCIG7 ={};
!function(e) {
   
    e.init = function () {
        e.vinhProfile = {
            webCamParameter: {
                width:windowWidth,
                height:windowHeight
            },
            clockPosition:{
                x:windowWidth/2,
                y:windowHeight/2
            },
            weatherParameters:{
                url:"api.openweathermap.org/data/2.5/weather?zip=79415,us&APPID=110d9b8e28093bca1255c95aa342c445",
                iconurl:"http://openweathermap.org/img/wn/${url.weather[0].icon}@2x.png"
            }
        }

    }
}(HCIG7 || (HCIG7 = {}));

function preload() {
    HCIG7.init();
}
function setup() {

}
function draw() {

}