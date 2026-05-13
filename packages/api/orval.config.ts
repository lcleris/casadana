import { defineConfig } from "orval"

export default defineConfig({
  casadana: {
    input: {
      target: "../../apps/api/internal/openapi/openapi.yaml",
    },
    output: {
      mode: "tags-split",
      target: "src/generated/index.ts",
      schemas: "src/generated/schemas",
      client: "react-query",
      httpClient: "axios",
      indexFiles: true,
      prettier: false,
      override: {
        mutator: {
          path: "./src/client.ts",
          name: "customAxios",
        },
        useTypeOverInterface: true,
        query: {
          useQuery: true,
          useMutation: true,
          signal: true,
        },
      },
    },
  },
})
