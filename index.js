const gameBoard = document.querySelector("#gameBoard")
const body=document.querySelector("body")
const ctx = gameBoard.getContext("2d")
const scoreText = document.querySelector("#scoreText")
const resetBtn = document.querySelector("#resetBtn")
const gameWidth = gameBoard.width
const gameHeight = gameBoard.height
const boardBackground ="darkcyan"
const snakeColor ="lightgreen"
const snakeBorder="black"
const foodColor ="red"
const unitSize = 20
const bgMusic = document.getElementById('bgMusic');
const highScoreText = document.querySelector("#highScoreText");
let highScore = localStorage.getItem("highScore") || 0;
let running=false
let xVelocity = unitSize
let yVelocity = 0
let foodX
let foodY
let score=0
let snake=[
    {x:unitSize*5 , y:0},
    {x:unitSize*4 , y:0},
    {x:unitSize*3 , y:0},
    {x:unitSize*2, y:0},
    {x:unitSize , y:0}, 
]
document.addEventListener('keydown', function() {
    bgMusic.play();
});
 window.addEventListener("keydown" , changeDirection)
 resetBtn.addEventListener("click" , resetGame)

 gameStart()

//--------------------------------------------------------------------

function gameStart(){
   running= true
   scoreText.textContent = score
   body.style.backgroundImage="url('snakebg3.jpeg')"
   resetBtn.disabled="true"
   
   createFood()
   drawFood()
   nextTick()

}
 function nextTick(){
    if(running){
        setTimeout(()=>{
            clearBoard()
            drawFood()
            moveSnake()
            drawSnake()
            checkGameOver()
            checkWin()
            changeBg()
            nextTick()
            updateHighScore()
        } , 100-score*3.5)
    }
    else
    displayGameOver()
 }
 function clearBoard(){
    ctx.fillStyle = boardBackground
    ctx.fillRect(0 , 0 , gameWidth , gameHeight)
 }
 function createFood(){
    function randomFood(min , max){
        const randNum = Math.round((Math.random() * (max-min) +min)/ unitSize)*unitSize
        return randNum
    }
    foodX = randomFood(0,gameWidth - unitSize)
    foodY = randomFood(0,gameWidth - unitSize)
 }
 function drawFood(){
    ctx.fillStyle = foodColor
    ctx.fillRect(foodX , foodY , unitSize , unitSize)
 }
 function moveSnake(){
    const head = {x:snake[0].x+ xVelocity ,
                y: snake[0].y + yVelocity}
    snake.unshift(head)
    //if food is eaten 
    if(snake[0].x ==foodX && snake[0].y== foodY){
        score+=1
        scoreText.textContent = score
        createFood() 
    }
    else{
        snake.pop()
    }
 }
 function drawSnake(){
    ctx.fillStyle = snakeColor;
    ctx.strokeStyle = snakeBorder;
    snake.forEach((snakePart, index) => {
        // Draw the head with eyes
        if (index === 0) {
            const eyeSize = 4; 
            const eyeOffsetX = unitSize / 3;
            const eyeOffsetY = unitSize / 4; 
    
            // Draw head
            ctx.fillRect(snakePart.x, snakePart.y, unitSize, unitSize);
            ctx.strokeRect(snakePart.x, snakePart.y, unitSize, unitSize);
    
            // Draw eyes
            ctx.fillStyle = "white"; // Eye color
            ctx.beginPath();
            ctx.arc(snakePart.x + eyeOffsetX, snakePart.y + eyeOffsetY, eyeSize, 0, Math.PI * 2); 
            ctx.arc(snakePart.x + unitSize - eyeOffsetX, snakePart.y + eyeOffsetY, eyeSize, 0, Math.PI * 2);
            ctx.fill();
            ctx.closePath();
    
            ctx.fillStyle = "black"; // Pupil color
            ctx.beginPath();
            ctx.arc(snakePart.x + eyeOffsetX, snakePart.y + eyeOffsetY, eyeSize / 2, 0, Math.PI * 2); 
            ctx.arc(snakePart.x + unitSize - eyeOffsetX, snakePart.y + eyeOffsetY, eyeSize / 2, 0, Math.PI * 2); 
            ctx.fill();
            ctx.closePath();
        } else {
            // Draw body segments
            ctx.fillStyle = snakeColor;
            ctx.fillRect(snakePart.x, snakePart.y, unitSize, unitSize);
            ctx.fillStyle = snakeBorder;
            ctx.strokeRect(snakePart.x, snakePart.y, unitSize, unitSize);
        }
    });
 }
 function changeDirection(event){
    const keyPressed = event.keyCode
    const LEFT =37 //arrows
    const LEFT2 = 65 //wasd buttons
    const RIGHT = 39
    const RIGHT2 =68
    const UP = 38
    const UP2 =87
    const DOWN = 40
    const DOWN2 = 83

    const goingUp =(yVelocity == -unitSize)
    const goingDown = (yVelocity== unitSize)
    const goingLeft = (xVelocity== -unitSize)
    const goingRight = (xVelocity== unitSize)

    switch(true){
        case((keyPressed==LEFT ||keyPressed==LEFT2)&&!goingRight):
            xVelocity= - unitSize
            yVelocity = 0
            break
        case((keyPressed==RIGHT ||keyPressed==RIGHT2)&&!goingLeft):
        xVelocity=  unitSize
        yVelocity = 0
        break
        case((keyPressed==UP2 || keyPressed==UP)&&!goingDown):
        xVelocity= 0
        yVelocity =- unitSize
        break
        case((keyPressed==DOWN ||keyPressed==DOWN2)&&!goingUp):
        xVelocity= 0
        yVelocity =  unitSize
        break
    }
 }
 function checkGameOver(){
switch(true){
    case(snake[0].x<0):
    running=false
    break
    case(snake[0].x>=gameWidth):
    running=false
    break
    case(snake[0].y<0):
    running=false
    break
    case(snake[0].y>=gameHeight):
    running=false
    break
}

for(let i=1 ;i < snake.length ; i+=1){
    if(snake[i].x== snake[0].x && snake[i].y == snake[0].y)
    {
        running=false

    }
}
 }
 function displayGameOver(){ 
 ctx.font ="50px Bungee Spice"
 ctx.fillStyle = "black"
 ctx.textAlign = "center"

 if(score!=25){
 document.body.style.backgroundImage="url(snakebg3.jpeg)"
setTimeout(()=>
 {ctx.fillText("GAME OVER!" , gameWidth/2 , gameHeight/2)
 resetBtn.disabled = false}
,1000)
}
running=false
 }
 function resetGame(){
resetBtn.addEventListener("click" , ()=>{
    score=0
    body.classList.remove('annoying')
    scoreText.textContent=score
    xVelocity=unitSize
    yVelocity=0
    snake=[
        {x:unitSize*5 , y:0},
        {x:unitSize*4 , y:0},
        {x:unitSize*3 , y:0},
        {x:unitSize*2, y:0},
        {x:unitSize , y:0},
        {x:0 ,y:0}         
    ]


})
gameStart()
 }
function changeBg(){
    if(score>=5){
    setTimeout(() => {
       
            ctx.fillStyle = "skyblue"
            ctx.fillRect(0 , 0 , gameWidth , gameHeight)     
            ctx.fillStyle = "black"
            ctx.fillRect(foodX , foodY , unitSize , unitSize)  
            ctx.fillStyle=snakeColor
            ctx.strokeStyle = "white"
            snake.forEach((snakePart)=>{
                ctx.fillRect(snakePart.x , snakePart.y , unitSize , unitSize)
                ctx.strokeRect(snakePart.x , snakePart.y , unitSize , unitSize)
        
            })
        
        
    }, 1000-score*15);
    if(score>=10)
    {
        body.classList.add('annoying')
        body.style.backgroundImage="none"
    }
 
    }   
}
function checkWin(){
    if (score==25){
        running=false
        setTimeout(()=>
 {ctx.fillText("YOU WIN!" , gameWidth/2 , gameHeight/2)
 resetBtn.disabled = false}
,1000)
running=false
    }
}
function updateHighScore() {
    if (score > highScore) {
        highScore = score;
        localStorage.setItem("highScore", highScore);
    }
    highScoreText.textContent = "High Score: " + highScore;
}