game.Team = me.Container.extend({
  init: function(object) {
    var settings = {};
    
    this.teamName;
    this.teamNameUI;

    this.manaScores = {
      red: 0,
      blue: 0,
      yellow: 0,
      green: 0,
      white: 0,
      black: 0
    };
    this.manaUI;

    this.playerNum;
    this.characters = [];
    this._super(me.Container, 'init', [0, 0, 0, 0, settings]);

    this.buildFromObject(object);

    this.activeCharacter = this.characters[0];
    this.activeCharacter.setActive();

    this.createUI();
  },

  update: function(dt) {
    this._super(me.Container, 'update', [dt]);

    if(me.input.isKeyPressed('blueMatch')) {
      if(this.playerNum == game.playScreen.currentPlayer) {
        this.setActiveCharacter('blue');
      }
    }

    return true;
  },

  attack: function(turnMana) {
    var attacks = [];
    //iterate through colors, creating objects of best characters to attack.
    if(turnMana.red > 0) {
      attacks.push({ type: 0, mana: turnMana.red });
    }

    if(turnMana.blue > 0) {
      attacks.push({ type: 1, mana: turnMana.blue });
    }

    if(turnMana.yellow > 0) {
      attacks.push({ type: 2, mana: turnMana.yellow });
    }

    if(turnMana.green > 0) {
      attacks.push({ type: 3, mana: turnMana.green });
    }

    if(turnMana.white > 0) {
      attacks.push({ type: 4, mana: turnMana.white });
    }

    if(turnMana.black > 0) {
      attacks.push({ type: 5, mana: turnMana.black });
    }

    //trigger attack animation for each attack object
    attacks.forEach(function(attack) {
      console.log(attack);
    });

    //on attack finish, send attacked message to server
  },

  buildFromObject: function(object) {
    // { teamName: string, playerNum: int, characters: [ { name: string, charClass: charClass }, * 4 ] }
    this.teamName = object.teamName;
    this.playerNum = object.playerNum;

    var rightSide;
    var x;

    if(this.playerNum == 1) {
      rightSide = true;
      x = 0;
    } else {
      rightSide = false;   
      x = me.game.viewport.width - 130;
    }

    for(var i = 0; i < game.Team.MAX; i++) {
      var tempChar = new game.Character(x, me.game.viewport.height / 4 + (i * 100), object.characters[i].name, object.characters[i].charClass, rightSide);
      this.characters.push(tempChar);
      this.addChild(tempChar);
    }
  },

  //not sure this goes here
//  chooseAttacker: function(manaType) {
//    return this.characters.reduce(function(max, character) {
//      if(character.type == manaType && character.type.value > max.type.value) {
//        return character;
//      } 
//    });
//  }

  setTeamActive: function() {
    this.characters.forEach(function(character) {
      if(character.health > 100) { 
        character.renderable.setCurrentAnimation('walk');
      }
    });
  },

  setTeamInactive: function() {
    this.characters.forEach(function(character) {
      if(character.health > 100) {
        character.renderable.setCurrentAnimation('idle'); 
      }
    });
  },

  //TODO edit for type integers. needs a switch
  setActiveCharacter: function(color) {
    var max = -1;
    var index = -1;
    for(var i = 0; i < this.characters.length; i++) {
      if(this.characters[i].manaScores[color] > max) {
        max = this.characters[i].manaScores[color]; 
        index = i; 
      }
    }
    
    this.activeCharacter.setInactive();
    this.activeCharacter = this.characters[index];
    this.activeCharacter.setActive();
  },

  createUI: function() {
    this.teamNameUI = new game.TeamName(this); 
    me.game.world.addChild(this.teamNameUI);
    this.manaUI = new game.ManaUI(this);
    me.game.world.addChild(this.manaUI);
  }
});

game.Team.MAX = 4;
