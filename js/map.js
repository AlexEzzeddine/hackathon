var map;
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

window.onresize = function() {
	moveToCurLoc();
}

$('.collapse').collapse()
    $(".panel-collapse").on("hide.bs.collapse", function () {
        $(".panel-collapse-clickable").find('i').removeClass("glyphicon-chevron-up").addClass("glyphicon-chevron-down");
    });

    $(".panel-collapse").on("show.bs.collapse", function () {
        $(".panel-collapse-clickable").find('i').removeClass("glyphicon-chevron-down").addClass("glyphicon-chevron-up");
    });