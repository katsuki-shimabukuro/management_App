# Goの公式イメージを使う
FROM golang:1.22

# 作業ディレクトリを作成
WORKDIR /app

# Go Modulesを使う場合のため、go.modとgo.sumだけ先にコピー（なければ無視してOK）
# COPY go.mod go.sum ./
COPY go.mod ./
RUN go mod download

# ソースコード全部コピー
COPY . .

# コンテナ起動時に実行するコマンド
CMD ["go", "run", "main.go"]
