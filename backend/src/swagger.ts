import swaggerJSDoc from "swagger-jsdoc";

export const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: "3.1.0",
    info: { title: "Polity API", version: "1.0.0" },
    components: {
      securitySchemes: {
        ApiKey: { type: "apiKey", in: "header", name: "x-api-key" },
        ApiSecret: { type: "apiKey", in: "header", name: "x-api-secret" },
      },
      schemas: {
        Law: {
          type: "object",
          properties: {
            key: { type: "string", description: "bytes32 hex" },
            cid: { type: "string", description: "CIDv1 string" },
            sha256Hex: { type: "string" },
            version: { type: "integer" },
            uri: { type: "string" },
          },
          required: ["key", "cid", "sha256Hex", "version", "uri"],
        },
        ConsentStatus: {
          type: "object",
          properties: {
            user: { type: "string" },
            lawKey: { type: "string" },
            accepted: { type: "boolean" },
            acceptedVersion: { type: "integer", nullable: true },
            currentVersion: { type: "integer" },
          },
          required: ["user", "lawKey", "accepted", "currentVersion"],
        },
        AcceptWithSigRequest: {
          type: "object",
          properties: {
            user: { type: "string" },
            lawKey: { type: "string" },
            deadline: { type: "string", format: "date-time" },
            signature: { type: "string", description: "EIP-712 signature" },
          },
          required: ["user", "lawKey", "deadline", "signature"],
        },
      },
    },
    security: [{ ApiKey: [], ApiSecret: [] }],
  },
  apis: ["src/routes/**/*.ts"], // where JSDoc route blocks live
});
