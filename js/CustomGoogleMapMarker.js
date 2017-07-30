 function CustomMarker(pos,  map, image) {
    this.latlng_ = new google.maps.LatLng(pos.lat, pos.lng);
    this.image = image
    this.setMap(map);
  }

  CustomMarker.prototype = new google.maps.OverlayView();
  CustomMarker.prototype.draw = function() {
    var me = this;
    var div = this.div_;
    if (!div) {
      div = this.div_ = document.createElement('DIV');
      div.style.border = "none";
      div.style.position = "absolute";
      div.style.paddingLeft = "0px";
      div.style.cursor = 'pointer';
      //you could/should do most of the above via styling the class added below
		$(div).append(image);

      google.maps.event.addDomListener(div, "click", function(event) {
        google.maps.event.trigger(me, "click");
      });

      var panes = this.getPanes();
      panes.overlayImage.appendChild(div);
    }

    var point = this.getProjection().fromLatLngToDivPixel(this.latlng_);
    if (point) {
      div.style.left = point.x + 'px';
      div.style.top = point.y + 'px';
    }
  };

  CustomMarker.prototype.remove = function() {
    if (this.div_) {
      this.div_.parentNode.removeChild(this.div_);
      this.div_ = null;
    }
  };

  CustomMarker.prototype.getPosition = function() {
   return this.latlng_;
  };