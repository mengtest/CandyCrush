/**
 * Created by Cray on 2015/6/2.
 */
function Tile(postion,candyName){
    this.x = postion.x;
    this.y = postion.y;
    this.candyName = candyName;
    this.previousPosition = null;
}
/**
 * 保存当前的位置
 */
Tile.prototype.savePosition = function(){
    this.previousPosition = {x:this.x, y:this.y};
};
/**
 * 更新位置
 */
Tile.prototype.updatePosition = function(position){
    this.x = position.x;
    this.y = position.y;
};
/**
 * 获得当前位置
 * @returns {{x: *, y: *}}
 */
Tile.prototype.getPosition = function(){
    return {x:this.x, y:this.y};
};
/**
 * 序列化
 * @returns {{position: {x: *, y: *}, candyName: *}}
 */
Tile.prototype.serialize = function(){
    return {position:{x:this.x,y:this.y}, candyName:this.candyName};
};
