# 課題管理アプリ
* 課題をlistを利用し管理するアプリを作る。
* フロント：react(Typescript), バック：Go

## 環境構築  
※ すでにwsl, npm, dockerはインストールされている。

1. viteによるプロジェクト(frontendフォルダ)の作成  
`npm create vite@latest frontend -- --template react-ts`  
`cd frontend`    
`npm install`  

2. Dockerfileおよびdocker-compose.ymlは各フォルダ参照  

3. dockerのbuildおよび起動  
`docker compose up --build`  
or  
起動のみ：`docker compose up`   