var boardPreMove;
var wrongMove = false;
var isRiddleActive = false;
var chessboard = document.querySelector(".Chessboard");
var chessrows = chessboard.querySelectorAll("tr");
var xyClickedPiece = [];
var xyMovedTo = [];
var attackingPieces = [];
var attackingAngle;
var cellsOnCheck = [];
var validKingCells = [];
var pieceNotAllowedToMove = [];
var pinningPiece = [];
var pinningAngle = [];
var collectionOfPinCells = [];
var promotionPending = false;
var chessMove = new Audio('sounds/chessMove.wav');
var turns = 0;
var whoIsInCheck = "";

try{
    getRole();
}catch{}

if(document.querySelector(".newRiddle") != null){
    document.querySelector(".newRiddle").addEventListener("click", (event) => {
        if(riddleButtonDisabled == false){
        alreadySolved.push(currentRiddle);
        currentRiddle = Math.floor(Math.random() * riddles.length);
        while(alreadySolved.includes(currentRiddle)){
            if(alreadySolved.length != riddles.length){
                currentRiddle = Math.floor(Math.random() * riddles.length);
            }
            else{
                alreadySolved.shift();
            }
        }
        if(riddles[currentRiddle].role == "white"){
            turns = 0;
        }
        else{
            turns = 1;
        }
        document.querySelectorAll("th").forEach(cell => {
            cell.dataset.attacked = 0;
        })
        renderRiddle();
        if(turns % 2 == 0){
            moveTester("black", true)
        }
        else if(turns % 2 == 1){
            moveTester("white", true)
        }
        document.querySelectorAll(".dot").forEach(dot => {
            dot.parentNode.dataset.attacked = 1;
        })
        isRiddleActive = false;
        wrongMove = false;
        cellsOnCheck = [];
        
        addFunctionality();
        }
    });
}

