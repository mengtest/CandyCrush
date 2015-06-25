/**
 * Created by Cray on 2015/6/11.
 */
void function Log(){
    /**
     * 日志等级 0-5
     * {TRACE, DEBUG, INFO, WARN, ERROR, OFF}
     * 设置level等级后 日志输出会根据level等级输出日志
     * 比如 level = INFO 日志只输出 INFO - ERROR 的信息
     * 如果不输出日志 level = OFF 即可
     */
    var log = {
        TRACE:0,
        DEBUG:1,
        INFO:2,
        WARN:3,
        ERROR:4,
        OFF:5,
        level:this.INFO,
        log:function(){
            if(arguments.length>1){
                var slice = Array.prototype.slice;
                var args = slice.apply(arguments,[1]); //复制arguments 从 0 开始
                output(arguments[0],args);
            }else{
                output(this.ERROR,"log() 参数错误.");
            }
        },
        trace:function(){
            output(this.TRACE,arguments);
        },
        debug:function(){
            output(this.DEBUG,arguments);
        },
        info:function(){
            output(this.INFO,arguments);
        },
        warn:function(){
            output(this.WARN,arguments);
        },
        error:function(){
            output(this.ERROR,arguments);
        },
        clear:function(){
            console.clear();
        },
        time:function(id){
            console.time(id);
        },
        timeEnd:function(id){
            console.timeEnd(id);
        }
    };
    //输出函数
    function output(){
        var level = arguments[0];
        if(level >= getLevel()){
            var slice = Array.prototype.slice;
            var args = slice.apply(arguments[1],[0]); //复制arguments 从 0 开始
            if(args.length ==0){return false;}
            args.unshift(getTime());
            switch (level){
                case log.TRACE:{
                    console.trace.apply(console, args);
                    break;
                }
                case log.DEBUG:{
                    console.debug.apply(console, args);
                    break;
                }
                case log.INFO:{
                    console.info.apply(console, args);
                    break;
                }
                case log.WARN:{
                    console.warn.apply(console, args);
                    break;
                }
                case log.ERROR:{
                    console.error.apply(console, args);
                    break;
                }
            }
            args.unshift(getTime());

        }
    }
    //获得当前时间
    function getTime(){
        var time;
        var d = new Date();
        time = d.getMilliseconds();
        time = d.getSeconds() + ":" + time;
        time = d.getMinutes() + ":" + time;
        time = d.getHours() +  ":" + time;
        return time;
    }
    //获得log设置等级
    function getLevel(){
        return log.level;
    }

    window.$ = window.$ ? window.$ : {};
    window.$.log= log;
}();