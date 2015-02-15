/*
 * Copyright (C) 2015 Hiroki Ito
 *
 * Licensed under the Apache License, Version 2.0 (the &quot;License&quot;);
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an &quot;AS IS&quot; BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
// Last modified: 


//ゲームの状態
var gameState = {
    //問題文を構成する文字数。
    numDigits: 3,
    //問題の数字を配列で持つ。
    currentQuestion: "",
    //問題の数字を配列で持ったものを文字列に展開。
    currentQuestionAsTxt:"",
    //Speech Synthesisに渡す文字列。数字がカンマ区切りになっているもの。
    txtForSpeech: "",
    //ゲームで回答中であるかどうか。
    isAnswering: false,
    //読み上げ用の言語。初期値は日本語に。
    speechLang: "ja-JP",
    //読み上げ順。trueで同じ順、falseで逆順
    isInOrder: true
};
//設定
var gameConfig = {
    flagImageDir:"./phoca_flag_icons_22-14"
};
//lang("ja-JP"など)から表示用のタイトル("日本語[ja-JP]"など)を取るための連想配列
var lang2Title = {};
//lang("ja-JP"など)から国旗の画像("jp.png"など)を取るための連想配列
var lang2Flag = {};

/**
 * 画面をクリア。
 */
function clear() {
    $('#gameResult').text('');
    $('#gameResult').removeClass('alert-success');
    $('#gameResult').removeClass('alert-warning');
    $('#gameStatus').text('');
}

/**
 * レベル(数字の数)をセットする。
 * @param {number} n レベル(数字の数)
 */
function setDigits(e) {
    var n = e.data.value;
    console.log("レベルを変更。現在のレベル=" + n);
    $('#lblLevel').text("レベル: " + n);
    gameState.numDigits = n;
    if(true != e.data.mute) {
	playSound("seSelect");
    }
}

/**
 * 読み上げ順をセットする。
 * @param {number} n 読み上げ順。trueで同じ順、falseで逆順
 */
function setOrder(e) {
    var inOrder = e.data.value;
    console.log("読み上げ順を変更。同じ順?" + inOrder);
    if(inOrder) {
	$('#lblOrder').text("同じ順で");
    } else {
	$('#lblOrder').text("逆の順で");
    }
    gameState.isInOrder = inOrder;
    if(true != e.data.mute) {
	playSound("seSelect");
    }
}