const pieces = {
    "white-pawn": {
        piece: "white-pawn",
        Image: "pieces/white-pawn.svg",
        move(element, moveTest){
            let nextFields = returnFieldsPawn(element, turns, true, moveTest); 
            pawnMovement(element, nextFields, "white-pawn", pieces["white-pawn"].Image, 0, "black", moveTest)
        }
    },
    "black-pawn": {
        piece: "black-pawn",
        Image: "pieces/black-pawn.svg",
        move(element, moveTest){
            let nextFields = returnFieldsPawn(element, turns, false, moveTest); 
            pawnMovement(element, nextFields, "black-pawn", pieces["black-pawn"].Image, 1, "white", moveTest);
        }
    },
    "bishop": {
        piece: "bishop",
        blackbishop: "black-bishop",
        whitebishop: "white-bishop",
        bImage: "pieces/black-bishop.svg",
        wImage: "pieces/white-bishop.svg",
        move(element, isWhite, colorString, moveTest){
            if(moveTest == false){
                dotRemoval();
            }
            if(moveTest === "hasViewOnKing"){
                dotRemoval();
                if(colorString === "white"){
                    colorString = "black"
                }
                else{
                    colorString = "white"
                }
            }
            if(moveTest === "stalemate"){
                moveTest = true;
            }
            let nextFields = returnFields(element); 
            let currentRow = element.parentNode.parentNode.dataset.value;
            let leftTop = true;
            let rightTop = true;
            let leftBottom = true;
            let rightBottom = true;
            let ImageToUse = this.bImage;
            let pieceToUse = this.blackbishop;
            let piecesInWay = [[],[],[],[]]
            let pinningCells = [[],[],[],[]]
            let direction;
            
            if(isWhite === true){
                ImageToUse = this.wImage;
                pieceToUse = this.whitebishop;
                if((turns % 2 == 0 && promotionPending == false) || moveTest == true || moveTest === "hasViewOnKing"){
                    interactWithPiece(ImageToUse, pieceToUse);
                }
            }else{
                if((turns % 2 == 1 && promotionPending == false) || moveTest == true || moveTest === "hasViewOnKing"){
                    interactWithPiece(ImageToUse, pieceToUse);
                }
            }
                        
            function interactWithPiece(ImageToUse, pieceToUse){
                leftBottom = true;
                leftTop = true;
                rightBottom = true;
                rightTop = true;

                for (let index = currentRow; index < 8; index++) {
                let Row = nextFields[index];
                chessrows.forEach(chessrow => {
                    if(chessrow.dataset.value == Row[0]){
                        chessrow.querySelectorAll("th").forEach(cell => {
                                if(cell.dataset.value == Row[1] && leftTop === true){
                                    if(direction != "none"){
                                        direction = "upleft"
                                    }                                    
                                    if(cell.innerHTML === ""){
                                        cell.innerHTML += `<span class="dot" data-direction="${direction}"></span>`;
                                        if(moveTest === "hasViewOnKing"){
                                            pinningCells[0].push(cell)
                                        }
                                    }
                                    else if((cell.querySelector("#white-king") || cell.querySelector("#black-king")) && moveTest == true){
                                        cell.innerHTML += `<span class="dot" id="back" data-direction="${direction}"></span>`;
                                        direction = "none";
                                    }
                                    else if(cell.querySelector(".dot") && !cell.querySelector(".piece")){}
                                    else if(element.id.split('-')[0] === cell.querySelector(".piece").id.split('-')[0]){
                                        leftTop = false; 
                                    }
                                    else{
                                        if(moveTest != "hasViewOnKing"){
                                            leftTop = false; 
                                        }
                                        if(cell.querySelector(`[id^="${colorString}"]`) || moveTest == true){
                                            cell.innerHTML += `<span class="dot" id="back" data-direction="${direction}"></span>`;
                                            if(moveTest === "hasViewOnKing"){
                                                piecesInWay[0].push(cell);
                                            }
                                        }      
                                    }
                                }
                                else if(cell.dataset.value == Row[2] && rightTop === true){
                                    if(direction != "none"){
                                        direction = "upright"
                                    }                                    
                                    if(cell.innerHTML === ""){
                                        cell.innerHTML += `<span class="dot" data-direction="${direction}"></span>`;
                                        if(moveTest === "hasViewOnKing"){
                                            pinningCells[1].push(cell)
                                        }
                                    }
                                    else if((cell.querySelector("#white-king") || cell.querySelector("#black-king")) && moveTest == true){
                                        cell.innerHTML += `<span class="dot" id="back" data-direction="${direction}"></span>`;
                                        direction = "none";
                                    }
                                    else if(cell.querySelector(".dot") && !cell.querySelector(".piece")){}
                                    else if(element.id.split('-')[0] === cell.querySelector(".piece").id.split('-')[0]){
                                        rightTop = false; 
                                    }
                                    else{
                                        if(moveTest != "hasViewOnKing"){
                                            rightTop = false; 
                                        }
                                        if(cell.querySelector(`[id^="${colorString}"]`) || moveTest == true){
                                            cell.innerHTML += `<span class="dot" id="back" data-direction="${direction}"></span>`;
                                            if(moveTest === "hasViewOnKing"){
                                                piecesInWay[1].push(cell);
                                            }
                                        }
                                    } 
                                }        
                            })
                        }
                    })                    
                }
                for (let index = currentRow; index > 1; index--) {
                    let Row = nextFields[index - 2];
                    chessrows.forEach(chessrow => {
                        if(chessrow.dataset.value == Row[0]){
                            chessrow.querySelectorAll("th").forEach(cell => {
                                if(cell.dataset.value == Row[1] && rightBottom === true){
                                    if(direction != "none"){
                                        direction = "downright"
                                    }
                                    if(cell.innerHTML === ""){
                                        cell.innerHTML += `<span class="dot" data-direction="${direction}"></span>`;
                                        if(moveTest === "hasViewOnKing"){
                                            pinningCells[2].push(cell)
                                        }
                                    }
                                    else if((cell.querySelector("#white-king") || cell.querySelector("#black-king")) && moveTest == true){
                                        cell.innerHTML += `<span class="dot" id="back" data-direction="${direction}"></span>`;
                                        direction = "none";
                                    }
                                    else if(cell.querySelector(".dot") && !cell.querySelector(".piece")){}
                                    else if(element.id.split('-')[0] === cell.querySelector(".piece").id.split('-')[0]){
                                        rightBottom = false; 
                                    }
                                    else{
                                        if(moveTest != "hasViewOnKing"){
                                            rightBottom = false; 
                                        } 
                                        if(cell.querySelector(`[id^="${colorString}"]`) || moveTest == true){
                                            cell.innerHTML += `<span class="dot" id="back" data-direction="${direction}"></span>`;
                                            if(moveTest === "hasViewOnKing"){
                                                piecesInWay[2].push(cell);
                                            }
                                        }      
                                    }
                                }
                                if(cell.dataset.value == Row[2] && leftBottom === true){
                                    if(direction != "none"){
                                        direction = "downleft"
                                    }
                                    if(cell.innerHTML === ""){
                                        cell.innerHTML += `<span class="dot" data-direction="${direction}"></span>`;
                                        if(moveTest === "hasViewOnKing"){
                                            pinningCells[3].push(cell)
                                        }
                                    }
                                    else if((cell.querySelector("#white-king") || cell.querySelector("#black-king")) && moveTest == true){
                                        cell.innerHTML += `<span class="dot" id="back" data-direction="${direction}"></span>`;
                                        direction = "none";
                                    }
                                    else if(cell.querySelector(".dot") && !cell.querySelector(".piece")){}
                                    else if(element.id.split('-')[0] === cell.querySelector(".piece").id.split('-')[0]){
                                        leftBottom = false; 
                                    }
                                    else{
                                        if(moveTest != "hasViewOnKing"){
                                            leftBottom = false; 
                                        }                                     
                                        if(cell.querySelector(`[id^="${colorString}"]`) || moveTest == true){
                                            cell.innerHTML += `<span class="dot" id="back" data-direction="${direction}"></span>`;
                                            if(moveTest === "hasViewOnKing"){
                                                piecesInWay[3].push(cell);
                                            }
                                        }
                                    } 
                                }        
                            })
                        }
                    })         
                }
                
                try{
                    piecesInWay.forEach(piecesInDirection => {
                        if(!(piecesInDirection.length < 2) && piecesInDirection[1].querySelector(".piece").id === `${colorString}-king`){
                            collectionOfPinCells.push([element.parentNode, pinningCells]);
                            pieceNotAllowedToMove.push(piecesInDirection[0]);
                            pinningPiece.push(element.parentNode);
                            let angleNumber;
                            switch(piecesInDirection[0].querySelector(".dot").dataset.direction){
                                case "upleft":
                                    angleNumber = 0;
                                    break;
                                case "upright":
                                    angleNumber = 1;
                                    break;
                                case "downright":
                                    angleNumber = 2
                                    break;
                                case "downleft":
                                    angleNumber = 3;
                                    break;
                                default:
                                    console.log("something unexpected happened");
                                    break;
                            }
                            pinningAngle.push(angleNumber)
                        }
                    })
                }catch{}
                if(moveTest == false && (whoIsInCheck === "" || element.id.includes(whoIsInCheck))){
                    removeInvalidDots();
                }
                checkingForPin(element, pinningCells);
                dotFunctionality(element, ImageToUse, pieceToUse, colorString);
            }
        }
    },
    "knight": {
        piece: "knight",
        blackbishop: "black-knight",
        whitebishop: "white-knight",
        bImage: "pieces/black-knight.svg",
        wImage: "pieces/white-knight.svg",
        move(element, isWhite, colorString, moveTest){
            if(moveTest == false){
                dotRemoval();
            }
            if(moveTest === "hasViewOnKing"){
                dotRemoval();
            }
            if(moveTest === "stalemate"){
                moveTest = true;
            }
            let nextFields = returnFields(element); 
            let ImageToUse = this.bImage;
            let pieceToUse = this.blackbishop;
            
            if(isWhite === true){
                ImageToUse = this.wImage;
                pieceToUse = this.whitebishop;
                if((turns % 2 == 0 && promotionPending == false) || moveTest == true){
                    interactWithPiece(ImageToUse, pieceToUse);
                }
            }else{
                if((turns % 2 == 1 && promotionPending == false) || moveTest == true){
                    interactWithPiece(ImageToUse, pieceToUse);
                }
            }

            function interactWithPiece(ImageToUse, pieceToUse){
                let moveCounter = 0;
                nextFields.forEach(coordinates => {
                    chessrows.forEach(Row => {
                        if(Row.dataset.value == coordinates[0]){
                            Row.querySelectorAll("th").forEach(cell => {
                                if(cell.dataset.value == coordinates[1]){
                                    if(cell.innerHTML === ""){
                                        moveCounter++;
                                        cell.innerHTML += `<span class="dot" data-direction="${moveCounter}"></span>`;
                                    }
                                    else if(cell.querySelector(`[id^="${colorString}"]`) || moveTest == true){
                                        moveCounter++;
                                        cell.innerHTML += `<span class="dot" id="back" data-direction="${moveCounter}"></span>`;
                                    }
                                }
                            })
                        }
                    })
                })
                if(moveTest == false && (whoIsInCheck === "" || element.id.includes(whoIsInCheck))){
                    removeInvalidDots();
                }        
                checkingForPin(element);
                dotFunctionality(element, ImageToUse, pieceToUse, colorString);
            }
        }
    },
    "rook":{
        piece: "rook",
        blackrook: "black-rook",
        whiterook: "white-rook",
        bImage: "pieces/black-rook.svg",
        wImage: "pieces/white-rook.svg",
        move(element, isWhite, colorString, moveTest){
            if(moveTest == false){
                dotRemoval();
            }
            if(moveTest === "hasViewOnKing"){
                dotRemoval();
                if(colorString === "white"){
                    colorString = "black"
                }
                else{
                    colorString = "white"
                }
            }
            if(moveTest === "stalemate"){
                moveTest = true;
            }
            let currentRow = element.parentNode.parentNode.dataset.value;
            let currentColumn = element.parentNode.dataset.value;
            let nextFields = returnFields(element)
            let top = true;
            let bottom = true;
            let right = true;
            let left = true;
            let ImageToUse = this.bImage;
            let pieceToUse = this.blackrook;
            let piecesInWay = [[],[],[],[]]
            let pinningCells = [[],[],[],[]]
            let direction;
            
            if(isWhite === true){
                ImageToUse = this.wImage;
                pieceToUse = this.whiterook;
                if((turns % 2 == 0 && promotionPending == false) || moveTest == true || moveTest === "hasViewOnKing"){
                    interactWithPiece(ImageToUse, pieceToUse);
                }
            }else{
                if((turns % 2 == 1 && promotionPending == false) || moveTest == true || moveTest === "hasViewOnKing"){
                    interactWithPiece(ImageToUse, pieceToUse);
                }
            }

            function interactWithPiece(ImageToUse, pieceToUse){
                top = true;
                bottom = true;
                right = true;
                left = true;

                for (let index = currentRow; index < 8; index++) {
                    if(direction != "none"){
                        direction = "up"
                    }
                    let Row = nextFields[0][index];
                    chessrows.forEach(chessrow => {
                        if(chessrow.dataset.value == Row[0]){
                            var cell = chessrow.querySelector(`[data-value="${Row[1]}"]`);
                            if(cell.innerHTML === "" && top == true){
                                if(moveTest === "hasViewOnKing"){
                                    pinningCells[0].push(cell);
                                }
                                cell.innerHTML += `<span class="dot" data-direction="${direction}"></span>`;
                            }
                            else if((cell.querySelector("#white-king") || cell.querySelector("#black-king")) && moveTest == true && top == true){
                                cell.innerHTML += `<span class="dot" id="back" data-direction="${direction}"></span>`;
                                direction = "none";
                            }
                            else if(cell.querySelector(".dot") && !cell.querySelector(".piece")){}
                            else if((cell.querySelector(`[id^="${colorString}"]`) || moveTest == true) && top == true){
                                cell.innerHTML += `<span class="dot" id="back" data-direction="${direction}"></span>`;
                                if(moveTest != "hasViewOnKing"){
                                    top = false;     
                                }else{
                                    piecesInWay[0].push(cell)
                                }
                            }
                            else{
                                top = false;     
                            }
                        }
                    })                      
                }

                for (let index = currentRow; index > 1; index--) {
                    if(direction != "none"){
                        direction = "down"
                    }
                    let Row = nextFields[0][index-2];
                    chessrows.forEach(chessrow => {
                        if(chessrow.dataset.value == Row[0]){
                            var cell = chessrow.querySelector(`[data-value="${Row[1]}"]`);
                            if(cell.innerHTML === "" && bottom == true){
                                cell.innerHTML += `<span class="dot" data-direction="${direction}"></span>`;
                                if(moveTest === "hasViewOnKing"){
                                    pinningCells[1].push(cell);
                                }
                            }
                            else if((cell.querySelector("#white-king") || cell.querySelector("#black-king")) && moveTest == true && bottom == true){
                                cell.innerHTML += `<span class="dot" id="back" data-direction="${direction}"></span>`;
                                direction = "none"
                            }
                            else if(cell.querySelector(".dot") && !cell.querySelector(".piece")){}
                            else if((cell.querySelector(`[id^="${colorString}"]`) || moveTest == true) && bottom == true){
                                cell.innerHTML += `<span class="dot" id="back" data-direction="${direction}"></span>`;
                                if(moveTest != "hasViewOnKing"){
                                    bottom = false;     
                                }else{
                                    piecesInWay[1].push(cell)
                                }                          
                            }
                            else{
                                bottom = false;     
                            }
                        }
                    })                   
                }

                for (let index = currentColumn; index < 8; index++) {
                    if(direction != "none"){
                        direction = "right"
                    }
                    let Row = nextFields[1][index];
                    chessrows.forEach(chessrow => {
                        if(chessrow.dataset.value == Row[0]){
                            var cell = chessrow.querySelector(`[data-value="${Row[1]}"]`);
                            if(cell.innerHTML === "" && right == true){
                                cell.innerHTML += `<span class="dot" data-direction="${direction}"></span>`;
                                if(moveTest === "hasViewOnKing"){
                                    pinningCells[2].push(cell);
                                }
                            }
                            else if((cell.querySelector("#white-king") || cell.querySelector("#black-king")) && moveTest == true && right == true){
                                cell.innerHTML += `<span class="dot" id="back" data-direction="${direction}"></span>`;
                                direction = "none";
                            }
                            else if(cell.querySelector(".dot") && !cell.querySelector(".piece")){}
                            else if((cell.querySelector(`[id^="${colorString}"]`) || moveTest == true) && right == true){
                                cell.innerHTML += `<span class="dot" id="back" data-direction="${direction}"></span>`;
                                if(moveTest != "hasViewOnKing"){
                                    right = false;     
                                }else{
                                    piecesInWay[2].push(cell)
                                }    
                            }
                            else{
                                right = false;     
                            }
                        }
                    })                    
                }

                for (let index = currentColumn; index > 1; index--) {
                    if(direction != "none"){
                        direction = "left"
                    }
                    let Row = nextFields[1][index-2];
                    chessrows.forEach(chessrow => {
                        if(chessrow.dataset.value == Row[0]){
                            var cell = chessrow.querySelector(`[data-value="${Row[1]}"]`);
                            if(cell.innerHTML === "" && left == true){
                                cell.innerHTML += `<span class="dot" data-direction="${direction}"></span>`;
                                if(moveTest === "hasViewOnKing"){
                                    pinningCells[3].push(cell);
                                }
                            }
                            else if((cell.querySelector("#white-king") || cell.querySelector("#black-king")) && moveTest == true && left == true){
                                cell.innerHTML += `<span class="dot" id="back" data-direction="${direction}"></span>`;
                                direction = "none";
                            }
                            else if(cell.querySelector(".dot") && !cell.querySelector(".piece")){}
                            else if((cell.querySelector(`[id^="${colorString}"]`) || moveTest == true) && left == true){
                                cell.innerHTML += `<span class="dot" id="back" data-direction="${direction}"></span>`;
                                if(moveTest != "hasViewOnKing"){
                                    left = false;     
                                }else{
                                    piecesInWay[3].push(cell)
                                }    
                            }
                            else{
                                left = false;     
                            }
                        }
                    })                   
                }
                try{
                    piecesInWay.forEach(piecesInDirection => {
                        if(!(piecesInDirection.length < 2) && piecesInDirection[1].querySelector(".piece").id === `${colorString}-king`){
                            collectionOfPinCells.push([element.parentNode, pinningCells]);
                            pieceNotAllowedToMove.push(piecesInDirection[0]);
                            pinningPiece.push(element.parentNode);
                            let angleNumber;
                            switch(piecesInDirection[0].querySelector(".dot").dataset.direction){
                                case "up":
                                angleNumber = 0;
                                    break;
                                case "down":
                                    angleNumber = 1;
                                    break;
                                case "right":
                                    angleNumber = 2;
                                    break;
                                case "left":
                                    angleNumber = 3;
                                    break;
                                default:
                                    console.log("something unexpected happened");
                                    break;
                            }
                            pinningAngle.push(angleNumber)
                        }
                    })
                }catch{}
                if(moveTest == false && (whoIsInCheck === "" || element.id.includes(whoIsInCheck))){
                    removeInvalidDots();
                }
                checkingForPin(element);
                dotFunctionality(element, ImageToUse, pieceToUse, colorString);
            }
        }
    },
    "queen": {
        piece: "queen",
        blackqueen: "black-queen",
        whitequeen: "white-queen",
        bImage: "pieces/black-queen.svg",
        wImage: "pieces/white-queen.svg",
        move(element, isWhite, colorString, moveTest){
            if(moveTest == false){
                dotRemoval();
            }
            if(moveTest === "hasViewOnKing"){
                dotRemoval();
                if(colorString === "white"){
                    colorString = "black"
                }
                else{
                    colorString = "white"
                }
            }
            if(moveTest === "stalemate"){
                moveTest = true;
            }
            let currentRow = element.parentNode.parentNode.dataset.value;
            let currentColumn = element.parentNode.dataset.value;
            let nextFields = returnFields(element)
            let top = true;
            let bottom = true;
            let right = true;
            let left = true;
            let leftTop = true;
            let rightTop = true;
            let leftBottom = true;
            let rightBottom = true;
            let ImageToUse = this.bImage;
            let pieceToUse = this.blackqueen;
            let pinningCells = [[],[],[],[],[],[],[],[]]
            let piecesInWay = [[], [],[], [],[], [],[], [],]
            let direction;
            
            if(isWhite === true){
                ImageToUse = this.wImage;
                pieceToUse = this.whitequeen;
                if((turns % 2 == 0 && promotionPending == false) || moveTest == true || moveTest === "hasViewOnKing"){
                    interactWithPiece(ImageToUse, pieceToUse);
                }
            }else{
                if((turns % 2 == 1 && promotionPending == false) || moveTest == true || moveTest === "hasViewOnKing"){
                    interactWithPiece(ImageToUse, pieceToUse);
                }
            }

            function interactWithPiece(ImageToUse, pieceToUse){
                top = true;
                bottom = true;
                right = true;
                left = true;

                for (let index = currentRow; index < 8; index++) {
                    if(direction != "none"){
                        direction = "up"
                    }
                    let Row = nextFields[1][0][index];
                    chessrows.forEach(chessrow => {
                        if(chessrow.dataset.value == Row[0]){
                            var cell = chessrow.querySelector(`[data-value="${Row[1]}"]`);
                            if(cell.innerHTML === "" && top == true){
                                cell.innerHTML += `<span class="dot" data-direction="up"></span>`;
                                if(moveTest === "hasViewOnKing"){
                                    pinningCells[0].push(cell)
                                }
                            }
                            else if((cell.querySelector("#white-king") || cell.querySelector("#black-king")) && moveTest == true && top == true){
                                cell.innerHTML += `<span class="dot" id="back" data-direction="up"></span>`;
                            }
                            else if(cell.querySelector(".dot") && !cell.querySelector(".piece")){}
                            else if((cell.querySelector(`[id^="${colorString}"]`) || moveTest == true) && top == true){
                                cell.innerHTML += `<span class="dot" id="back" data-direction="up"></span>`;
                                if(moveTest != "hasViewOnKing"){
                                    top = false;     
                                }else{
                                    piecesInWay[0].push(cell)
                                }    
                            }
                            else{
                                top = false;     
                            }
                        }
                    })                   
                }

                for (let index = currentRow; index > 1; index--) {
                    if(direction != "none"){
                        direction = "down"
                    }
                    let Row = nextFields[1][0][index-2];
                    chessrows.forEach(chessrow => {
                        if(chessrow.dataset.value == Row[0]){
                            var cell = chessrow.querySelector(`[data-value="${Row[1]}"]`);
                            if(cell.innerHTML === "" && bottom == true){
                                cell.innerHTML += `<span class="dot" data-direction="${direction}"></span>`;
                                if(moveTest === "hasViewOnKing"){
                                    pinningCells[1].push(cell)
                                }
                            }
                            else if((cell.querySelector("#white-king") || cell.querySelector("#black-king")) && moveTest == true && bottom == true){
                                cell.innerHTML += `<span class="dot" id="back" data-direction="${direction}"></span>`;
                                direction = "none";
                            }
                            else if(cell.querySelector(".dot") && !cell.querySelector(".piece")){}
                            else if((cell.querySelector(`[id^="${colorString}"]`) || moveTest == true) && bottom == true){
                                cell.innerHTML += `<span class="dot" id="back" data-direction="${direction}"></span>`;
                                if(moveTest != "hasViewOnKing"){
                                    bottom = false;     
                                }else{
                                    piecesInWay[1].push(cell)
                                }   
                            }
                            else{
                                bottom = false;     
                            }
                        }
                    })                   
                }

                for (let index = currentColumn; index < 8; index++) {
                    if(direction != "none"){
                        direction = "right"
                    }
                    let Row = nextFields[1][1][index];
                    chessrows.forEach(chessrow => {
                        if(chessrow.dataset.value == currentRow){
                            var cell = chessrow.querySelector(`[data-value="${Row[1]}"]`);
                            if(cell.innerHTML === "" && right == true){
                                cell.innerHTML += `<span class="dot" data-direction="${direction}"></span>`;
                                if(moveTest === "hasViewOnKing"){
                                    pinningCells[2].push(cell)
                                }
                            }
                            else if((cell.querySelector("#white-king") || cell.querySelector("#black-king")) && moveTest == true && right == true){
                                cell.innerHTML += `<span class="dot" id="back" data-direction="${direction}"></span>`;
                                direction = "none";
                            }
                            else if(cell.querySelector(".dot") && !cell.querySelector(".piece")){}
                            else if((cell.querySelector(`[id^="${colorString}"]`) || moveTest == true || moveTest === "hasViewOnKing")&& right == true){
                                cell.innerHTML += `<span class="dot" id="back" data-direction="${direction}"></span>`;
                                if(moveTest != "hasViewOnKing"){
                                    right = false;     
                                }else{
                                    piecesInWay[2].push(cell)
                                }                                
                            }
                            else{
                                right = false;     
                            }
                        }
                    })                   
                }

                for (let index = currentColumn; index > 1; index--) {
                    if(direction != "none"){
                        direction = "left"
                    }
                    let Row = nextFields[1][1][index-2];
                    chessrows.forEach(chessrow => {
                        if(chessrow.dataset.value == Row[0]){
                            var cell = chessrow.querySelector(`[data-value="${Row[1]}"]`);
                            if(cell.innerHTML === "" && left == true){
                                cell.innerHTML += `<span class="dot" data-direction="${direction}"></span>`;
                                if(moveTest === "hasViewOnKing"){
                                    pinningCells[3].push(cell)
                                }
                            }
                            else if((cell.querySelector("#white-king") || cell.querySelector("#black-king")) && moveTest == true && left == true){
                                cell.innerHTML += `<span class="dot" id="back" data-direction="${direction}"></span>`;
                                direction = "none";
                            }
                            else if(cell.querySelector(".dot") && !cell.querySelector(".piece")){}
                            else if((cell.querySelector(`[id^="${colorString}"]`) || moveTest == true || moveTest === "hasViewOnKing") && left == true){
                                cell.innerHTML += `<span class="dot" id="back" data-direction="${direction}"></span>`;
                                if(moveTest != "hasViewOnKing"){
                                    left = false;     
                                }else{
                                    piecesInWay[3].push(cell)
                                }
                            }
                            else{
                                left = false;     
                            }
                        }
                    })                   
                }

                leftBottom = true;
                leftTop = true;
                rightBottom = true;
                rightTop = true;

                for (let index = currentRow; index < 8; index++) {
                    if(direction != "none"){
                        direction = "upleft"
                    }
                let Row = nextFields[0][index];
                chessrows.forEach(chessrow => {
                    if(chessrow.dataset.value == Row[0]){
                        chessrow.querySelectorAll("th").forEach(cell => {
                                if(cell.dataset.value == Row[1] && leftTop === true){
                                    if(cell.innerHTML === ""){
                                        cell.innerHTML += `<span class="dot" data-direction="${direction}"></span>`;
                                        if(moveTest === "hasViewOnKing"){
                                            pinningCells[4].push(cell)
                                        }
                                    }
                                    else if((cell.querySelector("#white-king") || cell.querySelector("#black-king")) && moveTest == true && leftTop == true){
                                        cell.innerHTML += `<span class="dot" id="back" data-direction="${direction}"></span>`;
                                        direction = "none";
                                    }
                                    else if(cell.querySelector(".dot") && !cell.querySelector(".piece")){}
                                    else{
                                        if(cell.querySelector(`[id^="${colorString}"]`) || moveTest == true){
                                            cell.innerHTML += `<span class="dot" id="back" data-direction="${direction}"></span>`;
                                        }      
                                        if(moveTest != "hasViewOnKing"){
                                            leftTop = false;     
                                        }else{
                                            piecesInWay[4].push(cell)
                                        }    
                                    }
                                }
                                else if(cell.dataset.value == Row[2] && rightTop === true){
                                    if(direction != "none"){
                                        direction = "upright"
                                    }
                                    if(cell.innerHTML === ""){
                                        cell.innerHTML += `<span class="dot" data-direction="${direction}"></span>`;
                                        if(moveTest === "hasViewOnKing"){
                                            pinningCells[5].push(cell)
                                        }
                                    }
                                    else if((cell.querySelector("#white-king") || cell.querySelector("#black-king")) && moveTest == true && rightTop == true){
                                        cell.innerHTML += `<span class="dot" id="back" data-direction="${direction}"></span>`;
                                        direction = "none";
                                    }
                                    else if(cell.querySelector(".dot") && !cell.querySelector(".piece")){}
                                    else{
                                        if(cell.querySelector(`[id^="${colorString}"]`) || moveTest == true){
                                            cell.innerHTML += `<span class="dot" id="back" data-direction="${direction}"></span>`;
                                        }
                                        if(moveTest != "hasViewOnKing"){
                                            rightTop = false;     
                                        }else{
                                            piecesInWay[5].push(cell)
                                        }    
                                    } 
                                }        
                            })
                        }
                    })                    
                }
                for (let index = currentRow; index > 1; index--) {
                    let Row = nextFields[0][index - 2];
                    chessrows.forEach(chessrow => {
                        if(chessrow.dataset.value == Row[0]){
                            chessrow.querySelectorAll("th").forEach(cell => {
                                if(cell.dataset.value == Row[1] && rightBottom === true){
                                    if(direction != "none"){
                                        direction = "downright"
                                    }
                                    if(cell.innerHTML === ""){
                                        cell.innerHTML += `<span class="dot" data-direction="${direction}"></span>`;
                                        if(moveTest === "hasViewOnKing"){
                                            pinningCells[6].push(cell)
                                        }
                                    }
                                    else if((cell.querySelector("#white-king") || cell.querySelector("#black-king")) && moveTest == true && leftBottom == true){
                                        cell.innerHTML += `<span class="dot" id="back" data-direction="${direction}"></span>`;
                                        direction = "none";
                                    }
                                    else if(cell.querySelector(".dot") && !cell.querySelector(".piece")){}
                                    else{
                                        if(cell.querySelector(`[id^="${colorString}"]`) || moveTest == true){
                                            cell.innerHTML += `<span class="dot" id="back" data-direction="${direction}"></span>`;
                                        }    
                                        if(moveTest != "hasViewOnKing"){
                                            rightBottom = false;     
                                        }else{
                                            piecesInWay[6].push(cell)
                                        }      
                                    }
                                }
                                if(cell.dataset.value == Row[2] && leftBottom === true){
                                    if(direction != "none"){
                                        direction = "downleft"
                                    }
                                    if(cell.innerHTML === ""){
                                        cell.innerHTML += `<span class="dot" data-direction="${direction}"></span>`;
                                        if(moveTest === "hasViewOnKing"){
                                            pinningCells[7].push(cell)
                                        }
                                    }
                                    else if((cell.querySelector("#white-king") || cell.querySelector("#black-king")) && moveTest == true && rightBottom == true){
                                        cell.innerHTML += `<span class="dot" id="back" data-direction="${direction}"></span>`;
                                        direction = "none";
                                    }
                                    else if(cell.querySelector(".dot") && !cell.querySelector(".piece")){}
                                    else{
                                        if(cell.querySelector(`[id^="${colorString}"]`) || moveTest == true){
                                            cell.innerHTML += `<span class="dot" id="back" data-direction="${direction}"></span>`;
                                        }
                                        if(moveTest != "hasViewOnKing"){
                                            leftBottom = false;     
                                        }else{
                                            piecesInWay[7].push(cell)
                                        }    
                                    } 
                                }        
                            })
                        }
                    })         
                }
               
                try{
                    piecesInWay.forEach(piecesInDirection => {
                        if(!(piecesInDirection.length < 2) && piecesInDirection[1].querySelector(".piece").id === `${colorString}-king`){
                            collectionOfPinCells.push([element.parentNode, pinningCells]);
                            pieceNotAllowedToMove.push(piecesInDirection[0]);
                            pinningPiece.push(element.parentNode);
                            let angleNumber;
                            switch(piecesInDirection[0].querySelector(".dot").dataset.direction){
                                case "up":
                                    angleNumber = 0;
                                    break;
                                case "down":
                                    angleNumber = 1;
                                    break;
                                case "right":
                                    angleNumber = 2;
                                    break;
                                case "left":
                                    angleNumber = 3;
                                    break;
                                case "upleft":
                                    angleNumber = 4;
                                    break;
                                case "upright":
                                    angleNumber = 5;
                                    break;
                                case "downright":
                                    angleNumber = 6;
                                    break;
                                case "downleft":
                                    angleNumber = 7;
                                    break;
                                default:
                                    console.log("something unexpected happened");
                                    break;
                            }
                            pinningAngle.push(angleNumber)
                        }
                    })
                }catch(e){alert(e.toString())}
                if(moveTest == false && (whoIsInCheck === "" || element.id.includes(whoIsInCheck))){
                    removeInvalidDots();
                }
                checkingForPin(element);
                dotFunctionality(element, ImageToUse, pieceToUse, colorString);
            }
        }
    },
    "king": {
        piece: "king",
        blackking: "black-king",
        whiteking: "white-king",
        bImage: "pieces/black-king.svg",
        wImage: "pieces/white-king.svg",
        move(element, isWhite, colorString, moveTest){
            if(moveTest == false){
                dotRemoval();
            }
            if(moveTest === "hasViewOnKing"){
                dotRemoval();
            }
            if(moveTest === "stalemate"){
                moveTest = true;
            }
            let ImageToUse = this.bImage;
            let pieceToUse = this.blackking;
            let nextFields = returnFields(element);

            if(isWhite === true){
                ImageToUse = this.wImage;
                pieceToUse = this.whiteking;
                if((turns % 2 == 0 && promotionPending == false) || moveTest == true){
                    interactWithPiece(ImageToUse, pieceToUse);
                }
            }else{
                if((turns % 2 == 1 && promotionPending == false) || moveTest == true){
                    interactWithPiece(ImageToUse, pieceToUse);
                }
            }

            function interactWithPiece(ImageToUse, pieceToUse){
                let attackOnCastle = 0;
                let rooksIdle = [];
                let currentRow = element.parentNode.parentNode;
                currentRow.querySelectorAll('[id*="rook"]').forEach(rook => {
                    if(rook.dataset.state == 0){
                        rooksIdle.push(rook);
                    }
                })
                if(element.dataset.state == 0){
                    for(let i = 0; i < rooksIdle.length; i++){
                        if(rooksIdle[i].parentNode.dataset.value == 1){
                            let cellsToCheck = [1,2,3,4,5];
                            currentRow.querySelectorAll("th").forEach(cell => {
                                if(cellsToCheck.includes(parseInt(cell.dataset.value))){
                                    if(cell.dataset.attacked == 1 || (cell.dataset.value != 1 && cell.dataset.value != 5 && cell.innerHTML != "")){
                                        attackOnCastle++;
                                    }
                                }
                            })

                            if(attackOnCastle == 0){
                                currentRow.querySelector(`[data-value="3"]`).innerHTML += `<span class="dot" id="longcastle" data-type="kingmove"></span>`
                            }
                            attackOnCastle = 0;
                        }
                        else if(rooksIdle[i].parentNode.dataset.value == 8){
                            let cellsToCheck = [5,6,7,8];
                            currentRow.querySelectorAll("th").forEach(cell => {
                                if(cellsToCheck.includes(parseInt(cell.dataset.value))){
                                    if(cell.dataset.attacked == 1 || (cell.dataset.value != 5 && cell.dataset.value != 8 && cell.innerHTML != "")){
                                        attackOnCastle++;
                                    }
                                }
                            })

                            if(attackOnCastle == 0){
                                currentRow.querySelector(`[data-value="7"]`).innerHTML += `<span class="dot" id="castle" data-type="kingmove"></span>`
                            }

                            attackOnCastle = 0;
                        }
                    }
                }

                for(let i = 0; i < 8; i++){
                    chessrows.forEach(Row =>{
                        if(Row.dataset.value == nextFields[i][0]){
                            Row.querySelectorAll("th").forEach(cell => {
                                if(cell.dataset.value == nextFields[i][1]){
                                    if((cell.innerHTML === "" || (cell.querySelector(".dot") && !cell.querySelector("#back"))) && cell.dataset.attacked == 0){
                                        cell.innerHTML = `<span class="dot" data-type="kingmove"></span>`;
                                    }
                                    else if(cell.querySelector(`[id^="${colorString}"]`) && cell.dataset.attacked == 0){
                                        cell.innerHTML += `<span class="dot" id="back" data-type="kingmove"></span>`;
                                    }
                                }
                            })
                        }
                    })
                }
                dotFunctionality(element, ImageToUse, pieceToUse, colorString);
            }
        }
    }
}

