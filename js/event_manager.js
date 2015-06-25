/**
 * Created by Cray on 2015/6/4.
 */
void function EventManager(){
    /**
     * [eventuality 给元素注册事件类型by on  然后此元素可以触发事件类型 by fire]
     * @param  {[type]} that [description]
     * @return {[type]}      [description]
     */
    var build =  function (that) {
        /**
         * 是否是dom元素
         * @param ele
         * @returns {*|boolean}
         */
        function isDOM (ele){
            return ele && (typeof HTMLElement === 'object' ? ele instanceof HTMLElement : typeof ele === 'object' && ele.nodeType === 1 && typeof ele.nodeName === 'string');
        }

        /**
         * 是否是字符串
         * @param value
         * @returns {boolean}
         */
        function isString(value){
            return Object.prototype.toString.apply(value) === '[object String]';
        }
        /**
         * [addHandler 添加事件]
         * @param {[type]} element [description]
         * @param {[type]} type    [description]
         * @param {[type]} handler [description]
         */
        function addHandler(element, type, handler){
            var prefixes = ['ms-','moz-', 'webkit-', 'o-'],
                eventypes = ["transitionEnd"],
                comType,
                rcap = /-([a-z])/g,
                capfn = function($0,$1){return $1.toUpperCase();};

            if(eventypes.indexOf(type) != -1){
                for (var i=0, l=prefixes.length; i < l; i++) {
                    comType = (prefixes[i] + type).replace(rcap,capfn);
                    if(element.addEventListener){
                        element.addEventListener(comType, handler, false);
                    }else if(element.attachEvent){
                        element.attachEvent("on" + comType, handler);
                    }else{
                        element["on" + comType] = handler;
                    }
                }
            }else{
                if(element.addEventListener){
                    element.addEventListener(type, handler, false);
                }else if(element.attachEvent){
                    element.attachEvent("on" + type, handler);
                }else{
                    element["on" + type] = handler;
                }
            }
        }

        /**
         * [removeHandler 移除事件]
         * @param  {[type]} element [description]
         * @param  {[type]} type    [description]
         * @param  {[type]} handler [description]
         * @return {[type]}         [description]
         */
        function removeHandler(element, type, handler){
            var prefixes = ['ms-','moz-', 'webkit-', 'o-'],
                eventypes = ["transitionEnd"],
                comType,
                rcap = /-([a-z])/g,
                capfn = function($0,$1){return $1.toUpperCase();};

            if(eventypes.indexOf(type) != -1){
                for (var i=0, l=prefixes.length; i < l; i++) {
                    comType = (prefixes[i] + type).replace(rcap,capfn);
                    if(element.removeEventListener){
                        element.removeEventListener(comType, handler, false);
                    }else if(element.detachEvent){
                        element.detachEvent("on" + comType, handler);
                    }else{
                        element["on" + comType] = null;
                    }
                }
            }else{
                if(element.removeEventListener){
                    element.removeEventListener(type, handler, false);
                }else if(element.detachEvent){
                    element.detachEvent("on" + type, handler);
                }else{
                    element["on" + type] = null;
                }
            }
        }

        var registry = {};
        /**
         * 派发监听事件
         * @param ele
         * @param type
         * @param data
         * @returns {that}
         */
        that.fire = function (ele, type, data) {
            if(isString(ele)){
                data = type; type = ele; ele = null;
            }
            var array,
                func,
                target,
                handler,
                i;
            if (registry.hasOwnProperty(type)) {
                array = registry[type];
                for (i = 0; i < array.length; i++) {
                    handler = array[i];
                    func = handler.method;
                    target = handler.target;
                    if(ele === null){
                        func.apply(this, [{target:target, data:data, param:handler.param, eventType:type}]);
                        if(handler.guid == 1){
                            this.off(ele, type, func);
                        }
                    }else{
                        if(target === ele){
                            func.apply(this, [{target:target, data:data, param:handler.param, eventType:type}]);
                            if(handler.guid == 1){
                                this.off(ele, type, func);
                            }
                        }
                    }

                }
            }
            return that;
        };
        /**
         * 添加监听
         * @param ele
         * @param type
         * @param method
         * @param param
         * @param guid
         * @returns {that}
         */
        that.on = function (ele, type, method, param, guid) {
            var handler;
            if(isDOM(ele)){
                addHandler(ele,type,method);
            }else if(isString(ele)){
                guid=param;param=method;method=type;type=ele;ele=null;
            }

            handler = {
                target:ele,
                method: method,
                param: param,
                guid:guid
            };
            if (registry.hasOwnProperty(type)) {
                registry[type].push(handler);
            } else {
                registry[type] = [handler];
            }
            return that;
        };
        /**
         * 移除监听
         * @param ele
         * @param type
         * @param method
         * @returns that
         */
        that.off = function(ele,type,method){
            if(isDOM(ele)){
                removeHandler(ele,type,method);
            }else if(isString(ele)){
                method=type;type=ele;
            }
            var array,
                handler,
                i;
            if (registry.hasOwnProperty(type)) {
                array = registry[type];
                if(method && array.length>0){
                    for (i = 0; i < array.length; i++) {
                        handler = array[i];
                        if(handler.method==method)
                            array.splice(i,1);
                    }
                    registry[type] = array;
                }else{
                    delete registry[type];
                }
            }
            return that;
        };
        /**
         * 此方法不支持dom监听
         * @param ele
         * @param type
         * @param method
         * @param param
         */
        that.one = function(ele, type, method, param){
            return this.on(ele, type, method, param, 1);
        };
        /**
         * 判断是否有监听器
         * @param ele
         * @param type
         * @param method
         * @returns {boolean}
         */
        that.hasEventListener = function(ele, type, method){
            if(isString(ele)){
                method = type; type = ele; ele = null;
            }
            var array,
                func,
                handler,
                target,
                result = false,
                i;
            if (registry.hasOwnProperty(type)) {
                array = registry[type];
                for (i = 0; i < array.length; i++) {
                    handler = array[i];
                    func = handler.method;
                    target = handler.target;
                    if (ele === null) {
                       if(method === func){result = true}
                    }else{
                       if(ele === target && method === func){result = true}
                    }
                }
            }

            return result;
        };
        /**
         * [getEvent description]
         * @param  {[type]} event [description]
         * @return {[type]}       [description]
         */
        that.getEvent =  function(event){
            return event ? event : window.event;
        };
        /**
         * [getTarget 当前事件目标对象]
         * @param  {[type]} event [description]
         * @return {[type]}       [description]
         */
        that.getTarget = function(event){
            return event.target || event.srcElement;
        };
        /**
         * [preventDefault 如果可以取消事件的默认行为，则取消该行为]
         * @param  {[type]} event [description]
         * @return {[type]}       [description]
         */
        that.preventDefault = function(event){
            if(event.preventDefault){
                event.preventDefault();
            }else{
                event.returnValue = false;
            }
        };
        /**
         * [stopPropagation 防止对事件流中当前节点的后续节点中的所有事件侦听器进行处理]
         * @param  {[type]} event [description]
         * @return {[type]}       [description]
         */
        that.stopPropagation = function(event){
            if(event.stopPropagation){
                event.stopPropagation();
            }else{
                event.cancleBubble = true;
            }
        };
        return that;
    };

    window.$ = window.$ ? window.$ : {};
    window.$.eventManager = build({});
}();