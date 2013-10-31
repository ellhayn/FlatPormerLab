var stage;
var preloadCount = 0; var PRELOADTOTAL = 2;
var img_bg = new Image(); var obj_bg;

////////////////////////////////////////////////////////////////////////////
// Keyboard management
//////////////////////////////////////////////////////////////////////////// 
var touches = {};
var keynum_DOWNARROW = 40; var keynum_UPARROW = 38;
var keynum_LEFTARROW = 37; var keynum_RIGHTARROW = 39;

////////////////////////////////////////////////////////////////////////////
// Player
//////////////////////////////////////////////////////////////////////////// 

var img_joueur = new Image(); var obj_joueur;
var speed_joueur_x = 0; var speed_joueur_y = 0;

////////////////////////////////////////////////////////////////////////////
// Gravity engine
//////////////////////////////////////////////////////////////////////////// 

var ACTIVEGRAVITY = true;
var PLAYERMAXSPEEDX = 10; var PLAYERACCX = 1; var PLAYERACCY = 1;
var JUMPPOWER = 20; var NBJUMPMAX = 4; var nb_jump = 0;
var GROUNDFRICTION = 0.2; var AIRFRICTION = 0.0001;
var GRAVITY = 2;
var on_ground = true; var input_x = 0; var input_y = 0;

function gravity_event_keydown(e)
{
    if ((e.keyCode >= 37) && (e.keyCode <= 40))
    {
	e.preventDefault();
	if (e.keyCode == keynum_DOWNARROW)
	    input_y--;
	if (e.keyCode == keynum_UPARROW)
	{
	    input_y++;
	    if (!(keynum_UPARROW in touches) && (nb_jump < NBJUMPMAX))
	    {
		nb_jump++;
		if (speed_joueur_y < 0)
		    speed_joueur_y = -speed_joueur_y;
		speed_joueur_y -= JUMPPOWER;
	    }
	    on_ground = false;
	}
	if (e.keyCode == keynum_LEFTARROW)
	    input_x--;
	if (e.keyCode == keynum_RIGHTARROW)
	    input_x++;
    }   
    touches[e.keyCode]=true;
    return false;
}

function gravity_event_keyup(e)
{
    if (e.keyCode == keynum_DOWNARROW)
	input_y++;
    if (e.keyCode == keynum_UPARROW)
	input_y--;
    if (e.keyCode == keynum_LEFTARROW)
	input_x++;
    if (e.keyCode == keynum_RIGHTARROW)
	input_x--;
}

function gravity_event_tick()
{
    var friction;
    if (obj_joueur.y >= 365)
	friction = GROUNDFRICTION;
    else
	friction = AIRFRICTION;
    var acc = 0;
    if (keynum_LEFTARROW in touches)
	acc -= PLAYERACCX;
    if (keynum_RIGHTARROW in touches)
	acc += PLAYERACCX;
    if (acc==0)
	speed_joueur_x -= (speed_joueur_x*friction);
    else
	speed_joueur_x += acc;
    if (speed_joueur_x > PLAYERMAXSPEEDX)
	speed_joueur_x = PLAYERMAXSPEEDX;
    else if (speed_joueur_x < -PLAYERMAXSPEEDX)
	speed_joueur_x = -PLAYERMAXSPEEDX;
    obj_joueur.x += speed_joueur_x;
    if (obj_joueur.x < 0)
    {
	speed_joueur_x = 0;
	obj_joueur.x = 0;
    }
    else if (obj_joueur.x > 550)
    {
	speed_joueur_x = 0;
	obj_joueur.x = 550;
    }
    // up arrow
    speed_joueur_y += GRAVITY;
    if (keynum_UPARROW in touches)
	speed_joueur_y -= PLAYERACCY;
    if (keynum_DOWNARROW in touches)
	speed_joueur_y += PLAYERACCY;
    obj_joueur.y += speed_joueur_y;
    if (obj_joueur.y < 0)
    {
	speed_joueur_y = 0;
	obj_joueur.y = 0;
    }
    else if (obj_joueur.y > 365)
    {
	speed_joueur_y = 0;
	obj_joueur.y = 365;
	nb_jump = 0;
    }
}

////////////////////////////////////////////////////////////////////////////
// Main program
//////////////////////////////////////////////////////////////////////////// 

addEventListener("keydown",
		 function(e)
		 {
		     if (ACTIVEGRAVITY)
			 gravity_event_keydown(e);
		     return false;
		     touches[e.keyCode]=true;
		 });

addEventListener("keyup",
		 function (e)
		 {
		     delete touches[e.keyCode];
		     if (ACTIVEGRAVITY)
			 gravity_event_keyup(e);
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
	gravity_event_tick();
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
    document.getElementById("PLAYERACCX").innerHTML = PLAYERACCX;
    document.getElementById("PLAYERACCY").innerHTML = PLAYERACCY;
    document.getElementById("PLAYERMAXSPEEDX").innerHTML = PLAYERMAXSPEEDX;
    document.getElementById("GRAVITY").innerHTML = GRAVITY;
    document.getElementById("JUMPPOWER").innerHTML = JUMPPOWER;
    document.getElementById("GROUNDFRICTION").innerHTML = GROUNDFRICTION;
    document.getElementById("AIRFRICTION").innerHTML = AIRFRICTION;
    document.getElementById("NBJUMPMAX").innerHTML = NBJUMPMAX;
}