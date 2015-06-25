/**
 * Created by Cray on 2015/6/4.
 */
function GameController(LevelManager, HTMLActuator, LocalStorageManger){
    this.levelManager = new LevelManager(4);
    this.actuator = new HTMLActuator();
    this.storageManager = new LocalStorageManger();
    //��ʼ��������
    $.eventManager.on("level_data_complete",this.initScene.bind(this));
    $.eventManager.on("to-swap",this.swap.bind(this));
    $.eventManager.on("animate-finished",this.animateFinished.bind(this));
    $.eventManager.on("keep-next-level",this.keeyNextLevel.bind(this));
    $.eventManager.on("try-again",this.tryAgain.bind(this));
    //����
    this.utils = $.utils;
    //����
    this.setUp();
}

/**
 * ������Ϸ
 */
GameController.prototype.setUp = function(){
    var level = this.storageManager.getLevel();//��õȼ�����
    this.levelManager.setLevel(level);
};
/**
 * �ȼ��������ݼ������
 * @param event
 */
GameController.prototype.initScene = function(event){
    this.initEvent = event || this.initEvent;
    var data = this.initEvent.data;
    var self = this;

    this.tiles = data.tiles;
    this.moves = data.moves;
    this.targetScore = data.targetScore;
    this.score = 0;
    this.comboMultiplier = 1; //�������� �����ɱ�����
    //����Ŀ�����
    this.actuator.updateTargetScore(this.targetScore);
    this.actuator.updateMoves(this.moves);
    this.actuator.updateScore(this.score);

    this.actuator.userInteractionEnable = true;

    var state = this.storageManager.getState();
    this.grid = new Grid(this.tiles, state);

    window.requestAnimationFrame(function () {
        self.actuator.clearContainer();
        self.createTile();
    });
};
/**
 * ����
 * @param event
 * direct : 0-up,1-right,2-down,3-left
 */
GameController.prototype.swap = function(event){
    if(!this.actuator.userInteractionEnable)return false;
    $.log.debug(event,"[GameController->swap()]");
    var self = this;
    var obj = event.data;
    var vector = {
        0:{dx:0,dy:-1},
        1:{dx:1,dy:0},
        2:{dx:0,dy:1},
        3:{dx:-1,dy:0}
    };

    var tile= self.grid.getTileByPosition(obj.position);
    var direct = obj.direct;
    var swapTile = this.grid.availableTile({x:tile.x + vector[direct].dx, y:tile.y+vector[direct].dy});
    if(swapTile==null){return;}
    if(this.grid.isPossibleSwap(tile,swapTile)){
        this.grid.swap(tile,swapTile);
        this.decrementMoves();
        window.requestAnimationFrame(function () {
            self.actuator.clearContainer();
            self.createTile();
        });
        this.actuate();
    }
};
/**
 * ִ���ƶ�
 */
GameController.prototype.actuate = function(){
    var self = this;
    var chains = [];
    window.requestAnimationFrame(function () {
        chains = self.grid.detectHorizontalMatches(chains);
        chains = self.grid.detectVerticalMatches(chains);
        if(chains.length>0){
            $.log.info(chains,"[GameController->actuate()->chains]");
            //�������
            self.calculateScores(chains);
            //������tile ���ò�����
            $.utils.each(chains,function(i,j,tile){
                self.grid.tiles[tile.y][tile.x].candyName = "";
            });
            self.actuator.userInteractionEnable = false;
            self.actuator.removeTiles(chains);
        }else{
            self.comboMultiplier = 1;
            self.grid.detectPossibleSwaps().length==0 && self.grid.shuffle();
            self.actuator.userInteractionEnable = true;
    }
        $.log.debug(self.grid.tiles,"[GameController->actuate()->tiles]");
    });
};
/**
 * ��������
 * @param event
 */
GameController.prototype.animateFinished = function(event){
    var self = this;
    var drops = [];
    var topups = [];

    //window.requestAnimationFrame(function () {
    //    self.actuator.clearContainer();
    //    self.createTile();
    //});

    var state = event.data.state;
    state++;
    switch (state){
        case 1:{
            window.requestAnimationFrame(function () {
                drops = self.grid.fillHoles();//���ո�
                drops.length>0 ? self.actuator.dropTiles(drops) : self.animateFinished({data:{state:1}});
                $.log.info(drops,"[GameController->actuate()->drops]");
            });
            break;
        }
        case 2:{
            window.requestAnimationFrame(function () {
                topups = self.grid.topUp();//������ǹ�
                topups.length>0 ? self.actuator.topupTiles(topups) : self.animateFinished({data:{state:2}});
                $.log.info(topups,"[GameController->actuate()->topups]");
            });
            break;
        }
        case 3:{
            window.requestAnimationFrame(function () {
                self.actuator.clearContainer();
                self.createTile();
                self.actuate();
            });
            break;
        }
    }
};

/**
 * ����tile
 */
GameController.prototype.createTile = function(){
    var self = this;
    self.utils.each(self.grid.tiles,function(i,j,tile){
        self.actuator.addTile(tile);
    });
};
/**
 * �������
 * @param chains
 */
GameController.prototype.calculateScores = function(chains){
    var score = 0;
    for(var i=0;i<chains.length;i++) {
        if (chains[i].length > 0) {
            score += (chains[i].length - 2) * 60 * this.comboMultiplier;
            this.comboMultiplier++;
        }
    }
    this.score += score;
    this.actuator.updateScore(this.score);

    this.score >= this.targetScore && this.actuator.showGameOver("win");
};
/**
 * �����ƶ�����
 */
GameController.prototype.decrementMoves = function(){
    this.moves--;
    this.actuator.updateMoves(this.moves);

    this.moves <=0 && this.actuator.showGameOver("lost");
};

/**
 * ��һ�ȼ�
 */
GameController.prototype.keeyNextLevel = function(){
    var level = this.levelManager.level;
    level++;
    this.levelManager.setLevel(level) ||  this.actuator.showGameOver("over");
};
/**
 * ����һ��
 */
GameController.prototype.tryAgain = function(){
   this.initScene();
};