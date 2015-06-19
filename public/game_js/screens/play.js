game.PlayScreen = me.ScreenObject.extend({
    init: function() {
      this.grid;
      this.currentPlayer = 1;
    }, 

    onResetEvent: function() {
      me.game.world.addChild(new me.ColorLayer('background', '#33bbcc', 0)); 

      tiles = [
        [0, 1, 2, 3, 4, 5, 0, 1], 
        [4, 5, 0, 1, 2, 3, 4, 5], 
        [2, 3, 4, 5, 0, 1, 2, 3],
        [0, 1, 2, 3, 4, 5, 0, 1],
        [2, 3, 4, 5, 0, 1, 2, 3],
        [4, 5, 0, 1, 2, 3, 4, 5],
        [0, 1, 2, 3, 4, 5, 0, 1],
        [2, 3, 4, 5, 0, 1, 2, 3]
      ]

      me.input.bindKey(me.input.KEY.X, 'clear', true);
      me.input.bindKey(me.input.KEY.C, 'appear', true);
      me.input.bindKey(me.input.KEY.F1, 'setPlayer1', true);
      me.input.bindKey(me.input.KEY.F2, 'setPlayer2', true);
      me.input.bindKey(me.input.KEY.V, 'hurtChar', true);

      this.grid = new game.Grid(8, 8);  
      this.grid.populate(tiles);
      me.game.world.addChild(this.grid, 1);

      me.game.world.addChild(new game.TurnUI());

      var team1Object = { teamName: 'Squatpump', playerNum: 1, characters: [ 
        { name: 'Stinky Pete', charClass: game.charClasses.Fighter },
        { name: 'Shteven', charClass: game.charClasses.RedMage },
        { name: 'Wheel', charClass: game.charClasses.Thief },
        { name: 'Kervin', charClass: game.charClasses.BlackMage }
      ] };

      this.team1 = new game.Team(team1Object);
      this.team1.setTeamActive();
      me.game.world.addChild(this.team1);

      var team2Object = { teamName: 'Derpyderp', playerNum: 2, characters: [ 
        { name: 'Benji', charClass: game.charClasses.WhiteMage },
        { name: 'Shames', charClass: game.charClasses.Fighter },
        { name: 'Brody', charClass: game.charClasses.Thief },
        { name: 'Vance', charClass: game.charClasses.BlackBelt }
      ] };

      this.team2 = new game.Team(team2Object);
      this.team2.setTeamInactive();
      me.game.world.addChild(this.team2);
    },

    onDestroyEvent: function() {
      me.game.world.removeChild(this.grid); 
    },

    switchTurn: function() {
      if(this.currentPlayer == 1) {
        this.currentPlayer = 2;
        this.team2.setTeamActive();
        this.team1.setTeamInactive();

      } else {
        this.currentPlayer = 1;
        this.team1.setTeamActive();
        this.team2.setTeamInactive();
      }
    }
});
