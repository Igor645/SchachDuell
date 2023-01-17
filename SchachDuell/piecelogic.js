var chessboard = document.querySelector(".Chessboard");
var chessrows = chessboard.querySelectorAll("tr");
var turns = 0;

const pieces = {
    "white-pawn": {
        piece: "white-pawn",
        Image: "pieces/white-pawn.svg",
        move(element){
            let nextFields = returnFieldsPawn(element, turns, true); 
            pawnMovement(element, nextFields, "white-pawn", pieces["white-pawn"].Image, 0, "black")
        }
    },
    "black-pawn": {
        piece: "black-pawn",
        Image: "pieces/black-pawn.svg",
        move(element){
            let nextFields = returnFieldsPawn(element, turns, false); 
            pawnMovement(element, nextFields, "black-pawn", pieces["black-pawn"].Image, 1, "white");
        }
    },
    "bishop": {
        piece: "bishop",
        blackbishop: "black-bishop",
        whitebishop: "white-bishop",
        bImage: "pieces/black-bishop.svg",
        wImage: "pieces/white-bishop.svg",
        move(element, isWhite, colorString){
            dotRemoval();
            let nextFields = returnFields(element); 
            let currentRow = element.parentNode.parentNode.dataset.value;
            let leftTop = true;
            let rightTop = true;
            let leftBottom = true;
            let rightBottom = true;
            let ImageToUse = this.bImage;
            let pieceToUse = this.blackbishop;
            let direction;

            
            if(isWhite === true){
                ImageToUse = this.wImage;
                pieceToUse = this.whitebishop;
                if(turns % 2 == 0){
                    interactWithPiece(ImageToUse, pieceToUse);
                }
            }else{
                if(turns % 2 == 1){
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
                                    }
                                    else if(cell.querySelector("#white-king") || cell.querySelector("#black-king")){
                                        cell.innerHTML += `<span class="dot" id="back" data-direction="${direction}"></span>`;
                                        direction = "none";
                                    }
                                    else if(cell.querySelector(".dot") && !cell.querySelector(".piece")){}
                                    else{
                                        leftTop = false; 
                                        if(cell.querySelector(`[id^="${colorString}"]`) || moveTest == true){
                                            cell.innerHTML += `<span class="dot" id="back" data-direction="${direction}"></span>`;
                                        }      
                                    }
                                }
                                else if(cell.dataset.value == Row[2] && rightTop === true){
                                    if(direction != "none"){
                                        direction = "upright"
                                    }                                    
                                    if(cell.innerHTML === ""){
                                        cell.innerHTML += `<span class="dot" data-direction="${direction}"></span>`;
                                    }
                                    else if(cell.querySelector("#white-king") || cell.querySelector("#black-king")){
                                        cell.innerHTML += `<span class="dot" id="back" data-direction="${direction}"></span>`;
                                        direction = "none";
                                    }
                                    else if(cell.querySelector(".dot") && !cell.querySelector(".piece")){}
                                    else{
                                        rightTop = false; 
                                        if(cell.querySelector(`[id^="${colorString}"]`)){
                                            cell.innerHTML += `<span class="dot" id="back" data-direction="${direction}"></span>`;
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
                                    }
                                    else if(cell.querySelector("#white-king") || cell.querySelector("#black-king")){
                                        cell.innerHTML += `<span class="dot" id="back" data-direction="${direction}"></span>`;
                                        direction = "none";
                                    }
                                    else if(cell.querySelector(".dot") && !cell.querySelector(".piece")){}
                                    else{
                                        rightBottom = false; 
                                        if(cell.querySelector(`[id^="${colorString}"]`)){
                                            cell.innerHTML += `<span class="dot" id="back" data-direction="${direction}"></span>`;
                                        }      
                                    }
                                }
                                if(cell.dataset.value == Row[2] && leftBottom === true){
                                    if(direction != "none"){
                                        direction = "downleft"
                                    }
                                    if(cell.innerHTML === ""){
                                        cell.innerHTML += `<span class="dot" data-direction="${direction}"></span>`;
                                    }
                                    else if(cell.querySelector("#white-king") || cell.querySelector("#black-king")){
                                        cell.innerHTML += `<span class="dot" id="back" data-direction="${direction}"></span>`;
                                        direction = "none";
                                    }
                                    else if(cell.querySelector(".dot") && !cell.querySelector(".piece")){}
                                    else{
                                        leftBottom = false; 
                                        if(cell.querySelector(`[id^="${colorString}"]`)){
                                            cell.innerHTML += `<span class="dot" id="back" data-direction="${direction}"></span>`;
                                        }
                                    } 
                                }        
                            })
                        }
                    })         
                }
                
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
        move(element, isWhite, colorString){
            dotRemoval();
            let nextFields = returnFields(element); 
            let ImageToUse = this.bImage;
            let pieceToUse = this.blackbishop;
            
            if(isWhite === true){
                ImageToUse = this.wImage;
                pieceToUse = this.whitebishop;
                if(turns % 2 == 0 ){
                    interactWithPiece(ImageToUse, pieceToUse);
                }
            }else{
                if(turns % 2 == 1){
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
                                    else if(cell.querySelector(`[id^="${colorString}"]`)){
                                        moveCounter++;
                                        cell.innerHTML += `<span class="dot" id="back" data-direction="${moveCounter}"></span>`;
                                    }
                                }
                            })
                        }
                    })
                })        
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
        move(element, isWhite, colorString){
            dotRemoval();
            let currentRow = element.parentNode.parentNode.dataset.value;
            let currentColumn = element.parentNode.dataset.value;
            let nextFields = returnFields(element)
            let top = true;
            let bottom = true;
            let right = true;
            let left = true;
            let ImageToUse = this.bImage;
            let pieceToUse = this.blackrook;
            let direction;
            
            if(isWhite === true){
                ImageToUse = this.wImage;
                pieceToUse = this.whiterook;
                if(turns % 2 == 0){
                    interactWithPiece(ImageToUse, pieceToUse);
                }
            }else{
                if(turns % 2 == 1){
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
                                cell.innerHTML += `<span class="dot" data-direction="${direction}"></span>`;
                            }
                            else if((cell.querySelector("#white-king") || cell.querySelector("#black-king")) && top == true){
                                cell.innerHTML += `<span class="dot" id="back" data-direction="${direction}"></span>`;
                                direction = "none";
                            }
                            else if(cell.querySelector(".dot") && !cell.querySelector(".piece")){}
                            else if(cell.querySelector(`[id^="${colorString}"]`) && top == true){
                                cell.innerHTML += `<span class="dot" id="back" data-direction="${direction}"></span>`;
                                top = false;     
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
                            }
                            else if((cell.querySelector("#white-king") || cell.querySelector("#black-king")) && bottom == true){
                                cell.innerHTML += `<span class="dot" id="back" data-direction="${direction}"></span>`;
                                direction = "none"
                            }
                            else if(cell.querySelector(".dot") && !cell.querySelector(".piece")){}
                            else if(cell.querySelector(`[id^="${colorString}"]`) && bottom == true){
                                cell.innerHTML += `<span class="dot" id="back" data-direction="${direction}"></span>`;
                                bottom = false;                             
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
                            }
                            else if((cell.querySelector("#white-king") || cell.querySelector("#black-king")) && right == true){
                                cell.innerHTML += `<span class="dot" id="back" data-direction="${direction}"></span>`;
                                direction = "none";
                            }
                            else if(cell.querySelector(".dot") && !cell.querySelector(".piece")){}
                            else if(cell.querySelector(`[id^="${colorString}"]`) && right == true){
                                cell.innerHTML += `<span class="dot" id="back" data-direction="${direction}"></span>`;
                                right = false;         
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
                            }
                            else if((cell.querySelector("#white-king") || cell.querySelector("#black-king")) && left == true){
                                cell.innerHTML += `<span class="dot" id="back" data-direction="${direction}"></span>`;
                                direction = "none";
                            }
                            else if(cell.querySelector(".dot") && !cell.querySelector(".piece")){}
                            else if(cell.querySelector(`[id^="${colorString}"]`) && left == true){
                                cell.innerHTML += `<span class="dot" id="back" data-direction="${direction}"></span>`;
                                left = false;     
                            }
                            else{
                                left = false;     
                            }
                        }
                    })                   
                }
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
        move(element, isWhite, colorString){
            dotRemoval();
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
            let direction;
            
            if(isWhite === true){
                ImageToUse = this.wImage;
                pieceToUse = this.whitequeen;
                if(turns % 2 == 0){
                    interactWithPiece(ImageToUse, pieceToUse);
                }
            }else{
                if(turns % 2 == 1){
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
                            }
                            else if((cell.querySelector("#white-king") || cell.querySelector("#black-king")) && top == true){
                                cell.innerHTML += `<span class="dot" id="back" data-direction="up"></span>`;
                            }
                            else if(cell.querySelector(".dot") && !cell.querySelector(".piece")){}
                            else if(cell.querySelector(`[id^="${colorString}"]`) && top == true){
                                cell.innerHTML += `<span class="dot" id="back" data-direction="up"></span>`;
                                top = false;     
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
                            }
                            else if((cell.querySelector("#white-king") || cell.querySelector("#black-king")) && bottom == true){
                                cell.innerHTML += `<span class="dot" id="back" data-direction="${direction}"></span>`;
                                direction = "none";
                            }
                            else if(cell.querySelector(".dot") && !cell.querySelector(".piece")){}
                            else if(cell.querySelector(`[id^="${colorString}"]`) && bottom == true){
                                cell.innerHTML += `<span class="dot" id="back" data-direction="${direction}"></span>`;
                                bottom = false;     
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
                            }
                            else if((cell.querySelector("#white-king") || cell.querySelector("#black-king")) && right == true){
                                cell.innerHTML += `<span class="dot" id="back" data-direction="${direction}"></span>`;
                                direction = "none";
                            }
                            else if(cell.querySelector(".dot") && !cell.querySelector(".piece")){}
                            else if(cell.querySelector(`[id^="${colorString}"]`) && right == true){
                                cell.innerHTML += `<span class="dot" id="back" data-direction="${direction}"></span>`;
                                right = false;                                 
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
                            }
                            else if((cell.querySelector("#white-king") || cell.querySelector("#black-king")) && left == true){
                                cell.innerHTML += `<span class="dot" id="back" data-direction="${direction}"></span>`;
                                direction = "none";
                            }
                            else if(cell.querySelector(".dot") && !cell.querySelector(".piece")){}
                            else if(cell.querySelector(`[id^="${colorString}"]`) && left == true){
                                cell.innerHTML += `<span class="dot" id="back" data-direction="${direction}"></span>`;
                                left = false;     
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
                                    }
                                    else if((cell.querySelector("#white-king") || cell.querySelector("#black-king")) && leftTop == true){
                                        cell.innerHTML += `<span class="dot" id="back" data-direction="${direction}"></span>`;
                                        direction = "none";
                                    }
                                    else if(cell.querySelector(".dot") && !cell.querySelector(".piece")){}
                                    else{
                                        if(cell.querySelector(`[id^="${colorString}"]`)){
                                            cell.innerHTML += `<span class="dot" id="back" data-direction="${direction}"></span>`;
                                        }      
                                        leftTop = false;        
                                    }
                                }
                                else if(cell.dataset.value == Row[2] && rightTop === true){
                                    if(direction != "none"){
                                        direction = "upright"
                                    }
                                    if(cell.innerHTML === ""){
                                        cell.innerHTML += `<span class="dot" data-direction="${direction}"></span>`;
                                    }
                                    else if((cell.querySelector("#white-king") || cell.querySelector("#black-king")) && rightTop == true){
                                        cell.innerHTML += `<span class="dot" id="back" data-direction="${direction}"></span>`;
                                        direction = "none";
                                    }
                                    else if(cell.querySelector(".dot") && !cell.querySelector(".piece")){}
                                    else{
                                        if(cell.querySelector(`[id^="${colorString}"]`)){
                                            cell.innerHTML += `<span class="dot" id="back" data-direction="${direction}"></span>`;
                                        }
                                        rightTop = false;     
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
                                    }
                                    else if((cell.querySelector("#white-king") || cell.querySelector("#black-king")) && leftBottom == true){
                                        cell.innerHTML += `<span class="dot" id="back" data-direction="${direction}"></span>`;
                                        direction = "none";
                                    }
                                    else if(cell.querySelector(".dot") && !cell.querySelector(".piece")){}
                                    else{
                                        if(cell.querySelector(`[id^="${colorString}"]`)){
                                            cell.innerHTML += `<span class="dot" id="back" data-direction="${direction}"></span>`;
                                        }    
                                        rightBottom = false;        
                                    }
                                }
                                if(cell.dataset.value == Row[2] && leftBottom === true){
                                    if(direction != "none"){
                                        direction = "downleft"
                                    }
                                    if(cell.innerHTML === ""){
                                        cell.innerHTML += `<span class="dot" data-direction="${direction}"></span>`;
                                    }
                                    else if((cell.querySelector("#white-king") || cell.querySelector("#black-king")) && rightBottom == true){
                                        cell.innerHTML += `<span class="dot" id="back" data-direction="${direction}"></span>`;
                                        direction = "none";
                                    }
                                    else if(cell.querySelector(".dot") && !cell.querySelector(".piece")){}
                                    else{
                                        if(cell.querySelector(`[id^="${colorString}"]`)){
                                            cell.innerHTML += `<span class="dot" id="back" data-direction="${direction}"></span>`;
                                        }
                                        leftBottom = false;       
                                    } 
                                }        
                            })
                        }
                    })         
                }
               
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
            dotRemoval();
            let ImageToUse = this.bImage;
            let pieceToUse = this.blackking;
            let nextFields = returnFields(element);

            if(isWhite === true){
                ImageToUse = this.wImage;
                pieceToUse = this.whiteking;
                if(turns % 2 == 0){
                    interactWithPiece(ImageToUse, pieceToUse);
                }
            }else{
                if(turns % 2 == 1){
                    interactWithPiece(ImageToUse, pieceToUse);
                }
            }

            function interactWithPiece(ImageToUse, pieceToUse){

                for(let i = 0; i < 8; i++){
                    chessrows.forEach(Row =>{
                        if(Row.dataset.value == nextFields[i][0]){
                            Row.querySelectorAll("th").forEach(cell => {
                                if(cell.dataset.value == nextFields[i][1]){
                                    if((cell.innerHTML === "" || (cell.querySelector(".dot") && !cell.querySelector("#back")))&& cell.dataset.attacked == 0){
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

function returnFieldsPawn(element, turns, isWhite){
    let nextFields; 
    if(isWhite == true){
        if(element.dataset.state == 0 && turns % 2 == 0){
            nextFields = [[parseInt(element.parentNode.parentNode.dataset.value) + 1, element.parentNode.dataset.value], [parseInt(element.parentNode.parentNode.dataset.value) + 2, element.parentNode.dataset.value]]
        }
        else if(turns % 2 == 0){
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

function pawnMovement(piece, nextFields, pieceToUse, imageToUse, whatIsRest, colorString){
    let goOn = true;
    let alreadyPut;
    let firstCell;
    dotRemoval();
    chessrows.forEach(element => {
        if(turns % 2 == whatIsRest){
            if(element.dataset.value == nextFields[0][0]){
                if(element.querySelector(`[data-value="${nextFields[0][1]}"]`).innerHTML === "" && goOn == true){
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
                    if(rightOfPawn.querySelector(`[id^="${colorString}"]`) || rightOfPawn.id === "enPassant"){
                        if(!rightOfPawn.querySelector(".piece")){}
                        else{
                            rightOfPawn.innerHTML += `<span class="dot" id="back" data-direction="0" data-type="pawnAttack"></span>`
                        }
                    }
                }
                catch{}
                try{
                    if(leftOfPAwn.querySelector(`[id^="${colorString}"]`) || leftOfPAwn.id === "enPassant"){
                        if(!leftOfPAwn.querySelector(".piece")){}
                        else{
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
    
    document.querySelectorAll(".dot").forEach(dot => {
        dot.addEventListener("click",  (event) => {
            event.preventDefault();
            if(dot.parentNode.id === "enPassant"){
                let pieces = chessboard.querySelectorAll(`.piece`);
                pieces.forEach(piece => {
                    if(piece.dataset.enpassantable === "yes"){
                        piece.dataset.enpassantable = "no";
                        if(turns % 2 == 0){
                            document.querySelector(".eatenPieces#white").innerHTML += `<image class="piece" id="black-pawn" data-state="1" data-enpassantable="no" src="pieces/black-pawn.svg"/>`;
                        }
                        else{
                            document.querySelector(".eatenPieces#black").innerHTML += `<image class="piece" id="white-pawn" data-state="1" data-enpassantable="no" src="pieces/white-pawn.svg"/>`;
                        }
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

            runturn(colorString);
        })
    })
}

function dotRemoval(){
    document.querySelectorAll(".dot").forEach(toRemove =>{
        toRemove.remove();
    })
}

function addFunctionality(){
    
    document.querySelectorAll("#white-pawn").forEach(whitepawn =>{
        whitepawn.addEventListener("click", (event) => {pieces["white-pawn"].move(whitepawn);})
    })
    document.querySelectorAll("#black-pawn").forEach(blackpawn =>{
        blackpawn.addEventListener("click", (event) => {pieces["black-pawn"].move(blackpawn);})
    })
    document.querySelectorAll("#white-bishop").forEach(bishop => {
        bishop.addEventListener("click", (event) => {pieces["bishop"].move(bishop, true, "black");})
    })
    document.querySelectorAll("#black-bishop").forEach(bishop => {
        bishop.addEventListener("click", (event) => {pieces["bishop"].move(bishop, false, "white");})
    })
    document.querySelectorAll("#white-rook").forEach(rook => {
        rook.addEventListener("click", (event) => {pieces["rook"].move(rook, true, "black");})
    })
    document.querySelectorAll("#black-rook").forEach(rook => {
        rook.addEventListener("click", (event) => {pieces["rook"].move(rook, false, "white");})
    })
    document.querySelectorAll("#white-knight").forEach(knight => {
        knight.addEventListener("click", (event) => {pieces["knight"].move(knight, true, "black");})
    })
    document.querySelectorAll("#black-knight").forEach(knight => {
        knight.addEventListener("click", (event) => {pieces["knight"].move(knight, false, "white");})
    })
    document.querySelectorAll("#white-queen").forEach(queen => {
        queen.addEventListener("click", (event) => {pieces["queen"].move(queen, true, "black");})
    })
    document.querySelectorAll("#black-queen").forEach(queen => {
        queen.addEventListener("click", (event) => {pieces["queen"].move(queen, false, "white");})
    })
    document.querySelectorAll("#white-king").forEach(king => {
        king.addEventListener("click", (event) => {pieces["king"].move(king, true, "black");})
    })
    document.querySelectorAll("#black-king").forEach(king => {
        king.addEventListener("click", (event) => {pieces["king"].move(king, false, "white");})
    })
}

async function runturn(color){
    dotRemoval()
    turns++;
    addFunctionality();
}


function dotFunctionality(element, ImageToUse, pieceToUse, colorString){
    document.querySelectorAll(".dot").forEach(dot => {
        dot.addEventListener("click", (event) => {
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

            dot.parentNode.innerHTML = `<image class="piece" id="${pieceToUse}" data-identity="${element.dataset.identity}" data-state="1" src="${ImageToUse}"/>`;

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