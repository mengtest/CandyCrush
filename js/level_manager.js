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
 * ͨ���ȼ�������������
 * ��������ɷ�level_data_complete�����¼�
 * @param level
 */
LevelManager.prototype.loadMetaData = function(level){
    var url = "/data/Levels/Level_"+level+".json";
    var that = this;
    this.ajax.getJSON(url,function(data){
        //���ݼ�������ɷ��¼�
        that.eventManager.fire("level_data_complete",data);
    });
    return true;
};