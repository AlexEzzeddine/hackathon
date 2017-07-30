var map;
var request_markers = [];

client = Rapid.createClient("NDA1OWE0MWo1b3AzYzA3LnJhcGlkLmlv")

client.collection('food_requests')
	.subscribe((requests, changes) => {
		changes.added.forEach(request => {
			var myLatLng = new google.maps.LatLng(request.body.loc.lat, request.body.loc.lng);
			var myMarker = new CustomMarker(myLatLng,map);
	})
  })

function moveToCurLoc()
{
	var pos;
	var im = 'circle.png';
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position) {
			pos = {
				lat: position.coords.latitude,
				lng: position.coords.longitude
			}
			map.setCenter(pos);
			var userMarker = new google.maps.Marker({
				position: pos,
				map: map,
				icon: im
			});
		})
	}
}

function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
		zoom: 18,
		center: {lat: -34.397, lng: 150.644},
		disableDefaultUI: true
	});
	moveToCurLoc();
}


function placeFoodRequest(){
	navigator.geolocation.getCurrentPosition(function(position) {
    	client
			.collection('food_requests')
			.newDocument() // generate the id of a new document automatically
			.mutate({ // create a new to-do and assign it to John
				name: $("#request-name").val(),
				time: $("#request-time").val(),
				food: $("#request-food").val(),
				loc: {
					lat: position.coords.latitude,
					lng: position.coords.longitude
				}
			})
			.then(() => {
				$(".collapse").collapse('toggle');
				})
	})
}

window.onresize = function() {
	moveToCurLoc();
}


$(function(){ 
	$("#request-submit").click(placeFoodRequest);
})