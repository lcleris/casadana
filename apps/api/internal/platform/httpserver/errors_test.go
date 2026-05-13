package httpserver

import (
	"errors"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
)

var errSentinel = errors.New("test: sentinel")

func TestWriteError_KnownStatus(t *testing.T) {
	Register(errSentinel, http.StatusConflict, "TEST_CONFLICT")

	rec := httptest.NewRecorder()
	WriteError(rec, nil, errSentinel)

	if rec.Code != http.StatusConflict {
		t.Fatalf("status = %d, want %d", rec.Code, http.StatusConflict)
	}
	body := rec.Body.String()
	if !strings.Contains(body, `"code":"TEST_CONFLICT"`) {
		t.Errorf("body = %q, missing code", body)
	}
}

func TestWriteError_UnknownDefaultsTo500(t *testing.T) {
	rec := httptest.NewRecorder()
	WriteError(rec, nil, errors.New("boom"))
	if rec.Code != http.StatusInternalServerError {
		t.Fatalf("status = %d, want 500", rec.Code)
	}
	if strings.Contains(rec.Body.String(), "boom") {
		t.Error("internal error message leaked to client")
	}
}
