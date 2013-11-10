var stage;
var preloadCount = 0; var PRELOADTOTAL = 2;
var img_bg = new Image(); var obj_bg;
var p = {}

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

// position parameters
p["PLAYERMINPOSX"] = 0; p["PLAYERMAXPOSX"] = 550;
p["PLAYERMINPOSY"] = 0; p["PLAYERMAXPOSY"] = 365;
// speed parameters
p["PLAYERMINSPEEDX"] = 0; p["PLAYERMAXSPEEDX"] = 10;
p["PLAYERMINSPEEDY"] = 0; p["PLAYERMAXSPEEDY"] = 100;
// acceleration parameters
p["PLAYERACCX"] = 1; p["PLAYERACCY"] = 1;
// jump management
p["JUMPPOWER"] = 0; p["NBJUMPMAX"] = 2;
// physics management
p["GRAVITY"] = 2; p["GROUNDFRICTION"] = 0.2;
p["AIRFRICTION"] = 0.0001;


function getCorrectValue(new_val, min_val, max_val, epsilon)
{
    if (new_val > max_val)
	return max_val;
    else if (new_val < min_val)
	return min_val;
    else if ((new_val > -epsilon) &&
	     (new_val < epsilon))
	return 0;
    return new_val;
}

function gravity_event_keydown(e)
{
    if ((e.keyCode >= 37) && (e.keyCode <= 40) && !(e.keyCode in touches))
    {
	e.preventDefault();
	if ((e.keyCode == keynum_UPARROW) &&
	    (nb_jump < p["NBJUMPMAX"]))
	{
	    nb_jump++;
	    speed_joueur_y = -p["JUMPPOWER"];
	}
    }
}

function gravity_event_keyup(e)
{
}

function gravity_event_tick()
{
    var friction;
    if (obj_joueur.y >= 365)
	friction = p["GROUNDFRICTION"];
    else
	friction = p["AIRFRICTION"];
    var acc = 0;
    if (keynum_LEFTARROW in touches)
	acc -= p["PLAYERACCX"];
    if (keynum_RIGHTARROW in touches)
	acc += p["PLAYERACCX"];
    if (acc == 0)
	acc -= (speed_joueur_x*friction);2
    speed_joueur_x = getCorrectValue(speed_joueur_x + acc,
				     -p["PLAYERMAXSPEEDX"],
				     p["PLAYERMAXSPEEDX"],
				     p["PLAYERMINSPEEDX"]);
    speed_joueur_x = getCorrectValue(obj_joueur.x + speed_joueur_x,
				   p["PLAYERMINPOSX"],
				   p["PLAYERMAXPOSX"],
				   0) - obj_joueur.x;
    obj_joueur.x += speed_joueur_x;
    // up arrow
    acc = p["GRAVITY"];
    if (keynum_UPARROW in touches)
	acc -= p["PLAYERACCY"];
    if (keynum_DOWNARROW in touches)
	acc += p["PLAYERACCY"];
    if (acc == 0)
	acc -= (speed_joueur_y*friction);
    speed_joueur_y = getCorrectValue(speed_joueur_y + acc,
				     -p["PLAYERMAXSPEEDY"],
				     p["PLAYERMAXSPEEDY"],
				     p["PLAYERMINSPEEDY"]);
    speed_joueur_y = getCorrectValue(obj_joueur.y + speed_joueur_y,
				   p["PLAYERMINPOSY"],
				   p["PLAYERMAXPOSY"],
				   0) - obj_joueur.y;
    obj_joueur.y += speed_joueur_y;
    if (obj_joueur.y == p["PLAYERMAXPOSY"])
	nb_jump = 0;
}

////////////////////////////////////////////////////////////////////////////
// Main program
//////////////////////////////////////////////////////////////////////////// 

addEventListener("keydown",
		 function(e)
		 {
		     gravity_event_keydown(e);
		     touches[e.keyCode]=true;
		     return false;
		 });

addEventListener("keyup",
		 function (e)
		 {
		     delete touches[e.keyCode];
		     gravity_event_keyup(e);
		 });

function startGame() {preloadAssets();}

function preloadAssets()
{
    img_bg.onload = preloadUpdate()
    img_bg.src = "media/images/background_sky_640x480px.png";

    img_joueur.onload = preloadUpdate();
//    img_joueur.src = "media/joueur.png";
    img_joueur.src = "media/images/Sprite_megaman_41x41px.png";
    
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
    gravity_event_tick();
    stage.update();
    var st = "<ul>";
    for (v in p)
    {
	var val = Number(document.getElementById(v).value);
	if (val != NaN)
	    p[v] = val;
	else
	    alert(v+" "+p[v])
//	st += "<li>"+v+" : "+p[v]+"</li>";
    }
    document.getElementById("parameters").innerHTML = st+"</ul>";
    document.getElementById("obj_joueur.x").innerHTML = obj_joueur.x.toFixed(2);
    document.getElementById("obj_joueur.y").innerHTML = obj_joueur.y.toFixed(2);
    document.getElementById("speed_joueur_x").innerHTML = speed_joueur_x.toFixed(2);
    document.getElementById("speed_joueur_y").innerHTML = speed_joueur_y.toFixed(2);
}