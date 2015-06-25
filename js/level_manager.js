/**
 * Created by Cray on 2015/6/4.
 */
function LevelManager(maxLevel){
    this.maxLevel = maxLevel;
    this.eventManager = $.eventManager;

    this.level = 0;
    this.ajax = $.ajax;
}
/**
 *
 * @param level
 * @returns {string}
 */
LevelManager.prototype.setLevel = function(level){
    this.level = level;
    if(this.level>this.maxLevel){
        return false;
    }
    return this.loadMetaData(this.level);
};
/**
 * 通过等级参数加载数据
 * 加载完成派发level_data_complete类型事件
 * @param level
 */
LevelManager.prototype.loadMetaData = function(level){
    var url = "/data/Levels/Level_"+level+".json";
    var that = this;
    this.ajax.getJSON(url,function(data){
        //数据加载完成派发事件
        that.eventManager.fire("level_data_complete",data);
    });
    return true;
};