addFunctionality();

function returnFieldsPawn(element, turns, isWhite, moveTest){
    let nextFields; 
    if(isWhite == true){
        if(element.dataset.state == 0 && (turns % 2 == 0 || moveTest == true)){
            nextFields = [[parseInt(element.parentNode.parentNode.dataset.value) + 1, element.parentNode.dataset.value], [parseInt(element.parentNode.parentNode.dataset.value) + 2, element.parentNode.dataset.value]]
        }
        else if(turns % 2 == 0 || moveTest == true){
            nextFields = [[parseInt(element.parentNode.parentNode.dataset.value) + 1, element.parentNode.dataset.value]]
        } 
    } 
    else{
        if(element.dataset.state == 0){
            nextFields = [[parseInt(element.parentNode.parentNode.dataset.value) - 1, element.parentNode.dataset.value], [parseInt(element.parentNode.parentNode.dataset.value) - 2, element.parentNode.dataset.value]]
        }
        else{
            nextFields = [[parseInt(element.parentNode.parentNode.dataset.value) - 1, element.parentNode.dataset.value]]
        } 
    }
    return nextFields;
}

function returnFields(element){
    let Rows = [1, 2, 3, 4, 5, 6, 7, 8]
    let column = [1, 2, 3, 4, 5, 6, 7, 8]
    const currentRow = parseInt(element.parentNode.parentNode.dataset.value);
    const currentColumn = parseInt(element.parentNode.dataset.value);
    var NewSpaces = [];
    if(element.id == "black-bishop" || element.id == "white-bishop"){
        for(let i = 1; i <= Rows.length; i++){
            let rowDistance = currentRow - i;
            NewSpaces.push([i, parseInt(currentColumn) + parseInt(rowDistance), parseInt(currentColumn) + parseInt(rowDistance) * -1])
        }
        return NewSpaces;
    }
    else if(element.id == "black-rook" || element.id == "white-rook"){
        NewSpaces.push([],[])
        for(let i = 1; i <= Rows.length; i++){
            NewSpaces[0].push([i, currentColumn])
        }
        for (let i = 1; i <= column.length; i++) {
            NewSpaces[1].push([currentRow, i])
        }
        return NewSpaces;
    }
    else if(element.id == "black-knight" || element.id == "white-knight"){
        NewSpaces.push([currentRow + 2, currentColumn - 1], [currentRow + 2, currentColumn + 1])
        NewSpaces.push([currentRow - 2, currentColumn - 1], [currentRow - 2, currentColumn + 1])
        NewSpaces.push([currentRow - 1, currentColumn - 2], [currentRow + 1, currentColumn + 2])
        NewSpaces.push([currentRow + 1, currentColumn - 2], [currentRow - 1, currentColumn + 2])
        return NewSpaces;
    }
    else if(element.id == "black-queen" || element.id == "white-queen"){
        NewSpaces.push([],[[], []])
        for(let i = 1; i <= Rows.length; i++){
            let rowDistance = currentRow - i;
            NewSpaces[0].push([i, parseInt(currentColumn) + parseInt(rowDistance), parseInt(currentColumn) + parseInt(rowDistance) * -1])
        }
        for(let i = 1; i <= Rows.length; i++){
            NewSpaces[1][0].push([i, currentColumn])
        }
        for (let i = 1; i <= column.length; i++) {
            NewSpaces[1][1].push([currentRow, i])
        }
        return NewSpaces;
    }
    else if(element.id == "black-king" || element.id == "white-king"){
        NewSpaces.push([currentRow + 1, currentColumn], [currentRow + 1, currentColumn - 1], [currentRow + 1, currentColumn + 1])
        NewSpaces.push([currentRow, currentColumn - 1], [currentRow, currentColumn + 1])
        NewSpaces.push([currentRow - 1, currentColumn], [currentRow - 1, currentColumn - 1], [currentRow - 1, currentColumn + 1])
        return NewSpaces;
    }
}

