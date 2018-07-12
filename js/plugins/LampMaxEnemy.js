//=============================================================================
// LampMaxEnemy.js
//=============================================================================

/*:ja
 * @plugindesc ver1.00 敵の基本能力値のみ限界突破させます。
 * @author まっつＵＰ
 * 
 * @param mmpMin
 * @desc mmpの最低値です。
 * @default 0
 * 
 * @param paramsMin
 * @desc mmp以外の基本能力値の最低値です。
 * @default 1
 * 
 * @param mhpMax
 * @desc mhpの最大値です。
 * @default 999999
 * 
 * @param mmpMax
 * @desc mmpの最大値です。
 * @default 9999
 * 
 * @param paramsMax
 * @desc mhpとmmp以外の基本能力値の最高値です。
 * @default 999
 * 
 * @help
 * 
 * RPGで笑顔を・・・
 * 
 * このヘルプとパラメータの説明をよくお読みになってからお使いください。
 * 
 * 敵キャラのノートタグ
 * 
 * paramIdは基本能力値のID
 * <LMEparamId:value>
 * 
 * 例：atkを100にする。
 * <LME2:100>
 * 
 * 例：mhpを99999999にする。
 * <LME0:99999999>
 * 
 * 能力値の変更は敵キャラのセットアップ時に行います。
 * 
 * このプラグインを利用する場合は
 * readmeなどに「まっつＵＰ」の名を入れてください。
 * また、素材のみの販売はダメです。
 * 上記以外の規約等はございません。
 * もちろんツクールMVで使用する前提です。
 * 何か不具合ありましたら気軽にどうぞ。
 *  
 * 免責事項：
 * このプラグインを利用したことによるいかなる損害も制作者は一切の責任を負いません。
 * 
 */

(function() {
    
var parameters = PluginManager.parameters('LampMaxEnemy');
var LMEmmpMin = Number(parameters['mmpMin'] || 0);
var LMEparamsMin = Number(parameters['paramsMin'] || 1);
var LMEmhpMax = Number(parameters['mhpMax'] || 999999);
var LMEmmpMax = Number(parameters['mmpMax'] || 9999);
var LMEparamsMax = Number(parameters['paramsMax'] || 999);

Game_BattlerBase.prototype.LMforceParam = function(enemyId) {
    var enemy = $dataEnemies[enemyId];
    if(!enemy) return;
    var str;
    var num;
    for(var i = 0; i < enemy.params.length; i++){
        str = 'LME' + i;
        num = Number(enemy.meta[str] || 0);
        if(num) enemy.params[i] = num;
    }
};

//内蔵するrecoverAll()でhp==mhpになる。
var _Game_Enemy_setup = Game_Enemy.prototype.setup;
Game_Enemy.prototype.setup = function(enemyId, x, y) {
    this.LMforceParam(enemyId);
    _Game_Enemy_setup.call(this, enemyId, x, y);
};

Game_Enemy.prototype.paramMin = function(paramId) {
    if (paramId === 1) {
        return LMEmmpMin;
    } else {
        return LMEparamsMin;
    }
};

Game_Enemy.prototype.paramMax = function(paramId) {
    if (paramId === 0) {
        return LMEmhpMax;
    } else if (paramId === 1) {
        return LMEmmpMax;
    } else {
        return LMEparamsMax;
    }
};
          
})();
