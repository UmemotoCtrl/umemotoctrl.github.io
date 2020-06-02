# Chocolateyで楽々ソフトインストール

**更新日：2020/5/9**

## Chocolateyとは

windowsでソフトをインストールするには，Webサイトから一つ一つインストーラをダウンロードし，nextを繰り返し押して待つのが常でした．Chocolateyはその苦しみからユーザを解放します．以前からありましたが対応ソフトウェアの数や安定性でやや使いにくかったものが，2020年現在では非常に高い完成度に至っています．

[Chocolatey](https://chocolatey.org/)はlinuxのapt，macOSのhomebrewに対応するパッケージ管理システムです．ソフト間の依存関係を考えながら，コマンドからサクッとソフトのインストール/アンインストール/アップデートができます．コマンドの記法はaptに準拠するように配慮されています．

## 使い方

下記は管理者権限で実行しましょう．インストール方法は割愛します．

```sh
# 一括インストール，私が使用しているソフトです．
choco install -y 7zip autohotkey tablacus cmder quicklook notepadplusplus notable evernote vlc texstudio jabref git sourcetree advanced-ip-scanner filezilla fastcopy vscode imgburn authy-desktop etcher
```

```sh
# インストール済みソフト一覧
choco list --local-only
```

```sh
# 一括アップデート，定期的に実行しましょう
choco update -y all
```

