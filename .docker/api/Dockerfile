FROM golang:1.26-alpine AS builder

WORKDIR /app

COPY apps/api/go.mod apps/api/go.sum ./
RUN go mod download

COPY apps/api .

RUN CGO_ENABLED=0 GOOS=linux go build -o bin/server ./cmd/server

FROM scratch

COPY --from=builder /app/bin/server /server

EXPOSE 8080

ENTRYPOINT ["/server"]
