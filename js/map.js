var map;
var food_requests = [];
var user;

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

function showChat(id){
	var chat = client.collection("chat"+id)
	chat
  	.subscribe((messages, changes) => {
    changes.added.forEach(message => {
		var el = document.createElement("div");
		var img = new Image();
		if (message.body.icon!=="")
				img.src = message.body.icon
			else
				img.src = "./profile_default.png"
		img.width=32;
		$(img).css("margin-right", "10px");
		$(el).prepend(img);
		$(el).append("<span>"+message.body.text+"</span>")
      	$('#chatbox').append(el);
    })
  	})

  	$('#input').keyup(e => {
  if (e.which === 13) {
    chat
      .newDocument()
      .mutate({
      	username:user.body.name,
      	icon: user.body.image,
      	text: $('#input').val() 
      })
    $('#input').val('')
  }
})

	var request = food_requests[id]
	$("#question").text(request.name+" is ordering " +request.food+" in "+request.time+". Do you want to join?");
	$('#memberModal').modal('show');
}

$(function(){
	client
		.collection("users")
		.document(getCookie("username"))
		.fetch(doc =>{user = doc});

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
			$(el).data("id", request.id);
			$(el).click(function(event) {
				showChat($(el).data("id"));
			});
			food_requests[request.id] = request.body;
			var myMarker = new CustomMarker(request.body.pos, map, el);
		})
  	})
	$("#request-submit").click(placeFoodRequest);
})