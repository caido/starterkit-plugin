import type { Caido } from "@caido/sdk-frontend";
import type { API } from "starterkit-plugin-backend";

import type { PluginStorage } from "./types";

import "./styles/style.css";

type CaidoSDK = Caido<API>;

const Page = "/my-plugin" as const;
const Commands = {
  increment: "my-plugin.increment",
  decrement: "my-plugin.decrement",
  randomize: "my-plugin.randomize",
} as const;

const getCount = (sdk: CaidoSDK) => {
  const storage = sdk.storage.get() as PluginStorage | undefined;

  if (storage) {
    return storage.count;
  }

  return 0;
}

const increment = (sdk: CaidoSDK) => {
  const count = getCount(sdk);
  sdk.storage.set({ count: count + 1 });
}

const decrement = async (sdk: CaidoSDK) => {
  const count = getCount(sdk);
  sdk.storage.set({ count: count - 1 });
}

const randomize = async (sdk: CaidoSDK) => {
  const newNumber = await sdk.backend.generateNumber(0, 1000);
  sdk.storage.set({ count: newNumber });
}

const addPage = (sdk: CaidoSDK) => {

  const count = getCount(sdk);

  const body = document.createElement("div");
  body.className = "my-plugin";
  body.innerHTML = `
    <div class="my-plugin__count">
      <span>Count:</span>
      <span class="my-plugin__value">${count}</span>
    </div>
    <div>
      <button class="c-button" data-command="${Commands.increment}">Increment</button>
      <button class="c-button" data-command="${Commands.decrement}">Decrement</button>
      <button class="c-button" data-command="${Commands.randomize}">Randomize</button>
    </div>
  `;

  const countElement = body.querySelector(".my-plugin__value") as HTMLElement;
  const incrementButton = body.querySelector(`[data-command="${Commands.increment}"]`) as HTMLElement;
  const decrementButton = body.querySelector(`[data-command="${Commands.decrement}"]`) as HTMLElement;
  const randomizeButton = body.querySelector(`[data-command="${Commands.randomize}"]`) as HTMLElement;

  sdk.storage.onChange((newStorage) => {
    const storage = newStorage as PluginStorage | undefined;

    if (storage) {
      countElement.innerHTML = `${storage.count}`;
      return;
    }
  });

  incrementButton.addEventListener("click", () => {
    increment(sdk);
  });

  decrementButton.addEventListener("click", () => {
    decrement(sdk);
  });

  randomizeButton.addEventListener("click", () => {
    randomize(sdk);
  });

  sdk.navigation.addPage(Page, {
    body,
  });
}


export const init = (sdk: CaidoSDK) => {

  // Register commands
  // Commands are registered with a unique identifier and a handler function
  // The run function is called when the command is executed
  // These commands can be registered in various places like command palette, context menu, etc.
  sdk.commands.register(Commands.increment, {
    name: "Increment",
    run: () => increment(sdk),
  });

  sdk.commands.register(Commands.decrement, {
    name: "Decrement",
    run: () => decrement(sdk),
  });

  // Register command palette items
  sdk.commandPalette.register(Commands.increment);
  sdk.commandPalette.register(Commands.decrement);

  // Register page
  addPage(sdk);

  // Register sidebar
  sdk.sidebar.registerItem("My plugin", Page, {
    icon: "fas fa-rocket",
  });
}