//初期化
$(document).ready(function(){
    var userAgent = window.navigator.userAgent.toLowerCase();
    var appVersion = window.navigator.appVersion.toLowerCase();
    if (userAgent.indexOf('chrome') == -1) {
	var sorryMessage = 'このアプリはChrome以外では動作しません。Chromeをお使いください。';
	alert(sorryMessage);
	showResultMessage(sorryMessage);
    }

    //レベル設定用のボタン
    for(var i = 2; i <= 9; i++) {
	$("#btn" + i).on('change', {value:i}, setDigits);
    }

    //読み上げ順
    $('#btnInOrder').on('change', {value:true}, setOrder);
    $('#btnReversedOrder').on('change', {value:false}, setOrder);
    
    if(true){
    var langOnly2Lang = {};
    for(var i = 0; i < langConfig.speech.length; i++) {
    	//var lo = langConfig.speech[i].lang.split('-')[0].toLowerCase();
    	var lo = langConfig.speech[i].title.split('(')[0];
    	var ar = langConfig.speech[i];
    	if(!langOnly2Lang[lo]) {langOnly2Lang[lo] = [];}
    	langOnly2Lang[lo].push(langConfig.speech[i]);
    }
    var speechItems = "";
    for(key in langOnly2Lang) {
    	speechItems = speechItems + "<div class='btn-group flagBox'>";
	speechItems = speechItems + "<h5><span class=''>" + key + "</span></h5>";
    	for(var j = 0; j < langOnly2Lang[key].length; j++) {
    	    var lang = langOnly2Lang[key][j].lang;
    	    var flag = langOnly2Lang[key][j].flag;
    	    var title = langOnly2Lang[key][j].title + " [" + lang + "]";
    	    if(flag === undefined || "" == flag) {
    		flag = lang.split('-')[1].toLowerCase();
    	    }
    	    flag = flag + ".png";
    	    lang2Flag[lang] = flag;
    	    lang2Title[lang] = title;
    	    var item = "\
    		<label class='btn btn-default' data-toggle='" + lang + "' data-original-title='" + lang + "' data-placement='left' title='" + lang2Title[lang] + "' id='lblSpeechLang_" + lang + "'>\
    		<input type='radio' name='recognitionLanguage' id='btnSpeechLang_" + lang + "' autocomplete='off'><img src='" + gameConfig.flagImageDir + "/" + lang2Flag[lang] + "' width='44' height='28'>\
    	    </label>";
    	    speechItems = speechItems + item;
    	}
    	speechItems = speechItems + "</div>";
    }
    $("#speechLangGroup").html(speechItems);
    }
    
    //読み上げ言語をセット
    if(false){
    var speechItems = "";
    for(var i = 0; i < langConfig.speech.length; i++) {
	var lang = langConfig.speech[i].lang;
	var flag = langConfig.speech[i].flag;
	var title = langConfig.speech[i].title + " [" + lang + "]";
	if(flag === undefined || "" == flag) {
	    flag = lang.split('-')[1].toLowerCase();
	}
	flag = flag + ".png";
	lang2Flag[lang] = flag;
	lang2Title[lang] = title;
    var item = "\
	    <label class='btn btn-default' data-toggle='" + lang + "' data-original-title='" + lang + "' data-placement='left' title='" + lang2Title[lang] + "' id='lblSpeechLang_" + lang + "'>\
	    <input type='radio' name='recognitionLanguage' id='btnSpeechLang_" + lang + "' autocomplete='off'><img src='" + gameConfig.flagImageDir + "/" + lang2Flag[lang] + "' width='44' height='28'>\
</label>";
	speechItems = speechItems + item;
    }
    $("#speechLangGroup").html(speechItems);
    }
	
    for(var i = 0; i < langConfig.speech.length; i++) {
	var lang = langConfig.speech[i].lang;
	$("#btnSpeechLang_" + lang).on('change', {value:lang, title:lang2Title[lang]}, setSpeechLang);
    }
    
    //認識言語をセット
    //読み上げ言語が認識言語を全て含んでいる前提。
    if(true){
    var recognitionItems = "";
    for(key in langOnly2Lang) {
    	recognitionItems = recognitionItems + "<div class='btn-group flagBox'>";
	recognitionItems = recognitionItems + "<h5><span class=''>" + key + "</span></h5>";
    	for(var j = 0; j < langOnly2Lang[key].length; j++) {
    	    var lang = langOnly2Lang[key][j].lang;
    	    var flag = langOnly2Lang[key][j].flag;
    	    var title = langOnly2Lang[key][j].title + " [" + lang + "]";
    	    if(flag === undefined || "" == flag) {
    		flag = lang.split('-')[1].toLowerCase();
    	    }
    	    flag = flag + ".png";
    	    lang2Flag[lang] = flag;
    	    lang2Title[lang] = title;
    	    var item = "\
    		<label class='btn btn-default' data-toggle='" + lang + "' data-original-title='" + lang + "' data-placement='left' title='" + lang2Title[lang] + "' id='lblSpeechLang_" + lang + "'>\
    		<input type='radio' name='recognitionLanguage' id='btnRecognitionLang_" + lang + "' autocomplete='off'><img src='" + gameConfig.flagImageDir + "/" + lang2Flag[lang] + "' width='44' height='28'>\
    	    </label>";
    	    recognitionItems = recognitionItems + item;
    	}
    	recognitionItems = recognitionItems + "</div>";
    }
    $("#recognitionLangGroup").html(recognitionItems);
}

    if(false){
    var dictationItems = "";
    for(var i = 0; i < langConfig.recognition.length; i++) {
	var lang = langConfig.recognition[i].lang;
    var item = "\
	    <label class='btn btn-default' data-toggle='" + lang + "' data-original-title='" + lang + "' data-placement='left' title='" + lang2Title[lang] + "' id='lblRecognitionLang_" + lang + "'>\
	    <input type='radio' name='recognitionLanguage' id='btnDictationLang_" + lang + "' autocomplete='off'><img src='" + gameConfig.flagImageDir + "/" + lang2Flag[lang] + "' width='44' height='28'>\
</label>";
	dictationItems = dictationItems + item;
    }
    $("#dictationLangGroup").html(dictationItems);
    }
	
    for(var i = 0; i < langConfig.recognition.length; i++) {
	var lang = langConfig.recognition[i].lang;
	$("#btnRecognitionLang_" + lang).on('change', {value:lang, title:lang2Title[lang]}, setRecognitionLang);
    }
    
    enableNextQuetionButton();

    //値をセットしておく
    var ev1 = {data:{value:3, mute:true}};
    setDigits(ev1);
    $('#lblBtn3').addClass('active');
    var ev2 = {data:{value:"ja-JP", title:"日本語[ja-JP]", mute:true}};
    setSpeechLang(ev2);
    $('#lblSpeechLang_ja-JP').addClass('active');
    var ev3 = {data:{value:"ja-JP", title:"日本語[ja-JP]", mute:true}};
    setRecognitionLang(ev3);
    $('#lblRecognitionLang_ja-JP').addClass('active');
    var ev4 = {data:{value:true, mute:true}};
    setOrder(ev4);
    
    //イベント追加
    $('#nextQuestion').on('click', function(){
	console.log('次の問題');
	disableNextQuetionButton();
	clear();
	playSound("seQuestion");
	//S.E.の後に読み上げたいのでちょい待ち。
	setTimeout(function(){
	    gameState.currentQuestion = getNextQuestion();
	    console.log("current question is " + gameState.currentQuestion);
	    
	    gameState.txtForSpeech = "";
	    gameState.currentQuestionAsTxt = "";
	    if(gameState.isInOrder) {
		//正順
		console.log("正順で問題を作ります。");
		for(var i = 0; i < gameState.currentQuestion.length; i++) {
	    	    gameState.txtForSpeech = gameState.txtForSpeech + gameState.currentQuestion[i] + ", ";
		}
	    } else {
		//逆順
		console.log("逆順で問題を作ります。");
		for(var i = gameState.currentQuestion.length - 1; i >= 0; i--) {
		    gameState.txtForSpeech = gameState.txtForSpeech + gameState.currentQuestion[i] + ", ";
		}
	    }
	    for(var i = 0; i < gameState.currentQuestion.length; i++) {
		gameState.currentQuestionAsTxt += gameState.currentQuestion[i];
	    }
	    //var currentReversedAnswerAsTxt = gameState.currentQuestionAsTxt.split("").reverse().join("");
	    console.log("question=" + gameState.currentQuestionAsTxt);
	    
	    speak(gameState.txtForSpeech, true);
	}, 1000);
    });
    
    //イベント追加
    $('#listenAgain').on('click', function(){
	console.log('問題をもういちど読む');
	recognition.stop();
	speak(gameState.txtForSpeech, true);
    });
    
    //イベント追加
    $('#quitQuestion').on('click', function(){
	console.log('問題をやめる');
	stopRecognition();
	clear();
	enableNextQuetionButton();
    });
});

