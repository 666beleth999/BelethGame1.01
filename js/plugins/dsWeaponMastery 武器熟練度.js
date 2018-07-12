//==============================================================================
// dsWeaponMastery.js
// Copyright (c) 2015 - 2018 DOURAKU
// Released under the MIT License.
// http://opensource.org/licenses/mit-license.php
//==============================================================================

/*:
 * @plugindesc 武器熟練度システム ver1.9.0
 * @author 道楽
 *
 * @requiredAssets img/system/WMAptitude
 *
 * @param Weapon Masteries Max
 * @desc 武器熟練度の影響を受ける武器タイプの最大数
 * @default 12
 * @type number
 *
 * @param Weapon Mastery Table
 * @desc 武器熟練度に使用する武器タイプのテーブル
 * 熟練度の種類分必要
 * @default ["1","2","3","4","5","6","7","8","9","10","11","12"]
 * @type number[]
 *
 * @param Weapon Mastery Icon
 * @desc 表示する武器タイプのアイコン
 * 熟練度の種類分必要
 * @default ["96","97","98","99","100","101","102","103","104","105","106","107"]
 * @type number[]
 *
 * @param Mastery Level Max
 * @desc 武器熟練度レベルの最大値
 * D=1, C=2, B=3, A=4, S=5の順番で設定
 * @default ["100","100","100","100","100"]
 * @type number[]
 *
 * @param Mastery Exp Max
 * @desc 武器熟練度レベルアップに必要な経験値
 * この経験値は武器を使用して攻撃するごとに加算されます
 * @default 1000
 * @type number
 *
 * @param Add Mastery Exp
 * @desc 攻撃ごとに加算される武器熟練度経験値
 * D=1, C=2, B=3, A=4, S=5の順番で設定
 * @default ["5","10","15","20","25"]
 * @type number[]
 *
 * @param Add Damage Rate
 * @desc 熟練度上昇毎に加算されるダメージ率
 * @default 5
 * @type number
 *
 * @param Learning Skill Text
 * @desc スキル習得時に表示されるテキスト
 * %1 - アクター %2 - 武器タイプ %3 武器熟練度レベル
 * @default %1は%2の武器熟練度が %3 に上がった！
 * @type text
 *
 * @help
 * このプラグインは以下のメモタグの設定が必要です。
 *
 * ----------------------------------------------------------------------------
 * アクターに設定するメモタグ
 *
 * <wmAptitude:C,S,B,A,D,C,C,B,A,A,D,C>
 *  各武器に対する適正を設定します。
 *  設定できる値は適正が低い順に「D」「C」「B」「A」「S」となっています。
 *  また、このタグの引数は「,」区切りで、
 *  「Weapon Mastery Max」の数だけ必要になります。
 *
 * ----------------------------------------------------------------------------
 * 職業に設定するメモタグ
 *
 * <wmAptitude:C,S,B,A,D,C,C,B,A,A,D,C>
 *  アクターと同様のタグが設定できます。
 *  両方に設定されている場合は職業に設定されている適性が優先されます。
 *
 * ----------------------------------------------------------------------------
 * スキルに設定するメモタグ
 *
 * <wmType:[武器タイプ]>
 *  スキルに対応する武器タイプの種類を設定します。
 *  [武器タイプ] - 武器タイプのID(数字)
 *                 -1の場合は現在装備している武器の種類に依存するようになります。
 *                 この状態では<requiredWM>が無効になりますので、
 *                 習得レベルの設定は<requiredWMEx>を使用してください。
 *
 * <requiredWM:[必要レベル]>
 *  スキルを習得するために必要な武器熟練度レベルを設定します。
 *  [必要レベル] - 習得に必要な武器熟練度レベル(数字)
 *
 * <requiredWMEx[条件番号]:[武器タイプ],[必要レベル]>
 *  必要な武器熟練度レベルを設定するタグの拡張版です。
 *  複数の武器タイプに必要レベルを設定する時はこちらのタグを使用します。
 *  なお、<requiredWM>と同時に設定した場合は<requiredWM>が優先されます。
 *  [条件番号]   - 00～09までの2桁の数値が設定できます。
 *                 なお、ひとつのスキルに同じ条件番号を複数設定出来ません。
 *  [武器タイプ] - 武器タイプのID(数字)
 *  [必要レベル] - 習得に必要な武器熟練度レベル(数字)
 *
 * ----------------------------------------------------------------------------
 * プラグインコマンド
 *
 * アクターの武器適正を変更するコマンド
 *   ChangeWMAptitude actorId wtypeId value
 *
 * アクターの武器適正を加減算するコマンド
 *   AddWMAptitude actorId wtypeId value
 *
 * アクターの武器熟練度レベルを変更するコマンド
 *   ChangeWMLevel actorId wtypeId value show
 *
 * アクターの武器熟練度レベルを加減算するコマンド
 *   AddWMLevel actorId wtypeId value show
 *
 * パーティ全員の武器熟練度レベルを加減算するコマンド
 *   AddWMLevelAll wtypeId value show
 *
 * アクターの武器熟練度経験値を加減算するコマンド
 *   AddWMExp actorId wtypeId value show
 *
 * パーティ全員の武器熟練度経験値を加減算するコマンド
 *   AddWMExpAll wtypeId value show
 *
 * 上記コマンドのパラメータは共通になります
 *     actorId
 *       コマンドの対象を指定するアクターＩＤ
 *       メッセージと同じ記法で変数も使用できます (\v[変数番号])
 *     wtypeId
 *       0   全ての武器を対象とする
 *       1～ 指定した武器タイプを対象とする
 *     value
 *       変更、加減算する値
 *     show
 *       true  熟練度レベルがあがったメッセージを表示する
 *       false 熟練度レベルがあがったメッセージを表示しない
 * ----
 *
 * 武器熟練度レベルを取得し、変数に格納するコマンド
 *   GetWMLevel variableId actorId wtypeId
 *     variableId - 格納する変数の番号
 *     actorId    - 取得するアクターの番号
 *     wtypeId    - 取得する武器タイプ
 *
 * ----------------------------------------------------------------------------
 * ダメージ計算式への組み込み
 *
 * スキル等のダメージ計算式では以下のコマンドが使用できます。
 *
 * a.wml(item)
 *   a(攻撃側)が使用したスキルに対応した武器熟練度を取得する
 *
 * b.wml(item)
 *   b(防御側)が使用されたスキルに対応した武器熟練度を取得する
 */

