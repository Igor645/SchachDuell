var currentRule = 0;
var rules = [
    {
        name: "Pawn",
        demonstration: "videos/pawnMovement.mp4",
        description: "If you are moving the pawn for the first time in the round, then the pawn can move forward by two spaces. Afterwards he can only move forward by one space."
    },
    {
        name: "Pawn Attack",
        demonstration: "videos/pawnAttack.mp4",
        description: "The pawn attacks the squares diagonal of itself."
    },
    {
        name: "En Passant",
        demonstration: "videos/enPassant.mp4",
        description: "If your pawn stands next to an opponent's pawn that moved forwards by two spaces, then your pawn can perform the en Passant."
    },
    {
        name: "Promotion",
        demonstration: "videos/promotion.mp4",
        description: "Once your pawn reaches the end of the board it can promote to any other piece."
    },
    {
        name: "Bishop",
        demonstration: "videos/bishop.mp4",
        description: "The bishop can move diagonally by whichever distance he wishes to."
    },
    {
        name: "Knight",
        demonstration: "videos/knight.mp4",
        description: "The knight moves in patterns that are similar to an L. The knight's specialty is it's ability to jump over other pieces."
    },
    {
        name: "Rook",
        demonstration: "videos/rook.mp4",
        description: "The rook moves in straight lines by whichever distance he wishes to."
    },
    {
        name: "Queen",
        demonstration: "videos/queen.mp4",
        description: "The queen mvoes in straight and diagonal lines by whichever distances she wishes to."
    },
    {
        name: "King",
        demonstration: "videos/king.mp4",
        description: "The king moves by one space in every direction."
    },
    {
        name: "Castling",
        demonstration: "videos/castling.mp4",
        description: "If your king and one of the rooks haven't moved and the spaces inbetween the king and the rook aren't attacked, then you can castle. Castling switches the position of both king and rook."
    },
    {
        name: "Check",
        demonstration: "videos/check.mp4",
        description: "If your king gets attacked, then you are in check. Once in check you have to either move your king, or set another piece inbetween you and the attacker."
    },
    {
        name: "Checkmate",
        demonstration: "videos/checkmate.mp4",
        description: "If your king is attacked and there are neither spaces to move or pieces to put inbetween, then it's checkmate. This means you lost."
    },
    {
        name: "Stalemate",
        demonstration: "videos/stalemate.mp4",
        description: "If any of the players has no valid moves to play, whilst the king isn't being attacked, then the result is a stalemate. In that case you have tied with the opponent."
    },
    {
        name: "Stalemate #2",
        demonstration: "videos/stalemate2.mp4",
        description: "The other way that a stalemate can occur is, when only the two kings remain on the board."
    }
]
document.querySelector(".restartButton").addEventListener("click", (event) => {
    event.preventDefault();
    location.reload();
})

document.querySelector(".viewRules").addEventListener("click", (event) => {
    try{
        document.querySelector(".viewRules").remove();
    }catch{}
    printRule();
})

function addScrollButtons(){
    document.querySelectorAll(".buttonBg").forEach(button => {
        if(button.querySelector(".buttonRight")){
            button.addEventListener("click", (event) => {
                if(currentRule + 1 !== rules.length){
                    currentRule++;
                }
                else{
                    currentRule = 0;
                }
                printRule()
            })
        }

        if(button.querySelector(".buttonLeft")){
            button.addEventListener("click", (event) => {
                if(currentRule - 1 >= 0){
                    currentRule = currentRule - 1;
                }
                else{
                    currentRule = rules.length - 1;
                }
                printRule()
            })
        }
    })
}

function printRule(){
    document.querySelector(".content").innerHTML = `
    <div class="ruleTitle">${rules[currentRule].name}</div>
    <video class="demonstration" src="${rules[currentRule].demonstration}" type="video/mp4" autoplay loop>
    </video>
    <div class="textAndButtons">
    <div class="buttonBg">
    <div class="buttonLeft"><</div>
    </div>
    <div class="description">${rules[currentRule].description}</div>
    <div class="buttonBg">
    <div class="buttonRight">></div>
    </div>    </div>`
    addScrollButtons();
}