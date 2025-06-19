# Latex数式コマンド集

## 基本編

Markdown (具体的にはTyporaとこのサイトで使うMathJax) でLatex数式コマンドを使うことを想定しています．latexで使う場合は，amsmathやamssymbパッケージを\usepackage{amsmath,amssymb}として使用できるようにすれば使えるものを扱っています．MathJaxでは標準でamsの記号類が有効．[こちら](./md/tips/latexMath.md)からmdファイルをDL．Markdownで書き始めるには，インラインの文中式なら`$`で囲み，`$\alpha_1$`=$\alpha_1$，別行立てで書くなら`$$`で囲み

```latex
$$
y = f(x)
$$
```

$$
y = f(x)
$$

と書きます．MathJaxはオプション指定で`\[ ... \]`も使えるが，Typora未対応．

書き方には**特殊文字** (一般名称かは不明，制御文字とも)，**コマンド**と**環境environment**があります．特殊文字はアンダーバー`a_1`=$a_1$などです．コマンドは`\コマンド名{引数}{引数-2，あれば}`，環境は`\begin{環境名}中身\end{環境名}`と書きます．コマンドは引数のないものもあり，例えばギリシャ文字`\alpha`=$\alpha$や`\LaTeX`=$\LaTeX$などがあります．複数引数コマンドは`$\frac{n}{d}$`=$\frac{n}{d}$などです．コマンドと環境には四角括弧`[]`でオプションを指定できるものもあります（`$\sqrt[3]{2}$`=$\sqrt[3]{2}$など）．`\`は**バックスラッシュ**で，shift-jisなど文字コード次第では`¥`でも良い場合があります．私はUTF-8を基本的に使用し，alt+¥で入力しています．windowsもshift-jis離れが進んでいるので，バックスラッシュで困ることも少なくなるかもしれません．

## 特殊文字：とても種類が少ない

- `\`，コマンドや環境に使う．`\\`で複数行式や行列の改行．表示するにはコマンドで`\backslash`=$\backslash$．似たようなものに`\setminus`=$\setminus$がある
- 中括弧`{}`，コマンドや環境に使うので特殊な文字．そのまま使うと無視される．`{x}`=${x}$
- アンダーバー`a_1`=$a_1$，複数文字なら`a_{10}`=$a_{10}$
- ハット文字`a^2`=$a^2$，複数文字なら`a^{20}`=$a^{20}$
- チルダ文字`a~b`=$a~b$，ちょっとスペース空ける．普通の半角スペースは生テキストの見栄えを整えるのに使用し，表示では無視される
- `= < >`，それほど特殊な処理はないがどうやらLatexが見栄えを調整．変数定義`y := 10`=$y := 10$，$f(x)$の$x$微分`f'(x)`=$f'(x)$ほか
- 特殊文字をそのまま表示したいなら`\`でエスケープ`\_`=$\_$，`\{`=$\{$など

## コマンド：一番種類が多い

### 上付き記号

- 時間微分に使う上ドット`\dot{x}`=$\dot{x}$，複数なら`\ddot{x}`=$\ddot{x}$，三つ以上は`x^{(3)}`=$x^{(3)}$と書くのが良い
- ハット`\hat{x}`=$\hat{x}$，`\widehat{XYZ}`=$\widehat{XYZ}$
- チルダ`\tilde{x}`=$\tilde{x}$，`\widetilde{XYZ}`=$\widetilde{XYZ}$
- オーバーバー`$\bar{x}$`=$\bar{x}$や`\overline{XYZ}`=$\overline{XYZ}$，アンダーも`\underline{XYZ}`=$\underline{XYZ}$．
- ベクトル記号`\vec{x}`=$\vec{x}$，`\overrightarrow{XYZ}`=$\overrightarrow{XYZ}$

### misc, miscellany，いずれ分類

- 分数`\frac{n}{d}`=$\frac{n}{d}$，インラインなら小さく，別行立てなら大きく表示される．大きくしたいなら`\dfrac{n}{d}`=$\dfrac{n}{d}$．単純なものなら`n/d`=$n/d$と書く．微分$\dfrac{dy}{dx}$，偏微分$\dfrac{\partial y}{\partial x}$
- 総和，総乗`\sum_{n=1}^5 n`=$\sum_{n=1}^5 n$，`\prod_{n=1}^5 n`=$\prod_{n=1}^5 n$．大きくしたいなら`\displaystyle \sum_{n=1}^5 n`=$\displaystyle \sum_{n=1}^5 n$，<!-- $\bigwedge_z^b$ -->
- 三角関数`\sin`=$\sin$，`\cos`=$\cos$，`\tan`=$\tan$，逆`\arcsin`=$\arcsin$，正割sec余割csc余接cotもある．双曲線`\tanh`=$\tanh$など，普通に`sin`は$sin$で斜体になりマナー違反
- 平方根・ルート`\sqrt{2}`=$\sqrt{2}$，3乗根`\sqrt[3]{2}`=$\sqrt[3]{2}$
- 最大最小極大極小$\max$，$\min$．$\sup$，$\inf$．添字も有効で$\displaystyle \max_{x \in D}\|f(x)\|$，本質的上限は標準ではないので，`\mathrm{ess}\sup`=$\mathrm{ess}\sup$でもある程度整うが，latexなら`\usepackage{amsmath}`の後，`\DeclareMathOperator*{\esssup}{ess\,sup}`などとすれば定義できる．
- 極限`\lim`．$f'(x):=\lim_{h\to \pm 0}\frac{f(x+h)-f(x)}{h}$
- ベクトルなどを太字にする`$\boldsymbol{x}$`=$\boldsymbol{x}$
- 実数空間`\mathbb{R}`=$\mathbb{R}$，複素空間$\mathbb{C}$，自然数空間$\mathbb{N}$
- 等号不等号`=`=$=$，`\neq`=$\neq$，`\leq`=$\leq$，`\geq`=$\geq$，近似等号`\approx`=$\approx$，恒等式と合同`\equiv`=$\equiv$，その否定`\not\equiv`=$\not\equiv$．2重線の不等号`\geqq`=$\geqq$，点をつけた近似`\fallingdotseqに`=$\fallingdotseq$もできる．
- 集合の要素・元`\in`=$\in$，部分集合`\subset`=$\subset$，等号含む`\subseteq`=$\subseteq$．反対なら`\supset`=$\supset,~\supseteq$
- 集合の演算，共通部分$\cap$, 和集合$\cup$, 直和$\oplus$, 減算$\setminus$
- for all `\forall`=$\forall$，存在する`\exists`=$\exists$
- ギリシャ文字$\alpha$，$\beta$，$\gamma$，棒が出ないファイ`\varphi`=$\varphi$，棒が出るファイ`\phi`=$\phi$，[LaTeXコマンド集，ギリシャ文字](http://www.latex-cmd.com/special/greek.html)
- 丸やドット$\dots$，$\cdots$，$\vdots$，$\ddots$，$\cdot$，$\bullet$，$\circ$
- 括弧$(x)$・$[x]$・$|x|$・$\| x\|$．$\{ x\}$
- 括弧の大きさ自動調整$\left(\dfrac{n}{d}\right)$・$\left[\dfrac{n}{d}\right]$・$\left\|\dfrac{n}{d}\right\|$・$\left\{\dfrac{n}{d}\right\}$，手動調整[LaTeX入門，括弧の大きさを指定](https://medemanabu.net/latex/bracket/)．
- 未定義関数の立体`\mathrm{diag}(x)`=$\mathrm{diag}(x)$，ベクトル$x$を対角要素にもつ行列
- 広めのスペース空け`x\quad y`=$x\quad y$，`x\qquad y`=$x\qquad y$．複数行にわたる式の頭下げなんかに使う
- 式内で文字を書く$x \text{ is } y$．Markdownでは直接書いてしまってよい．LaTeXでは`\mbox{}`や`\text{}`で，MathJaxはどちらも処理してくれるが，日本語はバランス悪い．

`\displaystyle`とか`\partial`とか長すぎと思ったら，LaTeXでは自作コマンド，MathJaxならmacrosで短縮コマンドを作ることができる．既存コマンド名との衝突に注意．

## 環境：数式で使うものは少ない

* 行列：array，matrix，pmatrix環境もあるが個人的にはbmatrix一択．
$$
A := \begin{bmatrix}a&b\\ c&d\end{bmatrix}
$$
* イコールが揃う複数行数式１：`equation`+`split`または`equation`+`aligned`環境，全体に式番号が一つ付く
$$
\begin{equation}
\tag{A1}\begin{aligned}
\dot{x} =& f(x,~u) \\
y =& g(x)
\end{aligned}
\end{equation}
$$

* =が揃う複数行数式２：`align`環境，Latexではそれぞれに式番号が一つ付く．`eqnarray`は使わなくて良い模様
$$
\begin{align}
\dot{x} =& f(x,~u) \\
y =& g(x)
\end{align}
$$

* 条件わけ．右にカッコを閉じたい場合は`array`と`\left. \right\}`を駆使して下さい．`\left.`は表示されない．大きさ判定のために左右セットにしなければならないようで，非表示ですが必須．大きさを指定する$\bigr\}$などは片側でも良いが，手動調整は旨味がない．
$$
\begin{equation}
f(x) :=
\begin{cases}
1,\quad &\text{if}~ x\neq 0 \\
0,\quad &\text{if}~ x = 0
\end{cases}
\end{equation}
$$
* 別行立て数式には`\tag{数字など}`で名前を付けられます．MathJaxやTyporaは参照にも対応しており，`$\eqref{LabelX}$`と書けば番号を参照してくれます．\label{...}と独立行式中に書けば，`\ref{...}, \eqref{...}`の参照が使えます．Latexにコピペすることを想定すると，式番号を使う場合はLatexで使用される(1)などを避け，(A1) のようにしておけば番号が混ざらないので後で処理しやすいかもしれない．

**注記**： MathJaxとKatexでも違い、使うソフトごとに対応がまばらで困ります。

