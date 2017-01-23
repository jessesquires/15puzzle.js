// ****************************
//
//  Jesse Squires
//  
//  15 puzzle
//
// ****************************


// Represents a piece on the board.
class Piece {
    constructor(number, color) {
        this.number = number;
        this.color = color;
    }

    isEmpty() {
        return this.number === 0;
    }

    backgroundColor() {
        return this.color
    }

    foregroundColor() {
        return '#fff';
    }

    displayText() {
        return this.isEmpty() ? '' : this.number;
    }
}


// Represents the board of pieces.
class Board {
    constructor(gridSize) {
        this.size = gridSize;
        this.pieces = this.generateGrid(gridSize);
    }

    isOutOfBounds(val) {
        return val < 0 || val >= this.size;
    }

    movePieceAt(x, y) {
        if (this.pieces[x][y].isEmpty()) {
            return false;
        }

        console.log("Tapped: " + this.pieces[x][y].displayText() + " at (" + x + ", " + y + ")");

        // check north
        let north = y + 1;
        if (!this.isOutOfBounds(north)) {
            let northPiece = this.pieces[x][north];
            if (northPiece.isEmpty()) {
                this.movePieceFromTo(x, y, x, north);
                return true
            }
        }

        // check east
        let east = x + 1;
        if (!this.isOutOfBounds(east)) {
            let eastPiece = this.pieces[east][y];
            if (eastPiece.isEmpty()) {
                this.movePieceFromTo(x, y, east, y);
                return true
            }
        }

        // check south
        let south = y - 1;
        if (!this.isOutOfBounds(south)) {
            let southPiece = this.pieces[x][south];
            if (southPiece.isEmpty()) {
                this.movePieceFromTo(x, y, x, south);
                return true
            }
        }

        // check west
        let west = x - 1;
        if (!this.isOutOfBounds(west)) {
            let westPiece = this.pieces[west][y];
            if (westPiece.isEmpty()) {
                this.movePieceFromTo(x, y, west, y);
                return true
            }
        }

        return false;
    }

    movePieceFromTo(fromX, fromY, toX, toY) {
        let fromPiece = this.pieces[fromX][fromY];
        let toPiece = this.pieces[toX][toY];
        this.pieces[toX][toY] = fromPiece;
        this.pieces[fromX][fromY] = toPiece;
    }
    
    // Generates a 2D array of `Piece` objects.
    generateGrid(gridSize) {
        let total = Math.pow(gridSize, 2);
        let pieces = this.generatePieces(total);    
        let grid = this.generate2DArray(gridSize);

        for (let x = 0; x < gridSize; x++) {
            for (let y = 0; y < gridSize; y ++) {
                let index = x + (y * gridSize);
                grid[x][y] = pieces[index];
            }
        }
        return grid;
    }

    generate2DArray(gridSize) {
        let arr = [];
        for (let i = 0; i < gridSize; i++) {
            arr[i] = [];
        }
        return arr;
    }

    generatePieces(total) {
        let pieces = [];
        for (let i = 0; i < total; i++) {
            
            let isEmpty = (i == 0);
            let color = isEmpty ? '#fff' : '#3c929e';
            pieces[i] = new Piece(i, color);
        }
        this.shuffleArray(pieces);
        return pieces;
    }

    shuffleArray(arr) {
        let n = arr.length - 1;
        let min = 0;
        let max = n;
        while (n > 1) {
            let randomIndex =  Math.floor(Math.random() * (max - min)) + min;
            let randomValue = arr[randomIndex];

            let tempN = arr[n];
            arr[n] = randomValue;
            arr[randomIndex] = tempN;
            n -= 1;
        }
    }
}


// Represents the puzzle. Owns a canvas and a board.
class Puzzle {
    constructor(canvas, gridSize) {
        this.canvas = canvas;
        this.board = new Board(gridSize);
        this.draw();
    }

    pieceSize() {
        return Math.floor(this.canvas.width / this.board.size);
    }

    draw() {
        let boardSize = this.board.size;
        let pieceSize = this.pieceSize();
        let fontSize = Math.ceil(pieceSize / 2.5);

        let context = this.canvas.getContext('2d');
        context.font = fontSize + 'px arial';
        context.textAlign = 'left';
        context.textBaseline = 'middle';

        for (let i = 0; i < boardSize; i++) {
            for (let j = 0; j < boardSize; j ++) {
                let piece = this.board.pieces[i][j];

                let originX = Math.floor(i * pieceSize);
                let originY = Math.floor(j * pieceSize);
                context.fillStyle = piece.backgroundColor();
                context.fillRect(originX, originY, pieceSize, pieceSize);

                let borderWidth = 1;
                context.strokeStyle = '#fff'
                context.strokeRect(originX + borderWidth, 
                                   originY + borderWidth, 
                                   pieceSize - (borderWidth * 2), 
                                   pieceSize - (borderWidth * 2));

                context.fillStyle = piece.foregroundColor();
                let numberText = piece.displayText();
                let textMetrics = context.measureText(numberText);
                let offset =  Math.floor(pieceSize / 2);
                let textX = Math.floor(textMetrics.width / 2);
                let textY = 44;
                context.fillText(piece.displayText(), 
                                 originX + offset - textX, 
                                 originY + offset);
            }
        }
    }

    handleClickAt(xClick, yClick) {
        let board = this.board;
        let boardSize = board.size;
        let pieceSize = this.pieceSize();

        let x = Math.floor(xClick / pieceSize);        
        if (board.isOutOfBounds(x)) {
            return;
        }

        let y = Math.floor(yClick / pieceSize);
        if (board.isOutOfBounds(y)) {
            return;
        }

        if (board.movePieceAt(x,y)) {
            this.draw();
        }
    }
}


window.onload = function(){
    let canvas = document.getElementById("canvas");
    if (canvas.width != canvas.height) {
        throw "Error: canvas must have equal width and height."
    }

    let gridSize = 4; // 4x4 grid
    let puzzle = new Puzzle(canvas, gridSize);

    console.log(puzzle.board)

    canvas.addEventListener('click', function(event) {
        let rect = this.getBoundingClientRect();
        let x = event.clientX - rect.left;
        let y = event.clientY - rect.top;
        puzzle.handleClickAt(x, y);
    });
}
