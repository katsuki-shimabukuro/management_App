# Goの公式イメージを使う
FROM golang:1.22

# 作業ディレクトリを作成
WORKDIR /app

# ソースコードを全部コピー
COPY . .

RUN go build -o server .
RUN apt-get update && apt-get install -y libsqlite3-dev

EXPOSE 8080

CMD ["./server"]
