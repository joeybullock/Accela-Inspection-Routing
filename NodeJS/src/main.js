//  Declare variables
var https = require("https");

//  API variables
console.log('running');
var API_URL = `https://apis.accela.com/v4/inspections?module=Building`;
var request = {};

//  Inspection detail variables
var recordId = [];
var inspectionType = [];
var scheduleDate = [];
var scheduledDateToShort = [];
var inspectionStatus = [];
var inspectorFullName = [];
var fullLineAddresses = [];
var mapsReadyAddresses = [];

//  Date variables
const today = new Date();
const yyyymmdd = today.getFullYear() + "-" + ("0" + (today.getMonth() + 1)).slice(-2) + "-" + ("0" + today.getDate()).slice(-2);

//  Google Maps variables
var mapsLink = `https://www.google.com/maps/dir/?api=1&origin=90+Mitchell+St+SW+Atlanta+GA&destination=98+Mitchell+St+SW+Atlanta+GA`;
var mapsReadyAddresses = '';

//  Set inspection search parameters
var startDate = '2018-05-01';
var endDate = '2018-07-31';
var inspectorId = 'JBULLOCK';

//  Clear contents before next search
function searchStart() {
    console.log('searchStart');
    recordId = [];
    inspectionType = [];
    scheduleDate = [];
    scheduledDateToShort = [];
    inspectionStatus = [];
    inspectorFullName = [];
    fullLineAddresses = [];
    API_URL = `https://apis.accela.com/v4/inspections?module=Building`;
    request = {};
}

//  MAIN FUNCTION : Create variables from form input, search API, display results, and display route
function formSubmitted() {
    var searchTerm = "&inspectorIds=" + inspectorId;
        startDate = "&scheduledDateFrom=" + startDate;
        endDate = "&scheduledDateTo=" + endDate;
    
    searchStart();
    search(searchTerm, startDate, endDate)
    .then(displayResults)
    .then(calcRoute);
}

//  Filter returned Accela API Array to only Scheduled or Rescheduled statuses
function filterResults(resultAll) {
    var scheduled = ["Scheduled"];
    var filteredArray = resultAll.result.filter(function(itm) {
        return scheduled.indexOf(itm.status.value) > -1;
    });
    return {result: filteredArray};
}

//  Call Accela API
function search(searchTerm, startDate, endDate) {
    API_URL = `${API_URL}${searchTerm}${startDate}${endDate}`;
    request = https.request(API_URL, {
        method: 'GET',
        headers: new Headers({
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'x-accela-appid': '636603438780966771',
            'Authorization': 'dka0rIlqvKz2tH4t33xEKACBuAEHYd1t-YlkjxdxFbAQTljNlbnNR-nu1kzRFUNmB7jCSY72rciYwsGJfw7FwZvspcn0b2ORZ55AE2niDKEY-xBoBWATSFSMdGyRxcMyOmbXXRa-MAc2XXv8IgxIvU3YDe9IgHx8N_JMhPHJWKKj8Qe4Sku2ZROxfjg4qYHsGWFUSBnhCTsIOUMb5HLp6Cz87vrFtikk8M6QYr6Vly0hdWv0gUOuTUUcI8IUoZvxFjcw549XIQLpSjcvZgaiNtJLGu2xGHo4wca2Th_tgkGvhXQlSZjdFihzwPVj5g86WQi6Sa_M34ztLC7_tBOiRUhDsS_ggQLMhEPm09P_yh57NO2_xU9_p8qxyMDB-ABuoH4W6WO2F1aVwBXe0iWmshVjKvxOOuJgACoO8X3Dzpo1'
        })
    });
    return fetch(request)
    .then(response => response.json())
    .then(resultAll => filterResults(resultAll))
    .then(result => {
        return result.result;
    });
}

//  Push Accela API results to variable arrays
function displayResults(returnResult) {
    returnResult.forEach(returnResultEach => {
        recordId.push(returnResultEach.recordId.customId);
        inspectionType.push(returnResultEach.type.value);
        scheduleDate = returnResultEach.scheduleDate.split("-");
        scheduledDateToShort.push(scheduleDate[1] + "/" + scheduleDate[2] + "/" + scheduleDate[0]);
        inspectionStatus.push(returnResultEach.status.value);
        inspectorFullName.push(returnResultEach.inspectorFullName);
        // Push address to variable to pass into Google Maps routing
        //fullLineAddresses.push(returnResultEach.address.streetStart + ' ' + returnResultEach.address.streetName + ' ' + returnResultEach.address.streetSuffix.text + ' ' + returnResultEach.address.streetSuffixDirection.text + ', ' + returnResultEach.address.city + ', ' + returnResultEach.address.state.text + ' ' + returnResultEach.address.postalCode);
        mapsReadyAddresses.push(returnResultEach.address.streetStart + '+' + returnResultEach.address.streetName + '+' + returnResultEach.address.streetSuffix.text + '+' + returnResultEach.address.streetSuffixDirection.text + '+' + returnResultEach.address.city + '+' + returnResultEach.address.state.text + '+' + returnResultEach.address.postalCode);
    })
return mapsReadyAddresses;
}

//  Call Google Maps API
function calcRoute(mapsReadyAddresses) {
    var addresses = mapsReadyAddresses;
    var waypoints = '';
    for (var i = 0; i < addresses.length; i++) {
        waypoints += addresses[i];
        if (addresses.length != i) waypoints += '|';
    }
    mapsLink = mapsLink + '&waypoints=' + waypoints;
    console.log(mapsLink);
}

formSubmitted();
/*function initialize() {
    directionsDisplay.setMap(map);
}

function mapLocation() {
    
    google.maps.event.addDomListener(window, 'load', initialize());
}*/