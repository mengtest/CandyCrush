/**
 * Created by Cray on 2015/4/27.
 */
Function.prototype.method = function(name,func){
    if(!this.prototype[name]){
        this.prototype[name] = func;
    }
    return this;
};
/**
 * [description]
 * @param  {[type]} Super [父类]
 * @return {[type]}       [子类实例]
 */
Function.method('inherits', function(Super){
    var prototype = Object.create(Super.prototype);
    prototype.constructor = this;
    this.prototype = prototype;
    return this;
});

Function.method('bind',function(target){
    var that = this,
        slice = Array.prototype.slice,//获得数组slice方法，slice对数组做浅复制
        args = slice.apply(arguments, [1]);// arguments.slice(1);复制伪数组从1开始
    return function(){
        return that.apply(target,args.concat(slice.apply(arguments, [0])));//从参数arguments数组0开始复制，然后和args链接，target为绑定目标
    };
});