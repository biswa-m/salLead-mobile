import envConfig from "../../env/.env.config";
import envDefault from "../../env/.env.default";
import envLocal from "../../env/.env.local";
import envStagging from "../../env/.env.stagging";
import envProduction from "../../env/.env.production";

const { DEV_MODE } = envConfig;
const NODE_ENV = __DEV__ ? "dev" : "prod";

const env = Object.assign(
  {},
  envDefault,
  NODE_ENV === "prod"
    ? envProduction
    : DEV_MODE === "stagging"
    ? envStagging
    : envLocal
);

const config = {
  NODE_ENV,
  DEV_MODE,

  apiUrl: env.apiUrl,

  initialLocation: { locationid: 1861, city: "Maryland", state: "NY" },
  //  {locationid: 1853, city: "New York", state: "NY"}
};

export default config;
