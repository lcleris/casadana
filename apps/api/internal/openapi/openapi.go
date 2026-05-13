// Package openapi serves the API's OpenAPI 3.0.3 specification and a
// Swagger UI page that browses it.
//
//   - GET /api/openapi.yaml  → raw spec
//   - GET /api/docs           → Swagger UI HTML (loads /api/openapi.yaml)
package openapi

import (
	_ "embed"
	"net/http"

	"github.com/go-chi/chi/v5"
)

//go:embed openapi.yaml
var Spec []byte

const swaggerHTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Casa Dana API — Docs</title>
  <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css" />
  <style>body { margin: 0; }</style>
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js" crossorigin></script>
  <script>
    window.addEventListener("load", () => {
      window.ui = SwaggerUIBundle({
        url: "/api/openapi.yaml",
        dom_id: "#swagger-ui",
        deepLinking: true,
        layout: "BaseLayout",
      });
    });
  </script>
</body>
</html>`

func Mount(r chi.Router) {
	r.Get("/api/openapi.yaml", func(w http.ResponseWriter, _ *http.Request) {
		w.Header().Set("Content-Type", "application/yaml; charset=utf-8")
		_, _ = w.Write(Spec)
	})
	r.Get("/api/docs", func(w http.ResponseWriter, _ *http.Request) {
		w.Header().Set("Content-Type", "text/html; charset=utf-8")
		_, _ = w.Write([]byte(swaggerHTML))
	})
}
