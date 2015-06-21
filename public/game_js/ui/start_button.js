game.StartButton = me.GUI_Object.extend({
  init: function(x, y) {
    var settings = {};
    settings.image = 'button';
    settings.framewidth = 512;
    settings.frameheight = 128;

    this._super(me.GUI_Object, 'init', [x, y, settings]);
  },

  onClick: function(event) {
    me.state.change(me.state.PLAY);
  }
});