function pawnMovement(piece, nextFields, pieceToUse, imageToUse, whatIsRest, colorString, moveTest){
    let goOn = true;
    let alreadyPut;
    let firstCell;
    if(moveTest == false){
        dotRemoval();
    }
    if(moveTest === "hasViewOnKing"){
        dotRemoval();
    }
    chessrows.forEach(element => {
        if((turns % 2 == whatIsRest && promotionPending == false) || moveTest == true){
            if(element.dataset.value == nextFields[0][0]){
                if(element.querySelector(`[data-value="${nextFields[0][1]}"]`).innerHTML === "" && goOn == true && (moveTest == false || moveTest == "stalemate")){
                    element.querySelector(`[data-value="${nextFields[0][1]}"]`).innerHTML = `<span class="dot" data-direction="0"></span>`;
                    firstCell = element.querySelector(`[data-value="${nextFields[0][1]}"]`);
                }
                else{
                    if(whatIsRest == 0){
                        try{
                            alreadyPut.innerHTML = "";
                        }catch{}
                    }
                    goOn = false;
                }
                let leftOfPAwn = element.querySelector(`[data-value="${parseInt(nextFields[0][1]) - 1}"]`);
                let rightOfPawn = element.querySelector(`[data-value="${parseInt(nextFields[0][1]) + 1}"]`);
                try{
                    if(rightOfPawn.querySelector(`[id^="${colorString}"]`) || rightOfPawn.id === "enPassant" || moveTest == true){
                        if(moveTest == true && !rightOfPawn.querySelector(".piece")){
                            rightOfPawn.innerHTML += `<span class="dot" id="back" data-direction="0" data-type="pawnAttack"></span>`
                        }else if(moveTest != "stalemate"){
                            rightOfPawn.innerHTML += `<span class="dot" id="back" data-direction="0" data-type="pawnAttack"></span>`
                        }
                    }
                }
                catch{}
                try{
                    if((leftOfPAwn.querySelector(`[id^="${colorString}"]`) || leftOfPAwn.id === "enPassant" || moveTest == true) && moveTest != "stalemate"){
                        if(moveTest == true && !leftOfPAwn.querySelector(".piece")){
                            leftOfPAwn.innerHTML += `<span class="dot" id="back" data-direction="0" data-type="pawnAttack"></span>`
                        }else if(moveTest != "stalemate"){
                            leftOfPAwn.innerHTML += `<span class="dot" id="back" data-direction="0" data-type="pawnAttack"></span>`
                        }
                    }
                }catch{}
            }
            else if(piece.dataset.state == 0 && element.dataset.value == nextFields[1][0]){
                if(element.querySelector(`[data-value="${nextFields[1][1]}"]`).innerHTML === "" && goOn == true){
                    element.querySelector(`[data-value="${nextFields[1][1]}"]`).innerHTML = `<span class="dot" id="twoSpaces" data-direction="0"></span>`;
                    alreadyPut = element.querySelector(`[data-value="${nextFields[1][1]}"]`);
                }
            }
        }
    })

    if(moveTest == false && (whoIsInCheck === "" || piece.id.includes(whoIsInCheck))){
        removeInvalidDots();
    }
    checkingForPin(piece)
    
    document.querySelectorAll(".dot").forEach(dot => {
        dot.addEventListener("click",  (event) => {
            chessMove.play();
            boardPreMove = document.querySelector(".Chessboard").innerHTML;
            xyMovedTo = [parseInt(dot.parentNode.dataset.value), parseInt(dot.parentNode.parentNode.dataset.value)]
            event.preventDefault();
            if(dot.parentNode.id === "enPassant"){
                let pieces = chessboard.querySelectorAll(`.piece`);
                pieces.forEach(piece => {
                    if(piece.dataset.enpassantable === "yes"){
                        piece.dataset.enpassantable = "no";
                        try{
                            if(turns % 2 == 0){
                                document.querySelector(".eatenPieces#white").innerHTML += `<image class="piece" id="black-pawn" data-state="1" data-enpassantable="no" src="pieces/black-pawn.svg"/>`;
                            }
                            else{
                                document.querySelector(".eatenPieces#black").innerHTML += `<image class="piece" id="white-pawn" data-state="1" data-enpassantable="no" src="pieces/white-pawn.svg"/>`;
                            }
                        }catch{}
                        piece.parentNode.innerHTML = "";
                    }
                })
            }
            document.querySelectorAll("th").forEach(item => {
                if(item.id === "enPassant"){
                    item.removeAttribute("id");
                }
            })
            document.querySelectorAll(`.piece`).forEach(piece => {
                if(piece.dataset.enpassantable === "yes"){
                    piece.dataset.enpassantable = "no";
                }
            })
            let movedToCell = dot.parentNode;
            let newPawn;

            try{
                if(turns % 2 == 0 && dot.parentNode.querySelector(".piece") !== null){
                    document.querySelector(".eatenPieces#white").append(dot.parentNode.querySelector(".piece"));
                }
                else if(turns % 2 == 1 && dot.parentNode.querySelector(".piece") !== null){
                    document.querySelector(".eatenPieces#black").append(dot.parentNode.querySelector(".piece"));
                }
            }catch{}

            if(dot.id === "twoSpaces"){
                firstCell.setAttribute("id", "enPassant");
                dot.parentNode.innerHTML = `<image class="piece" id="${pieceToUse}" data-state="1" data-enpassantable="yes" src="${imageToUse}"/>`;
                newPawn = movedToCell.querySelector(".piece");
            }
            else{
                dot.parentNode.innerHTML = `<image class="piece" id="${pieceToUse}" data-state="1" data-enpassantable="no" src="${imageToUse}"/>`;
                newPawn = movedToCell.querySelector(".piece");
            }
            
            chessrows.forEach(row => {
                try{
                    if(row.dataset.value == piece.parentNode.parentNode.dataset.value){
                        row.querySelector(`[data-value="${piece.parentNode.dataset.value}"]`).innerHTML = "";
                    }
                }catch{}
            })

            if(newPawn.id === "white-pawn" && newPawn.parentNode.parentNode.dataset.value == 8)
            {
                dotRemoval();
                document.querySelector(".promotingPieces").innerHTML = `
                <img class="promotion" id="white-bishop" src="pieces/white-bishop.svg"/>
                <img class="promotion" id="white-knight" src="pieces/white-knight.svg"/>
                <img class="promotion" id="white-rook" src="pieces/white-rook.svg"/>
                <img class="promotion" id="white-queen" src="pieces/white-queen.svg" />`
                promotionPending = true;
                document.querySelectorAll(".promotion").forEach(promotion => {
                    promotion.addEventListener("click", (event) => {
                        movedToCell.innerHTML = `<image class="piece" id="${promotion.id}" src="${promotion.src}" data-state="1"/>`
                        document.querySelector(".promotingPieces").innerHTML = `<div class="noPromotion">no pawns have passed</div>`;
                        runturn(colorString);
                    })
                })
            }
            else if(newPawn.id === "black-pawn" && newPawn.parentNode.parentNode.dataset.value == 1)
            {
                dotRemoval();
                document.querySelector(".promotingPieces").innerHTML = `
                <img class="promotion" id="black-bishop" src="pieces/black-bishop.svg" />
                <img class="promotion" id="black-knight" src="pieces/black-knight.svg" />
                <img class="promotion" id="black-rook" src="pieces/black-rook.svg" />
                <img class="promotion" id="black-queen" src="pieces/black-queen.svg" />`
                promotionPending = true;
                document.querySelectorAll(".promotion").forEach(promotion => {
                    promotion.addEventListener("click", (event) => {
                        movedToCell.innerHTML = `<image class="piece" id="${promotion.id}" src="${promotion.src}" data-state="1"/>`
                        document.querySelector(".promotingPieces").innerHTML = `<div class="noPromotion">no pawns have passed</div>`;
                        runturn(colorString);
                    })
                })
            }
            else{
                runturn(colorString);
            }
        })
    })
}

