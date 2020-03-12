const API_URL=''
const API_KEY='001b0f58045147663b1ea518d34d88b4'

var parsedData;
var btn=$('#search')
var input=$('#city')

btn.on('click',()=>{
    var city=input.val()
    if(city.trim()!='')
        getWeatherForCity(city)
    else
        alert('please enter a city')
})

const getWeatherForCity=(city)=>{
    $.ajax({
        url: 'https://api.openweathermap.org/data/2.5/forecast/daily?q='+city+'&APPID='+API_KEY+'&cnt=10&units=metric',
        dataType: 'JSON',
        success: (data)=>{
            parsedData=data
            data = JSON.stringify(data);
            // console.log(data)
        }
    });
}