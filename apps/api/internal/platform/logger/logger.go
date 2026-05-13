package logger

import (
	"log/slog"
	"os"
	"strings"
)

func New(level string) *slog.Logger {
	var lvl slog.Level
	switch strings.ToLower(level) {
	case "debug":
		lvl = slog.LevelDebug
	case "warn":
		lvl = slog.LevelWarn
	case "error":
		lvl = slog.LevelError
	default:
		lvl = slog.LevelInfo
	}
	h := slog.NewJSONHandler(os.Stdout, &slog.HandlerOptions{
		Level:       lvl,
		ReplaceAttr: redactSensitive,
	})
	return slog.New(h)
}

var sensitiveKeys = map[string]struct{}{
	"password":      {},
	"token":         {},
	"authorization": {},
	"jwt":           {},
	"secret":        {},
}

func redactSensitive(_ []string, a slog.Attr) slog.Attr {
	if _, sensitive := sensitiveKeys[strings.ToLower(a.Key)]; sensitive {
		return slog.String(a.Key, "[REDACTED]")
	}
	return a
}
