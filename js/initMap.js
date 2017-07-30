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

const client = Rapid.createClient('NDA1OWE0MWo1b3AzYzA3LnJhcGlkLmlv')

client
  .collection('messages')
  .subscribe((messages, changes) => {
    changes.added.forEach(message => {
      $('#chatbox').append($('<div>').text(message.body.text))
    })
  })

$('#input').keyup(e => {
  if (e.which === 13) {
    client
      .collection('messages')
      .newDocument()
      .mutate({ text: $('#input').val() })
    $('#input').val('')
  }
})