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
 * ���浱ǰ��λ��
 */
Tile.prototype.savePosition = function(){
    this.previousPosition = {x:this.x, y:this.y};
};
/**
 * ����λ��
 */
Tile.prototype.updatePosition = function(position){
    this.x = position.x;
    this.y = position.y;
};
/**
 * ��õ�ǰλ��
 * @returns {{x: *, y: *}}
 */
Tile.prototype.getPosition = function(){
    return {x:this.x, y:this.y};
};
/**
 * ���л�
 * @returns {{position: {x: *, y: *}, candyName: *}}
 */
Tile.prototype.serialize = function(){
    return {position:{x:this.x,y:this.y}, candyName:this.candyName};
};
