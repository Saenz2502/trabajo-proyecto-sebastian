function initCanvas(){
  var ctx = document.getElementById('my_canvas').getContext('2d');
  var backgroundImage = new Image();
  var naveImage   = new Image(); // nave
  var enemiespic1  = new Image(); // enemigo 1
  var enemiespic2 = new Image(); // enemigo 2

  // backgroundImage y naveImage
  naveImage.src       = "images/estrella-removebg-preview.png"; //Imagen de la nave espacial
  // Enemigos fotos
  enemiespic1.src     = "images/descarga-removebg-preview.png";
  enemiespic2.src     = "images/play 2.png"; //imagen del enmigo
  
  // altura y anchura (canvas)
  var cW = ctx.canvas.width;500;
  var cH = ctx.canvas.height;500;

  // plantilla para naves
  var enemyTemplate = function(options){
      return {
          id: options.id||'',
          x: options.x || '',
          y: options.y || '',
          w: options.w || '',
          h: options.h || '',
          image: options.image || enemiespic1
      }
  }

  // Para reducir una función repetitiva o dos,se hiieron  cambios leves en la forma en la que se crea enemigos.
  var enemies = [
                 new enemyTemplate({id: "enemy1", x: 100, y:-20, w:50, h: 50}),
                 new enemyTemplate({id: "enemy2", x: 225, y:-20, w:50, h: 50}),
                 new enemyTemplate({id: "enemy3", x: 350, y:-20, w:50, h: 50}),
                 new enemyTemplate({id: "enemy4", x:100,  y:-70, w:50, h: 50}),
                 new enemyTemplate({id: "enemy5", x:225,  y:-70, w:50, h: 50}),
                 new enemyTemplate({id: "enemy6", x:350,  y:-70, w:50, h: 50}),
                 new enemyTemplate({id: "enemy7", x:475,  y:-70, w:50, h: 50}),
                 new enemyTemplate({id: "enemy8", x:600,  y:-70, w:50, h: 50}),
                 new enemyTemplate({id: "enemy9", x:475,  y:-20, w:50, h: 50}),
                 new enemyTemplate({id: "enemy10",x:600, y: -20, w:50, h: 50}),

                 // Segundo grupo de enemigos
                 new enemyTemplate({ id: "enemy11", x: 100, y: -220, w: 50, h: 50, image: enemiespic2 }),
                 new enemyTemplate({ id: "enemy12", x: 225, y: -220, w: 50, h: 50, image: enemiespic2 }),
                 new enemyTemplate({ id: "enemy13", x: 350, y: -220, w: 50, h: 50, image: enemiespic2 }),
                 new enemyTemplate({ id: "enemy14", x: 100, y: -270, w: 50, h: 50, image: enemiespic2 }),
                 new enemyTemplate({ id: "enemy15", x: 225, y: -270, w: 50, h: 50, image: enemiespic2 }),
                 new enemyTemplate({ id: "enemy16", x: 350, y: -270, w: 50, h: 50, image: enemiespic2 }),
                 new enemyTemplate({ id: "enemy17", x: 475, y: -270, w: 50, h: 50, image: enemiespic2 }),
                 new enemyTemplate({ id: "enemy18", x: 600, y: -270, w: 50, h: 50, image: enemiespic2 }),
                 new enemyTemplate({ id: "enemy19", x: 475, y: -200, w: 50, h: 50, image: enemiespic2 }),
                 new enemyTemplate({ id: "enemy20", x: 600, y: -200, w: 50, h: 50, image: enemiespic2 })
                ];

  // Esto también obliga a los enemigos a comprobar si ELLOS están golpeando al jugador.
  var renderEnemies = function (enemyList) {
      for (var i = 0; i < enemyList.length; i++) {
          console.log(enemyList[i]);
          ctx.drawImage(enemyList[i].image, enemyList[i].x, enemyList[i].y += .5, enemyList[i].w, enemyList[i].h);
          // Detecta cuando los barcos golpean el nivel inferior
          launcher.hitDetectLowerLevel(enemyList[i]);
      }
  }

  function Launcher(){
      //ubicación de balas
      this.y = 500, 
      this.x = cW*.5-25, 
      this.w = 100, 
      this.h = 100,   
      this.direccion, 
      this.bg="red", //color de bala
      this.misiles = [];

       // Si desea usar diferentes fuentes o mensajes para el jugador que pierde, puede cambiarlo en consecuencia.
       this.gameStatus = {
          over: false, 
          message: "",
          fillStyle: 'red',
          font: 'italic bold 36px Arial, sans-serif',
      }

      this.render = function () {
          if(this.direccion === 'left'){
              this.x-=5;
          } else if(this.direccion === 'right'){
              this.x+=5;
          }else if(this.direccion === "downArrow"){
              this.y+=5;
          }else if(this.direccion === "upArrow"){
              this.y-=5;
          }
          ctx.fillStyle = this.bg;
          ctx.drawImage(backgroundImage, 10, 10); //imagen de fondo
          ctx.drawImage(naveImage,this.x,this.y, 100, 90); // Necesitamos asegurarnos de que la nave espacial esté en el mismo lugar que las balas.

          for(var i=0; i < this.misiles.length; i++){
              var m = this.misiles[i];
              ctx.fillRect(m.x, m.y-=5, m.w, m.h); // dirección de la bala
              this.hitDetect(this.misiles[i],i);
              if(m.y <= 0){ // Si el misil pasa los límites del lienzo, retírelo.
                  this.misiles.splice(i,1); // empalmar el misil fuera de la matriz de misiles
              }
          }
          // Esto pasa si ganas
          if (enemies.length === 0) {
              clearInterval(animateInterval); // Detener el bucle de animación del juego
              ctx.fillStyle ='perdiste,intentalo de nuevo';
              ctx.font = this.gameStatus.font;
              ctx.fillText('Ganaste, felicitacones!', cW * .5 - 80, 50);
          }
      }
      // Detectar impacto de bala
      this.hitDetect = function (m, mi) {
          console.log('crush');
          for (var i = 0; i < enemies.length; i++) {
              var e = enemies[i];
              if(m.x+m.w >= e.x && 
                 m.x <= e.x+e.w && 
                 m.y >= e.y && 
                 m.y <= e.y+e.h){
                  this.misiles.splice(this.misiles[mi],1); // retirar el misil
                  enemies.splice(i, 1); // Elimina al enemigo que golpeó el misil.
                  document.querySelector('.barra').innerHTML = "Destroyed "+ e.id+ " ";
              }
          }
      }
      // Preguntar a la nave del jugador si un enemigo ha pasado o lo ha  golpeado la nave del jugador
      this.hitDetectLowerLevel = function(enemy){
          // Si la ubicación del barco es superior a 550, sabemos que pasó un nivel inferior
          if(enemy.y > 550){
              this.gameStatus.over = true;
              this.gameStatus.message = 'perdiste,intetarlo de nuevo';
              
          }
          // Esto detecta un choque de la nave con enemigos
          //console.log(this);
        
          if(enemy.id === 'enemy3'){
              //console.log(this.y);
              console.log(this.x);
          }
          if ((enemy.y < this.y + 25 && enemy.y > this.y - 25) &&
              (enemy.x < this.x + 45 && enemy.x > this.x - 45)) { // Csi el enemigo está a la izquierda o a la derecha de la nave espacial
                  this.gameStatus.over = true;
                  this.gameStatus.message = alert('Perdiste, Intentalo de nuevo!');
              }

          if(this.gameStatus.over === true){  
              clearInterval(animateInterval); // Detener el bucle de animación del juego
              ctx.fillStyle = this.gameStatus.fillStyle; //poner color al texto
              ctx.font = this.gameStatus.font;
              // Para mostrar texto en el lienzo
              ctx.fillText(this.gameStatus.message, cW * .5 - 80, 50); // texto x , y
          }
      }
  }
  
  var launcher = new Launcher();
  function animate(){
      ctx.clearRect(0, 0, cW, cH);
      launcher.render();
      renderEnemies(enemies);
  }
  var animateInterval = setInterval(animate, 6);
  
  var left_btn  = document.getElementById('left_btn');
  var right_btn = document.getElementById('right_btn');
  var fire_btn  = document.getElementById('fire_btn'); 

 document.addEventListener('keydown', function(event) {
      if(event.keyCode == 37) // flecha izquierda
      {
       launcher.direccion = 'left';  
          if(launcher.x < cW*.2-130){
              launcher.x+=0;
              launcher.direccion = '';
          }
     }    
  });

  document.addEventListener('keyup', function(event) {
      if(event.keyCode == 37)
      {
       launcher.x+=0;
       launcher.direccion = '';
      }
  }); 

  document.addEventListener('keydown', function(event) {
      if(event.keyCode == 39) // flecha correcta
      {
       launcher.direccion = 'right';
       if(launcher.x > cW-110){
          launcher.x-=0;
          launcher.direccion = '';
       }
      
      }
  });

  document.addEventListener('keyup', function(event) {
      if(event.keyCode == 39) // flecha correcta
      {
       launcher.x-=0;   
       launcher.direccion = '';
      }
  }); 

  document.addEventListener('keydown', function(event){
       if(event.keyCode == 38) // flecha arriba
         launcher.direccion = 'upArrow';  
         if(launcher.y < cH*.2-80){
            launcher.y += 0;
            launcher.direccion = '';
          }
       }
  );

  document.addEventListener('keyup', function(event){
       if(event.keyCode == 38) // flecha arriba
       {
         launcher.y -= 0;
         launcher.direccion = '';
       }
  });

  document.addEventListener('keydown', function(event){
       if(event.keyCode == 40) // flecha hacia abajo
       {
         launcher.direccion = 'downArrow';  
        if(launcher.y > cH - 110){
          launcher.y -= 0;
          launcher.direccion = '';
         }
       }
  });
  document.addEventListener('keyup', function(event){
       if(event.keyCode == 40) //flecha hacia abajo
       {
         launcher.y += 0;
         launcher.direccion = '';
       }
  });

  document.addEventListener('keydown', function(event){
       if(event.keycode== 80) // reinicia el juego
       {
        location.reload();
       }
  });

  // botones de control
  left_btn.addEventListener('mousedown', function(event) {
      launcher.direccion = 'left';
  });

  left_btn.addEventListener('mouseup', function(event) {
      launcher.direccion = '';
  });

  right_btn.addEventListener('mousedown', function(event) {
      launcher.direccion = 'right';
  });

  right_btn.addEventListener('mouseup', function(event) {
      launcher.direccion = '';
  });
  //Este código a continuación dispara balas
  fire_btn.addEventListener('mousedown', function(event) {
      launcher.misiles.push({x: launcher.x + launcher.w*.5, y: launcher.y, w: 3, h: 10});
  });
  // Esto se dispara al hacer clic en el botón de espacio del teclado
  document.addEventListener('keydown', function(event) {
      if(event.keyCode == 32) {
         launcher.misiles.push({x: launcher.x + launcher.w*.5, y: launcher.y, w: 3,h: 10});
      }
  });


}window.addEventListener('load', function(event) {
  initCanvas();
});

