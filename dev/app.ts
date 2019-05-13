import {getInjectorManager, InjectableProvider, Provider} from "brit";
import {CoreModuleConfig} from "../src/lib/core-module-config";
import {Root} from "./root";

@InjectableProvider(CoreModuleConfig)
export class CoreModuleConfigProvider implements Provider<CoreModuleConfig> {
  provide(): CoreModuleConfig {
    const config = new CoreModuleConfig();
    config.name = 'Core Module Development';
    config.port = 4000;
    return config;
  }

}

getInjectorManager()
  .getInjector()
  .injectFor<Root>(Root)
  .then(() => {})
  .catch(err => {
    console.error(err);
  });
