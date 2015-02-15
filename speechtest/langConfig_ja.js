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

// Google Chrome (Mac) 40.0.2214.111 (64-bit)で調査した結果。
// Last modified:  Sun Feb 15 09:56:43 2015 JST


var langConfig = {
    speech:[
	{lang:"ar-SA",flag:"",title:"アラビア語(サウジアラビア)"},
	{lang:"cs-CZ",flag:"",title:"チェコ語"},
	{lang:"da-DK",flag:"",title:"デンマーク語"},
	{lang:"de-DE",flag:"",title:"ドイツ語"},
	{lang:"el-GR",flag:"",title:"ギリシャ語"},
	{lang:"en-AU",flag:"",title:"英語(オーストラリア)"},
	{lang:"en-GB",flag:"",title:"英語(U.K.)"},
	{lang:"en-IE",flag:"",title:"英語(アイルランド)"},
	{lang:"en-IN",flag:"",title:"英語(インド)"},
	{lang:"en-US",flag:"",title:"英語(U.S.)"},
	{lang:"en-ZA",flag:"",title:"英語(南アフリカ)"},
	{lang:"es-AR",flag:"",title:"スペイン語(アルゼンチン)"},
	{lang:"es-ES",flag:"",title:"スペイン語(スペイン)"},
	{lang:"es-MX",flag:"",title:"スペイン語(メキシコ)"},
	{lang:"fi-FI",flag:"",title:"フィンランド語"},
	{lang:"fr-CA",flag:"",title:"フランス語(カナダ)"},
	{lang:"fr-FR",flag:"",title:"フランス語(フランス)"},
	{lang:"he-IL",flag:"",title:"ヘブライ語"},
	{lang:"hi-IN",flag:"",title:"ヒンズー語"},
	{lang:"hu-HU",flag:"",title:"ハンガリー語"},
	{lang:"id-ID",flag:"",title:"インドネシア語"},
	{lang:"it-IT",flag:"",title:"イタリア語"},
	{lang:"ja-JP",flag:"",title:"日本語"},
	{lang:"ko-KR",flag:"",title:"韓国語"},
	{lang:"nb-NO",flag:"",title:"ノルウェー語"},
	{lang:"nl-BE",flag:"",title:"オランダ語(ベルギー)"},
	{lang:"nl-NL",flag:"",title:"オランダ語(オランダ)"},
	{lang:"pl-PL",flag:"",title:"ポーランド語"},
	{lang:"pt-BR",flag:"",title:"ポルトガル語(ブラジル)"},
	{lang:"pt-PT",flag:"",title:"ポルトガル語(ポルトガル)"},
	{lang:"ro-RO",flag:"",title:"ルーマニア語"},
	{lang:"ru-RU",flag:"",title:"ロシア語"},
	{lang:"sk-SK",flag:"",title:"スロバキア語"},
	{lang:"sv-SE",flag:"",title:"スウェーデン語"},
	{lang:"th-TH",flag:"",title:"タイ語"},
	{lang:"tr-TR",flag:"",title:"トルコ語"},
	{lang:"zh-CN",flag:"",title:"中国語(中国)"},
	{lang:"zh-HK",flag:"",title:"中国語(香港)"},
	{lang:"zh-TW",flag:"",title:"中国語(台湾)"}
    ],
    recognition:[
	{lang:"ar-SA",flag:"",title:"アラビア語(サウジアラビア)"},
	{lang:"cs-CZ",flag:"",title:"チェコ語"},
	{lang:"da-DK",flag:"",title:"デンマーク語"},
	{lang:"de-DE",flag:"",title:"ドイツ語"},
	{lang:"el-GR",flag:"",title:"ギリシャ語"},
	{lang:"en-AU",flag:"",title:"英語(オーストラリア)"},
	{lang:"en-GB",flag:"",title:"英語(U.K.)"},
	{lang:"en-IE",flag:"",title:"英語(アイルランド)"},
	{lang:"en-IN",flag:"",title:"英語(インド)"},
	{lang:"en-US",flag:"",title:"英語(U.S.)"},
	{lang:"en-ZA",flag:"",title:"英語(南アフリカ)"},
	{lang:"es-AR",flag:"",title:"スペイン語(アルゼンチン)"},
	{lang:"es-ES",flag:"",title:"スペイン語(スペイン)"},
	{lang:"es-MX",flag:"",title:"スペイン語(メキシコ)"},
	{lang:"fi-FI",flag:"",title:"フィンランド語"},
	{lang:"fr-CA",flag:"",title:"フランス語(カナダ)"},
	{lang:"fr-FR",flag:"",title:"フランス語(フランス)"},
	{lang:"he-IL",flag:"",title:"ヘブライ語"},
	{lang:"hi-IN",flag:"",title:"ヒンズー語"},
	{lang:"hu-HU",flag:"",title:"ハンガリー語"},
	{lang:"id-ID",flag:"",title:"インドネシア語"},
	{lang:"it-IT",flag:"",title:"イタリア語"},
	{lang:"ja-JP",flag:"",title:"日本語"},
	{lang:"ko-KR",flag:"",title:"韓国語"},
	{lang:"nb-NO",flag:"",title:"ノルウェー語"},
	{lang:"nl-BE",flag:"",title:"オランダ語(ベルギー)"},
	{lang:"nl-NL",flag:"",title:"オランダ語(オランダ)"},
	{lang:"pl-PL",flag:"",title:"ポーランド語"},
	{lang:"pt-BR",flag:"",title:"ポルトガル語(ブラジル)"},
	{lang:"pt-PT",flag:"",title:"ポルトガル語(ポルトガル)"},
	{lang:"ro-RO",flag:"",title:"ルーマニア語"},
	{lang:"ru-RU",flag:"",title:"ロシア語"},
	{lang:"sk-SK",flag:"",title:"スロバキア語"},
	{lang:"sv-SE",flag:"",title:"スウェーデン語"},
	{lang:"th-TH",flag:"",title:"タイ語"},
	{lang:"tr-TR",flag:"",title:"トルコ語"},
	{lang:"zh-CN",flag:"",title:"中国語(中国)"},
	{lang:"zh-HK",flag:"",title:"中国語(香港)"},
	{lang:"zh-TW",flag:"",title:"中国語(台湾)"}
    ]};
