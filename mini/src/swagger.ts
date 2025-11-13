import SwaggerUI from "swagger-ui";
import "swagger-ui/dist/swagger-ui.css";

(SwaggerUI as any)({
  url: "/openapi.json",
  dom_id: "#swagger",
});
