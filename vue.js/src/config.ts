export type Environment = "development" | "production";
export class Configuration {
  env: Environment = process.env?.NODE_ENV ?? "development";
  get remoteApi() {
    const apiPrefix = "/anime-api";
    if (this.env === "production") {
      return "https://kitsu.io/api/edge";
    }
    return apiPrefix;
  }
}
export default new Configuration();
