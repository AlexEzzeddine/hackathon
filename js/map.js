var map;
var request_markers = [];

client = Rapid.createClient("NDA1OWE0MWo1b3AzYzA3LnJhcGlkLmlv")

 function CustomMarker(pos,  map, el) {
    this.latlng_ = new google.maps.LatLng(pos.lat, pos.lng);
    this.el = el
    this.setMap(map);
  }

  CustomMarker.prototype = new google.maps.OverlayView();
  CustomMarker.prototype.draw = function() {
    var me = this;
    var el = this.el;

    google.maps.event.addDomListener(el, "click", function(event) {
        google.maps.event.trigger(me, "click");
      });

      var panes = this.getPanes();
      panes.overlayImage.appendChild(el);

    var point = this.getProjection().fromLatLngToDivPixel(this.latlng_);
    if (point) {
      el.style.left = point.x + 'px';
      el.style.top = point.y + 'px';
    }
  };

  CustomMarker.prototype.remove = function() {
    if (this.el) {
      this.el.parentNode.removeChild(this.el);
      this.el = null;
    }
  };

  CustomMarker.prototype.getPosition = function() {
   return this.latlng_;
  };

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
				name: user.body.name,
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
	client.collection('food_requests')
	.subscribe((requests, changes) => {
		requests.forEach(request => {
			var el = document.createElement("div");
			var div = document.createElement("div");
			$(el).addClass("marker");
			$(div).text(request.body.name);
			$(div).addClass('circle_caption');
			var image = new Image();
			if (request.body.image!=="")
				image.src = request.body.image
			else
				image.src = "./profile_default.png"
			$(image).addClass("img-circle marker-image");
			$(el).append(image);
			$(el).append(div);
			var myMarker = new CustomMarker(request.body.pos, map, el);
		})
  	})
	$("#request-submit").click(placeFoodRequest);
})