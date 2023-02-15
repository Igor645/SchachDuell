var currentTurn = 1;
var alreadySolved = [];
var movedToCell;
var finishedRiddle = false;
var riddleButtonDisabled = false;
var emptyChessboard = document.querySelector(".Chessboard").innerHTML;
var chessMove = new Audio('sounds/chessMove.wav');
var riddles = [
    {
        role: "white",
        bPawn: [[1,7],[2,5],[8,7],[6,7], [5,6], [7,6]],
        wPawn: [[6,6], [5,4], [3,3], [2,2], [7,2], [8,2]],
        bBishop: [[5,8], [3,7]],
        wBishop: [[1,5], [3,4]],
        bKnight: [[3, 6]],
        wKnight: [[5, 5]],
        bQueen: [[4,8]],
        wQueen: [[8,4]],
        bRook: [[1,8],[7,8]],
        wRook: [[6,3]],
        bKing: [[8,8]],
        wKing: [[8,1]],
        solutions: {
            1: [[8, 4], [8, 7]],
            2: [[6, 3], [8, 3]]
        },
        reactingMoves: {
            1: [[8, 8], [8, 7]]
        }
    },
    {
        role: "white",
        bPawn: [[7,6]],
        wPawn: [[7,3], [8,4]],
        bBishop: [[3,2]],
        wBishop: [[1,3]],
        bKnight: [[]],
        wKnight: [[7,4]],
        bQueen: [],
        wQueen: [],
        bRook: [[4,2],[4,4]],
        wRook: [[6,2]],
        bKing: [[8,5]],
        wKing: [[8,3]],
        solutions: {
            1: [[7, 4], [6, 6]],
            2: [[1, 3], [6,8]]
        },
        reactingMoves: {
            1: [[8, 5], [8, 6]]
        }
    },
    {
        role: "black",
        bPawn: [[7,3],[8,3]],
        wPawn: [],
        bBishop: [],
        wBishop: [[1,7]],
        bKnight: [[5, 4]],
        wKnight: [],
        bQueen: [],
        wQueen: [],
        bRook: [],
        wRook: [],
        bKing: [[6,3]],
        wKing: [[8,1]],
        solutions: {
            1: [[5, 4], [6, 2]],
            2: [[7, 3], [6, 2]],
            3: [[6,2], [6,1], "rook"],
            4: [[6,1], [8,1]]
        },
        reactingMoves: {
            1: [[1, 7], [6, 2]],
            2: [[8, 1], [8, 2]],
            3: [[8,2], [8,3]]
        }
    },
    {
        role: "white",
        bPawn: [[1,7],[2,7],[3,7],[6,5],[7,6],[8,7]],
        wPawn: [[1,2],[2,3],[3,4],[4,5],[6,2],[7,2],[8,3]],
        bBishop: [[6,7]],
        wBishop: [[5,6],[3,3]],
        bKnight: [[3,6],[5,7]],
        wKnight: [[6,3]],
        bQueen: [[4,8]],
        wQueen: [[2,2]],
        bRook: [[6,8]],
        wRook: [[6,1]],
        bKing: [[7,8]],
        wKing: [[7,1]],
        solutions: {
            1: [[3,3], [8,8]],
            2: [[2, 2], [4, 4]],
            3: [[4,4], [7,7]]
        },
        reactingMoves: {
            1: [[3,6], [4, 4]],
            2: [[6, 7], [5, 6]]
        }
    },
    {
        role: "white",
        bPawn: [[1,5],[2,6],[3,5],[5,5],[6,7],[7,6], [8,7]],
        wPawn: [[1,2],[2,3],[3,3],[5,4],[6,2],[7,2],[8,2]],
        bBishop: [],
        wBishop: [[3,1]],
        bKnight: [[3,6]],
        wKnight: [[4,5]],
        bQueen: [[4,7]],
        wQueen: [[6,3]],
        bRook: [[5,8]],
        wRook: [[6,1]],
        bKing: [[6,8]],
        wKing: [[7,1]],
        solutions: {
            1: [[3,1], [8,6]],
            2: [[6, 3], [6, 6]],
            3: [[6,6], [7,7]]
        },
        reactingMoves: {
            1: [[6,8], [7, 8]],
            2: [[2, 6], [2, 5]]
        }
    }
]
var currentRiddle = Math.floor(Math.random() * riddles.length);


renderRiddle();

