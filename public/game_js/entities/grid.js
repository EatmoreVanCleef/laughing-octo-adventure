game.Grid = me.Container.extend({
  init: function(cols, rows) {
    this.COLS = cols;
    this.ROWS = rows;
    this.board = [];
    this.needsShifting = false;

    this.cellsVanishing = 0;
    this.cellsAppearing = 0;

    this.currentMatch = 0;
    this.cascadeMatches = [];

    this.currentBoard = 0;
    this.cascadeBoards = [];

    this._super(me.Container, 'init', [me.game.viewport.width / 3.5, 100, this.COLS * game.Tile.width - game.Tile.width / 2, this.ROWS * game.Tile.width - game.Tile.width / 2]);
  },

  update: function(dt) {
    this._super(me.Container, 'update', [dt]);

    //if animating appearance or vanishes
    if(this.cellsVanishing > 0 || this.cellsAppearing > 0) {
      console.log('animating!', this.cellsVanishing, this.cellsAppearing);
      return true;
    }

    //after animations, shift
    if(this.needsShifting) {
      console.log('shifting!');
      this.shiftEmpties();
      return true;
    }
    
    if(this.cascadeMatches.length > 0) {
      if(this.currentMatch == this.currentBoard && this.currentMatch < this.cascadeMatches.length) {
        console.log('matches!', this.currentMatch);
        this.handleCascadeMatch(this.currentMatch);
        this.currentMatch++;
      } else if(this.currentMatch != this.currentBoard && this.currentBoard < this.cascadeBoards.length) {
        console.log('boards!', this.currentBoard);
        this.handleCascadeBoard(this.currentBoard);
        this.currentBoard++;
      }
    } else {
      this.currentMatch = 0;
      this.cascadeMatches = [];
      this.currentBoard = 0;
      this.cascadeBoards = [];
    }

    return true;
  },

  handleCascadeMatch: function(index) {
    var matchSet = this.cascadeMatches[index];

    //handle one set
    matchSet.forEach(function(matchObject) {
      game.playScreen.grid.clearTiles(matchObject);
    });
  },

  handleCascadeBoard: function(index) {
    var diffBoard = game.playScreen.grid.cascadeBoards[index];  
    console.log(diffBoard);

    game.playScreen.grid.tileFall(diffBoard);
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

  replaceBoard: function(board) {
    for(var col = 0; col < this.COLS; col++) {
      for(var row = 0; row < this.ROWS; row++) {
        this.board[col][row].alive = true;
        this.board[col][row].setCrystal(board[col][row]);
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
        if(row[i].alive) {
          row[i].vanishCrystal();
        }
      }
    } else {
      var col = this.getCol(object.end.col);
      for(var i = object.end.row; i > object.end.row - object.count; i--) {
        if(col[i].alive) {
          col[i].vanishCrystal();
        }
      }
    }
  },

  tileFall: function(diffBoard) {
    //get differences in boards
    for(var col = 0; col < this.COLS; col++) {
      for(var row = 0; row < this.ROWS; row++) {
        var cell = this.board[col][row];
        if(cell.type == 6) {
          cell.appearCrystal(diffBoard[col][row]);
        }
      }
    }
  },

  shiftEmpties: function() {
    var col;
    var swapped = false;
    var temp;
    for(var i = 0; i < this.COLS; i++) {
      col = this.getCol(i);
      for(var j = 1; j < this.ROWS; j++) {
        if(!col[j].alive && col[j-1].alive) {
          temp = col[j-1].type;
          col[j-1].setCrystal(col[j].type); 
          col[j-1].alive = false;
          col[j].setCrystal(temp);
          col[j].alive = true;
          swapped = true; 
        }
      }
    }
    this.needsShifting = swapped;
  },

  printBoard: function() {
    var printBoard = [];
    for(var col = 0; col < this.COLS; col++) {
      printBoard.push([]);
      for(var row = 0; row < this.ROWS; row++) {
        printBoard[col].push(this.board[col][row].type);
      }
    }

    console.log(printBoard);
  }
});
