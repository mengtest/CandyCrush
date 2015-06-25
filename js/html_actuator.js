/**
 * Created by Cray on 2015/6/4.
 */
function HTMLActuator(){
    this.scoreContainer = document.querySelector(".score-container");
    this.targetScoreContainer = document.querySelector(".targetScore-container");
    this.movesContainer = document.querySelector(".moves-container");

    this.titleContainer = document.querySelector(".tile-container");

    this.gameMessageContainer = document.querySelector(".game-message");


    this.touchStartClientX = 0;
    this.touchStartClientY = 0;
    this.tile = null;
    this.eventManager = $.eventManager;
    this.utils = $.utils;
    this.eles = [];

    if (window.navigator.msPointerEnabled) {
        this.eventTouchstart    = "MSPointerDown";
        this.eventTouchmove     = "MSPointerMove";
        this.eventTouchend      = "MSPointerUp";
    } else {
        this.eventTouchstart    = "touchstart";
        this.eventTouchmove     = "touchmove";
        this.eventTouchend      = "touchend";
    }

    this.gameConatiner = document.querySelector(".game-container");
    this.gameConatiner.addEventListener(this.eventTouchend,this.touchEndHandler.bind(this));
    this.gameConatiner.addEventListener("mouseup",this.mouseUpHandler.bind(this));

    var self = this;
    this.bindButtonPress(".keep-playing-button", function(event){
        event.preventDefault();
        self.hideGameOver();
        $.eventManager.fire("keep-next-level");
    });
    this.bindButtonPress(".retry-button", function(event){
        event.preventDefault();
        self.hideGameOver();
        $.eventManager.fire("try-again");
    });

    this.userInteractionEnable = true;
}

/**
 * tile
 * @param tile
 */
HTMLActuator.prototype.addTile = function(tile){
    if(tile && tile.candyName){
        var candyEle = document.createElement("div");
        var positionClass = this.normalizeClassPostion(tile.getPosition());
        var candyClass = this.normalizeClassName(tile.candyName);

        candyEle.clsName = candyClass;
        candyEle.y = tile.y;
        candyEle.x = tile.x;
        var classes = ["tile",candyClass,positionClass];
        this.applyClasses(candyEle,classes);

        this.titleContainer.appendChild(candyEle);
        //添加监听器
        this.addListener(candyEle);
        //存储元素
        this.eles.push(candyEle);

        return candyEle;
    }

    return null;
};
/**
 * 移除tiles
 * @param chains
 */
HTMLActuator.prototype.removeTiles = function(chains){
    var self = this;
    var bs = 0;
    for(var i=0;i<chains.length;i++){
            if(chains[i].length > 0){
            var c = chains[i];
            for(var j=0; j<c.length; j++){
                self.utils.each(self.eles,function(i,ele){
                   if(ele.x == c[j].x && ele.y == c[j].y && !$.eventManager.hasEventListener(ele,"transitionEnd",animationEndHandler)){
                       bs++;
                       $.eventManager.on(ele, "transitionEnd", animationEndHandler);
                       window.requestAnimationFrame(function(){
                           ele.style.opacity = 0;
                       });

                   }
                });
            }
        }
    }
    var es = 0;
    function animationEndHandler(event){
        $.log.info(event,"HTMLActuator->removeTiles()->animationEndHandler(event)");
        event.target.classList.remove("fadeout");
        $.eventManager.off(event.target,"transitionEnd",animationEndHandler);
        es++;
        if(es == bs){
            $.eventManager.fire("animate-finished", {state:0});
        }
    }
};
/**
 * 空格上方的糖果落下
 * @param drops
 */
