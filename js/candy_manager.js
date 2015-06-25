/**
 * Created by Cray on 2015/6/4.
 */
function CandyManger(){
    this.candyArray = ["Croissant","Cupcake","Danish","Donut","Macaroon","SugarCookie"];
}

CandyManger.prototype.getRandom = function(){
    var i = Math.round(Math.random()*(this.candyArray.length-1));
    return this.candyArray[i];
};