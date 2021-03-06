game.chooseTeamEntity = me.Entity.extend({
  init: function(x, y, flipped, teamNumber) {
    var settings = {};
    settings.image = 'teamParties';
    settings.width = 542;
    settings.height = 160;
    
    this._super(me.Entity, 'init', [x, y, settings]);

    this.startPos = { x: x, y: y};
    this.flipped = flipped;
    this.renderable.flipX(this.flipped);

    this.teamNumber = teamNumber;

    this.buildTeamEntity(this.teamNumber);
},

  
  update: function(dt) {
    this._super(me.Entity, 'update', [dt]);
    this.body.update();
    return true;
  },

  setAnimations: function(num) {
    this.renderable.addAnimation('walk', [num, num+1, num+2, num+1], 250);
    this.renderable.setCurrentAnimation('walk');
  },

  buildTeamEntity: function(teamNumber) {
      switch(teamNumber) {
        case 0:
          this.setAnimations(0);
          break;
        case 1:
          this.setAnimations(3);
          break;
      }
  }
});