HTMLActuator.prototype.dropTiles = function(drops){
    var self = this;
    var bs = 0;
    $.utils.each(drops,function(i,obj){
        var tile = obj.to;
        var ftile = obj.from;
        self.utils.each(self.eles,function(i,ele){
            if(ele.x == ftile.x && ele.y == ftile.y){
                bs++;
                $.eventManager.on(ele, "transitionEnd", animationEndHandler);
                var cs = $.utils.getCSSProterty("transform");
                $.log.debug(cs + " : getCSSProterty->transform");
                window.requestAnimationFrame(function(){
                    ele.style[cs] = "translate(" + (tile.x)*64 +"px,"+ tile.y*72 +"px)";
                });


            }
        });
    });

    var es = 0;
    function animationEndHandler(event){
        $.log.info(event,"HTMLActuator->dropTiles()->animationEndHandler(event)");
        $.eventManager.off(event.target,"transitionEnd",animationEndHandler);
        es++;
        if(es == bs){
            $.eventManager.fire("animate-finished", {state:1});
        }
    }
};
/**
 * 添加新的糖果到空格
 * @param topups
 */
HTMLActuator.prototype.topupTiles = function(topups){
    var self = this;
    var bs = 0;
    $.utils.each(topups,function(i,tile){
        bs++;
        var ele = self.addTile(tile);
        var cs = $.utils.getCSSProterty("transform");
        ele.style[cs] = "translate(" + (tile.x)*64 +"px,-80px)";
        ele.style.opacity = 0;
        $.eventManager.on(ele, "transitionEnd", animationEndHandler);
        window.requestAnimationFrame(function(){
            ele.style[cs] = "translate(" + (tile.x)*64 +"px,"+ tile.y*72 +"px)";
            ele.style.opacity = 1;
        });
    });

    var es = 0;
    function animationEndHandler(event){
        $.log.info(event,"HTMLActuator->topupTiles()->animationEndHandler(event)");
        $.eventManager.off(event.target,"transitionEnd",animationEndHandler);
        es++;
        if(es == bs){
            $.eventManager.fire("animate-finished", {state:2});
        }
    }
};
/**
 * 分数
 * @param len
 */
HTMLActuator.prototype.updateScore = function(value){
   this.scoreContainer.textContent = value;
};
/**
 * 更新移动次数
 * @param value
 */
HTMLActuator.prototype.updateMoves = function(value){
    this.movesContainer.textContent = value;
};
/**
 * 更新目标分数
 * @param value
 */
HTMLActuator.prototype.updateTargetScore = function(value){
    this.targetScoreContainer.textContent = value;
};


/**
 * 给糖果元素添加碰触监听器
 * @param ele
 */
HTMLActuator.prototype.addListener = function(ele){
    var self = this;
    var touchStartClientX, touchStartClientY;
    ele.addEventListener(this.eventTouchstart,function(event){
        if ((!window.navigator.msPointerEnabled && event.touches.length > 1) ||
            event.targetTouches > 1) {
            return; //多点触摸不做处理
        }

        if (window.navigator.msPointerEnabled) {
            touchStartClientX = event.pageX;
            touchStartClientY = event.pageY;
        } else {
            touchStartClientX = event.touches[0].clientX;
            touchStartClientY = event.touches[0].clientY;
        }
        //兼容ie this == window
        self.startHandler(touchStartClientX,touchStartClientY,event);
    });

    ele.addEventListener(this.eventTouchend,function(event){
        if ((!window.navigator.msPointerEnabled && event.touches.length > 1) ||
            event.targetTouches > 1) {
            return; //多点触摸不做处理
        }

        self.outHandler(event);
    });


    ele.addEventListener("mousedown", function(event){
        self.startHandler(event.clientX,event.clientY,event);
    });

    ele.addEventListener("mouseout", function(event){
        self.tile &&  self.outHandler(event);
    });
};
/**
 * 容器监听碰触结束事件
 * @param event
 */
HTMLActuator.prototype.touchEndHandler = function(event){
    if ((!window.navigator.msPointerEnabled && event.touches.length > 1) ||
        event.targetTouches > 1) {
        return; //多点触摸不做处理
    }

    var touchEndClientX, touchEndClientY;

    if (window.navigator.msPointerEnabled) {
        touchEndClientX = event.pageX;
        touchEndClientY = event.pageY;
    } else {
        touchEndClientX = event.changedTouches[0].clientX;
        touchEndClientY = event.changedTouches[0].clientY;
    }

    this.endHandler(touchEndClientX,touchEndClientY,event);
};
/**
 * 鼠标抬起
 * @param event
 */