function dotRemoval(){
    document.querySelectorAll(".dot").forEach(toRemove =>{
        toRemove.remove();
    })
}

function addFunctionality(){
    chessboard = document.querySelector(".Chessboard");
    chessrows = chessboard.querySelectorAll("tr");
    checkForCheck();
    
    document.querySelectorAll("#white-pawn").forEach(whitepawn =>{
        whitepawn.addEventListener("click", (event) => {pieces["white-pawn"].move(whitepawn, false); getCoordinates(whitepawn)})
    })
    document.querySelectorAll("#black-pawn").forEach(blackpawn =>{
        blackpawn.addEventListener("click", (event) => {pieces["black-pawn"].move(blackpawn, false); getCoordinates(blackpawn)})
    })
    document.querySelectorAll("#white-bishop").forEach(bishop => {
        bishop.addEventListener("click", (event) => {pieces["bishop"].move(bishop, true, "black", false); getCoordinates(bishop)})
    })
    document.querySelectorAll("#black-bishop").forEach(bishop => {
        bishop.addEventListener("click", (event) => {pieces["bishop"].move(bishop, false, "white", false); getCoordinates(bishop)})
    })
    document.querySelectorAll("#white-rook").forEach(rook => {
        rook.addEventListener("click", (event) => {pieces["rook"].move(rook, true, "black", false); getCoordinates(rook)})
    })
    document.querySelectorAll("#black-rook").forEach(rook => {
        rook.addEventListener("click", (event) => {pieces["rook"].move(rook, false, "white", false); getCoordinates(rook)})
    })
    document.querySelectorAll("#white-knight").forEach(knight => {
        knight.addEventListener("click", (event) => {pieces["knight"].move(knight, true, "black", false); getCoordinates(knight)})
    })
    document.querySelectorAll("#black-knight").forEach(knight => {
        knight.addEventListener("click", (event) => {pieces["knight"].move(knight, false, "white", false); getCoordinates(knight)})
    })
    document.querySelectorAll("#white-queen").forEach(queen => {
        queen.addEventListener("click", (event) => {pieces["queen"].move(queen, true, "black", false); getCoordinates(queen)})
    })
    document.querySelectorAll("#black-queen").forEach(queen => {
        queen.addEventListener("click", (event) => {pieces["queen"].move(queen, false, "white", false); getCoordinates(queen)})
    })
    document.querySelectorAll("#white-king").forEach(king => {
        king.addEventListener("click", (event) => {pieces["king"].move(king, true, "black", false); getCoordinates(king)})
    })
    document.querySelectorAll("#black-king").forEach(king => {
        king.addEventListener("click", (event) => {pieces["king"].move(king, false, "white", false); getCoordinates(king)})
    })
}

