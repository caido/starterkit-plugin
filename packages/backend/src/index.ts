import { Body } from "caido:utils";
import { SDK, DefineAPI } from "caido:plugin";

function multiply(sdk: SDK, a: Date, b: number): number {
  sdk.console.log(new Body("test")); // Example from utils
  return a * b;
}

export type API = DefineAPI<{
  multiply: typeof multiply;
}>;

export function init(sdk: SDK) {
  sdk.api.register("multiply", multiply);
}
