/**
 * Created by Cray on 2015/4/23.
 */
void function Utils(){
    var utils = {
        trim: function(text) {
            return text == null ? "" : (text + "").replace(/^\s+\s+$/g,"");
        },
        /**
         * [each 循环返回false推出循环]
         * @return {[type]} [description]
         */
        each: function(obj, callback){
            var value,
                i = 0,
                j = 0,
                name,
                length = obj.length,
                isArray = this.isArray(obj);
            if(isArray){
                for(i=0;i<length;i++){
                    if(obj[i] && this.isArray(obj[i])){
                        for(j=0;j<obj[i].length;j++){
                            value = callback.call(obj[i],i,j,obj[i][j]);
                            if(value===false){
                                break;
                            }
                        }
                    }else{
                        value = callback.call(obj[i],i,obj[i]);
                        if(value===false){
                            break;
                        }
                    }
                }
            }else{
                for(name in obj){
                    value = callback.call(obj[name],name,obj[name]);
                    if(value===false){
                        break;
                    }
                }
            }

            return obj;
        },
        /**
         * 判断是否是数组
         * */
        isArray:function (value) {
            return Object.prototype.toString.apply(value) === '[object Array]';
        },
        /**
         * 判断是否是数值
         * */
        isNumber:function (value) {
            return typeof value === 'number' && isFinite(value);
        },
        /**
         * 对象数组排序
         * */
        by: function (name, minor) { //
            return function(o, p){
                var a, b;
                if(o && p && typeof o === 'object' && typeof p === 'object'){
                    a = o[name];
                    b = p[name];
                    if(a === b){
                        return typeof minor === 'function' ? minor(o, p) : 0;
                    }
                    if(typeof a === typeof b){
                        return a<b ? -1 : 1;
                    }
                    return typeof a < typeof b ? -1 : 1;
                }else{
                    throw{
                        name: 'Error',
                        message: 'Expected an object when sorting by ' + name
                    };
                }
            };
        },
        /**
         * 函数节流，100ms内只执行一次
         * eg window.onresize = function(){ throttle(bussifn); };
         * */
        throttle: function (method, context) {
            clearTimeout(method.tId);
            method.tId = setTimeout(function () {
                method.call(context);
            }, 100);
        },
        /**
         * [createObject 创建新对象]
         * @param  {[type]} o [description]
         * @return {[type]}   [description]
         */
        createObject: function(o){
            function F(){}
            F.prototype = o;
            return new F();
        },
        /**
         * 获得css样式属性
         * @param name
         * @returns {*}
         */
        getCSSProterty:function(name){
            var prefixes = ['ms-','moz-', 'webkit-', 'o-'],
                rcap = /-([a-z])/g,
                capfn = function($0,$1){return $1.toUpperCase();};

            var target = document.documentElement.style;
            var styleName="";
            for (var i=0, l=prefixes.length; i < l; i++) {
                styleName = (prefixes[i] + name).replace(rcap,capfn);
                if(styleName in target){
                    return styleName;
                }
            }
            return null;
        }
    };
    window.$ = window.$ ? window.$ : {};
    window.$.utils= utils;
}();
