var squirrel, 
    nut, 
    nutTimeout, 
    interval, 
    nextX, 
    nextY, 
    missSound, 
    catchSound;

var margin = 50;


function init()
{
    // hash elements:
    squirrel = $("#squirrel");
    belly = $("#belly");
    nut = $("#nut");
    missSound = $("#miss_sound")[0];
    catchSound = $("#catch_sound")[0];
    giggleSound = $("#giggle_sound")[0];
    
    // Timeout:
    interval = 700;
    
    // Desktop clicks:
    $(document).on("mousedown", function(e){
        onTouch(e);
    });
    
    // Mobile touches:
    document.addEventListener('touchstart', function(e) {
        onTouch(e);
    }, false);
    
    // Start the game:
    nutTimeout = setTimeout(showNut, interval);
}


function startResume()
{
    // Look straight:
    setSquirrelTexture("c");
    showNut();
}


function showNut ()
{
    // Position and transform:
    var scale = Math.random() * 0.2 + 0.8;
    var rotation = Math.random() * 90 - 45;
    getNextPos();
    
    nut.css({
        left: nextX,
        top: nextY,
        transform: "rotate(" + rotation + "deg) scale(" + scale + ")"
    });
    
    // Timeout:
    nutTimeout = setTimeout(onTimeout, interval);
}


function hideNut()
{
    // Hide by scaling down to create css transition.
    nut.css({
        transform: "scale(0.01)" // Zero creates weird transitions for some reason
    });
}


function onTimeout()
{
    hideNut();
    nutTimeout = setTimeout(showNut, 800);
}


function onTouch(e)
{
    e.preventDefault();
    // get a single touch / mouse event:
    var touch = e.touches ? e.touches[0] : e;
    if(touch.target == nut[0]){
        onCatch();
    } else if(touch.target == belly[0]) {
        onTickle();
    } else {
        onMiss();
        // Squirrle texture (look at nut):
        var angle = getAngleFromCenter(touch.pageX, touch.pageY);
        var sqLabel = getLabelFromAngle(angle);
        setSquirrelTexture(sqLabel);
    }
}


function onMiss()
{
    missSound.play();
}


function onCatch()
{
    clearTimeout(nutTimeout);
    hideNut();
    
    // Update squirrel sprite:
    setSquirrelTexture("nut");
    
    catchSound.play();
    
    // Time to resume:
    nutTimeout = setTimeout(startResume, 2500);
}


function onTickle()
{
    hideNut();
    setSquirrelTexture("giggle");
    giggleSound.play();
}


function getNextPos()
{
    // Randomize x and y but avoid collision with squirrle
    
    do nextX = Math.random() * ($('body').width() - nut.width() - margin) + margin;
    while (nextX > squirrel.offset().left && nextX < squirrel.offset().left + squirrel.width())
    
    do nextY = Math.random() * ($('body').height() - nut.height() - margin) + margin;
    while (nextY > squirrel.offset().top && nextY < squirrel.offset().top + squirrel.height())
}


function setSquirrelTexture(label)
{
    squirrel.attr("class", "sprite sq_" + label);
}
    

function getAngleFromCenter(x, y)
{
    var p1 = {x: $("body").width() / 2, y: $("body").height() / 2};
    
    var dy = y - p1.y;
    var dx = x - p1.x;
    var theta = Math.atan2(dy, dx);
    theta *= 180/Math.PI;
    
    return theta;
}

    
function getLabelFromAngle (angle)
{
    if (angle >= -22.5 && angle < 22.5)
        return "r"
    else if (angle >= 22.5 && angle < 67.5)
        return "dr"
    else if (angle >= 67.5 && angle < 112.5)
        return "d"
    else if (angle >= 112.5 && angle < 157.5)
        return "dl"
    else if (angle >= 157.5 || angle < -157.5)
        return "l"
    else if (angle >= -157.5 && angle < -112.5)
        return "ul"
    else if (angle >= -112.5 && angle < -67.5)
        return "u"
    else if (angle >= -67.5 && angle < -22.5)
        return "ur";
}

    
$(function(){
    init();
});