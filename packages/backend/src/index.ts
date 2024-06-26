function multiply(a: number): number {
  return a * 5;
}

export type API = {
  multiply: typeof multiply;
};

export function init(sdk: any) {
  sdk.api.register("multiply", multiply);
}