function renderRiddle(){
    document.querySelector(".riddleStatus").innerHTML = ""
    document.querySelectorAll(".piece").forEach(piece => {
        piece.remove();
    })
    currentTurn = 1;
    finishedRiddle = false;
    if(riddles[currentRiddle].role == "white")
    {
        document.querySelector(".roleIndicator").style.backgroundColor = "white";
    }
    else{
        document.querySelector(".roleIndicator").style.backgroundColor = "black";
    }
    otherPiecesRender(riddles[currentRiddle].bBishop, "black-bishop", "pieces/black-bishop.svg");
    otherPiecesRender(riddles[currentRiddle].wBishop, "white-bishop", "pieces/white-bishop.svg");
    otherPiecesRender(riddles[currentRiddle].bKnight, "black-knight", "pieces/black-knight.svg");
    otherPiecesRender(riddles[currentRiddle].wKnight, "white-knight", "pieces/white-knight.svg");
    otherPiecesRender(riddles[currentRiddle].bQueen, "black-queen", "pieces/black-queen.svg");
    otherPiecesRender(riddles[currentRiddle].wQueen, "white-queen", "pieces/white-queen.svg");
    pawnRender(riddles[currentRiddle].bPawn, "black-pawn", "pieces/black-pawn.svg");
    pawnRender(riddles[currentRiddle].wPawn, "white-pawn", "pieces/white-pawn.svg");
    rookRender(riddles[currentRiddle].bRook, "black-rook", "pieces/black-rook.svg");
    rookRender(riddles[currentRiddle].wRook, "white-rook", "pieces/white-rook.svg");
    kingRender(riddles[currentRiddle].bKing, "black-king", "pieces/black-king.svg");
    kingRender(riddles[currentRiddle].wKing, "white-king", "pieces/white-king.svg");
}

function pawnRender(coordinates, id, image){
    let pawnStartingRow = 2;
    if(id === "black-pawn"){
        pawnStartingRow = 7;
    }

    coordinates.forEach(Pawn => {
        let enPassantRow = Pawn[1] - 1;
        if(id === "black-pawn"){
            enPassantRow = Pawn[1] + 1;
        }
        document.querySelectorAll("tr").forEach(row => {
            if(row.dataset.value == Pawn[1]){
                row.querySelectorAll("th").forEach(cell => {
                    if(cell.dataset.value == Pawn[0] && Pawn[1] === pawnStartingRow){
                        cell.innerHTML = `<image class="piece" id="${id}" data-state="0" data-enpassantable="no" src="${image}"/>`
                    }
                    else if(cell.dataset.value == Pawn[0] && (enPassantRow == 6 || enPassantRow == 3)){
                        cell.innerHTML = `<image class="piece" id="${id}" data-state="1" data-enpassantable="yes" src="${image}"/>`
                        document.querySelectorAll("tr").forEach(row => {
                            if(row.dataset.value == enPassantRow){
                                row.querySelectorAll("th").forEach(cell => {
                                    if(cell.dataset.value == Pawn[0]){
                                        cell.setAttribute("id", "enPassant");
                                    }
                                })
                            }
                        })
                    }
                    else if(cell.dataset.value == Pawn[0]){
                        cell.innerHTML = `<image class="piece" id="${id}" data-state="1" data-enpassantable="no" src="${image}"/>`
                    }
                })
            }
        })
    })
}

function otherPiecesRender(coordinates, id, image){
    coordinates.forEach(Piece => {
        document.querySelectorAll("tr").forEach(row => {
            if(row.dataset.value == Piece[1]){
                row.querySelectorAll("th").forEach(cell => {
                    if(cell.dataset.value == Piece[0]){
                        cell.innerHTML = `<image class="piece" id="${id}" data-state="1" data-enpassantable="no" src="${image}"/>`
                    }
                })
            }
        })
    })
}

function rookRender(coordinates, id, image){
    let rookStartingPos = [[1,1], [8,1]];
    let isStartingPos = false;
    if(id === "black-rook"){
        rookStartingPos = [[1,8],[8,8]];
    }
    
    coordinates.forEach(Rook => {
        isStartingPos = false;
        document.querySelectorAll("tr").forEach(row => {
            if(row.dataset.value == Rook[1]){
                row.querySelectorAll("th").forEach(cell => {
                    rookStartingPos.forEach(startingPos => {
                        if(cell.dataset.value == Rook[0] && Rook[1] == startingPos[1] && Rook[0] == startingPos[0]){
                            cell.innerHTML = `<image class="piece" id="${id}" data-state="0" src="${image}"/>`
                            isStartingPos = true;
                        }
                        else if(cell.dataset.value == Rook[0] && isStartingPos == false){
                            cell.innerHTML = `<image class="piece" id="${id}" data-state="1" src="${image}"/>`
                        }
                    })
                })
            }
        })
    })
}