function getCoordinates(piece){
    xyClickedPiece = [parseInt(piece.parentNode.dataset.value), parseInt(piece.parentNode.parentNode.dataset.value)]
}

async function runturn(color){
    isRiddleActive = false;
    cellsOnCheck = [];
    attackingPieces = [];
    validKingCells = [];
    attackingAngle = [];
    pinningAngle = [];
    pinningPiece = [];
    collectionOfPinCells = [];
    pieceNotAllowedToMove = [];
    promotionPending = false;
    whoIsInCheck = "";
    let colorString = color;

    try{
        isRiddleActive = await processRiddle();
        document.querySelector(".promotingPieces").innerHTML = `<div class="noPromotion">no pawns have passed</div>`;
    }catch{}

    document.querySelectorAll("th").forEach(cell => {
        cell.dataset.attacked = 0;
    })
    dotRemoval();
    if(color === "white" && isRiddleActive != true){
        colorString = "black";
    }
    else if(isRiddleActive != true){
        colorString = "white";
    }

    
    turns++;
    document.querySelectorAll("th").forEach(cell => {
        if(cell.querySelector(`[id^="${colorString}"]`)){
            inspectedPiece = cell.querySelector(".piece")
            if(inspectedPiece.id === `${colorString}-pawn`){
                pieces[`${colorString}-pawn`].move(inspectedPiece, true)
                addAttackingPieces(inspectedPiece);
            }
            else if(inspectedPiece.id === `${colorString}-rook`){
                pieces["rook"].move(inspectedPiece, true, `${colorString}`, true)
                addAttackingPieces(inspectedPiece);
            }
            else if(inspectedPiece.id === `${colorString}-knight`){
                pieces["knight"].move(inspectedPiece, true, `${colorString}`, true)
                addAttackingPieces(inspectedPiece);
            }
            else if(inspectedPiece.id === `${colorString}-bishop`){
                pieces["bishop"].move(inspectedPiece, true, `${colorString}`, true)
                addAttackingPieces(inspectedPiece)
            }
            else if(inspectedPiece.id === `${colorString}-queen`){
                pieces["queen"].move(inspectedPiece, true, `${colorString}`, true)
                addAttackingPieces(inspectedPiece);
            }
            else if(inspectedPiece.id === `${colorString}-king`){
                pieces["king"].move(inspectedPiece, true, `${colorString}`, true)
                addAttackingPieces(inspectedPiece);
            }
        }
    })
    turns = turns - 1;
    dotRemoval();
    moveTester(colorString, true);
    document.querySelectorAll(".dot").forEach(dot => {
        dot.parentNode.dataset.attacked = 1;
    })
    document.querySelectorAll("th").forEach(cell =>{
        if(cell.dataset.attacked == 0){
            validKingCells.push(cell)
        }
    })
    removeInvalidDots();
    dotRemoval();
    moveTester(colorString, "hasViewOnKing");
    dotRemoval()
    turns++;
    let moveIndicator =  document.querySelector(".moveIndicator");
    if(turns % 2 == 0 && turns != "none" && moveIndicator != null){
        moveIndicator.style.backgroundColor = "white";
    }
    else if(turns != "none" && moveIndicator != null){
        moveIndicator.style.backgroundColor = "black";
    }

    addFunctionality();
}