/**
 * 問題を出すボタンを有効にし、やめるボタンを無効にする。
 */
function enableNextQuetionButton() {
    $('#nextQuestion').prop("disabled", false);
    $('#listenAgain').prop("disabled", true);
    $('#quitQuestion').prop("disabled", true);
}

/**
 * 問題を出すボタンを無効にし、やめるボタンを有効にする。
 */
function disableNextQuetionButton() {
    $('#nextQuestion').prop("disabled", true);
    $('#listenAgain').prop("disabled", false);
    $('#quitQuestion').prop("disabled", false);
}


/**
 * 結果を表示
 */
function showResultMessage(msg) {
    updateResultMessage(msg);
}

/**
 * 結果を表示(正解)
 */
function showCollectMessage(msg) {
    updateResultMessage(msg, 'alert-success');
}

/**
 * 結果を表示(不正解)
 */
function showIncollectMessage(msg) {
    updateResultMessage(msg, 'alert-warning');
}

/**
 * 結果欄をアップデート
 */
function updateResultMessage(msg, cls) {
    $('#gameResult').addClass(cls);
    $('#gameResult').text(msg);
}

/**
 * 次の問題を作る。数字はバラバラになるように。
 * @return {number[]} 次の問題
 */
function getNextQuestion() {
    var used = [];
    for(var i = 0; i < 10; i++) {
	used.push(false);
    }
    var ret = [];
    //手抜きの生成。
    var count = 0;
    while(count < gameState.numDigits) {
	var n = parseInt(Math.random() * 10);
	if(used[n] == false) {
	    ret.push(n);
	    used[n] = true;
	    count = count + 1;
	}
    }
    return ret;
}

/**
 * ステータスを表示。
 * @param {string} msg ステータス
 */
function showStatus(msg) {
    $('#gameStatus').text(msg);
    console.log(msg);
}

/**
 * 効果音を鳴らす。
 * @param {string} soundId 効果音のId
 */
function playSound(soundId) {
    document.getElementById(soundId).play();
}

/**
 * 問題を読み上げる
 * @param {string} txt 問題文
 */