function kingRender(coordinates, id, image){
    let kingStartingPos = [5,1];
    if(id === "black-king"){
        kingStartingPos = [5,8];
    }
    
    coordinates.forEach(King => {
        document.querySelectorAll("tr").forEach(row => {
            if(row.dataset.value == King[1]){
                row.querySelectorAll("th").forEach(cell => {
                    if(cell.dataset.value == King[0] && King[1] == kingStartingPos[1] && King[0] == kingStartingPos[0]){
                        cell.innerHTML = `<image class="piece" id="${id}" data-state="0" src="${image}"/>`
                    }
                    else if(cell.dataset.value == King[0]){
                        cell.innerHTML = `<image class="piece" id="${id}" data-state="1" src="${image}"/>`
                    }
                })
            }
        })
    })
}

async function processRiddle(){
    let previousColor;
    getMovedToCell();
    getRole();

    
    if(xyClickedPiece[0] === riddles[currentRiddle].solutions[currentTurn][0][0] &&
        xyClickedPiece[1] === riddles[currentRiddle].solutions[currentTurn][0][1] && 
        xyMovedTo[0] === riddles[currentRiddle].solutions[currentTurn][1][0] && 
        xyMovedTo[1] === riddles[currentRiddle].solutions[currentTurn][1][1]){
       
        let pieceToMove;
        let toEmptyCell;
        riddleButtonDisabled = true;    

        previousColor = getComputedStyle(movedToCell).getPropertyValue('background-color');
        movedToCell.style.backgroundColor = "#64e764"
        chessrows.forEach(chessrow => {
            if(riddles[currentRiddle].reactingMoves[currentTurn] != null && chessrow.dataset.value == riddles[currentRiddle].reactingMoves[currentTurn][0][1]){
                chessrow.querySelectorAll("th").forEach(cell => {
                    if(cell.dataset.value == riddles[currentRiddle].reactingMoves[currentTurn][0][0]){
                        pieceToMove = cell.innerHTML;
                        toEmptyCell = cell;
                    }
                })
            }
        })        

        dotRemoval();
        if(riddles[currentRiddle].solutions[currentTurn].length === 3){
        let pieceToPromote = riddles[currentRiddle].solutions[currentTurn][2];
            if(movedToCell.querySelector(`[id$=${pieceToPromote}]`))
            { 
                await correctMove(toEmptyCell, previousColor, pieceToMove);    
            }
            else{
                await wrongMovePlayed(boardPreMove)
            }
        }
        else{        
            await correctMove(toEmptyCell, previousColor, pieceToMove);
        }
    }
    else{
        await wrongMovePlayed(boardPreMove);
    }

    document.querySelectorAll("th").forEach(cell => {
        cell.dataset.attacked = 0;
    })
    movedToCell.style.backgroundColor = previousColor;
    riddleButtonDisabled = false;
    return true;
}

function responseMove(pieceToMove){
    chessrows.forEach(chessrow => {
        if(chessrow.dataset.value == riddles[currentRiddle].reactingMoves[currentTurn][1][1]){
            chessrow.querySelectorAll("th").forEach(cell => {
                if(cell.dataset.value == riddles[currentRiddle].reactingMoves[currentTurn][1][0]){
                    chessMove.play();
                    cell.innerHTML = pieceToMove;
                }
            })
        }
    }) 
    currentTurn++;    
}

async function wrongMovePlayed(boardPreMove){
    movedToCell.style.backgroundColor = "#EB3C62";
    dotRemoval();
    await new Promise(resolve => setTimeout(resolve, 600));
    document.body.querySelector(".Chessboard").innerHTML = boardPreMove
    wrongMove = true;
}

async function correctMove(toEmptyCell, previousColor, pieceToMove){
    await new Promise(resolve => setTimeout(resolve, 600));
    movedToCell.style.backgroundColor = previousColor;
    if(toEmptyCell != null){
        toEmptyCell.innerHTML = ""
    }

    if(currentTurn <= Object.keys(riddles[currentRiddle].reactingMoves).length){
        responseMove(pieceToMove);
        wrongMove = false; 
    } 
    else{
        document.querySelector(".riddleStatus").innerHTML = "Riddle Solved"
        wrongMove = false; 
        finishedRiddle = true;
        turns = "none"
    }
}

function getMovedToCell(){
    document.querySelectorAll("tr").forEach(row => {
        if(row.dataset.value == xyMovedTo[1]){
            row.querySelectorAll("th").forEach(cell => {
                if(cell.dataset.value == xyMovedTo[0]){
                    movedToCell = cell;
                }
            })
        }
    })
}

function getRole(){
    if(riddles[currentRiddle].role === "white" && finishedRiddle == false){
        turns = 0;
    }
    else if(riddles[currentRiddle].role === "black" && finishedRiddle == false)
    {
        turns = 1;
    }
    else{
        turns = "none";
    }
}