game.CharHealth = me.Renderable.extend({
  init: function(character) {
    this._super(me.Renderable, 'init', [0, 0, 0, 0]);

    this.font = new me.Font('Press Start 2P', 20, '#fff', 'right');
    this.floating = true;

    this.character = character;

    this.x;
    this.y;

    if(this.character.flipped) {
      this.x = this.character.pos.x + 390; 
      this.y = this.character.pos.y + 125;
    } else {
      this.x = this.character.pos.x - 130;
      this.y = this.character.pos.y + 125;
      this.font.textAlign = 'left';
    }
  },

  draw: function(renderer) {
    this.font.draw(renderer, this.character.health, this.x, this.y);
  }
});
