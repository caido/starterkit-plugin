import { Caido } from "@caido/sdk-frontend";
import { helper } from "./helper";

Caido.commands.register("my-sample-command", {
  name: "My Sample Command",
  run: () => {
    helper();
  },
});

Caido.commandPalette.register("my-sample-command");
