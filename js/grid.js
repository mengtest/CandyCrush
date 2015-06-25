/**
 * Created by Cray on 2015/6/5.
 */
function Grid(cells, state){

    this.possibleSwaps = [];
    this.candyManager = new CandyManger();
    this.utils = $.utils;

    this.columns = cells.length;
    this.rows = cells[0].length;
    this.cells = cells;
    this.tiles = state ? this.formatState(state) : (this.shuffle() || this.tiles);
}

/**
 *
 * @param state
 */
Grid.prototype.formatState = function(state){
    if(this.utils.isArray(state)){
        var tiles=[];
        for(var i=0; i<this.columns; i++){
            var rowArray = tiles[i] = [];
            for(var j=0; j<this.rows; j++){
                var data = state[i][j];
                rowArray.push(data ? new Tile(data.positon,data.candyName):null);
            }
        }
        return tiles;
    }
    return this.createTilesByCells();
};
/**
 * 创建空的二维数组
 * @returns {Array}
 */
Grid.prototype.createTilesByCells = function(){
    var tiles=[];
    for(var i=0; i<this.columns; i++){
        var rowArray = tiles[i] = [];
        for(var j=0; j<this.rows; j++){
            var candyName = "";
            do{
                candyName = this.candyManager.getRandom()
            }while(i>=2 && tiles[i-1][j] && tiles[i-1][j].candyName == candyName && tiles[i-2][j] && tiles[i-2][j].candyName == candyName
                || j>=2 && tiles[i][j-1] && tiles[i][j-1].candyName == candyName && tiles[i][j-2] && tiles[i][j-2].candyName == candyName);
            rowArray.push(this.cells[i][j] == 1 ? new Tile({"y":i,"x":j},candyName):null);
        }
    }
    return tiles;
};
/**
 * 空格上方的糖果落下填充空格
 */
Grid.prototype.fillHoles = function(){
    var drops = [];
    for(var y=this.columns-1; y>=0; y--) {
        for (var x = 0; x < this.rows; x++) {  //逐行逐列遍历
            if(this.tiles[y][x]){
                if(this.tiles[y][x].candyName == ""){
                    var col = 1;
                    while((y-col)>=0){
                        if(this.tiles[y-col][x] && this.tiles[y-col][x].candyName){
                            this.tiles[y][x].candyName = this.tiles[y-col][x].candyName;
                            this.tiles[y-col][x].candyName = "";
                            drops.push({to:this.tiles[y][x],from:this.tiles[y-col][x]});
                            break;
                        }else{
                            col++;
                        }

                    }
                }
            }
        }
    }

    return drops;
};
/**
 * 在添加糖果
 * @returns {Array}
 */
Grid.prototype.topUp = function(){
    var topups = [];
    var candyName = "";
    for(var y=0; y<this.columns; y++) {
        for (var x = 0; x < this.rows; x++) {  //逐行逐列遍历
            if (this.tiles[y][x]) {
                if (this.tiles[y][x].candyName == "") {
                    var newCandyName = "";
                    do{
                        newCandyName = this.candyManager.getRandom()
                    }while(newCandyName == candyName);
                    candyName = newCandyName;
                    this.tiles[y][x].candyName = newCandyName;
                    topups.push(this.tiles[y][x]);
                }
            }
        }
    }
    return topups;
};
/**
 * 交换
 * @param tile
 * @param swapTile
 */
Grid.prototype.swap = function(tile,swapTile){
    var c = tile.candyName;
    tile.candyName = swapTile.candyName;
    swapTile.candyName = c;
    return true;
};
/**
 * 是否有三个相同的链接
 * 纵向 横向 有三个相同的candyName才可移动
 */
Grid.prototype.hasChain = function(tile){
    var horLen = 1,
        verLen = 1,
        x = tile.x, //x -> rows
        y = tile.y; //y -> columns
    if(tile.candyName == ""){return false};
    var i,j;
    //判断横向
    for(i = x-1; i >= 0; i--){
        if(x > 0 && this.tiles[y][i] && this.tiles[y][i].candyName == tile.candyName){
            horLen++;
        }else{
            break;
        }
    }

    for(i = x+1; i<this.rows; i++){
        if(x < this.rows-1 && this.tiles[y][i] && this.tiles[y][i].candyName == tile.candyName){
            horLen++;
        }else{
            break;
        }
    }
    if(horLen>=3)return true;

    //判断纵向
    for(j = y+1; j < this.columns; j++){
        if(y <this.columns-1  && this.tiles[j][x] && this.tiles[j][x].candyName == tile.candyName){
            verLen++;
        }else{
            break;
        }
    }
    for(j = y-1; j >= 0; j--){
        if(y > 0 && this.tiles[j][x] && this.tiles[j][x].candyName == tile.candyName){
            verLen++;
        }else{
            break;
        }
    }

    return verLen>=3;
};
/**
 * 洗牌
 */
