# ドローンのロバスト自律制御

## 論文「Dynamic cooperative transportation control using friction forces of n multi-rotor unmanned aerial vehicles」の紹介
---

### 1. 研究の背景と目的

- ドローン（UAV）は空撮や軽い物の運搬などに使われていますが、1台では重い物を運ぶのが難しいです。
- そこで、複数台のUAVが協力して重い物を運ぶ「協調運搬」の研究が進められています。
- 既存研究の多くは2台のUAVでの運搬や、UAVに特別な装置（ロボットアームやボールジョイントなど）を付ける方法でしたが、装備が重くなったり、計算量が多くなったりして現実的な運用が難しい課題がありました。

---

### 2. 本研究の新しい提案

- 本論文では、**3台以上のUAV**が**特別な装置を使わず**、市販のUAVによく付いている「ローターガード（プロペラの周りの保護枠）」を利用して物体に接触し、**摩擦力**で物体を押したり支えたりして運ぶ方法を提案しています。
- 計算量が多い「最適化計算」を使わず、リアルタイムで多台数UAVを制御できる新しい制御アルゴリズムを開発しました。

---

### 3. 制御システムの特徴

- **2段階の制御方式**を採用しています。

1. **力の割り当て**：運ぶ物体の位置や姿勢（向き）を目標通りに動かすため、各UAVがどれくらいの力を出せばよいかを計算します。このとき、摩擦力による「滑り（スリップ）」が起きないように、割り当てる力が摩擦円錐（フリクションコーン）という条件を満たすように設計します。
2. **UAVの姿勢制御**：各UAVが自分に割り当てられた力を正確に出せるように、分散型（各UAVが独立して動く）で姿勢を制御します。ここでは外乱オブザーバ（Disturbance Observer）という手法を使い、誤差や外からの影響に強い制御を実現しています。

---

### 4. 技術的ポイント

- **摩擦円錐制約**：UAVが物体を押すとき、摩擦力が足りないと滑ってしまいます。そこで、力の割り当て時に「この範囲なら滑らない」という摩擦円錐の条件を常に守るように、冗長な自由度（余った力の方向）をうまく使って調整します。
- **リアルタイム性と拡張性**：最適化計算を使わないことで、UAVの台数が増えても計算時間が増えにくく、リアルタイムで制御可能です。
- **分散制御**：各UAVは自分の情報だけで制御できるため、通信や計算の負担が小さく、台数が多くてもスケーラブルです。

---

### 5. シミュレーション結果

- 10台のUAVで重い物体を運ぶシミュレーションを行い、提案手法の有効性を確認しました。
- **外乱オブザーバを使った制御**では、UAVの姿勢誤差が小さく、物体の位置・姿勢も正確に制御できました。
- **摩擦制約を守る滑り抑制制御**を入れると、滑りが発生せず、安定して運搬できることが確認されました。
- 既存のフィードバック線形化制御（従来手法）と比べて、より高精度で安定した運搬が可能です。

---

### 6. まとめ・意義

- 本研究は、**多台数UAVによる重い物体の協調運搬を、現実的な装備とリアルタイムな計算で実現できる新しい制御方式**を提案しています。
- 摩擦力をうまく使い、滑りを防ぎながら効率的に運搬できる点が特徴です。
- 将来的には、実際のUAVを使った実験も計画されています。

---

## 関連論文

5. Tiehua Wang, Kazuki Umemoto, Takahiro Endo, Fumitoshi Matsuno, "Modeling and Control of a Quadrotor UAV Equipped with a Flexible Arm in Vertical Plane", IEEE Access, Vol. 9, No. 1, pp.98476-98489, 2021.7, [DOI: 10.1109/ACCESS.2021.3095536](https://doi.org/10.1109/ACCESS.2021.3095536)
6. Tiehua Wang, Kazuki Umemoto, Takahiro Endo, Fumitoshi Matsuno, "Non-cascade Adaptive Sliding Mode Control for Quadrotor UAVs under Parametric Uncertainties and External Disturbance with Indoor Experiments", Journal of Intelligent and Robotic Systems, Vol. 102, No. 8, pp.1-21, 2021.4, [DOI: 10.1007/s10846-021-01351-z](https://doi.org/10.1007/s10846-021-01351-z)
8. Kazuki Umemoto, Takahiro Endo, Fumitoshi Matsuno, "Dynamic cooperative transportation control using friction forces of n multi-rotor unmanned aerial vehicles", Journal of Intelligent and Robotic Systems, Vol. 100, No. 1, pp.1085-1095, 2020.5, [DOI: 10.1007/s10846-020-01212-1](https://doi.org/10.1007/s10846-020-01212-1)
13. Tiehua Wang, Kazuki Umemoto, Takahiro Endo, Fumitoshi Matsuno, "Dynamic hybrid position/force control for the quadrotor with a multi-degree-of-freedom manipulator", Artificial Life and Robotics, Vol. 24, No. 1, pp.378-389, 2019.2, [DOI: 10.1007/s10015-019-00534-0](https://doi.org/10.1007/s10015-019-00534-0)
18. 梅本 和希, 池田 拓也, 松野 文俊, "スライディングモード制御によるマルチロータ型UAVのロバスト追従制御", 計測自動制御学会論文集, Vol. 50, No. 2, pp.170-176, 2014.2, [DOI: 10.9746/sicetr.50.170](https://doi.org/10.9746/sicetr.50.170)
