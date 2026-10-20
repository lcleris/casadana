// Package contractapi is the Go side of the oRPC contract in packages/contract:
// types and a chi strict-server interface generated from the spec it emits.
package contractapi

//go:generate go run github.com/oapi-codegen/oapi-codegen/v2/cmd/oapi-codegen@v2.8.0 -generate types,chi-server,strict-server -package contractapi -o api.gen.go ../openapi/contract.json
