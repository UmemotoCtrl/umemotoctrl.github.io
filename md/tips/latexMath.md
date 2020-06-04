# Latex数式コマンド集

**更新日：2020/6/2**

## 基本編

Markdown (具体的にはTyporaとこのサイトで使うMathJax) でLatex数式コマンドを使うことを想定しています．[こちら](./md/tips/latexMath.md)からmdファイルをDL．Markdownで書き始めるには，インラインの文中式なら`$`で囲み，`$\alpha_1$`=$\alpha_1$，別行立てで書くなら`$$`で囲み

```latex
$$
y = f(x)
$$
```

$$
y = f(x)
$$

と書きます．

書き方には**特殊文字** (一般名称かは不明，制御文字とも)，**コマンド**と**環境environment**があります．特殊文字はアンダーバー`a_1`=$a_1$などです．コマンドは`\コマンド名{引数}{引数-2，あれば}`，環境は`\begin{環境名}中身\end{環境名}`と書きます．コマンドは引数のないものもあり，例えばギリシャ文字`\alpha`=$\alpha$や`\LaTeX`=$\LaTeX$などがあります．複数引数コマンドは`$\frac{n}{d}$`=$\frac{n}{d}$などです．コマンドと環境には四角括弧`[]`でオプションを指定できるものもあります（`$\sqrt[3]{2}$`=$\sqrt[3]{2}$など）．`\`は**バックスラッシュ**で，`¥`でも良い場合があります．エディタ次第かも．私はalt+¥で入力しています．最近のエディタはしっかり区別してくれます．

## 特殊文字：とても種類が少ない

- 中括弧`{}`，コマンドや環境に使うので特殊な文字．そのまま使うと無視される．`{x}`=${x}$
- アンダーバー`a_1`=$a_1$，複数文字なら`a_{10}`=$a_{10}$
- ハット文字`a^2`=$a^2$，複数文字なら`a^{20}`=$a^{20}$
- チルダ文字`a~b`=$a~b$，ちょっとスペース空ける．普通の半角スペースは生テキストの見栄えを整えるのに使用し，表示では無視される
- `= < >`，それほど特殊な処理はないがどうやらLatexが見栄えを調整．変数定義`y := 10`=$y := 10$，$f(x)$の$x$微分`f'(x)`=$f'(x)$ほか
- 特殊文字をそのまま表示したいなら`\`でエスケープ=$\_$，`\{`=$\{$など

## コマンド：一番種類が多い

### 上付き記号

- 時間微分に使う上ドット`\dot{x}`=$\dot{x}$，複数なら`\ddot{x}`=$\ddot{x}$，`\dddot{x}`=$\dddot{x}$，三つ以上は`x^{(3)}`=$x^{(3)}$と書くのが良い
- ハット`\hat{x}`=$\hat{x}$，オブザーバの文脈で$x$の推定値を$\hat{x}$とする，など
- チルダ`\tilde{x}`=$\tilde{x}$，$x$ではないが$x$に似た何かとして使用
- オーバーバー`\overline{x}`=$\overline{x}$，アンダーも`\underline{x}`=$\underline{x}$．$x$の上限，下限など

### misc, miscellany，いずれ分類

- 分数`\frac{n}{d}`=$\frac{n}{d}$，インラインなら小さく，別行立てなら大きく表示される．大きくしたいなら`\dfrac{n}{d}`=$\dfrac{n}{d}$．単純なものなら`n/d`=$n/d$と書く．微分$\dfrac{dy}{dx}$，偏微分$\dfrac{\partial y}{\partial x}$
- 総和，総乗`\sum_{n=1}^5 n`=$\sum_{n=1}^5 n$，`\prod_{n=1}^5 n`=$\prod_{n=1}^5 n$．大きくしたいなら`\displaystyle \sum_{n=1}^5 n`=$\displaystyle \sum_{n=1}^5 n$
- 三角関数`\sin`=$\sin$，`\cos`=$\cos$，`\tan`=$\tan$，`\tanh`=$\tanh$など，普通に`sin`は$sin$で斜体になりおすすめしない
- 根ルート$\sqrt{2}$，3乗根$\sqrt[3]{2}$
- $\max$，$\min$．$\sup$，$\inf$．添字も有効で$\displaystyle \max_{x \in D}\|f(x)\|$
- 極限$f'(x)=\lim_{h\to \pm 0}\frac{f(x+h)-f(x)}{h}$
- ベクトルなどを太字にする`$\boldsymbol{x}$`
- 実数空間$\mathbb{R}$，複素空間$\mathbb{C}$，自然数空間$\mathbb{N}$
- 等号不等号$=$，$\neq$，$\leq$，$\geq$，近似等号$\approx$．2重線や点をつけた近似にもできるがおすすめしない．
- 集合の要素・元$\in$，部分集合$\subset$，等号含む$\subseteq$
- $\forall$，集合$D$に含まれる任意の$x$について，$f_1(x)=f_2(x)$を満たす．$f_1(x)=f_2(x),~\forall x\in D$
- $\alpha$，$\beta$，$\gamma$，棒が出ないファイ$\varphi$，棒が出るファイ$\phi$，[LaTeXコマンド集，ギリシャ文字](http://www.latex-cmd.com/special/greek.html)
- 丸やドット$\dots$，$\cdots$，$\vdots$，$\ddots$，$\cdot$，$\bullet$，$\circ$
- 括弧$(x)$・$[x]$・$|x|$・$\| x\|$．$\{ x\}$
- 括弧の大きさ自動調整$\left(\dfrac{n}{d}\right)$・$\left[\dfrac{n}{d}\right]$・$\left\|\dfrac{n}{d}\right\|$・$\left\{\dfrac{n}{d}\right\}$，手動調整[LaTeX入門，括弧の大きさを指定](https://medemanabu.net/latex/bracket/)．
- 未定義関数の立体`\mathrm{diag}(x)`=$\mathrm{diag}(x)$，ベクトル$x$を対角要素にもつ行列
- 広めのスペース空け$x\quad y$，$x\qquad y$
- 式内で文字を書く$xはy$．Markdownでは直接書いてしまってよい．LaTeXでは`\mbox{}`や`\text{}`

`\displaystyle`とか`\partial`とか長すぎと思ったら，LaTeXでは自作コマンドで短縮コマンドを作ることができる．既存コマンド名との衝突に注意．

## 環境：数式で使うものは少ない

行列：array，matrix，pmatrix環境もあるが個人的にはbmatrix一択．

$$
A := \begin{bmatrix}a&b\\ c&d\end{bmatrix}
$$

イコールが揃う複数行数式１：Latexでは全体に式番号が一つ付く

$$
\tag{A1} \begin{split}
\dot{x} =& f(x,~u) \\
y =& g(x)
\end{split}
$$

=が揃う複数行数式２：Latexではそれぞれに式番号が一つ付く

$$
\begin{align}
\tag{A2} \dot{x} =& f(x,~u) \\
\tag{A3} y =& g(x)
\end{align}
$$

条件わけ

$$
\tag{A4} f(x) :=
\begin{cases}
1,\quad &\mbox{if}~ x\neq 0 \\
0,\quad &\mbox{if}~ x = 0
\end{cases}
$$

別行立て数式には`\tag{数字など}`で名前を付けられます．Latexで便利な相互参照は無い様子．Latexにコピペすることを想定すると，式番号を使う場合はLatexで使用される(1)などを避け，上のようにしておけば番号が混ざらないので後で処理しやすい．Typoraは`split`へのtagは処理してくれない様子．

**注記**：本来のLatexとほんのちょっと記法が違うものがあります．LaTeXでは，`$$`は無しで`align`環境を書く．`split`環境は`$$`に対応していない場合があるので，`$$`ではなくequation環境内で使う．`equation`や`align`は自動番号付けされ，`align*`環境を使えば式番号を付けない．