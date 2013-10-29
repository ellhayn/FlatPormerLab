var stage;
var preloadCount = 0; var PRELOADTOTAL = 2;

var img_joueur = new Image(); var obj_joueur;
var speed_joueur_x = 0; var speed_joueur_y = 0;
var PLAYERMAXSPEEDX = 20; var PLAYERACCX = 1;
var JUMPSPEED = 51; var JUMPACC = 2;

var ACTIVEGRAVITY = true;
var GRAVITY = 5;

var img_bg = new Image(); var obj_bg;

// keyboard management
var touches = {};
var keynum_DOWNARROW = 40; var keynum_UPARROW = 38;
var keynum_LEFTARROW = 37; var keynum_RIGHTARROW = 39;

addEventListener("keydown",
		 function(e)
		 {
		     touches[e.keyCode]=true;
		     if ((e.keyCode >= 37) && (e.keyCode <= 40))
		     {
			 e.preventDefault();
			 if (e.keyCode == keynum_UPARROW)
			     speed_joueur_y = JUMPSPEED;
			 if ((keynum_LEFTARROW in touches) && (keynum_RIGHTARROW in touches))
			     speed_joueur_x = 0;
		     }   
		     return false;
		 });

addEventListener("keyup",
		 function (e)
		 {
		     delete touches[e.keyCode];
		     if (!(keynum_LEFTARROW in touches) && !(keynum_RIGHTARROW in touches))
			 speed_joueur_x = 0;
		 });

function startGame() {preloadAssets();}

function preloadAssets()
{
    img_bg.onload = preloadUpdate()
    img_bg.src = "media/images/background_road_640x480px.png";

    img_joueur.onload = preloadUpdate();
//    img_joueur.src = "media/joueur.png";
    img_joueur.src = "media/images/Sprite_kingedmund_115x90px.png";
    
}

function preloadUpdate()
{
    preloadCount++;
    if (preloadCount == PRELOADTOTAL) launchGame();
}

function launchGame()
{
    stage = new createjs.Stage(document.getElementById("gameCanvas"));

    obj_bg = new createjs.Bitmap(img_bg);
    stage.addChild(obj_bg);
    
    obj_joueur = new createjs.Bitmap(img_joueur);
    stage.addChild(obj_joueur);
    obj_joueur.y = 365;

    createjs.Ticker.setFPS(30);
    createjs.Ticker.addEventListener("tick", mainTick);
}

function mainTick()
{
    if (ACTIVEGRAVITY)
    {
	// up arrow
	if ((keynum_UPARROW in touches) && (obj_joueur.y < 365))
	    speed_joueur_y += JUMPACC;
	speed_joueur_y -= GRAVITY;
	obj_joueur.y -= speed_joueur_y;
	if (obj_joueur.y < 0)
	{
	    speed_joueur_y = 0;
	    obj_joueur.y = 0;
	}
	else if (obj_joueur.y > 365)
	    obj_joueur.y = 365;
	
	// left arrow
	if ((keynum_LEFTARROW in touches) && (obj_joueur.x > 0))
	    speed_joueur_x -= PLAYERACCX;
	// right arrow
	if ((keynum_RIGHTARROW in touches) && (obj_joueur.x < 550))
	    speed_joueur_x += PLAYERACCX;
	// limit speed
	if (speed_joueur_x > PLAYERMAXSPEEDX)
	    speed_joueur_x = PLAYERMAXSPEEDX;
	else if (speed_joueur_x < -PLAYERMAXSPEEDX)
	    speed_joueur_x = -PLAYERMAXSPEEDX;
	obj_joueur.x += speed_joueur_x;
	if (obj_joueur.x < 0)
	    obj_joueur.x = 0;
	else if (obj_joueur.x > 550)
	    obj_joueur.x = 550;
    } else {
	// vertical move
	if ((keynum_DOWNARROW in touches) && (obj_joueur.y > 0))
	    obj_joueur.y -= PLAYERSPEED;
	else if ((keynum_UPARROW in touches) && (obj_joueur.y < 365))
	    obj_joueur.y += PLAYERSPEED;
	//horizontal move
	if ((keynum_LEFTARROW in touches) && (obj_joueur.x > 0))
	    obj_joueur.x -= PLAYERSPEED;
	else if ((keynum_RIGHTARROW in touches) && (obj_joueur.x < 550))
	    obj_joueur.x += PLAYERSPEED;
    }
    stage.update();
}