import envConfig from "../../env/.env.config";
import envDefault from "../../env/.env.default";
import envLocal from "../../env/.env.local";
import envStagging from "../../env/.env.stagging";
import envProduction from "../../env/.env.production";
import priorityEnv from "../../env/.env";

const { DEV_MODE } = envConfig;
const NODE_ENV = __DEV__ ? "dev" : "prod";

const env = Object.assign(
  {},
  envDefault,
  NODE_ENV === "prod"
    ? envProduction
    : DEV_MODE === "stagging"
    ? envStagging
    : envLocal,
  priorityEnv
);

const config = {
  NODE_ENV,
  DEV_MODE,

  apiUrl: env.REACT_APP_API_URL,
  appname: env.REACT_APP_APP_NAME,
};

export default config;
