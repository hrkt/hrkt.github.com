// The MIT License (MIT)

// Copyright (c) 2015 Hiroki Ito

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

//デバッグ時のフラグ
var DEBUG = false;

/**
 * canvasを画像の大きさにリサイズする
 * @param {Object} image 画像
 * @param {Object} canvas canvas
 */
function resizeCanvas(image, canvas) {
    document.body.appendChild(image);
    canvas.width = image.offsetWidth;
    canvas.style.width = image.offsetWidth.toString() + "px";
    canvas.height = image.offsetHeight;
    canvas.style.height = image.offsetHeight.toString() + "px";
    document.body.removeChild(image);
}

/**
 * 画面にメッセージを表示
 * @param {strings} msg メッセージ
 */
function showMessage(msg) {
    $("#message").html(msg);
}

/**
 * 画面をクリア 
 */
function clearScreen() {
    $("#message").html("");
}

// Canvasオブジェクトを生成
var canvas = document.getElementById('src');
var ctx = canvas.getContext('2d');

// 重ね合わせる画像
var overlayImg = new Image();
overlayImg.src = overlaySrc;

// Imageオブジェクトを生成
var img = new Image();

/**
 * 顔を検出してオーバーレイ画像を描く
 * @param {Object} img 画像
 */
function detectAndDraw(img) {
    clearScreen();
    
    resizeCanvas(img, canvas);

    // ベース画像を表示
    ctx.drawImage(img, 0, 0);

    showMessage("顔を見つけようとしています。少々お待ちください。");

    // 顔検出
    var startTime = (new Date()).getTime();
    var comp = ccv.detect_objects({
        "canvas": ccv.grayscale(ccv.pre(img)),
        "cascade": cascade,
        "interval": 5,
        "min_neighbors": 1
    });

    showMessage("顔検出に要した時間は : " + ((new Date()).getTime() - startTime).toString() + "msでした。");

    if(comp.length == 0) {
	showMessage("すみません。顔っぽい部分を発見できませんでした。別の画像を試してみてください。（画像は、そこそこの大きさ(横幅500px以上くらい)があり、顔全体が見えて、耳も出ているものだとわりと検出しやすくなります。）");
	return;
    }


    // ccvで検出された顔の候補の中からそれっぽいものを選ぶ。
    var targetIndex = selectTarget(img, comp, ctx);

    var inw = img.naturalWidth;
    var inh = img.naturalHeight;
    var ixc = inw / 2;
    var iyc = inh / 2;
    var minIndex = 0;

    var i = targetIndex;
    //顔の領域
    var fx = comp[i].x;
    var fy = comp[i].y;
    var fw = comp[i].width;
    var fh = comp[i].height;

    var onw = overlayImg.naturalWidth;
    var onh = overlayImg.naturalHeight;
    if(DEBUG){
	console.log(onw + ", " + onh + " " + inw + "," +  inh);
    }
    //重ね合わせ側
    var hw = 120;
    var hh = 120;
    var hx = 230;
    var hy = 125;

    //scaled
    var sw = 1.0 * fw / hw * onw;
    var sh = 1.0 * fh / hw * onh;
    if(DEBUG){
	console.log(sw + " " + sh);
    }
    var sx = hx * fw / hw;
    var sy = hy * fh / hh;
    ctx.drawImage(overlayImg, fx - sx, (fy + fh * 0.70) - sy, sw, sh);
    //lyrics
    drawLyrics(ctx, inw);

    //move to result
    $('html,body').animate({
      scrollTop : $('#result').offset().top
    }, 'normal');
}