function speak(txt, fireStartRecognition) {
    // unsupported.
    if (!'SpeechSynthesisUtterance' in window) {
        alert('Web Speech API には未対応です。');
        return;
    }
    
    var msg = new SpeechSynthesisUtterance();
    msg.volume = 1;
    msg.rate = 1;
    msg.pitch = 2;
    msg.text = gameState.currentQuestion;
    msg.lang = gameState.speechLang;

    // 終了時の処理
    if(fireStartRecognition) {
	msg.onend = function (event) {
            console.log('スピーチ終了');
	    gameState.isAnswering = true;
	    startRecognition();
	};
    }
    msg.text = txt;

    showStatus("問題を読み上げます");
    speechSynthesis.speak(msg);
}


function setSpeechLang(e) {
    var lang = e.data.value;
    console.log("読み上げ用言語を" + lang2Title[lang] + "に変更します。");
    $('#lblSpeechLang').text(lang2Title[lang]);
    $('#imgSpeechLang').attr("src", gameConfig.flagImageDir + "/" + lang2Flag[lang]);
    gameState.speechLang = lang;
    if(true != e.data.mute) {
	playSound("seSelect");
    }
}

function setRecognitionLang(e) {
    var lang = e.data.value;
    console.log("認識用言語を" + lang2Title[lang] + "に変更します。");
    $('#lblDictationLang').text(lang2Title[lang]);
    $('#imgRecognitionLang').attr("src", gameConfig.flagImageDir + "/" + lang2Flag[lang]);
    recognition.lang = lang;
    if(true != e.data.mute) {
	playSound("seSelect");
    }
}


//認識用のオブジェクト
var recognition = new webkitSpeechRecognition();
recognition.continuous = true;
recognition.interimResults = true;
recognition.maxAlternatives = 10;
recognition.lang = "ja-JP";

/**
 * 認識開始
 */
function startRecognition(){
    console.log("startRecognition()");
    recognition.abort();
    recognition.start();
}

/**
 * 認識停止
 */
function stopRecognition(){
    console.log("stopRecognition()");
    recognition.stop();
}

//話し声の認識中
recognition.onsoundstart = function(){
    showStatus("聞き取り開始...");
};
//エラー
recognition.onerror= function(e){
    showStatus("エラーが発生しました。" + e);
};
//話し声の認識終了
recognition.onsoundend = function(){
    console.log("onsoundend");
    // if(gameState.isAnswering){
    // 	playSound("seTimeout");
    // 	gameState.isAnswering = false;
    // 	showResultMessage("時間切れです。");
    // }
};

//認識が終了したときのイベント
recognition.onresult = function(event){
    var results = event.results;
    for (var i = event.resultIndex; i<results.length; i++){
        //認識の最終結果
        if(results[i].isFinal){
	    var text = results[i][0].transcript;
	    showStatus(text + "と聞き取りました。");
	    console.log("text=" + text + " length=" + text.length);
	    var numOnlyTxt = extractNums(text);
	    if(numOnlyTxt.length >= gameState.numDigits) {
		var diffPos = checkDiff(numOnlyTxt, gameState.currentQuestionAsTxt);
		gameState.isAnswering = false;
		stopRecognition();
		enableNextQuetionButton();
		if(diffPos.length == 0) {
		    showCollectMessage("正解です！");
		    playSound("seCorrect");
		} else {
		    showIncollectMessage("不正解です。正解は" + gameState.currentQuestionAsTxt + " です。" + (diffPos[0]+1) + "文字目にミスがありました。");
		    playSound("seIncorrect");
		}
	    } else {
		showStatus("継続して聞いています。");
	    }
        }
        //認識の中間結果
        else{
	    showStatus("継続して聞いています。現時点の聞き取り:" + results[i][0].transcript);
        }
    }
};

/**
 * 文字列から数字(半角の0-9)のみを取り出して文字列として返します。
 * @param {string} txt 対象の文字列
 * @return {string} 数字のみを抜き出した結果
 */
function extractNums(txt) {
    return txt.replace(/[^0-9]/g, "");
}

/**
 * 認識された文言と正解とを比較。
 * @param {string} txt 認識した文字列
 * @param {string} oracle 正解
 * @return {number[]}  間違えた位置。0オリジン。間違えてない時は要素数0の配列。
 */
function checkDiff(txt, oracle) {
    
    console.log("[" + txt + "]と[" + oracle + "]とを比べます");
    var numOnlyTxt = extractNums(txt);
    console.log("数字だけを抜き出した結果:" + numOnlyTxt);
    var diffPos = [];
    for(var i = 0; i < oracle && i < txt.length; i++) {
	if(!(numOnlyTxt.charAt(i) == oracle.charAt(i))) {
	    diffPos.push(i);
	}
    }
    return diffPos;
}
