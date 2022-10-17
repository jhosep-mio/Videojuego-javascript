 const canvas= document.querySelector('#game');
 const game = canvas.getContext('2d');
 const btnUp= document.querySelector('#up');
 const btnLeft= document.querySelector('#left');
 const btnRight= document.querySelector('#right');
 const btnDown= document.querySelector('#down');
 const spanvidas= document.querySelector('#vidas');
 const spantiempo= document.querySelector('#time');
 const spanrecord= document.querySelector('#record');
 const spanresult= document.querySelector('#result');
 const btnreiniciar= document.querySelector('#reiniciar');

 let canvasSize;
 let elementSize;
 let level=0;
 let lives=3;

 let timeStart; 
 let interval;
 

 const playerPosition = {
    x: undefined,
    y: undefined,
  };

  const regaloPosition = {
    x: undefined,
    y: undefined,
  };

  const bommPosition={
    x: undefined,
    y: undefined,
  }

 let bombas =[];

 window.addEventListener('load', setCanvasSize);
 window.addEventListener('resize', setCanvasSize);

 function setCanvasSize(){
    if(window.innerHeight>window.innerWidth){
        canvasSize=window.innerWidth* 0.7;
    }else{
        canvasSize= window.innerHeight*0.7;
    }

    canvasSize=Number(canvasSize.toFixed(0));

    canvas.setAttribute('width',canvasSize);
    canvas.setAttribute('height',canvasSize);
    elementSize= canvasSize/10;
    playerPosition.x=undefined;
    playerPosition.y=undefined;
    startGame();
 }
 
 function startGame(){
    game.font= elementSize-5 + 'px arial';
    game.textAlign='end';
    
    const map=maps[level];

    if(!map){
        gameWin();
        return;
    }
    if(!timeStart){
        timeStart=Date.now();
        interval= setInterval(verTiempo, 100);
        verRecord();
    } 

    const mapRows= map.trim().split('\n');
    const mapRowCols=mapRows.map(row => row.trim().split(''));
    cantidadVidas();
    bombas = [];
    game.clearRect(0,0, canvasSize,canvasSize);

    mapRowCols.forEach((row, rowI) => {
        row.forEach((col, colI) => {
          const emoji = emojis[col];
          const posX = elementSize * (colI + 1);
          const posY = elementSize * (rowI + 1);

          if (col == 'O') {
            if(!playerPosition.x && !playerPosition.y){
                playerPosition.x = posX;
                playerPosition.y = posY;
            }
          }else if (col == 'I'){
                regaloPosition.x = posX;
                regaloPosition.y = posY;
          }else if(col == 'X'){
                bombas.push({
                    x: posX,
                    y: posY,
                });
          }
          
          game.fillText(emoji, posX, posY);
        });
      });
    
      movePlayer();
   
 }

 

 function movePlayer(){
    const regaloPositionX=playerPosition.x.toFixed(3) == regaloPosition.x.toFixed(3);
    const regaloPositionY=playerPosition.y.toFixed(3) == regaloPosition.y.toFixed(3);
    const collisionReagalo=regaloPositionX && regaloPositionY;

    if(collisionReagalo){
        lvlUp();
    }

    const collisionBomba = bombas.find(bomba =>{
        const collisionBombaX= bomba.x.toFixed(3) == playerPosition.x.toFixed(3);
        const collisionBombaY= bomba.y.toFixed(3) == playerPosition.y.toFixed(3);
        return collisionBombaX && collisionBombaY;
    });

    if(collisionBomba){
        accionarBoom();
        
        setTimeout(lvlOver,500);
        
    }

    game.fillText(emojis['PLAYER'], playerPosition.x, playerPosition.y);
}

function lvlUp(){
    level++;
    startGame();
}

function lvlOver(){
    lives--;
    
    if(lives<=0){
        setTimeout(mostrarPerdida, 100)
        level=0;
        lives=3;
        timeStart=undefined;
    }
    
    playerPosition.x=undefined;
    playerPosition.y=undefined;
    startGame();
}

function gameWin(){

    clearInterval(interval);

    const recordTime=localStorage.getItem('record');
    const playerTime=Date.now() - timeStart;

    if(recordTime){
        if(recordTime >= playerTime){
            localStorage.setItem('record', playerTime);
            spanresult.innerHTML="SUPERASTE EL RECORD";
            
        }else{
            spanresult.innerHTML="Losiento, no superaste el record 😓";
        }
    }else{
        spanresult.innerHTML="¿Es tu primer juego?, Intenta superar tu record";
        localStorage.setItem('record', playerTime);
    }
     
    console.log({recordTime, playerTime});
    clearInterval(interval);
    mostrarGanador();
}

function accionarBoom(){
  const bommPositionX=bommPosition.x= playerPosition.x;
  const bommPositionY=bommPosition.y= playerPosition.y;
  
  playerPosition.x=undefined;
  playerPosition.y=undefined;

  game.fillText(emojis['BOMB_COLLISION'], bommPositionX-(elementSize/5), bommPositionY);
  
}

function cantidadVidas(){
    spanvidas.innerHTML= emojis['VIDA'].repeat(lives);
}

function verTiempo(){
    spantiempo.innerHTML= Date.now() - timeStart;
}

function verRecord(){
    spanrecord.innerHTML= localStorage.getItem('record');
}




 window.addEventListener('keydown', moveTeclado);
 btnUp.addEventListener('click', moveUp);
 btnLeft.addEventListener('click', moveLeft);
 btnRight.addEventListener('click', moveRight);
 btnDown.addEventListener('click', moveDown);


 
 function moveTeclado(event){
    if(event.key=='ArrowUp'){
        moveUp();
    }else if(event.key=='ArrowLeft'){
        moveLeft();
    }else if(event.key=='ArrowRight'){
        moveRight();
    }else if(event.key=='ArrowDown'){
        moveDown();
    }
    
 }

 

 function moveUp() {
    console.log('Me quiero mover hacia arriba');
  
    if ((playerPosition.y - elementSize) < elementSize) {
      console.log('OUT');
    } else {
      playerPosition.y -= elementSize;
      startGame();
    }
  }

 function moveLeft() {
  console.log('Me quiero mover hacia izquierda');

  if ((playerPosition.x - elementSize) < elementSize) {
    console.log('OUT');
  } else {
    playerPosition.x -= elementSize;
    startGame();
  }
}
function moveRight() {
  console.log('Me quiero mover hacia derecha');

  if ((playerPosition.x + elementSize) > canvasSize) {
    console.log('OUT');
  } else {
    playerPosition.x += elementSize;
    startGame();
  }
}
function moveDown() {
  console.log('Me quiero mover hacia abajo');
  
  if ((playerPosition.y + elementSize) > canvasSize) {
    console.log('OUT');
  } else {
    playerPosition.y += elementSize;
    startGame();
  }
}


btnreiniciar.addEventListener('click', reloadGame);

function reloadGame(){
  location.reload();
}

const contenedor1=document.querySelector('.game-container');
const contenedor2=document.querySelector('.container');
const contenedor3=document.querySelector('.container-lose');
const ren2=document.querySelector('#reiniciar2');
const puntos=document.querySelector('#puntaje');

ren2.addEventListener('click', reloadGame);


function mostrarPuntos(){
  puntos.innerHTML= Date.now() - timeStart;
}

function mostrarGanador(){
  contenedor2.className="container";
  contenedor1.className="game-container inactive";
  mostrarPuntos();
}

function mostrarPerdida(){
  contenedor3.className="container-lose";
  contenedor1.className="game-container inactive";

}

