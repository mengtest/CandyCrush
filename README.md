# CandyCrush
模拟糖果消除游戏
1. 基础脚本：aninmframe_polyfill.js, classlist_polyfill.js, function_polyfill.js, 
2. 服务脚本：ajax.js(http服务), logo.js(日志),  event_manager.js(事件), level_manager.js, candy_manager.js, storage_manager.js(存储)
3. 工具脚本: uitls.js
4. 数据模型脚本: tile.js, grid.js
5. 控制器脚本: game_controll.js
6. 视图脚本： html_actuator.js
7. 程序入口：main.js

初始化
[ [1, 1, 1, 1, 1, 1, 1, 1, 1 ],                              y
  [1, 1, 1, 1, 1, 1, 1, 1, 1 ],                              | 
  [1, 1, 1, 1, 1, 1, 1, 1, 1 ],                              |
  [1, 1, 1, 1, 1, 1, 1, 1, 1 ],                              |
  [1, 1, 1, 1, 1, 1, 1, 1, 1 ],                              |
  [1, 1, 1, 1, 1, 1, 1, 1, 1 ],                              |
  [1, 1, 1, 1, 1, 1, 1, 1, 1 ],                              |     
  [1, 1, 1, 1, 1, 1, 1, 1, 1 ],                              | 
  [1, 1, 1, 1, 1, 1, 1, 1, 1 ] ]   -------------------------> x
  
  1:标识有糖果 0：没有
  
  Grid->createTilesByCells 根据等级数据创建格子
  
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

横向和纵向从第三个开始和上两个都不相同就创建，否则重新随机新的糖果，保证初始化的时候没有三个以上一样的在一个链中

没耐心不写了，格子的逻辑都是在Gird.js 脚本中