function checkForCheck(){
    if(isRiddleActive == true){
        document.querySelectorAll("th").forEach(cell => {
            cell.dataset.attacked = 0;
        })
        if(turns % 2 == 0){
            moveTester("white", true)
        }
        else if(turns % 2 == 1){
            moveTester("black", true)
        }
        document.querySelectorAll(".dot").forEach(dot => {
            dot.parentNode.dataset.attacked = 1;
        })
        dotRemoval();
    }
    else if(document.querySelector(".isItCheck") != null){
        document.querySelector(".isItCheck").innerHTML = ""
    }
    let amountOfMoves = [];
    let checkmate = false;

    if(document.querySelector("#white-king").parentNode.dataset.attacked == 1 && turns % 2 == 0){
        if(document.querySelector(".isItCheck") != null){
            document.querySelector(".isItCheck").innerHTML = "Check"
        }
        document.querySelectorAll("#white-king").forEach(king => {
            pieces["king"].move(king, true, "black", true);
        })
        document.querySelectorAll(".dot").forEach(dot => {
            amountOfMoves.push(dot.parentNode)
        })
        moveTesterDuringCheck("white", true)
        removeInvalidDots();
        document.querySelectorAll(".dot").forEach(dot => {
            if(!dot.parentNode.querySelector(`[id^="white"]`)){
                amountOfMoves.push(dot.parentNode);
            }
        })
        if(amountOfMoves.length == 0){
            document.querySelector(".isItCheck").innerHTML = "Checkmate"
            checkmate = true;
        }
        whoIsInCheck = "white";
        dotRemoval();
    }
    else if(turns % 2 == 0){
        let colorToCheck = "black"
        let color = "black"
        if(isRiddleActive == true){
            color = "white"
            colorToCheck = "black"
        }

        if(document.querySelector(".isItCheck") != null){
            document.querySelector(".isItCheck").innerHTML = "";
        }
        document.querySelectorAll("#white-king").forEach(king => {
            pieces["king"].move(king, true, color, true);
        })
        document.querySelectorAll(".dot").forEach(dot => {
            amountOfMoves.push(dot.parentNode)
        })
        moveTesterDuringCheck(colorToCheck, "stalemate")
        document.querySelectorAll(".dot").forEach(dot => {
            if(dot.parentNode.querySelectorAll(`[id^="${colorToCheck}"]`).length == 0){
                amountOfMoves.push(dot.parentNode);
            }
        })

        if(amountOfMoves.length == 0 || chessboard.querySelectorAll(".piece").length == 2){
            document.querySelector(".isItCheck").innerHTML = "Stalemate"
            turns = "none";
        }
        dotRemoval();
    }
    if(document.querySelector("#black-king").parentNode.dataset.attacked == 1 && turns % 2 == 1){
        if(document.querySelector(".isItCheck") != null){
            document.querySelector(".isItCheck").innerHTML = "Check"
        }
        document.querySelectorAll("#black-king").forEach(king => {
            pieces["king"].move(king, false, "white", true);
        })
        moveTesterDuringCheck("black", true)
        removeInvalidDots();
        document.querySelectorAll(".dot").forEach(dot => {
            if(!dot.parentNode.querySelector(`[id*="black"]`)){
                amountOfMoves.push(dot.parentNode);
            }
        })
        if(amountOfMoves.length == 0){
            if(document.querySelector(".isItCheck") != null){
                document.querySelector(".isItCheck").innerHTML = "Checkmate";
            }
            checkmate = true;
        }
        whoIsInCheck = "black";
        dotRemoval();
    }
    else if(turns % 2 == 1){
        let colorToCheck = "black"
        let color = "white"
        if(isRiddleActive == true){
            color = "black"
            colorToCheck = "white"
        }
        if(document.querySelector(".isItCheck") != null){
            document.querySelector(".isItCheck").innerHTML = "";
        }
        document.querySelectorAll("#black-king").forEach(king => {
            pieces["king"].move(king, true, color, true);
        })
        moveTesterDuringCheck(colorToCheck, "stalemate");
        document.querySelectorAll(".dot").forEach(dot => {
            if(dot.parentNode.querySelectorAll(`[id^="${colorToCheck}"]`).length == 0){
                amountOfMoves.push(dot.parentNode);
            }
        })

        if(amountOfMoves.length == 0 || chessboard.querySelectorAll(".piece").length == 2){
            document.querySelector(".isItCheck").innerHTML = "Stalemate";
            turns = "none";
        }
        dotRemoval();
    }
    if(isRiddleActive == true && checkmate == false){
        turns++;
    }
}

