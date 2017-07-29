function calculateCenter()
{
	
}

function initMap() {
				var pos;
				var im = 'circle.png';
				var map = new google.maps.Map(document.getElementById('map'), {
					zoom: 15,
					center: {lat: -34.397, lng: 150.644}
				});
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