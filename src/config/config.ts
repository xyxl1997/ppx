export class Config {
    public static isProd = false;
    public static get url() {
      return Config.isProd ? "/api" : "https://www.ppx26.com"
    }
}