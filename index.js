/**
 * @author hakimhassani97
 * a simple page that uses openwathermap and leafletjs to show weather data
 */
const API_URL='https://api.openweathermap.org/data/2.5/forecast'///daily'
const API_KEY='001b0f58045147663b1ea518d34d88b4'
const card=`
<div class="card" style="background-color:$color;">
    <img src="http://openweathermap.org/img/wn/$img@2x.png">
    <div style="display: flex;flex-direction: row;width: 100%;align-content: space-around;">
        <div style="flex: 1;">$date</div>
        <div style="flex: 1;">$temp</div>
    </div>
</div>
`

var weatherData;
var btn=$('#search')
var btnGps=$('#searchGps')
var input=$('#city')
var list=$('#list')
var currentInfo=`
<img src="http://openweathermap.org/img/wn/$img@2x.png">
<div style="display: flex;flex-direction: row;width: 100%;align-content: space-around;">
    <div style="flex: 1;">$date</div>
    <div style="flex: 1;">$temp</div>
</div>
`

btn.on('click',()=>{
    var city=input.val()
    if(city.trim()!=''){
        getWeatherForCity(city)
    }else{
        alert('please enter a city')
    }
})

btnGps.on('click',()=>{
    getLocation((position)=>{
        // console.log(position.coords)
        getWeatherForCity('&lat='+position.coords.latitude+'&lon='+position.coords.longitude)
    })
})
const getWeatherForCity=(city)=>{
    //add loading
    $('#cityTitle').html('<div class="lds-facebook"><div></div><div></div><div></div>')
    // clear list
    list.html('')
    $.ajax({
        url: API_URL+'?q='+city+'&APPID='+API_KEY+'&cnt=1000&units=metric',
        dataType: 'JSON',
        success: (data)=>{
            var dates=data.list
            // console.log(data)
            fillFiveDaysGrid(dates)
            $('#cityTitle').html(data.city.name)
            initMap(data.city.coord.lat,data.city.coord.lon)
        },
        error:(err)=>{
            if(err.responseJSON.message) $('#cityTitle').html(err.responseJSON.message)
            // if(err.responseJSON.message) alert(err.responseJSON.message)
        },
    });
}
const fillFiveDaysGrid=(dates)=>{
    var old=''
    for(var i=0;i<dates.length;i++){
        var date=dates[i]
        // console.log(date)
        var time=new Date(date.dt_txt).toLocaleDateString()
        // if(time!=old){
        var diffInHours=Math.abs(new Date()-new Date(date.dt_txt))/(3600000)
        var diffInHoursToday=diffInHours%24
        if(diffInHoursToday<3){
            var newCard=card
            newCard=newCard.replace('$img',date.weather[0].icon)
            newCard=newCard.replace('$color',diffInHours<24 ? '#555' : '')
            newCard=newCard.replace('$date',new Date(date.dt_txt).toLocaleDateString())
            newCard=newCard.replace('$temp',date.main.temp+' C°')
            list.append(newCard)
            old=time
        }
        if(i==0){
            currentInfo=`
            <img src="http://openweathermap.org/img/wn/$img@2x.png">
            <div style="display: flex;flex-direction: row;width: 100%;align-content: space-around;">
                <div style="flex: 1;">$date / $temp</div>
            </div>
            `
            currentInfo=currentInfo.replace('$img',date.weather[0].icon)
            currentInfo=currentInfo.replace('$color',diffInHours<24 ? '#555' : '')
            currentInfo=currentInfo.replace('$date',new Date(date.dt_txt).toLocaleDateString())
            currentInfo=currentInfo.replace('$temp',date.main.temp+' C°')
        }
    }
}
// gps handling
const getLocation=(handler)=>{
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(handler);
    } else {
        x.innerHTML = "Geolocation is not supported by this browser.";
    }
}
// map handling
var map = L.map('map').setView([36.7525, 3.042], 11.5);
$(document).ready(()=>{
    initMap(36.7525, 3.042)
})
const initMap=(lat, lon)=>{
    map.setView([lat, lon]);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    drawDataOnMap(lat, lon)
    map.on('click', onMapClick);
}
const drawDataOnMap=(lat, lon)=>{
    var greenIcon = L.icon({
        iconUrl: 'gps.png',
        // shadowUrl: 'leaf-shadow.png',
        iconSize: [38, 95],
        shadowSize: [50, 64],
        iconAnchor: [22, 94],
        shadowAnchor: [4, 62],
        popupAnchor: [-3, -76]
    });
    $('.leaflet-marker-pane').html('')
    var c=L.marker([lat, lon], {icon: greenIcon})
    c.addTo(map);
    c.bindPopup(currentInfo);
}
const onMapClick=(e)=>{
    getWeatherForCity('&lat='+e.latlng.lat+'&lon='+e.latlng.lng)
}

// tab functions
const openView=(evt, tab)=>{
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(tab).style.display = "block";
    if(evt==null){
        evt=document.getElementsByClassName('tablinks')[0].classList.add('active')
    }else{
        evt.currentTarget.className += " active";
    }
}
$(document).ready(()=>{
    openView(null,'infoTab')
})