/**
 * 顔領域として複数候補がある場合、中心に近そうなものを探す。
 * @param {Object} img 画像
 * @param {number[]} comp 顔領域候補の配列
 * @param {Object} ctx canvascontext。デバッグ用に線を引くのに使う。
*/
function selectTarget(img, comp, ctx) {
    //TODO:大きさが大きなものを選んでもいいかもしれない。

    var inw = img.naturalWidth;
    var inh = img.naturalHeight;
    var ixc = inw / 2;
    var iyc = inh / 2;
    var min = Number.MAX_VALUE;
    var minIndex = -1;
    
    // デバッグ用の線
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#00f";
    for (var i = 0; i < comp.length; i++) {
        var tmpX = comp[i].x + comp[i].width / 2;
        var tmpY = comp[i].y + comp[i].height / 2;
	var l = Math.pow((tmpX - ixc), 2) + Math.pow((tmpY - iyc), 2) ;
	if(min > l) {
	    min = l;
	    minIndex = i;
	}
	if(DEBUG) {
	    console.log("target-", i, "->", [comp[i].x, comp[i].y, comp[i].width, comp[i].height, " score ", l].join());
	    ctx.strokeRect(comp[i].x, comp[i].y, comp[i].width, comp[i].height);
	    ctx.beginPath();
	    ctx.moveTo(0, 0);
	    ctx.moveTo(ixc, ixc);
	    ctx.lineTo(tmpX, tmpY);
	    ctx.stroke();
	}
    }
    if(DEBUG) {
	console.log("select:" + minIndex);
	ctx.strokeStyle = "#f00";
	ctx.strokeRect(comp[minIndex].x, comp[minIndex].y, comp[minIndex].width, comp[minIndex].height);
    }
    return minIndex;
}

/**
 * 歌詞を書く
 * @param {Object} ctx canvasのcontext 
 * @param {number} imageWidth 画像の横幅
 */
function drawLyrics(ctx, imageWidth) {
    //lYrics
    var txt = $('#lyricText').val();
    //全体が入るようにする。
    var ptSize = imageWidth / (txt.length + 5);
    var d = 5;
    ctx.font = ["italic", "bold", ptSize + "pt", "Arial"].join(' ');
    //少しずらして影付きっぽく
    ctx.fillStyle = "grey";
    ctx.fillText(txt, 10 + ptSize - d - 1, 10 + ptSize * 2 - d - 1);
    ctx.fillStyle = "black";
    ctx.fillText(txt, 10 + ptSize, 10 + ptSize * 2);
    ctx.fillStyle = "white";
    ctx.fillText(txt, 10 + ptSize - d, 10 + ptSize * 2- d);
}

/**
 * ページ読み込み時の処理
 */
$(function(){

    /**
     * ファイル選択時の処理。
     * @param {Event} evt ファイル選択イベント
     */
    function handleFileSelect(evt) {
	var files = evt.target.files; // inputタグからFileオブジェクトを取得
	if(files.length > 1) {
	    showMessage("ファイルは1つだけ選択してください。");
	    return;
	}
	var f = files[0];
	
        if (!f.type.match('image.*')) {
	    showMessage("画像ファイルを選んでください。");
	    return;
        }

        var reader = new FileReader();
        // ファイル読み込み。終わったら解析開始。
        reader.onload = (function(theFile) {
	    return function(e) {
		img = new Image();
		img.src = e.target.result;
		img.onload = function() {
		    detectAndDraw(this);
 		};
	    };
        })(f);
        reader.readAsDataURL(f);
    }

    //チェック
    if (window.File && window.FileReader && window.FileList && window.Blob) {
	$('#files').on('change', handleFileSelect);
    } else {
	showMessage("このブラウザではドラッグ&ドロップができません。");
    }
    
    //ダウンロードボタンが押されたときの処理
    $('#downloadButton').on('click', function() {
	canvas.toBlob(function(blob) {
	    saveAs(blob, "dragonized.png");
	});
    });
    
    // イベントをキャンセルするハンドラ
    var cancelEvent = function(event) {
        event.preventDefault();
        event.stopPropagation();
        return false;
    };
    
    // dragenter, dragover イベントのデフォルト処理をキャンセル。
    $('#d-and-d').on('dradenter', cancelEvent);
    $('#d-and-d').on('dragover', cancelEvent);
    //バインド
    $('#d-and-d').on('drop', dropped);
});

/**
 * @param {evt} event ドロップ処理
*/
function dropped(evt)
{
    evt.preventDefault();

    var file = evt.originalEvent.dataTransfer.files[0];
    
    // ファイル内容の読み取り
    var reader = new FileReader();
    reader.onloadend = function(){
	img = new Image();
	img.src = reader.result;
	img.onload = function() {
	    detectAndDraw(this);
	};
    };
    reader.readAsDataURL(file);
}

