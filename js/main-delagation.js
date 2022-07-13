import {getCellElementList,
    getCurrentTurnElement,
    getCellElementAtIdx,
    getGameStatusElement,
    getReplayButtonElement,
    getCellList} from './selectors.js'
    import {TURN,CELL_VALUE,GAME_STATUS} from './constants.js'
    import {checkGameStatus} from './utils.js'
/**
 * Global variables
 */
console.log(checkGameStatus(['X','X','O','O','O','X','X','O','X']));

let currentTurn = TURN.CROSS;
let isGameEnded = false;
let gameStatus =GAME_STATUS.PLAYING
let cellValues = new Array(9).fill("");

function toggleTurn() {
    // toggle turn
    currentTurn=currentTurn==='cross'?TURN.CIRCLE:TURN.CROSS;
    // update turn on DOM element
    const currentTurnElement = getCurrentTurnElement()
    if(currentTurnElement){
        currentTurnElement.classList.remove(TURN.CIRCLE,TURN.CROSS)
            currentTurnElement.classList.add(currentTurn)
        
    }
}

function updateGameState(newGameState) {
    gameStatus=newGameState
   const gameStatusElement= getGameStatusElement()
   if(gameStatusElement) gameStatusElement.textContent=newGameState;
}
function showReplayButton(){
    const showReplayButton=getReplayButtonElement()
    showReplayButton.classList.add('show')
}

function highlightWinCells(winPositions){
    if(!Array.isArray(winPositions||winPositions.length!==3))throw new Error('Invalid win positions');
    winPositions.forEach((positon)=>{
       const winElement= getCellElementAtIdx(positon)
       winElement.classList.add('win')
    })
}


function hideReplayButton(){
    const showReplayButton=getReplayButtonElement()
    showReplayButton.classList.remove('show')
}

function resetGame() {
// reset global vars
 currentTurn = TURN.CROSS;
 gameStatus =GAME_STATUS.PLAYING
 cellValues = cellValues.map(()=>'');
// reset dom elements

// reset game state
updateGameState(GAME_STATUS.PLAYING)
// reset current turn 
const currentTurnElement = getCurrentTurnElement()
if(currentTurnElement){
    currentTurnElement.classList.remove(TURN.CIRCLE,TURN.CROSS)
        currentTurnElement.classList.add(TURN.CROSS)
    
}
// reset game board
const cellElementList=getCellElementList()
for (const cellElement of cellElementList){
    cellElement.classList.remove(TURN.CIRCLE,TURN.CROSS,'win')
}
// hide replay button
hideReplayButton()
}

function initReplayButton() {
    const replayButton=getReplayButtonElement()
    if(replayButton){
        replayButton.addEventListener('click',resetGame)
    }
}

function handleCellClick(cell,index){
    const isClicked=cell.classList.contains(TURN.CIRCLE)||cell.classList.contains(TURN.CROSS)
    const isEndGame=gameStatus!==GAME_STATUS.PLAYING
    if(isClicked||isEndGame)return
    // set selected cell
    cell.classList.add(currentTurn);

    // upadte cellValues
    cellValues[index]=currentTurn===TURN.CROSS?CELL_VALUE.CROSS:CELL_VALUE.CIRCLE

    // toggle turn
        toggleTurn(cell)
    //check game status
    const game=checkGameStatus(cellValues)
    
    switch(game.status){
        case GAME_STATUS.ENDED:{
            // update game status
            updateGameState(game.status)
            // show replay button
            showReplayButton()
            break}

        case GAME_STATUS.X_WIN:
        case GAME_STATUS.O_WIN:{
         // update game status
         updateGameState(game.status)
         // show replay button
         showReplayButton()
//      highlight win cells
        highlightWinCells(game.winPositions)
            break;
        }

        default:
    }
}

function initCellElementList() {
    const liList=getCellElementList()
    liList.forEach((cell,index)=>{
        //  cell.addEventListener("click",()=>handleCellClick(cell,index))
        cell.dataset.index=index;
    })
    const cellList=getCellList()
    if(cellList){
        cellList.addEventListener('click',(e)=>{
            if(e.target.tagName!=='LI')return
            const index=Number.parseInt(e.target.dataset.index)
         
            handleCellClick(e.target,index)
        })
    }
  
}

/**
 * TODOs
 *
 * 1. Bind click event for all cells
 * 2. On cell click, do the following:
 *    - Toggle current turn
 *    - Mark current turn to the selected cell
 *    - Check game state: win, ended or playing
 *    - If game is win, highlight win cells
 *    - Not allow to re-click the cell having value.
 *
 * 3. If game is win or ended --> show replay button.
 * 4. On replay button click --> reset game to play again.
 *
 * 
 */
(()=>{
    // bind click event for all li elements
    initCellElementList()
    initReplayButton()
    // bind click event for replay button
})()
