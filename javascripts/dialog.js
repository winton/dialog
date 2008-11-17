var Dialog = new Class({
  Implements: [ Events, Options ],
  initialize: function(options) {
    var el;       // Element  instance
    var lightbox; // Lightbox instance
    
    // Hide element and lightbox
    this.hide = function() {
      el.hide();
      if (lightbox) lightbox.hide();
      // Fire hide event
      this.fireEvent('hide');
    }.bind(this);
    
    // Show element and lightbox
    this.show = function() {
      this.options = {};
      this.setOptions(opts);
      options = this.options;
      el.show(options);
      // Fire init event
      this.fireEvent('show');
    };
    
    // Initializer
    this.init = function(opts) {
      window.addEvent('domready', function() {
        this.options = {
          id: 'dialog',
          transition: {
            'in' : [ 'fade_in',  'slide_from_top' ],
            'out': [ 'fade_out', 'slide_to_top'   ]
          }
        };
        this.setOptions(opts);
        options = this.options;
        // Init lightbox
        if (!lightbox) {
          lightbox = Global.lightbox.init(options.lightbox);
          lightbox.addEvent('click', function() { this.hide(); }.bind(this));
        }
        if (!el) {
          el = Global.elements[options.id];
          // Element show event
          el.addEvent('show', function() {
            // Show lightbox
            if (lightbox) {
              lightbox.show();
              lightbox.indicator.show();
            }
          });
          // Element showed event
          el.addEvent('showed', function() {
            // Center element
            this.el.center();
            // Hide lightbox indicator
            if (lightbox)
              lightbox.indicator.hide();
          });
          // Element hide event
          el.addEvent('hide', function() {
            // Hide lightbox
            if (lightbox) {
              lightbox.hide();
              lightbox.indicator.hide();
            }
          });
          // Re-init el
          el.init(options);
          // Add to Global object
          Global.dialogs[options.id] = this;
        }
        // Fire init event
        this.fireEvent('init');
      }.bind(this));
      return this;
    };
    this.init(options);
    
    // Center dialog if resize
    window.addEvent('resize', function() {
			if (el && el.getStyle('opacity')  > 0) el.center();
		}.bind(this));
  }
});

Element.implement({
  center: function(second) {
    var width 	= this.getSize().x;
    var height 	= this.getSize().y;

    this.setStyles({
      position: 'absolute',
      left: (Window.getWidth()  / 2 - width  / 2) + Window.getScrollLeft() + 'px',
      top:  (Window.getHeight() / 2 - height / 2) + Window.getScrollTop()  + 'px',
      'z-index': 1001
    });
    
    if (this.getStyle('left') < 0) this.setStyle('left',  0);
    if (this.getStyle('top')  < 0) this.setStyle('right', 0);
    
    return this;
  }
});

var Global = Global || {};
Global.dialogs = {};