Grid.prototype.shuffle = function(){
    do{
        this.tiles = this.createTilesByCells();
        $.log.debug(this.tiles,"[Grid->shuffle()]");
        this.detectPossibleSwaps();
    }while(this.possibleSwaps.length==0)
};
/**
 * 检测是否有可以移动的
 */
Grid.prototype.detectPossibleSwaps = function(){
    this.possibleSwaps = [];
    var self = this;
    for(var y=0; y<this.columns; y++){
        for(var x=0; x<this.rows; x++){  //逐行逐列遍历
            if(this.tiles[y][x]){  //不为空
                //当前列 逐行查询
                if(y < this.columns - 1){
                    if(this.tiles[y+1][x]){
                        actuateSwap(this.tiles[y][x], this.tiles[y+1][x]);
                    }
                }
                if(x < this.rows - 1){  //当前行开始逐列查询并且不是最后一个
                    if(this.tiles[y][x+1]){
                        actuateSwap(this.tiles[y][x], this.tiles[y][x+1]);
                    }
                }
            }
        }
    }

    function actuateSwap(tile,swapTile){
        self.swap(tile,swapTile);
        if(self.hasChain(tile) || self.hasChain(swapTile)){
            self.swap(tile,swapTile);
            self.possibleSwaps.push({"tile":tile,"swapTile":swapTile});
        }else{
            self.swap(tile,swapTile);
        }
    }
    return this.possibleSwaps;
};

/**
 * 是否可以交换
 * @param tile
 * @param swapTile
 */
Grid.prototype.isPossibleSwap = function(tile,swapTile){
    var isPossible = false;
    var possibleSwaps = this.possibleSwaps;
    $.utils.each(possibleSwaps,function(i,obj){
        if((obj.tile == tile && obj.swapTile == swapTile) || (obj.tile == swapTile && obj.swapTile == tile)){
            isPossible = true;
            return false;//退出循环
        }
    });

    return isPossible;
};

/**
 * 水平方向检测可消除的糖果
 * @param chains
 * @returns {*}
 */
Grid.prototype.detectHorizontalMatches = function(chains){
    var candyName="";
    for(var y=0; y<this.columns; y++){
        for(var x=0; x<this.rows-2; x++){  //逐行逐列遍历
            if(this.tiles[y][x]){  //不为空
                candyName = this.tiles[y][x].candyName;
                if((this.tiles[y][x+1] && this.tiles[y][x+1].candyName == candyName) && (this.tiles[y][x+2] && this.tiles[y][x+2].candyName == candyName)){
                    var c = [];
                    c.push(this.tiles[y][x]);
                    c.push(this.tiles[y][x+1]);
                    c.push(this.tiles[y][x+2]);
                    x+=3;
                    while(x < this.rows && this.tiles[y][x] && this.tiles[y][x].candyName == candyName){
                        c.push(this.tiles[y][x]);
                        x++;
                    }
                    chains.push(c);
                }
            }
        }
    }

    return chains;
};
/**
 * 垂直方向检测可消除的糖果
 * @param chains
 * @returns {*}
 */
Grid.prototype.detectVerticalMatches = function(chains){
    var candyName="";
    for (var x = 0; x < this.rows; x++) {  //逐列遍历
        for(var y=0; y<this.columns - 2; y++) {
            if(this.tiles[y][x]){//不为空
                candyName = this.tiles[y][x].candyName;
                if((this.tiles[y+1][x] && this.tiles[y+1][x].candyName == candyName) && (this.tiles[y+2][x] && this.tiles[y+2][x].candyName == candyName)){
                    var c = [];
                    c.push(this.tiles[y][x]);
                    c.push(this.tiles[y+1][x]);
                    c.push(this.tiles[y+2][x]);
                    y+=3;
                    while(y < this.columns && this.tiles[y][x] && this.tiles[y][x].candyName == candyName){
                        c.push(this.tiles[y][x]);
                        y++;
                    }
                    chains.push(c);
                }
            }
        }
    }

    return chains;
};
/**
 * 判断postion位置是否可用
 * @param position
 */
Grid.prototype.availableTile = function(position){
    return position.x < 0 || position.x > this.rows || position.y<0 || position.y > this.columns  ? null : this.getTileByPosition(position);
};
/**
 *
 * @param position
 * @returns {*}
 */
Grid.prototype.getTileByPosition = function(position){
    var tile=null;
    this.utils.each(this.tiles,function(i,j,t){
        if(t && t.x == position.x && t.y == position.y){
            tile = t;
            return false;
        }
    });

    return tile;
};
/**
 * 序列号数据
 * 存储状态
 */
Grid.prototype.serialize = function(){
    var tiles=[];
    for(var i=0; i<this.columns; i++){
        var rowArray = tiles[i] = [];
        for(var j=0; j<this.rows; j++){
            rowArray.push(this.tiles[i][j] ? this.tiles[i][j].serialize() : null);
        }
    }
    return {"state":tiles};
};



