import os from "os"
import path from "path"
import { defineConfig } from "drizzle-kit"

export default defineConfig({
  dialect: "sqlite",
  schema: ["./src/**/*.sql.ts", "./src/**/sql.ts"],
  out: "./migration",
  dbCredentials: {
    url: path.join(os.homedir(), ".local/share/apexo/apexo.db"),
  },
})
