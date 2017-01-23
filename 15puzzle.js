// ****************************
//
//  Jesse Squires
//  
//  15 puzzle
//
// ****************************


class Piece {
    constructor(number, color, isMoveable) {
        this.number = number;
        this.color = color;
        this.isMoveable = isMoveable;
    }

    backgroundColor() {
        return this.color
    }

    foregroundColor() {
        return '#fff';
    }

    displayText() {
        return (this.number == 0) ? '' : this.number;
    }
}


class Puzzle {
    constructor(gridSize) {
        this.gridSize = gridSize;
        this.grid = this.generateGrid(gridSize);
    }

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
            
            if (i == 0) {
                var color = '#fff';
                var isMoveable = false;
            } else {
                var color = '#3c929e';
                var isMoveable = true;
            } 
            pieces[i] = new Piece(i, color, isMoveable);
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


function drawPuzzleInCanvas(puzzle, canvas) {
    let boardSize = canvas.width;
    let gridSize = puzzle.gridSize;
    let squareSize = boardSize / gridSize;
    let fontSize = Math.ceil(squareSize / 2.5);

    let context = canvas.getContext('2d');
    context.font = fontSize + 'px arial';
    context.textAlign = 'left';
    context.textBaseline = 'middle';

    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j ++) {
            let piece = puzzle.grid[i][j];

            let originX = Math.floor(i * squareSize);
            let originY = Math.floor(j * squareSize);
            context.fillStyle = piece.backgroundColor();
            context.fillRect(originX, originY, squareSize, squareSize);

            let borderWidth = 1;
            context.strokeStyle = '#fff'
            context.strokeRect(originX + borderWidth, 
                               originY + borderWidth, 
                               squareSize - (borderWidth * 2), 
                               squareSize - (borderWidth * 2));

            context.fillStyle = piece.foregroundColor();

            let numberText = piece.displayText();
            let textMetrics = context.measureText(numberText);
            
            let offset =  Math.floor(squareSize / 2);
            let textX = Math.floor(textMetrics.width / 2);
            let textY = 44;
            context.fillText(piece.displayText(), 
                             originX + offset - textX, 
                             originY + offset);

        }
    }
}



window.onload = function(){
    // 4x4 grid
    let gridSize = 4;
    let puzzle = new Puzzle(gridSize);
    let canvas = document.getElementById("canvas");

    drawPuzzleInCanvas(puzzle, canvas);

    console.log(puzzle);
}
