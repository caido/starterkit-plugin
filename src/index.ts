import type { Caido } from "@caido/sdk-frontend";
import { helper } from "./helper";

export const init = (caido: Caido) => {
  caido.commands.register("my-sample-command", {
    name: "My Sample Command",
    run: () => {
      helper();
    },
  });

  caido.commandPalette.register("my-sample-command");
}

