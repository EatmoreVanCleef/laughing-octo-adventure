game.Grid = me.Container.extend({
  init: function(cols, rows) {
    this.COLS = cols;
    this.ROWS = rows;
    this.board = [];
    this.dead = 0;
    this._super(me.Container, 'init', [me.game.viewport.width / 3.5, 100, this.COLS * game.Tile.width - game.Tile.width / 2, this.ROWS * game.Tile.width - game.Tile.width / 2]);
  },

  update: function(dt) {
    this._super(me.Container, 'update', [dt]);

    if(me.input.isKeyPressed('setPlayer1')) {
      game.data.player = 1;
      console.log(game.data.player);
    }

    if(me.input.isKeyPressed('setPlayer2')) {
      game.data.player = 2;
      console.log(game.data.player);
    }

    if(me.input.isKeyPressed('clear')) {
      this.clearTiles({ pattern: 'row', end: { col: 3, row: 3 }, count: 3 });
    }

    if(me.input.isKeyPressed('appear')) {
      this.fillTiles({ pattern: 'row', end: { col: 3, row: 0}, count: 3, colors: [1, 2, 3] });
    }

    if(this.dead >= 3) {
      this.shiftEmpties();
    }

    return true;
  },

  populate: function(tiles) {
    for(var col = 0; col < this.COLS; col++) {
      this.board.push([]);
      for(var row = 0; row < this.ROWS; row++) {
        var tile = me.pool.pull('tile', col * game.Tile.width, row * game.Tile.height, tiles[col][row], col, row);
        this.board[col].push(tile);
        this.addChild(tile);
      }
    }
  },

  getCol: function(col) {
    return this.board[col]; 
  },

  getRow: function(row) {
    var tempArray = [];
    for(var col = 0; col < this.COLS; col++) {
      tempArray.push(this.board[col][row]);
    }
    return tempArray;
  },

  shiftRow(rowIndex, right) {
    var row = this.getRow(rowIndex);

    if(right) {
      //shift right
      row.unshift(row.pop());
      row.forEach(function(cell) {
        if(cell.col == row.length - 1) {
          cell.col = 0;
        } else {
          cell.col++;
        }
        cell.pos.x = cell.col * game.Tile.width;
      });
    } else {
      //shift left
      row.push(row.shift());
      row.forEach(function(cell) {
        if(cell.col == 0) {
          cell.col = row.length - 1;
        } else {
          cell.col--;
        }
        cell.pos.x = cell.col * game.Tile.width;
      });
    }

    for(var i = 0; i < this.COLS; i++) {
      this.board[i][rowIndex] = row[i];
    }

    game.sendMessage('move', { pattern: 'row', row: rowIndex, movedRight: right });
  },

  shiftCol(colIndex, down) {
    var col = this.getCol(colIndex);

    if(down) {
      //shift down
      col.unshift(col.pop());
      col.forEach(function(cell) {
        if(cell.row == col.length - 1) {
          cell.row = 0;
        } else {
          cell.row++;
        }
        cell.pos.y = cell.row * game.Tile.height;
      });
    } else {
      //shift up 
      col.push(col.shift());
      col.forEach(function(cell) {
        if(cell.row == 0) {
          cell.row = col.length - 1;
        } else {
          cell.row--; 
        }
        cell.pos.y = cell.row * game.Tile.height;
      });
    }

    this.board[colIndex] = col;

    game.sendMessage('move', { pattern: 'column', col: colIndex, movedDown: down });
  },

  clearTiles: function(object) {
    // { pattern: row/column, end: { col: col, row: row }, count: > 3 }
    if(object.pattern == 'row') {
      var row = this.getRow(object.end.row);
      for(var i = object.end.col; i > object.end.col - object.count; i--) {
        row[i].vanishCrystal();
      }
    } else {
      var col = this.getCol(object.end.col);
      for(var i = object.end.row; i > object.end.row - object.count; i--) {
        col[i].vanishCrystal();
      }
    }
  },

  fillTiles: function(object) {
    // { pattern: row/column, end: { col: col, row: row }, count: > 3, colors: [1, 2, 3] }
    if(object.pattern == 'row') {
      var row = this.getRow(object.end.row);      
      for(var i = object.end.col, j = object.colors.length - 1; i > object.end.col - object.count; i--, j--) {
        console.log(object.colors[j]);
        row[i].setCrystal(object.colors[j]);
        row[i].appearCrystal();
      }
    } else {
      var col = this.getCol(object.end.col);      
      for(var i = object.end.row; i > object.end.row - object.count; i--) {
        col[i].setCrystal(object.colors[i]);
        col[i].appearCrystal();
      }
    }
  },

  shiftEmpties: function() {
    var col;
    var temp;
    var swapped = false;
    for(var i = 0; i < this.COLS; i++) {
      col = this.getCol(i);
      for(var j = 1; j < this.ROWS; j++) {
        //swap upwards if empty
        if(!col[j].alive) {
          col[j].setCrystal(col[j-1].type);
          col[j].alive = true;
          col[j-1].setCrystal(6);
          col[j-1].alive = false;
          swapped = true;
        }
      }
    }
    if(!swapped) {
      this.dead--;
    }
  }
});
