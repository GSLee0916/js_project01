//DOM
const playground=document.querySelector(".playground>ul");

//Setting
const GAME_ROWS = 20;
const GAME_COLS = 10;

//variables
let score = 0;
let duration = 500;
let downInterval;
let tempMovingItem;
//Block의 회전 좌표
const BLOCKS = {
    tree: [
        [[2,1],[0,1],[1,0],[1,1]],
        [[1,2],[0,1],[1,0],[1,1]],
        [[1,2],[0,1],[2,1],[1,1]],
        [[2,1],[1,2],[1,0],[1,1]],
    ]
}

const movingItem = {
    type: "tree",
    direction: 3,
    top: 0,
    left: 0,
};


init()

//funtions
function init(){
    tempMovingItem = {...movingItem};
    for(let i=0;i<20;i++){
        prependNewLine()
    }
    renderBlocks()
}
//matrix 생성
function prependNewLine(){
    const li=document.createElement("li");
    const ul=document.createElement("ul");
    for(let j=0;j<10;j++){
        const matrix=document.createElement("li");
        ul.prepend(matrix);
    }
    li.prepend(ul);
    playground.prepend(li);
}
//Block의 모양을 바꾸는 기능
function renderBlocks(moveType=""){
    const {type, direction, top, left} = tempMovingItem;
    const movingBlocks =document.querySelectorAll(".moving");
    movingBlocks.forEach(moving=>{
        moving.classList.remove(type, "moving");
    });
    BLOCKS[type][direction].some(block => {
        const x = block[0] + left;
        const y = block[1] + top;
        //사망 연산자. const xxx=조건 ? 참일경우 : 거짓일경우;
        const target = playground.childNodes[y]? playground.childNodes[y].childNodes[0].childNodes[x]: null;
        const isAvailable = checkEmpty(target);
        if(isAvailable){
            target.classList.add(type, "moving")
        }else{
            tempMovingItem = {...movingItem}
            setTimeout(()=>{
                renderBlocks();
                if(moveType === "Top"){
                    seizeBlock();
                }
            },0);
            return true;
        }
    });
    movingItem.left = left;
    movingItem.top = top;
    movingItem.direction = direction;
}
//아래로 내려가지 않고 쌓이는 기능
function seizeBlock(){
    const movingBlocks =document.querySelectorAll(".moving");
    movingBlocks.forEach(moving => {
        moving.classList.remove("moving");
        moving.classList.add("seized");
    })
    generateNewBlock()
}
function generateNewBlock(){
    movingItem.top = 0;
    movingItem.left = 3;
    movingItem.direction = 0;
    tempMovingItem = { ...movingItem };
    renderBlocks()
}

function checkEmpty(target){
    if(!target || target.classList.contains("seized")){
        return false;
    }
    return true;
}
function moveBlock(moveType, amount){
    tempMovingItem[moveType] += amount;
    renderBlocks(moveType);
}
//도형 모양 변경
function changeDirection(){
    const direction = tempMovingItem.direction;
    direction === 3 ? tempMovingItem.direction = 0 : tempMovingItem.direction +=1;
    renderBlocks();
}
//event handing (방향키 조작)
document.addEventListener("keydown", e=> {
    switch(e.keyCode){
        case 39:
            moveBlock("left", 1);
            break;
        case 37:
            moveBlock("left", -1);
            break;
        case 40:
            moveBlock("top", 1)
            break;
        case 38:
            changeDirection();
            break;
        default:
            break;
    }
})