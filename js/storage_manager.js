/**
 * Created by Cray on 2015/6/4.
 */
function LocalStorageManger(){
    this.scoreKey = "scoreKey";
    this.levelKey = "levelKey";
    this.movesKey = "movesKey";
    this.stateKey = "stateKey";

    var supported = this.localStorageManagerSupported();
    this.storage = supported ? window.localStorage:window.customLocalStorage;
}

/**
 * 判断是否支持本地存储
 * localStorage
 */
LocalStorageManger.prototype.localStorageManagerSupported = function(){
    var testLevel = "testLevelKey";
    var storage = window.localStorage;
    try{
        storage.setItem(testLevel,5);
        storage.removeItem(testLevel);
        return true;
    }catch(e){
        return false;
    }
};
/**
 * 获得当前分数
 * @returns {*|number}
 */
LocalStorageManger.prototype.getScore = function(){
    return this.storage.getItem(this.scoreKey) || 0 ;
};
/**
 *
 * @param value
 */
LocalStorageManger.prototype.setScore = function(value){
    this.storage.setItem(this.scoreKey,value);
};
/**
 *
 * @returns {*|number}
 */
LocalStorageManger.prototype.getLevel = function(){
    return this.storage.getItem(this.levelKey) || 0 ;
};
/**
 *
 * @param value
 */
LocalStorageManger.prototype.setLevel = function(value){
    this.storage.setItem(this.levelKey,value);
};
/**
 *
 * @returns {*|number}
 */
LocalStorageManger.prototype.getMoves = function(){
    return this.storage.getItem(this.movesKey) || 0 ;
};
/**
 *
 * @param value
 */
LocalStorageManger.prototype.setMoves = function(value){
    this.storage.setItem(this.movesKey,value);
};
/**
 *
 * @returns {null}
 */
LocalStorageManger.prototype.getState = function(){
    var stateStr = this.storage.getItem(this.stateKey);
    return stateStr ? JSON.parse(stateStr) : null;
};
/**
 *
 * @param stateValue
 */
LocalStorageManger.prototype.setState = function(stateValue) {
    this.storage.setItem(this.stateKey, JSON.stringify(stateValue));
};


window.customLocalStorage = {
    _storage:{},
    length:0,
    key : function(index) {
        var i=0;
        for(var skey in this._storage)
        {
            if(i == index){
                return skey;
            }
        }
        return undefined;
    },
    getItem : function(key) {
        return this._storage.hasOwnProperty(key) ? this._storage[key] : undefined;
    },
    setItem : function(key,data) {
        this._storage[key] = data;
        this.length++;
    },
    removeItem : function(key) {
        if(this._storage.hasOwnProperty(key)){
            this.length--;
            return delete this._storage[key];
        }
        return null;
    },
    clear : function() {
        this._storage = {};
        this.length = 0;
    }
};