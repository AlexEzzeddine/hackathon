var map;
var request_markers = [];

client = Rapid.createClient("NDA1OWE0MWo1b3AzYzA3LnJhcGlkLmlv")


function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

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
	client.collection('food_requests')
	.subscribe((requests, changes) => {
		changes.all.forEach(request => {
			image = new Image();
			image.width = "32";
			image.src = request.body.image
			var myMarker = new CustomMarker(request.body.pos, map, image);
		})
  	})
}


function placeFoodRequest() {
	navigator.geolocation.getCurrentPosition(function(position) {
		client
		.collection("users")
		.document(getCookie("username"))
		.fetch(user =>
		{
			console.log(user);
    		client
			.collection('food_requests')
			.newDocument() // generate the id of a new document automatically
			.mutate({
				name: $("#request-name").val(),
				time: $("#request-time").val(),
				food: $("#request-food").val(),
				image: user.body.image,
				pos: {
					lat: position.coords.latitude,
					lng: position.coords.longitude
				}
			})
			.then(() => {
				$(".collapse").collapse('toggle')
			})
		})
	})
};

window.onresize = function() {
	moveToCurLoc();
}


$(function(){
	$("#request-submit").click(placeFoodRequest);
})