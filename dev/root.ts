import {Injectable} from "brit";
import {CoreModule} from "../src/lib/core-module";

@Injectable()
export class Root {

  constructor(
    private _core: CoreModule
  ) {
    this._core.runServer();
  }

}
