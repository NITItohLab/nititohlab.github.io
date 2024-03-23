var store = [{
        "title": "シェーダー関連記事まとめ",
        "excerpt":"このページはシェーダに関する情報(GLSL, HLSL, ShaderLab..etc)をきっといつか誰かが見てくれることを信じて共有するためのものです。   全般     シェーダのシェの字も知らない人はまずMVP行列について軽く学ぼう   シェーダで条件分岐を使わないテクニック   シェーダーだけで創る世界・レイマーチングがすごい！   GLSL  HLSL  Unity(ShaderLab, Cg/HLSL)     (有償)Unity Shader Programming Vol.01   1日でマスターするUnityシェーダ入門！！　←初心者向き   Shader Graphを使ってノンプログラミングでシェーダを作ろう！   モバイルで10万個のオブジェクトを描画   シェーダについてまとめられているスライド   リアルよりの水流の作り方を学べるチュートリアル   リアルよりの水流の作り方を学べるチュートリアルに関しては、同サイトの簡単なチュートリアルを先にやっておくことを推奨。ソースコードに一つ誤りがあり、RGBAのアルファを元にディスプレイスしているが上手く働かないのでRの値を用いるのをおすすめする。   ","categories": ["blog"],
        "tags": ["Shader","HLSL","GLSL","Cg","Unity"],
        "url": "/blog/shader-list/",
        "teaser": null
      },{
        "title": "VIRTUALIZE REALIZE",
        "excerpt":"本研究室の2020年度卒業生2名が、企画・技術開発を担当したDJイベント。 当時のコロナウイルスの影響をものともせず、VRChatの特設ワールドにて開催しました！！  最新の映像転送技術を応用し、オンライン上でも参加者全員に「楽しさ」の共有ができるように奮闘しました。   詳細は特設サイトから。  ","categories": ["blog"],
        "tags": ["DJ","VRChat","VRize"],
        "url": "/blog/virtualize-realize/",
        "teaser": null
      },{
        "title": "論文を読んだり書いたりするときに使うツール",
        "excerpt":"超役立つやつ  改行・空白・タブ削除ツール   科学論文に役立つ英語   (英語版）こう言い換えろ→論文に死んでも書いてはいけない言葉３０   JM TRANSLATIONS -英語の論文で役立つ接続表現-   論文英語ナビ-目的の書き方-   On the other hand の言い換え一覧   論文を書く際に注意が必要な事項  ","categories": ["blog"],
        "tags": ["論文"],
        "url": "/blog/hanaoka-reading/",
        "teaser": null
      },{
        "title": "ジオメトリシェーダを学ぶ(基礎中の基礎編)",
        "excerpt":"需要など知らぬ。ただの自己満足 ここではUnityを使用したジオメトリシェーダについて解説していき、読んでくれる人がオリジナルのシェーダを記述できるまでにしていく。していきたい なお、今回のチュートリアルは、ジオメトリシェーダというよりは、シェーダ全体の解説なのであしからず。(見栄えがいいのは次回！ ジオメトリシェーダとは バーテックスシェーダとフラグメント(ピクセル)シェーダの中間に位置するシェーダ。 バーテックスシェーダでは頂点ごとにシェーダが適用され、フラグメントシェーダではピクセル単位でシェーダが適用される。これに対してジオメトリシェーダは、ポリゴン単位でシェーダが適用され、頂点座標を変更したり、頂点そのものを削除もしくは増加させることができる。 例えば三角形のポリゴンが入力として来た際に、それを四角形に変更したり、なんなら立方体にしてしまったりすることができる。(GPUパーティクルはこれを利用している) レンダリングパイプライン ジオメトリシェーダを使ってみる とりあえず何もしないシェーダを作ってみます。 Unityを起動したら適当な名前でプロジェクトを作成しましょう。作成できたら、まずはヒエラルキーでcubeを 置きます。 cubeが置けたら、今度はプロジェクトタブで、右クリック&gt;Create&gt;Materialを選択します。 Materialを適当な名前に変更したら、今度はshaderファイルを作成していきます。プロジェクトタブで右クリック&gt;Create&gt; Shader&gt;Unlit Shaderを選択します。 Shaderが作成できたら、名前を適当な名前に変更し、ファイルを先ほど作成したmaterialにドラッグ＆ドロップしましょう。 これでマテリアルとシェーダが紐づけされます。最後に、マテリアルをヒエラルキーのcubeにアタッチ（ドラッグ＆ドロップ）すれば、下準備は完了です。 ここからシェーダの中身を書いていきます。 Shader \"Unlit/cube\" { Properties { _MainTex (\"Texture\", 2D) = \"white\" {} } SubShader { Tags { \"RenderType\"=\"Opaque\" } LOD 100 Pass { CGPROGRAM #pragma vertex vert //vert関数がvertexシェーダであることを宣言 #pragma fragment frag //frag関数がfragmentシェーダであることを宣言...","categories": ["blog"],
        "tags": ["Shader","Unity"],
        "url": "/blog/geometry-shader/",
        "teaser": null
      }]