function moveTester(colorString, typeOfTest){
    document.querySelectorAll("th").forEach(cell => {
        if(cell.querySelector(`[id^="${colorString}"]`)){
            let inspectedPiece = cell.querySelector(".piece")
            if(inspectedPiece.id === `${colorString}-pawn`){
                pieces[`${colorString}-pawn`].move(inspectedPiece, typeOfTest)
            }
            else if(inspectedPiece.id === `${colorString}-rook`){
                pieces["rook"].move(inspectedPiece, true, `${colorString}`, typeOfTest)
            }
            else if(inspectedPiece.id === `${colorString}-knight`){
                pieces["knight"].move(inspectedPiece, true, `${colorString}`, typeOfTest)
            }
            else if(inspectedPiece.id === `${colorString}-bishop`){
                pieces["bishop"].move(inspectedPiece, true, `${colorString}`, typeOfTest)
            }
            else if(inspectedPiece.id === `${colorString}-queen`){
                pieces["queen"].move(inspectedPiece, true, `${colorString}`, typeOfTest)
            }
            else if(inspectedPiece.id === `${colorString}-king`){
                pieces["king"].move(inspectedPiece, true, `${colorString}`, typeOfTest)
            }
        }
    })
}

function moveTesterDuringCheck(colorString, checkForCheck){
    moveTester(colorString, checkForCheck)
}

function addAttackingPieces(inspectedPiece){
    document.querySelectorAll(".dot").forEach(dot => {
        dot.parentNode.dataset.attacked = 1;
    })

    if(document.querySelector("#white-king").parentNode.dataset.attacked == 1 && turns % 2 == 0){
        attackingAngle = document.querySelector("#white-king").parentNode.querySelector(".dot").dataset.direction;
        attackingPieces.push(inspectedPiece);
        document.querySelectorAll("th").forEach(cell => {
            if(cell === attackingPieces[0].parentNode){
                cellsOnCheck.push(cell);
            }
        })
        document.querySelectorAll(".dot").forEach(dot => {
            if(dot.dataset.direction === attackingAngle){
                cellsOnCheck.push(dot.parentNode);
            }
        })
    }
    else if(document.querySelector("#black-king").parentNode.dataset.attacked == 1 && turns % 2 == 1){
        attackingAngle = document.querySelector("#black-king").parentNode.querySelector(".dot").dataset.direction;
        attackingPieces.push(inspectedPiece);
        document.querySelectorAll("th").forEach(cell => {
            if(cell === attackingPieces[0].parentNode){
                cellsOnCheck.push(cell);
            }
        })
        document.querySelectorAll(".dot").forEach(dot => {
            if(dot.dataset.direction === attackingAngle){
                cellsOnCheck.push(dot.parentNode);
            }
        })
    }

    document.querySelectorAll("th").forEach(cell => {
        cell.dataset.attacked = 0;
    })
    dotRemoval();
}

function dotFunctionality(element, ImageToUse, pieceToUse, colorString){
    let castle = false;
    let currentRow = element.parentNode.parentNode;
    document.querySelectorAll(".dot").forEach(dot => {
        dot.addEventListener("click", (event) => {
            chessMove.play();
            boardPreMove = document.querySelector(".Chessboard").innerHTML;
            xyMovedTo = [parseInt(dot.parentNode.dataset.value), parseInt(dot.parentNode.parentNode.dataset.value)]
            event.preventDefault();
            document.querySelectorAll("th").forEach(item => {
                if(item.id === "enPassant"){
                    item.removeAttribute("id");
                }
            })
            document.querySelectorAll(`.piece`).forEach(piece => {
                if(piece.dataset.enpassantable === "yes"){
                    piece.dataset.enpassantable = "no";
                }
            })

            if(dot.id === "longcastle"){
                castle = true;
                let rook = currentRow.querySelector(`[data-value="1"]`).querySelector(".piece")
                rook.dataset.state = 1;
                rook.parentNode.innerHTML == "";
                currentRow.querySelector(`[data-value="3"]`).innerHTML = `<image class="piece" id="${pieceToUse}" data-identity="${element.dataset.identity}" data-state="1" src="${ImageToUse}"/>`;
                currentRow.querySelector(`[data-value="4"]`).append(rook);
            }
            else if(dot.id === "castle"){
                castle = true;
                let rook = currentRow.querySelector(`[data-value="8"]`).querySelector(".piece")
                rook.dataset.state = 1;
                rook.parentNode.innerHTML == "";
                currentRow.querySelector(`[data-value="7"]`).innerHTML = `<image class="piece" id="${pieceToUse}" data-identity="${element.dataset.identity}" data-state="1" src="${ImageToUse}"/>`;
                currentRow.querySelector(`[data-value="6"]`).append(rook);
            }

            try{
                if(turns % 2 == 0 && dot.parentNode.querySelector(".piece") !== null && castle == false){
                    document.querySelector(".eatenPieces#white").append(dot.parentNode.querySelector(".piece"));
                }
                else if(turns % 2 == 1 && dot.parentNode.querySelector(".piece") !== null && castle == false){
                    document.querySelector(".eatenPieces#black").append(dot.parentNode.querySelector(".piece"));
                }
            }catch{}
            if(castle == false){
                dot.parentNode.innerHTML = `<image class="piece" id="${pieceToUse}" data-identity="${element.dataset.identity}" data-state="1" src="${ImageToUse}"/>`;
            }
            chessrows.forEach(row => {
                try{
                    if(row.dataset.value == element.parentNode.parentNode.dataset.value){
                        row.querySelector(`[data-value="${element.parentNode.dataset.value}"]`).innerHTML = "";
                    }
                }catch{}
            })
            runturn(colorString);
        })
    })
}

function removeInvalidDots(){
    let counterOfCells = 0;
    let shouldCheckFurther = true;

    document.querySelectorAll(".dot").forEach(dot => {
        counterOfCells = 0;
        shouldCheckFurther = true;
        if(dot.dataset.type != "kingmove"){
            if(attackingPieces.length == 1){
                cellsOnCheck.forEach(acceptableCell => {
                    counterOfCells++;
                    if(acceptableCell === dot.parentNode){
                        shouldCheckFurther = false;
                    }else if(counterOfCells == cellsOnCheck.length && shouldCheckFurther == true){
                        dot.remove()
                    }
                })
            }
            else if(attackingPieces.length == 2){
                dot.remove()
            }
        }else{
            validKingCells.forEach(validCell => {
                counterOfCells++;
                if(validCell === dot.parentNode){
                    shouldCheckFurther = false;
                }else if(counterOfCells == validKingCells.length && shouldCheckFurther == true){
                    dot.remove()
                }  
            })
        }
    })
}

function checkingForPin(element){
    console.log(pinningPiece)
    console.log(pieceNotAllowedToMove)
    for(let i = 0; i < collectionOfPinCells.length; i++){
        if(element === pieceNotAllowedToMove[i].querySelector(".piece")){
            let dots = document.querySelectorAll(".dot");
            for(let a  = 0; a < dots.length; a++){
            let move = dots[a].parentNode;
                if(!(move === pinningPiece[i])){
                    let pinCombo = collectionOfPinCells[i]
                    if(pinningPiece[i].isSameNode(pinCombo[0])){
                        if(pinCombo[1][pinningAngle[i]].length == 0){
                            dots[a].remove()
                        }
                        else{
                            if(!(pinCombo[1][pinningAngle[i]].includes(move)) && move != null){
                                dots[a].remove();
                            }
                        }
                    }
                }
            }
        }
    }
}