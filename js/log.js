/**
 * Created by Cray on 2015/6/11.
 */
void function Log(){
    /**
     * ��־�ȼ� 0-5
     * {TRACE, DEBUG, INFO, WARN, ERROR, OFF}
     * ����level�ȼ��� ��־��������level�ȼ������־
     * ���� level = INFO ��־ֻ��� INFO - ERROR ����Ϣ
     * ����������־ level = OFF ����
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
                var args = slice.apply(arguments,[1]); //����arguments �� 0 ��ʼ
                output(arguments[0],args);
            }else{
                output(this.ERROR,"log() ��������.");
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
    //�������
    function output(){
        var level = arguments[0];
        if(level >= getLevel()){
            var slice = Array.prototype.slice;
            var args = slice.apply(arguments[1],[0]); //����arguments �� 0 ��ʼ
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
    //��õ�ǰʱ��
    function getTime(){
        var time;
        var d = new Date();
        time = d.getMilliseconds();
        time = d.getSeconds() + ":" + time;
        time = d.getMinutes() + ":" + time;
        time = d.getHours() +  ":" + time;
        return time;
    }
    //���log���õȼ�
    function getLevel(){
        return log.level;
    }

    window.$ = window.$ ? window.$ : {};
    window.$.log= log;
}();