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
 * @param  {[type]} Super [����]
 * @return {[type]}       [����ʵ��]
 */
Function.method('inherits', function(Super){
    var prototype = Object.create(Super.prototype);
    prototype.constructor = this;
    this.prototype = prototype;
    return this;
});

Function.method('bind',function(target){
    var that = this,
        slice = Array.prototype.slice,//�������slice������slice��������ǳ����
        args = slice.apply(arguments, [1]);// arguments.slice(1);����α�����1��ʼ
    return function(){
        return that.apply(target,args.concat(slice.apply(arguments, [0])));//�Ӳ���arguments����0��ʼ���ƣ�Ȼ���args���ӣ�targetΪ��Ŀ��
    };
});