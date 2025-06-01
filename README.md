# 課題管理アプリ
## システム構成図 
<img width="300" alt="image" src="https://github.com/user-attachments/assets/3a992541-f173-40b8-8b47-d0a4fb8504c5" />

## 背景  
各課題の管理を下図のようにexcelで表を作成し、チェックボックスにより管理を行っていた。  
しかし、表のみでは、期限がわからないため、別で確認する必要があったり、作成途中などの現在の状況把握まではできない。  
また、半期ごとにexcelの作成が必要であり、手間のかかる作業となる。  
そこで、期限の確認と現在の状態管理、そして表の作成が簡単にできるようにするために、これらの機能を搭載したwebアプリを作成した。  
これにより、全体の把握が容易になるため、出し忘れの防止や、余裕を持った行動を行うことができることを期待している。   

<img width="842" alt="image" src="https://github.com/user-attachments/assets/87a5ec00-b326-4067-b8dc-5a47a24756ec" />  

## 目的  
タスク管理を科目ごとに期限等を把握できるページと、それをもとに表により一括管理ができるページを作成するwebアプリを作成することを目的とする。  

## サービス概要  
* タスク管理を目的にする人向けに、課題管理を一括で行えるタスク一覧および表を作成。  
* 期限、状態を一括で管理可能。  

## 画像イメージ  
<img width="300" alt="image" src="https://github.com/user-attachments/assets/eb96ecca-d00b-4ece-90e8-5f8dd154ca1f" />
<img width="300" alt="image" src="https://github.com/user-attachments/assets/e7d73615-596e-46b6-a13d-ad0aafe93aff" />  


## 動作イメージ   
https://github.com/user-attachments/assets/1ef53257-6330-4bb6-985e-81f3bb481d27  

## 機能  
0:00-0:34  
* ホーム画面から追加ページに遷移。追加ページでは、「項目名」(必須), 「授業回数」(必須), 「備考」が入力できる。  
* 追加ボタンを押すとホーム画面に戻り、ホーム画面では授業回数分のタスクが表示される。

0:35-0:55  
* 管理リスト画面に遷移すると、項目が縦軸、授業回数が横軸の表が作成されている。また、授業回数分のチェックボックスが表示される。
* ホーム画面でチェックボックスにチェックが入ると管理リスト側にもチェックが入る。このとき、ホーム画面では、チェックが入ったタスクは末尾に移動させる。

0:56-1:40     
* 各タスクの「期限設定」ボタンより、タスクの期限を設定できる。保存を押すと、備考の下に期限が、タスク中央に残り時間が表示される仕様となっている。  
* 複数のタスクで期限が設定された場合は、残る期限が早い順にソートされる。
* チェックを入れずに、残り時間が0を切ると「Time Over」が表示される。チェックをいれると、残り時間に限らず「clear」が表示される。  

1:40-1:55  
* 項目名は検索ができる仕様となっている。
* 項目名もしくは授業回数で検索することで絞り込みが可能となっている。  

## 環境構築  
※ すでにwsl, npm, dockerはインストールされている。

1. リポジトリをクローン
 ```
 git clone https://github.com/katsuki-shimabukuro/management_App.git
 ```

2. dockerのbuildおよび起動  
`docker compose up --build`  
or  
起動のみ：`docker compose up`  
  
* 以下は環境構築で行った手順だが、メモ用。上記1,2のみでよい。  
1. viteによるプロジェクト(frontendフォルダ)の作成  
```
npm create vite@latest frontend -- --template react-ts  
cd frontend  
npm install
```

2. Tailwind CSSのインストールと設定  
```
npm install tailwindcss @tailwindcss/vite  
npm install tailwindcss @tailwindcss/cli  
ls -l node_modules/.bin  
```
* cloneしてる場合3は以上で4に移る。下記はその後の通常のインストール方法  
* 適当なinput.css(空でよい)を作成し`npx tailwindcss build input.css -o output.css`を実行  
  cli,ls,npxのほうは、nodemodules/.binにtailwindcssを入れるために実行している。  
* 上記実行後、vite.config.tsに下記編集を加える  
![alt text](image.png)  
* 次にindex.cssに下記を加える（実施済み）
![alt text](image-1.png) 

参照：  
〈公式〉https://tailwindcss.com/docs/installation/using-vite  
https://zenn.dev/mishima3141/articles/65668245241953  
https://qiita.com/shirokurotaitsu/items/732d2782048859a5a672  
https://www.youtube.com/watch?v=xExL5DnP_lA  

## ER図  
<img width="100" alt="image" src="https://github.com/user-attachments/assets/1c40ce20-dbe6-477f-bc90-98a17196a333" />  

## API仕様書  

