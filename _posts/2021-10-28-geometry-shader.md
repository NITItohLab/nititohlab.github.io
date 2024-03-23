---
author: RenHIRAYAMA
title: "ジオメトリシェーダを学ぶ(基礎中の基礎編)"
date: 2021-10-28T15:34:30-04:00
date_format: "%Y-%m-%d"
categories:
  - blog
tags:
  - Shader
  - Unity
---

~~需要など知らぬ。ただの自己満足~~  
ここではUnityを使用したジオメトリシェーダについて解説していき、読んでくれる人がオリジナルのシェーダを記述できるまでにしていく。~~していきたい~~  
なお、今回のチュートリアルは、ジオメトリシェーダというよりは、シェーダ全体の解説なのであしからず。(見栄えがいいのは次回！

### ジオメトリシェーダとは
バーテックスシェーダとフラグメント(ピクセル)シェーダの中間に位置するシェーダ。 バーテックスシェーダでは頂点ごとにシェーダが適用され、フラグメントシェーダではピクセル単位でシェーダが適用される。これに対してジオメトリシェーダは、ポリゴン単位でシェーダが適用され、頂点座標を変更したり、頂点そのものを削除もしくは増加させることができる。 例えば三角形のポリゴンが入力として来た際に、それを四角形に変更したり、なんなら立方体にしてしまったりすることができる。(GPUパーティクルはこれを利用している)


[レンダリングパイプライン](https://yttm-work.jp/shader/shader_0002.html) 


### ジオメトリシェーダを使ってみる  

とりあえず何もしないシェーダを作ってみます。  
Unityを起動したら適当な名前でプロジェクトを作成しましょう。作成できたら、まずはヒエラルキーでcubeを
置きます。  
{{:share:geom01.png?400|}}  
cubeが置けたら、今度はプロジェクトタブで、右クリック>Create>Materialを選択します。  
Materialを適当な名前に変更したら、今度はshaderファイルを作成していきます。プロジェクトタブで右クリック>Create>
Shader>Unlit Shaderを選択します。  
{{:share:geom2.png?400 |}} 
    
Shaderが作成できたら、名前を適当な名前に変更し、ファイルを先ほど作成したmaterialにドラッグ＆ドロップしましょう。
これでマテリアルとシェーダが紐づけされます。最後に、マテリアルをヒエラルキーのcubeにアタッチ（ドラッグ＆ドロップ）すれば、下準備は完了です。  
ここからシェーダの中身を書いていきます。  

```hlsl
Shader "Unlit/cube"
{
    Properties
    {
        _MainTex ("Texture", 2D) = "white" {}
    }
    SubShader
    {
        Tags { "RenderType"="Opaque" }
        LOD 100

        Pass
        {
            CGPROGRAM
            #pragma vertex vert   //vert関数がvertexシェーダであることを宣言
            #pragma fragment frag //frag関数がfragmentシェーダであることを宣言
	    #pragma geometry geo  //geo関数がgeometyシェーダであることを宣言

            #include "UnityCG.cginc"

            struct appdata
            {
                float4 vertex : POSITION;
                float2 uv : TEXCOORD0;
            };

            struct v2f
            {
                float2 uv : TEXCOORD0;
                float4 vertex : SV_POSITION;
            };

            sampler2D _MainTex;
            float4 _MainTex_ST;

            v2f vert (appdata v)
            {
                v2f o;
                o.vertex = UnityObjectToClipPos(v.vertex);
                o.uv = TRANSFORM_TEX(v.uv, _MainTex);

                return o;
            }

	　　[maxvertexcount(3)]
	　　void geo(triangle v2f input[3], inout TriangleStream<v2f> outStream)
	　　{
		outStream.Append(input[0]);
		outStream.Append(input[1]);
		outStream.Append(input[2]);
		outStream.RestartStrip();
	　　}

            fixed4 frag (v2f i) : SV_Target
            {
                fixed4 col = fixed4(i.uv.x, i.uv.y, 0, 1);
                
                return col;
            }
            ENDCG
        }
    }
}
```

上記のコードはいわゆる「なにもしない」シェーダです。与えられた入力データに対してMVP行列による座標変換のみを行い、それをそのまま出力としています。（色だけ変えてます）
MVP行列については[シェーダのシェの字も知らない人はまずMVP行列について軽く学ぼう](http://light11.hatenadiary.com/entry/2019/01/27/160541) 
で詳しく解説されているので、一読しておくのをおススメします。  
MVP行列について理解して頂いた上で、順に上からコードの解説をしていきます。

#### Properties
```hlsl
Properties
    {
        _MainTex ("Texture", 2D) = "white" {}
    }
```
Propertiesブロックです。Unity公式によると
>シェーダにより,UnityのMaterialインスペクター 上で,アーティストがセットできるパラメータの一覧を定義できます。シェーダでのPropertiesブロックで定義します。

つまり、Propertiesブロックで宣言した変数は、Unityのインスペクターから値を直接書き換えることができるようになります。また、マテリアルのインスペクターからアクセスできるということは、C#スクリプトからもアクセスできるため、柔軟なコードが組めるようになります。
Propertiesブロックに宣言できる変数にはいくつか種類があります。   
**例：Float Range**
```
name ("display name", Range (min, max)) = number
```
float型のプロパティです。インスペクタ上でmin,maxの範囲内でスライドバーが動かせるようになります。  
それぞれに入る値は以下のようになっています。
|name|実際に使用する変数名|
|display name|インスペクタ上に表示する名前|
|min,max|Float値|
|number|初期値(Float)|
これ以外にも指定できるプロパティはあるので、適宜こちらの公式ドキュメントを見ておくといいです。  
[ShaderLab文法](https://docs.unity3d.com/jp/460/Manual/SL-Properties.html])  

####SubShader
```
SubShader{
    ......
}
SubShader{
    ......
}
```
SubShaderはShaderLabの文法で、Shaderファイル一つにつき必ず一つは必要になります。複数存在する場合、上から実行可能なSubShaderを検索し実行します。  
こうして複数に分けることで、ハイエンド向けの処理、ロースペック向けの処理など分けて処理を記述することが可能になります。また、実行可能なシェーダが存在しない場合、"Fall Back"を記述することで別のシェーダから探索します。詳しくは公式ドキュメントの[Fall Backについて](https://docs.unity3d.com/jp/460/Manual/SL-Fallback.html)を参照してください。後述するTags,PassはSubShader内に記述します。

#### Tags
```
Tags { "RenderType"="Opaque" }
```
Tagsではシェーダがどのタイミングでどのようにレンダリングされるのかを指定します。  
RenderTypeで描画方法を、Queueで描画順序を指定します。半透明な見た目のシェーダを作成する場合はレンダータイプを半透明にし、描画順序(優先度)も最後に描画させるために半透明にする必要があります。これも今回の話にはあまり関わってこないので、興味がある方は公式ドキュメントを参照して下さい。
[Tags](https://docs.unity3d.com/Manual/SL-SubShaderTags.html)  

####Pass
```
Pass{
  ......
}
Pass{
  ......
}
```
頂点シェーダやフラグメントシェーダ、ジオメトリシェーダなどはこのpassブロック内に流れを記述していきます。恐らく初心者のうちはPassを複数書くことはあまりないと思います。Passを増やすことで、例えば1パス目でテクスチャを生成し、2パス目でそれを元にレンダリングを行ったりできます。(モデルに輪郭を出したい時などに使える)  また、一般的にはマルチパスレンダリングやマルチパスシェーダと呼ぶようです。

#### CGPROGRAM / ENDCG
```
CGPROGRAM
.
.
.
ENDCG
```
この間に描画処理を記述していきます。また、名前の通り、この間の記述にはCg言語を用いります。

####インクルードファイル
前述したCGPROGRAMのすぐ下で"#include "UnityCG.cginc"をしています。こうすることで、汎用的な定義済みの関数にアクセスすることができます。
内臓されているインクルードファイルについては[公式ドキュメント](https://docs.unity3d.com/jp/460/Manual/SL-BuiltinIncludes.html)を参照してください。

#### #pragma
```
  #pragma vertex vert
  #pragma fragment frag
  #pragma geometry geo
```
\#pragmaで指定してやることで、コンパイラに対してどの関数が頂点シェーダ、フラグメントシェーダ、ジオメトリシェーダとしてコンパイルするのかを教えてあげます。
今回のコードではvertが頂点シェーダ、fragがフラグメントシェーダ、geoがジオメトリシェーダというわけです。

####appdata, v2f
```
struct appdata
       {
           float4 vertex : POSITION;
           float2 uv : TEXCOORD0;
       };

struct v2f
       {
           float2 uv : TEXCOORD0;
           float4 vertex : SV_POSITION;
       };
```

appdata,v2fはshaderに対して渡す入力を定義しています。今は構造体として定義していますが、shaderの引数に直接記述することも可能です。  
また、それぞれの変数の最後に:POSITION;などと記述されています。
>>float4 vertex:POSITION;  

これらはセマンティクスと呼ばれ、頂点座標やUV座標などが、プログラム中のどの変数に対応するのかを定義するために使用します。セマンティクスに関しては[ここのサイト](https://qiita.com/sune2/items/fa5d50d9ea9bd48761b2)がわかりやすいです。
必要なのはこのセマンティクスなので、構造体自体は好きな名前にすることも可能ですし、中身も自由に変えて大丈夫です。

####uniform
```
 sampler2D _MainTex;
 float4 _MainTex_ST;
```
前述した部分のすぐ下に、この2行があると思います。これはuniform変数と呼ばれるもので、Propertiesブロックで宣言した変数を実際のshaderで使用するためのものです。
そのため、Propertiesブロックで宣言した名前と一致させる必要があります。明示的にuniformを変数の直前に記述することも可能です。
また、\_MainTex\_STというPropertiesブロックでは宣言していないはずのものがあると思います。これはデフォルトで用意されているもののようで、この変数には_MainTexで受け取ったテクスチャのタイリング、オフセットの情報が代入されます。(定義済み関数で使用しているので削除非推奨）

####Vertex Shader(頂点シェーダ)
```
v2f vert (appdata v)
{
    v2f o;
    o.vertex = UnityObjectToClipPos(v.vertex);
    o.uv = TRANSFORM_TEX(v.uv, _MainTex);

    return o;
}
```
ようやくシェーダの本体の話になります。まずは一番最初に実行される頂点シェーダについてです。  
今回は引数として構造体appdataを受け取っています。これによって頂点シェーダはオブジェクトの頂点情報を獲得したことになります。
```v2f o;
```
次に実行されるシェーダに渡すために構造体を宣言しています。
```
o.vertex = UnityObjectToClipPos(v.vertex);
```
入力された頂点座標(ローカル）に対してMVP変換したものを出力用データに代入しています。
```
 o.uv = TRANSFORM_TEX(v.uv, _MainTex);
```
各頂点のUV座標をテクスチャスケール、オフセットを適用した状態で出力用データに代入しています。
```
return o;
```
頂点シェーダで加工されたデータは、ジオメトリシェーダが定義されていなければフラグメントシェーダへ、定義されていればジオメトリシェーダに流されます。
今回はジオメトリシェーダを使用しているため、データはここに流れます。  
本来であればジオメトリシェーダに流すデータはv2g(vertex to geometry)などの名前にして、v2fと別にすべきですが、今回は渡されたデータをそのまま出力するだけなので
フラグメントシェーダに渡されるデータ(v2f)と共有で使っています。

####Geometry Shader(ジオメトリシェーダ）
```
[maxvertexcount(3)]
void geo(triangle v2f input[3], inout TriangleStream<v2f> outStream)
{
	outStream.Append(input[0]);
	outStream.Append(input[1]);
	outStream.Append(input[2]);
	outStream.RestartStrip();
}
```
本題のジオメトリシェーダです。(といっても今回は何もしないものですが)  
ジオメトリシェーダでは下記のように、まず出力する頂点の最大数を定義します。(必須）
```
[maxvertexcount(3)]
```
今回の場合は三角形ポリゴンを受け取って、それをそのまま出力するので最大頂点数は３になります。ですので、三角形ポリゴンを2枚出力するのであれば最大頂点数は6になります。

#####入力
ジオメトリシェーダの入力は
```
triangle v2f input[3]
```
以上のようになっています。
triangle　の部分は受け取る際のプリミティブを指定するのもので、
|プリミティブ型 |説明 |
|point|ポイントリスト|
|line|ラインリストまたはラインストリップ|
|triangle|三角形のリストまたは三角形のストリップ|
|lineadj|隣接関係にあるラインリストまたは隣接関係にあるラインストリップ|
|triangleadj|隣接関係にある三角形リストまたは隣接関係にある三角形ストリップ|  
いくつかのバリエーションがあります。どの単位で加工したいかによって変えていくのがベストだと思います。

#####出力
```
inout TriangleStream<v2f> outStream
```
ジオメトリシェーダでは戻り値がないため、引数として出力用のデータを参照渡しで渡しています。
inoutがその参照渡しを指定する方法のようです。(詳しくはまだ調べていない）
TriangleStream..の部分が出力するポリゴンの形を決定する箇所です。全部で、
|PointStream|点で出力|
|LineStream|エッジで出力|
|TriangleStream|三角形で出力|  

が存在します。データタイプ(v2fの部分)に関しては、フラグメントシェーダの入力用の構造体を指定してあげる必要があります。  
試しにLineStreamで出力した例が以下の画像です。
{{:share:shader:geom4.png?400|}}

これにはマルチパスシェーダ(パスを複数書く）を使っているため、画像では正常に色が描画され、その上にワイヤーフレームが表示されています。
単純にLineStreamで出力するとワイヤーフレームのみ表示され、中身は透明なオブジェクトが描画されますが、マルチパスを活用することで様々な応用が利かせられます。

#####ポリゴンの作成

```
outStream.Append(input[0]);
outStream.Append(input[1]);
outStream.Append(input[2]);
outStream.RestartStrip();
```
outStream.Append(頂点データ）とすることで一枚のポリゴンに必要な頂点データを流しこむことが出来ます。
今回の例では、inputデータをそのまま三角形ポリゴンの頂点データとして流し込んでいます。
最後にoutStream.RestartStrip()を呼んであげることで、一つのポリゴンとして区切りをつけることができます。
すなわち、これ以降にAppendをすると別の新しいポリゴンの頂点として認識されます。
例によってテキトウコードで試してみた。
{{:share:shader:geom5.png?400|}}  
えぇ…なにこれは…。
頂点法線を正規化せずにそのまま使ったらすごいことに…。  
一応コードのせときます。
```
[maxvertexcount(6)]
void geom(triangle v2f input[3], inout LineStream<v2f> outStream) {
	outStream.Append(input[0]);
	outStream.Append(input[1]);
	outStream.Append(input[2]);
	outStream.RestartStrip();
	input[0].vertex.xyz += input[0].normal.xyz;
	input[1].vertex.xyz += input[1].normal.xyz;
	input[2].vertex.xyz += input[2].normal.xyz;
	outStream.Append(input[0]);
	outStream.Append(input[1]);
	outStream.Append(input[2]);
	outStream.RestartStrip();
}
```
さすがに例がこれだけじゃいけないので、直近で読みかじっていたスフィアのサンプルの実行結果を載せます。
{{:share:shader:geom7.png?400|}}  

コードは2次配布可能か不明だったのでソース元を紹介しときます。[Demo 82](http://www.shaderslab.com/demo-82---extrude-faces.html)  
とりあえず、これでジオメトリシェーダの紹介は終了です。今回は全体の流れを説明しながらだったので、退屈なものだったと思います。  
次回以降のチュートリアルではよりgeometryに特化したものにしていく予定です。暇があれば頂点シェーダとかもチュートリアルつくります。  
以下フラグメントシェーダのプチ解説

####Flagment Shader(フラグメントシェーダ)
```
 fixed4 frag (v2f i) : SV_Target
 {
           
      fixed4 col = fixed4(i.uv.x, i.uv.y, 0, 1);
 
      return col;
}
```
はい、めっちゃ短いです。
フラグメントシェーダではピクセルに描画する色を返り値としています(めちゃシンプル)  
そのため、
```
fixed4 col = fixed4(i.uv.x, i.uv.y, 0, 1);
```
この部分で色をピクセル単位で色を指定しています。
つまり、上記の式では、UV値をそのままカラー値とすることで(UnityではRGB(0.0 ~1.0),UV値も0.0～1.0)グラデーションを再現しています。


####最後に
自分にインプットするためのアウトプットでしたが正直疲れました。(でも楽しかった）  
宝くじが当たるくらいの確率で読んでくれる人が表れた時に役にたったらいいな。  
あと正直説明不足のとこ多いと思う気がするのでとりあえずマッハで雛形はできたので適宜修正していこうと思います。  
以上(燃え尽きた)  
第一部　完

