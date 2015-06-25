/**
 * Created by Cray on 2015/6/4.
 */
void function Ajax(){
    var xhr = new XMLHttpRequest();

    var rnotwhite = (/\S+/g);
    var rwhite = (/\s+/g);
    var rdoubleslash = (/\/\//g);
    var allTypes = "*/".concat( "*" );

    function extend(source,target){
        var name,copy;
        for(name in target){
            if(!!target[name]){
                copy = target[name];
                source[name] = copy;
            }
        }
        return source;
    }

    function send(options,headers){
        //format url
        options.url = formatURL(options.url);
        //get method
        if(options.method == "GET")
        {
            options.url = options.param != "" ?  options.url + "?" + options.param : options.url;
            options.param = null;
        }
        xhr.open(options.method,options.url,options.async);

        var key;
        for(key in headers){
            xhr.setRequestHeader(key,headers[key]);
        }
        //·¢ËÍÊý¾Ý
        xhr.send(options.param);
        var isSuccess;
        var log = window.$.log;
        function callback (type) {
            if ( type === "error" && options.fail) {
                log.error("url request fail: " + options.url,"[Ajax->callback()]");
                options.fail({status:xhr.status, statusText:xhr.statusText});
            } else if(options.success){
                isSuccess = xhr.status >= 200 && xhr.status < 300 || xhr.status === 304;
                if(isSuccess){
                    var data = options.resultFormat === "*" ? xhr.response : (options.resultFormat === "xml" ? xhr.responseXML : xhr.responseText);
                    if(options.contentParse.hasOwnProperty(options.resultFormat)){
                        try{
                            data = options.contentParse[options.resultFormat](data);
                        }catch(e){
                            log.error("type " + options.resultFormat + "parse fail","[Ajax->callback()]");
                        }

                    }
                    $.log.info(data,"[AJAX->callback()]");
                    options.success(data);
                }
            }
        }

        xhr.onload = callback;
        xhr.onerror = callback("error");
    }

    var ajaxSettings = {
        url: window.location.href,
        method:"GET",
        async:true,
        contentType:"application/x-www-form-urlencoded; charset=UTF-8",
        accepts:{"*":allTypes, text:"text/plain", html:"text/html", xml:"application/xml, text/xml", json:"application/json, text/javascript"},
        contentParse: {xml: parseXML, json:parseJSON}
    };

    /**
     * resultFormat for JSON
     * @param data
     */
    function parseJSON ( data ) {
        return JSON.parse( data + "" );
    }

    /**
     * resultFormat for XML
     * @param data
     * @returns {*}
     */
    function parseXML( data ) {
        var xml, tmp;
        if ( !data || typeof data !== "string" ) {
            return null;
        }
        try {
            tmp = new DOMParser();
            xml = tmp.parseFromString( data, "text/xml" );
        } catch ( e ) {
            xml = undefined;
        }
        return xml;
    }
    /**
     *
     * @param url
     * @returns {*}
     */
    function formatURL(url){
        if(url.indexOf("http")==-1){
            var a = location.pathname.split("/");
            a.pop();
            var d = a.join("/");
            //url = url.charAt(0) == "/" ? url.substr(1,url.length) : url;
            url = "http://"+ (location.host + "/" + d + "/" + url).replace(rdoubleslash,"/");
          }
        return url;
    }

    function serializeParam(param){
        if(typeof param  == "string"){return param.replace(rwhite,"");}

        var paras = [];
        for(var key in param){
            paras.push(key+"="+param[key]);
        }
        return paras.join("&").replace(rwhite,"");
    }

    /**
     * options{
     *    url:"",
     *    method:"GET/POST",
     *    param:{},
     *    resultFormat:"/json/xml/text",
     *    aysn:true/false,
     *    success:fun(data),
     *    fail:fun()
     * }
     * @type {{getData: Function, getJSON: Function}}
     */
    var ajax = {
        getData:function(url,options){
            if ( typeof url === "object" ) {
                options = url;
                url = undefined;
            }
            options = options || {};

            var requestHeaders = {};
            var s = extend(ajaxSettings,options);
            s.url = url || s.url;
            s.param = s.param ? serializeParam(s.param) : "";
            s.success = s.success || null;
            s.fail = s.fail || null;
            requestHeaders["Content-Type"] = s.contentType;
            s.resultFormats = (s.resultFormat || "*").toLowerCase().match(rnotwhite) || [""];
            if(s.resultFormats.length>0){
                s.resultFormat = s.resultFormats[0];
                requestHeaders["Accept"] = s.resultFormat && s.accepts[s.resultFormat] ?
                s.accepts[s.resultFormat] + (s.resultFormat !== "*" ? ", " + allTypes + "; q=0.01" : "") : s.accepts["*"];
            }

            send(s,requestHeaders);
            return this;
        },
        getJSON:function(url,param,successFn,failFn){
            if(typeof param == "function"){
                successFn = param;
                param = null;
            }
            successFn = successFn || null;
            failFn = failFn || null;
            return this.getData({url:url,type:"GET",param:param,resultFormat:"json",success:successFn,fail:failFn});
        }
    };

    window.$ = window.$ ? window.$ : {};
    window.$.ajax= ajax;
}();

