// Variables:
var lat;
var lon;
var unit = 'metric'; // default unit
var time = Date.now() / 1000; // in seconds = milliseconds -> /1000

// Functions:
// Get Coordinates and call showWeather()
function returnPosition( position ) {
  lat = position.coords.latitude;
  lon = position.coords.longitude;
  showWeather();
}
function returnPositionVaiIp( coords ) {
  lat = coords.latitude;
  lon = coords.longitude;
  showWeather();
}

// Assign value to unit according to state of input-checkbox and call showWeather():
function switchUnit() {
  if ($(this).is(':checked')) {
    unit = 'imperial';
  } else {
    unit = 'metric';
  }
  showWeather();
}

// Show local weather:
function showWeather( position ) {
  var weatherURL = 'http://api.openweathermap.org/data/2.5/weather?lat='+ lat + '&lon=' + lon + '&units=' + unit + '&APPID=ae44e8d67a569c6b8064d639567e8cec';

  $.getJSON(weatherURL, function( result ) {

    // LOCATION NAME:
    // Get location name and write to '.location'
    var city = result.name;
    $('.location p').text(city);

    // SHOW WEATHER ICON & CHANGE BACKGROUND COLOUR:
    // Get weather condition id, sunrise time, sunset time, current time
    var weatherId = result.weather[0].id;
    var sunrise = result.sys.sunrise; // in seconds
    var sunset = result.sys.sunset; // in seconds


    // Weather icon:
    var icon; // icon = prefix + weatherId
    var prefix = 'wi wi-owm-';
    var weatherColourCode;
    // Change icon prefix according to daytime:
    if (sunrise < time && sunset > time) {
      prefix = prefix + 'day-';
      weatherColourCode = 'day';
    } else {
      prefix = prefix + 'night-';
      weatherColourCode = 'night';
    }
    icon = prefix + weatherId;
    // Add icon class to <i>:
    $('.weather-icon i').attr('class', icon);

    // Change background-color:
    // Get colour code with one digit from weatherId
    console.log(weatherColourCode);
    var weatherColour; // HEX colour
    var weatherBgColour; // HEX colour
    // Change Colours according to daytime:
    switch (weatherColourCode) {
      case 'day':
        weatherColour = '#FDD835';
        weatherBgColour = '#FBC02D';
        break;
      case 'night':
        weatherColour = '#4A2D68';
        weatherBgColour = '#38224E';
        break;
      default:
        weatherColour = '#AD1457';
        weatherBgColour = '#880E4F';
        break;
    }
    // Change font color on .current container:
    $('body').css('background-color', weatherBgColour);
    $('.current').css('background-color', weatherColour);

    // SHOW WEATHER CONDITIONS:
    // Get weather condition description & write it to .weather-status
    var weatherStatus = result.weather[0].description;
    $('.weather-status p').text(weatherStatus);

    // SHOW TEMPERATURE WITH UNIT:
    // Get current temperature without decimals
    var temp = Math.floor(result.main.temp);

    // Write temp to .temperature:
    $('.degrees').html(temp + '&#176;');

  });
  getForecast();
}

$(document).ready(function(){
  navigator.geolocation.getCurrentPosition(function( position ) {
    returnPosition( position );
  },
  function(failure) {
    $.getJSON('http://ipinfo.io', function( response ) {
      var loc = response.loc.split(',');
      var coords = {
        latitude: loc[0],
        longitude: loc[1]
      };
      returnPositionVaiIp( coords );
    })
  });

  $('input[type=checkbox]').on('click', switchUnit);
  $('input[type=checkbox]').on('click', emptyContainers);
  $(window).resize(screenSizeDetection);
});