HTMLActuator.prototype.mouseUpHandler = function(event){
    this.endHandler(event.clientX, event.clientY,event);
};
/**
 * 鼠标按下和手指碰触
 * @param event
 */
HTMLActuator.prototype.startHandler = function(touchStartClientX,touchStartClientY,event){
    this.touchStartClientX = touchStartClientX;
    this.touchStartClientY = touchStartClientY;
    this.tile = event.target;

    this.tile.classList.remove(this.tile.clsName);
    this.tile.classList.add(this.tile.clsName+"-high");

    event.preventDefault();//阻止事件的默认行为

    $.log.debug("x :"+ this.tile.x + " y: " + this.tile.y,"[HTMLActuator->startHandler()]");
};
/**
 * 元素鼠标离开或者手指碰触结束
 * @param event
 */
HTMLActuator.prototype.outHandler = function(event){
    this.tile.classList.remove(this.tile.clsName+"-high");
    this.tile.classList.add(this.tile.clsName);

    event.preventDefault();//阻止事件的默认行为
};
/**
 * 游戏容器鼠标抬起或者碰触结束
 * @param touchEndClientX
 * @param touchEndClientY
 * @param event
 */
HTMLActuator.prototype.endHandler = function(touchEndClientX,touchEndClientY,event){
    var dx = touchEndClientX - this.touchStartClientX;
    var absDx = Math.abs(dx);

    var dy = touchEndClientY - this.touchStartClientY;
    var absDy = Math.abs(dy);

    if (Math.max(absDx, absDy) > 10) {
        // 0-up,1-right,2-down,3-left
        var direct = absDx > absDy ? (dx > 0 ? 1 : 3) : (dy > 0 ? 2 : 0);
        this.eventManager.fire("to-swap", {position:{x:this.tile.x,y:this.tile.y},direct:direct});
    }

    event.preventDefault();//阻止事件的默认行为
};
/**
 * 元素设置样式属性
 * @param ele
 * @param classes
 */
HTMLActuator.prototype.applyClasses = function(ele, classes){
    ele.setAttribute("class", classes.join(" "));
};
/**
 * 格式化样式名
 * @param name
 * @returns {string}
 */
HTMLActuator.prototype.normalizeClassName = function(name){
    return name.toLowerCase();
};
/**
 * 格式化位置样式
 * @param position
 * @returns {string}
 */
HTMLActuator.prototype.normalizeClassPostion = function(position){
    return "tile-position-" + position.x + "-" + position.y;
};
/**
 * 清空容器
 */
HTMLActuator.prototype.clearContainer = function () {
    this.eles = [];//清空
    var container = this.titleContainer;
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }
};
/**
 * 添加按钮事件
 * @param selector
 * @param fn
 */
HTMLActuator.prototype.bindButtonPress = function (selector, fn) {
    var button = document.querySelector(selector);
    button.addEventListener("click", fn.bind(this));
    button.addEventListener(this.eventTouchend, fn.bind(this));
};
/**
 * 显示结果
 * @param result
 */
HTMLActuator.prototype.showGameOver = function(result){
    this.userInteractionEnable = false;
    this.gameMessageContainer.style.display = "block";
    var mw = document.querySelector(".middle-warp");
    var keepbtn = document.querySelector(".keep-playing-button");
    if(result == "win"){
        mw.classList.remove("game-lost");
        mw.classList.add("game-win");
        keepbtn.style.display="inline-block";
    }else if(result == "lost")
    {
        mw.classList.remove("game-win");
        mw.classList.add("game-lost");
        this.keepbtn.style.display="none";
    }
};
/**
 * 隐藏结果
 */
HTMLActuator.prototype.hideGameOver = function(){
    this.gameMessageContainer.style.display = "none";
};