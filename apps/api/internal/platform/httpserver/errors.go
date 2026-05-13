package httpserver

import (
	"encoding/json"
	"errors"
	"log/slog"
	"net/http"
	"sync"
)

type mapping struct {
	status int
	code   string
}

var (
	mu       sync.RWMutex
	registry = map[error]mapping{}
)

func Register(err error, status int, code string) {
	mu.Lock()
	defer mu.Unlock()
	registry[err] = mapping{status: status, code: code}
}

type errorBody struct {
	Error struct {
		Code    string `json:"code"`
		Message string `json:"message"`
	} `json:"error"`
}

type ValidationError struct{ Message string }

func (v *ValidationError) Error() string { return v.Message }

func WriteError(w http.ResponseWriter, r *http.Request, err error) {
	mu.RLock()
	defer mu.RUnlock()

	for sentinel, m := range registry {
		if errors.Is(err, sentinel) {
			writeJSON(w, m.status, m.code, sentinel.Error())
			return
		}
	}
	var vErr *ValidationError
	if errors.As(err, &vErr) {
		writeJSON(w, http.StatusUnprocessableEntity, "VALIDATION", vErr.Message)
		return
	}
	if r != nil {
		slog.ErrorContext(r.Context(), "internal server error", "err", err.Error(), "path", r.URL.Path)
	}
	writeJSON(w, http.StatusInternalServerError, "INTERNAL", "Something went wrong.")
}

func writeJSON(w http.ResponseWriter, status int, code, msg string) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	var body errorBody
	body.Error.Code = code
	body.Error.Message = msg
	_ = json.NewEncoder(w).Encode(body)
}
