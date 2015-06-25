/**
 * Created by Cray on 2015/4/27.
 */
void function(){
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var i= 0; i < vendors.length && !window.requestAnimationFrame; ++i){
        window.requestAnimationFrame = window[vendors[i]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[i]+'CancelAnimationFrame'] ||
            window[vendors[i] + 'CancelRequestAnimationFrame'];
    }
    /*callback(timestamp)*/
    if(!window.requestAnimationFrame)window.requestAnimationFrame = function(callback){
        var curTime = new Date().getTime();
        var timeToCall = Math.max(0, 16 - (curTime - lastTime));
        var id = window.setTimeout(function(){
            callback(curTime + timeToCall);
        }, timeToCall);
        lastTime = curTime + timeToCall;
        return id;
    };
    if(!window.cancelAnimationFrame)window.cancelAnimationFrame = function(id){
        clearInterval(id);
    };
}();