var Imported = Imported || {};
Imported.dsWeaponMastery = true;

(function (exports) {
	'use strict';

	exports.Param = (function() {
		var ret = {};
		var parameters = PluginManager.parameters('dsWeaponMastery');
		ret.MasteryAptitudeMax = 5;
		ret.RequiredWMExMax = 10;
		ret.MasteriesMax = Number(parameters['Weapon Masteries Max']);
		ret.WMTypeTbl = [];
		{
			var wmt = JSON.parse(parameters['Weapon Mastery Table']);
			for ( var ii = 0; ii < ret.MasteriesMax; ii++ )
			{
				ret.WMTypeTbl[ii] = (ii < wmt.length) ? Number(wmt[ii]) : 1 + ii;
			}
		}
		ret.WMIconTbl = [];
		{
			var wmi = JSON.parse(parameters['Weapon Mastery Icon']);
			for ( var ii = 0; ii < ret.MasteriesMax; ii++ )
			{
				ret.WMIconTbl[ii] = (ii < wmi.length) ? Number(wmi[ii]) : 1 + ii;
			}
		}
		ret.MasteryLevelMax = [];
		{
			var mlm = JSON.parse(parameters['Mastery Level Max']);
			for ( var ii = 0; ii < ret.MasteryAptitudeMax; ii++ )
			{
				ret.MasteryLevelMax[ii] = (ii < mlm.length) ? Number(mlm[ii]) : 100;
			}
		}
		ret.MasteryExpMax = Number(parameters['Mastery Exp Max']);
		ret.AddMasteryExp = [];
		{
			var ame = JSON.parse(parameters['Add Mastery Exp']);
			for ( var ii = 0; ii < ret.MasteryAptitudeMax; ii++ )
			{
				ret.AddMasteryExp[ii] = (ii < ame.length) ? Number(ame[ii]) : 5 + ii * 5;
			}
		}
		ret.AddDamageRate = Number(parameters['Add Damage Rate']) * 0.01;
		ret.LearningSkillText = String(parameters['Learning Skill Text']);
		return ret;
	})();

	//--------------------------------------------------------------------------
	/** Utility */
	function Utility() {}

	Utility.convertVariables = function(text)
	{
		text = text.replace(/\\/g, '\x1b');
		text = text.replace(/\x1b\x1b/g, '\\');
		text = text.replace(/\x1bV\[(\d+)\]/gi, function() {
			return $gameVariables.value(parseInt(arguments[1]));
		}.bind(this));
		return parseInt(text);
	};

	Utility.wmIndex = function(wtypeId)
	{
		for ( var ii = 0; ii < exports.Param.MasteriesMax; ii++ )
		{
			if ( exports.Param.WMTypeTbl[ii] === wtypeId )
			{
				return ii;
			}
		}
		return -1;
	};

	Utility.wmExpMax = function(aptitude)
	{
		var wmLvMax = exports.Param.MasteryLevelMax[aptitude];
		return wmLvMax * exports.Param.MasteryExpMax;
	};

	//--------------------------------------------------------------------------
	/** Game_Interpreter */
	var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
	Game_Interpreter.prototype.pluginCommand = function(command, args)
	{
		_Game_Interpreter_pluginCommand.call(this, command, args);
		var cmd = command.toLowerCase();
		if ( cmd === 'changewmaptitude' )
		{
			var actorId = Utility.convertVariables(args[0]);
			var wtypeId = Utility.convertVariables(args[1]);
			var value   = Utility.convertVariables(args[2]);
			this.changeWMAptitude(actorId, wtypeId, value);
		}
		else if ( cmd === 'addwmaptitude' )
		{
			var actorId = Utility.convertVariables(args[0]);
			var wtypeId = Utility.convertVariables(args[1]);
			var value   = Utility.convertVariables(args[2]);
			this.addWMAptitude(actorId, wtypeId, value);
		}
		else if ( cmd === 'changewmlevel' )
		{
			var actorId = Utility.convertVariables(args[0]);
			var wtypeId = Utility.convertVariables(args[1]);
			var value   = Utility.convertVariables(args[2]);
			var show    = Boolean(args[3] === 'true' || false);
			this.changeWMLevel(actorId, wtypeId, value, show);
		}
		else if ( cmd === 'addwmlevel' )
		{
			var actorId = Utility.convertVariables(args[0]);
			var wtypeId = Utility.convertVariables(args[1]);
			var value   = Utility.convertVariables(args[2]);
			var show    = Boolean(args[3] === 'true' || false);
			this.addWMLevel(actorId, wtypeId, value, show);
		}
		else if ( cmd === 'addwmlevelall' )
		{
			var wtypeId = Utility.convertVariables(args[0]);
			var value   = Utility.convertVariables(args[1]);
			var show    = Boolean(args[2] === 'true' || false);
			this.addWMLevelAll(wtypeId, value, show);
		}
		else if ( cmd === 'addwmexp' )
		{
			var actorId = Utility.convertVariables(args[0]);
			var wtypeId = Utility.convertVariables(args[1]);
			var value   = Utility.convertVariables(args[2]);
			var show    = Boolean(args[3] === 'true' || false);
			this.addWMExp(actorId, wtypeId, value, show);
		}
		else if ( cmd === 'addwmexpall' )
		{
			var wtypeId = Utility.convertVariables(args[0]);
			var value   = Utility.convertVariables(args[1]);
			var show    = Boolean(args[2] === 'true' || false);
			this.addWMExpAll(wtypeId, value, show);
		}
		else if ( cmd === 'getwmlevel' )
		{
			var variableId = Number(args[0]);
			var actorId    = Number(args[1]);
			var wtypeId    = Number(args[2]);
			this.getWMLevel(variableId, actorId, wtypeId);
		}
	};

	Game_Interpreter.prototype.changeWMAptitude = function(actorId, wtypeId, value)
	{
		var actor = $gameActors.actor(actorId);
		if ( actor )
		{
			actor.changeWMAptitude(wtypeId, value);
		}
	};

	Game_Interpreter.prototype.addWMAptitude = function(actorId, wtypeId, value)
	{
		var actor = $gameActors.actor(actorId);
		if ( actor )
		{
			actor.addWMAptitude(wtypeId, value);
		}
	};

	Game_Interpreter.prototype.changeWMLevel = function(actorId, wtypeId, value, show)
	{
		var actor = $gameActors.actor(actorId);
		if ( actor )
		{
			actor.changeWMLevel(wtypeId, value, show);
		}
	};

	Game_Interpreter.prototype.addWMLevel = function(actorId, wtypeId, value, show)
	{
		var actor = $gameActors.actor(actorId);
		if ( actor )
		{
			actor.addWMLevel(wtypeId, value, show);
		}
	};

	Game_Interpreter.prototype.addWMLevelAll = function(wtypeId, value, show)
	{
		$gameParty.members().forEach(function(actor) {
			if ( actor )
			{
				actor.addWMLevel(wtypeId, value, show);
			}
		});
	};

	Game_Interpreter.prototype.addWMExp = function(actorId, wtypeId, value, show)
	{
		var actor = $gameActors.actor(actorId);
		if ( actor )
		{
			actor.addWMExp(wtypeId, value, show);
		}
	};

	Game_Interpreter.prototype.addWMExpAll = function(wtypeId, value, show)
	{
		$gameParty.members().forEach(function(actor) {
			if ( actor )
			{
				actor.addWMExp(wtypeId, value, show);
			}
		});
	};

	Game_Interpreter.prototype.getWMLevel = function(variableId, actorId, wtypeId)
	{
		var actor = $gameActors.actor(actorId);
		if ( actor )
		{
			var level = actor.wmLevel(wtypeId);
			$gameVariables.setValue(variableId, level);
		}
	};

	//--------------------------------------------------------------------------
	/** Game_Action */
	var _Game_Action_calcElementRate = Game_Action.prototype.calcElementRate;
	Game_Action.prototype.calcElementRate = function(target)
	{
		var rate = _Game_Action_calcElementRate.call(this, target);
		var subject = this.subject();
		if ( subject.isActor() )
		{
			var item = this.item();
			if ( DataManager.isSkill(item) )
			{
				if ( item.id === 1 ) // 通常攻撃
				{
					subject.weapons().forEach(function(weapon) {
						rate *= subject.wmDamageRate(weapon.wtypeId);
					}, subject);
				}
				else
				{
					if ( item.meta.wmType )
					{
						var wmType = Number(item.meta.wmType);
						if ( wmType < 0 )
						{
							subject.weapons().forEach(function(weapon) {
								rate *= subject.wmDamageRate(weapon.wtypeId);
							}, subject);
						}
						else
						{
							rate *= subject.wmDamageRate(wmType);
						}
					}
				}
			}
		}
		return rate;
	};

	//--------------------------------------------------------------------------
	/** Game_BattlerBase */
	Game_BattlerBase.prototype.wml = function(item)
	{
		return 0;
	};

	Game_BattlerBase.prototype.wmLevel = function(wtypeId)
	{
		return 0;
	};

	//--------------------------------------------------------------------------
	/** Game_Actor */
	var _Game_Actor_initMembers = Game_Actor.prototype.initMembers;
	Game_Actor.prototype.initMembers = function()
	{
		_Game_Actor_initMembers.call(this);
		this._wmAptitude = [];
		this._wmLevel = [];
		this._wmExp = [];
		this._wmGainExp = [];
		for ( var ii = 0; ii < exports.Param.MasteriesMax; ii++ )
		{
			this._wmAptitude[ii] = 0;
			this._wmLevel[ii] = 0;
			this._wmExp[ii] = 0;
			this._wmGainExp[ii] = 0;
		}
	};

	var _Game_Actor_refresh = Game_Actor.prototype.refresh;
	Game_Actor.prototype.refresh = function()
	{
		_Game_Actor_refresh.call(this);
		this.refreshMasteries();
	};

	Game_Actor.prototype.refreshMasteries = function()
	{
		var wmAptitude = null;
		if ( this.currentClass().meta.wmAptitude )
		{
			wmAptitude = this.currentClass().meta.wmAptitude;
		}
		else if ( this.actor().meta.wmAptitude )
		{
			wmAptitude = this.actor().meta.wmAptitude;
		}
		if ( wmAptitude )
		{
			var aptitude = wmAptitude.split(',');
			for ( var ii = 0; ii < exports.Param.MasteriesMax; ii++ )
			{
				if ( ii < aptitude.length )
				{
					switch ( aptitude[ii] )
					{
					case 'D': this._wmAptitude[ii] = 0; break;
					case 'C': this._wmAptitude[ii] = 1; break;
					case 'B': this._wmAptitude[ii] = 2; break;
					case 'A': this._wmAptitude[ii] = 3; break;
					case 'S': this._wmAptitude[ii] = 4; break;
					default:  this._wmAptitude[ii] = 0; break;
					}
				}
			}
		}
	};

	Game_Actor.prototype.wml = function(item)
	{
		var wmLevelMax = 0;
		if ( DataManager.isSkill(item) )
		{
			if ( item.id === 1 ) // 通常攻撃
			{
				this.weapons().forEach(function(weapon) {
					wmLevelMax = Math.max(this.wmLevel(weapon.wtypeId), wmLevelMax);
				}, this);
			}
			else
			{
				if ( item.meta.wmType )
				{
					var wmType = Number(item.meta.wmType);
					if ( wmType < 0 )
					{
						this.weapons().forEach(function(weapon) {
							wmLevelMax = Math.max(this.wmLevel(weapon.wtypeId), wmLevelMax);
						}, this);
					}
					else
					{
						wmLevelMax = this.wmLevel(wmType);
					}
				}
			}
		}
		return wmLevelMax;
	};

	Game_Actor.prototype.wmLevel = function(wtypeId)
	{
		var idx = Utility.wmIndex(wtypeId);
		return (idx >= 0) ? this._wmLevel[idx] : 0;
	};

	Game_Actor.prototype.wmExp = function(wtypeId)
	{
		var idx = Utility.wmIndex(wtypeId);
		return (idx >= 0) ? this._wmExp[idx] : 0;
	};

	Game_Actor.prototype.wmExpRate = function(wtypeId)
	{
		var aptitude = this.wmAptitude(wtypeId);
		if ( this.wmLevel(wtypeId) === exports.Param.MasteryLevelMax[aptitude] )
		{
			return 1.0;
		}
		var idx = Utility.wmIndex(wtypeId);
		return (idx >= 0) ? (this._wmExp[idx] % exports.Param.MasteryExpMax) / exports.Param.MasteryExpMax : 0.0;
	};

	Game_Actor.prototype.wmAptitude = function(wtypeId)
	{
		var idx = Utility.wmIndex(wtypeId);
		return (idx >= 0) ? this._wmAptitude[idx] : 0;
	};

	Game_Actor.prototype.wmDamageRate = function(wtypeId)
	{
		var wmLevel = this.wmLevel(wtypeId);
		return 1.0 + (wmLevel * exports.Param.AddDamageRate);
	};

	Game_Actor.prototype.addWMGainExp = function(wtypeId)
	{
		var wmExpMax = Utility.wmExpMax(this.wmAptitude(wtypeId));
		var idx = Utility.wmIndex(wtypeId);
		if ( idx >= 0 )
		{
			var aptitude = this._wmAptitude[idx];
			this._wmGainExp[idx] += exports.Param.AddMasteryExp[aptitude];
			this._wmGainExp[idx] = this._wmGainExp[idx].clamp(0, wmExpMax);
		}
	};

	Game_Actor.prototype.changeWMAptitude = function(wtypeId, value)
	{
		if ( wtypeId === 0 )
		{
			for ( var ii = 0; ii < exports.Param.MasteriesMax; ii++ )
			{
				this._wmAptitude[ii] = value.clamp(0, exports.Param.MasteryAptitudeMax-1);
			}
		}
		else
		{
			var idx = Utility.wmIndex(wtypeId);
			if ( idx >= 0 )
			{
				this._wmAptitude[idx] = value.clamp(0, exports.Param.MasteryAptitudeMax-1);
			}
		}
	};

	Game_Actor.prototype.addWMAptitude = function(wtypeId, value)
	{
		if ( wtypeId === 0 )
		{
			for ( var ii = 0; ii < exports.Param.MasteriesMax; ii++ )
			{
				this._wmAptitude[ii] += value;
				this._wmAptitude[ii] = this._wmAptitude[ii].clamp(0, exports.Param.MasteryAptitudeMax-1);
			}
		}
		else
		{
			var idx = Utility.wmIndex(wtypeId);
			if ( idx >= 0 )
			{
				this._wmAptitude[idx] += value;
				this._wmAptitude[idx] = this._wmAptitude[idx].clamp(0, exports.Param.MasteryAptitudeMax-1);
			}
		}
	};

	Game_Actor.prototype.changeWMLevel = function(wtypeId, value, show)
	{
		if ( wtypeId === 0 )
		{
			for ( var ii = 0; ii < exports.Param.MasteriesMax; ii++ )
			{
				var wtypeId = exports.Param.WMTypeTbl[ii];
				var wmExpMax = Utility.wmExpMax(this.wmAptitude(wtypeId));
				this._wmExp[ii] = value * exports.Param.MasteryExpMax;
				this._wmExp[ii] = this._wmExp[ii].clamp(0, wmExpMax);
			}
		}
		else
		{
			var idx = Utility.wmIndex(wtypeId);
			if ( idx >= 0 )
			{
				var wmExpMax = Utility.wmExpMax(this.wmAptitude(wtypeId));
				this._wmExp[idx] = value * exports.Param.MasteryExpMax;
				this._wmExp[idx] = this._wmExp[idx].clamp(0, wmExpMax);
			}
		}
		this.gainWMExp(show);
	};

	Game_Actor.prototype.addWMLevel = function(wtypeId, value, show)
	{
		if ( wtypeId === 0 )
		{
			for ( var ii = 0; ii < exports.Param.MasteriesMax; ii++ )
			{
				var wtypeId = exports.Param.WMTypeTbl[ii];
				var wmExpMax = Utility.wmExpMax(this.wmAptitude(wtypeId));
				this._wmExp[ii] += value * exports.Param.MasteryExpMax;
				this._wmExp[ii] = this._wmExp[ii].clamp(0, wmExpMax);
			}
		}
		else
		{
			var idx = Utility.wmIndex(wtypeId);
			if ( idx >= 0 )
			{
				var wmExpMax = Utility.wmExpMax(this.wmAptitude(wtypeId));
				this._wmExp[idx] += value * exports.Param.MasteryExpMax;
				this._wmExp[idx] = this._wmExp[idx].clamp(0, wmExpMax);
			}
		}
		this.gainWMExp(show);
	};

	Game_Actor.prototype.addWMExp = function(wtypeId, value, show)
	{
		if ( wtypeId === 0 )
		{
			for ( var ii = 0; ii < exports.Param.MasteriesMax; ii++ )
			{
				var wtypeId = exports.Param.WMTypeTbl[ii];
				var wmExpMax = Utility.wmExpMax(this.wmAptitude(wtypeId));
				this._wmExp[ii] += value;
				this._wmExp[ii] = this._wmExp[ii].clamp(0, wmExpMax);
			}
		}
		else
		{
			var wmExpMax = Utility.wmExpMax(this.wmAptitude(wtypeId));
			var idx = Utility.wmIndex(wtypeId);
			if ( idx >= 0 )
			{
				this._wmExp[idx] += value;
				this._wmExp[idx] = this._wmExp[idx].clamp(0, wmExpMax);
			}
		}
		this.gainWMExp(show);
	};

	var _Game_Actor_useItem = Game_Actor.prototype.useItem;
	Game_Actor.prototype.useItem = function(item)
	{
		_Game_Actor_useItem.call(this, item);
		if ( DataManager.isSkill(item) )
		{
			if ( item.id === 1 ) // 通常攻撃
			{
				this.weapons().forEach(function(weapon) {
					this.addWMGainExp(weapon.wtypeId);
				}, this);
			}
			else
			{
				if ( item.meta.wmType )
				{
					var wmType = Number(item.meta.wmType);
					if ( wmType < 0 )
					{
						this.weapons().forEach(function(weapon) {
							this.addWMGainExp(weapon.wtypeId);
						}, this);
					}
					else
					{
						this.addWMGainExp(wmType);
					}
				}
			}
		}
	};

	Game_Actor.prototype.gainWMExp = function(show)
	{
		var lastSkills = this.skills();
		var lastWMLevel = [];
		for ( var ii = 0; ii < exports.Param.MasteriesMax; ii++ )
		{
			lastWMLevel[ii] = this._wmLevel[ii];
		}
		for ( var ii = 0; ii < exports.Param.MasteriesMax; ii++ )
		{
			var wtypeId = exports.Param.WMTypeTbl[ii];
			var wmExpMax = Utility.wmExpMax(this.wmAptitude(wtypeId));
			this._wmExp[ii] += this._wmGainExp[ii];
			this._wmExp[ii] = this._wmExp[ii].clamp(0, wmExpMax);
			this._wmGainExp[ii] = 0;
		}

		var wmLevelUp = false;
		for ( var ii = 0; ii < exports.Param.MasteriesMax; ii++ )
		{
			var wtypeId = exports.Param.WMTypeTbl[ii];
			while ( this._wmExp[ii] >= (this._wmLevel[ii] + 1) * exports.Param.MasteryExpMax )
			{
				if ( !this.wmLevelUp(wtypeId) )
				{
					break;
				}
				wmLevelUp = true;
			}
			while ( this._wmExp[ii] < this._wmLevel[ii] * exports.Param.MasteryExpMax )
			{
				if ( !this.wmLevelDown(wtypeId) )
				{
					break;
				}
			}
		}

		if ( show && wmLevelUp )
		{
			$gameMessage.newPage();
			for ( var ii = 0; ii < exports.Param.MasteriesMax; ii++ )
			{
				if ( this._wmLevel[ii] > lastWMLevel[ii] )
				{
					var wtypeId = exports.Param.WMTypeTbl[ii];
					var wtypeName = $dataSystem.weaponTypes[wtypeId];
					var text = exports.Param.LearningSkillText.format(this._name, wtypeName, this._wmLevel[ii]);
					$gameMessage.add(text);
				}
			}
			var newSkills = this.findNewSkills(lastSkills);
			newSkills.forEach(function(skill) {
				$gameMessage.add(TextManager.obtainSkill.format(skill.name));
			});
		}
	};

	Game_Actor.prototype.wmLevelUp = function(wtypeId)
	{
		var idx = Utility.wmIndex(wtypeId);
		if ( idx >= 0 )
		{
			this._wmLevel[idx]++;
			this.skillsWMType(wtypeId).forEach(function(skill) {
				if ( this.checkSkillLearning(skill, this._wmLevel[idx]) )
				{
					this.learnSkill(skill.id);
				}
			}, this, idx);
		}
		return ( idx >= 0 );
	};

	Game_Actor.prototype.wmLevelDown = function(wtypeId)
	{
		var idx = Utility.wmIndex(wtypeId);
		if ( idx >= 0 )
		{
			this._wmLevel[idx]--;
		}
		return ( idx >= 0 );
	};

	Game_Actor.prototype.skillsWMType = function(wtypeId)
	{
		return $dataSkills.filter(function(skill) {
			if ( skill )
			{
				if ( skill.meta.wmType )
				{
					if ( Number(skill.meta.wmType) === wtypeId )
					{
						return true;
					}
				}
				for ( var ii = 0; ii < exports.Param.RequiredWMExMax; ii++ )
				{
					var requiredWM = 'requiredWMEx' + ('0'+ii).slice(-2);
					if ( skill.meta[requiredWM] )
					{
						var metaData = skill.meta[requiredWM].split(',');
						if ( Number(metaData[0]) === wtypeId )
						{
							return true;
						}
					}
				}
			}
		}, wtypeId);
	};

	Game_Actor.prototype.checkSkillLearning = function(skill, level)
	{
		if ( skill.meta.requiredWM )
		{
			if ( Number(skill.meta.requiredWM) === level )
			{
				return true;
			}
		}
		else
		{
			var result = true;
			var existMetaData = false;
			for ( var ii = 0; ii < exports.Param.RequiredWMExMax; ii++ )
			{
				var requiredWM = 'requiredWMEx' + ('0'+ii).slice(-2);
				if ( skill.meta[requiredWM] )
				{
					var metaData = skill.meta[requiredWM].split(',');
					if ( this.wmLevel(Number(metaData[0])) < Number(metaData[1]) )
					{
						result = false;
					}
					existMetaData = true;
				}
			}
			if ( existMetaData )
			{
				return result;
			}
		}
		return false;
	};

	//--------------------------------------------------------------------------
	/** Window_Base */
	Window_Base.prototype.wmColor1 = function()
	{
		return this.textColor(28);
	};

	Window_Base.prototype.wmColor2 = function()
	{
		return this.textColor(29);
	};

	Window_Base.prototype.lvColor = function()
	{
		return this.textColor(20);
	};

	Window_Base.prototype.wmIcon = function(wtypeId)
	{
		var idx = Utility.wmIndex(wtypeId);
		if ( idx >= 0 )
		{
			return exports.Param.WMIconTbl[idx];
		}
		return 0;
	};

	Window_Base.prototype.drawMasteryGauge = function(actor, index, x, y, width)
	{
		var wtypeId = exports.Param.WMTypeTbl[index];
		var name = $dataSystem.weaponTypes[wtypeId];
		var iconBoxWidth = Window_Base._iconWidth + 4;
		var labelWidth = this.textWidth('LV');
		var valueWidth = this.textWidth('000');
		var gaugeWidth = width - iconBoxWidth * 2 - labelWidth - valueWidth - 4;
		var x1 = x + iconBoxWidth;
		var x2 = x + width - labelWidth - valueWidth - iconBoxWidth;
		var x3 = x + width - valueWidth - iconBoxWidth;
		var x4 = x + width - iconBoxWidth;
		var color1 = this.wmColor1();
		var color2 = this.wmColor2();
		var color3 = this.lvColor();
		this.drawGauge(x1, y, gaugeWidth, actor.wmExpRate(wtypeId), color1, color2);
		this.drawIcon(this.wmIcon(wtypeId), x + 2, y + 2);
		this.changeTextColor(this.systemColor());
		this.drawText(name, x1, y, width);
		this.changeTextColor(color3);
		this.drawText('LV', x2, y, labelWidth);
		this.resetTextColor();
		this.drawText(actor.wmLevel(wtypeId), x3, y, valueWidth, 'right');
		this.drawAptitude(actor.wmAptitude(wtypeId), x4 + 2, y + 2);
	};

	Window_Base.prototype.drawAptitude = function(aptitude, x, y)
	{
		var bitmap = ImageManager.loadSystem('WMAptitude');
		var pw = Window_Base._iconWidth;
		var ph = Window_Base._iconHeight;
		var sx = aptitude * pw;
		var sy = 0;
		this.contents.blt(bitmap, sx, sy, pw, ph, x, y);
	};

	//--------------------------------------------------------------------------
	/** Window_Status */
	var _Window_Status_initialize = Window_Status.prototype.initialize;
	Window_Status.prototype.initialize = function()
	{
		this._switchWM = false;
		_Window_Status_initialize.call(this);
	};

	Window_Status.prototype.processOk = function()
	{
		this._switchWM = this._switchWM ? false : true;
		this.playOkSound();
		this.refresh();
	};

	Window_Status.prototype.onTouch = function(triggered)
	{
		var x = this.canvasToLocalX(TouchInput.x);
		var y = this.canvasToLocalY(TouchInput.y);
		var hitIndex = this.hitTest(x, y);
		if ( hitIndex >= 0 )
		{
			if ( triggered && this.isTouchOkEnabled() )
			{
				this.processOk();
			}
		}
	};

	Window_Status.prototype.hitTest = function(x, y)
	{
		if ( this.isContentsArea(x, y) )
		{
			return 0;
		}
		return -1;
	};

	Window_Status.prototype.isOkEnabled = function()
	{
		return true;
	};

	var _Window_Status_drawBlock3 = Window_Status.prototype.drawBlock3;
	Window_Status.prototype.drawBlock3 = function(y)
	{
		if ( this._switchWM )
		{
			this.drawMasteries(48, y);
		}
		else
		{
			_Window_Status_drawBlock3.call(this, y);
		}
	};

	Window_Status.prototype.drawMasteries = function(x, y)
	{
		var lineHeight = this.lineHeight();
		for ( var ii = 0; ii < exports.Param.MasteriesMax; ii++ )
		{
			var row = Math.floor(ii / 2);
			var col = ii % 2;
			this.drawMasteryGauge(this._actor, ii, x+342*col, y+lineHeight*row, 342);
		}
	};

	//--------------------------------------------------------------------------
	/** Scene_Boot */
	var _Scene_Boot_loadSystemWindowImage = Scene_Boot.prototype.loadSystemWindowImage;
	Scene_Boot.prototype.loadSystemWindowImage = function()
	{
		_Scene_Boot_loadSystemWindowImage.call(this);
		ImageManager.loadSystem('WMAptitude');
	};

	//--------------------------------------------------------------------------
	/** BattleManager */
	var _BattleManager_gainRewards = BattleManager.gainRewards;
	BattleManager.gainRewards = function()
	{
		_BattleManager_gainRewards.call(this);
		this.gainWMExp();
	};

	BattleManager.gainWMExp = function()
	{
		$gameParty.allMembers().forEach(function(actor) {
			actor.gainWMExp(true);
		});
	};

}((this.dsWeaponMastery = this.dsWeaponMastery || {})));
