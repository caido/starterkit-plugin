import type { Caido } from "@caido/sdk-frontend";

import type { PluginStorage } from "./types";

const Page = "/my-plugin" as const;
const Commands = {
  increment: "my-plugin.increment",
  decrement: "my-plugin.decrement",
} as const;

const getCount = (caido: Caido) => {
  const storage = caido.storage.get() as PluginStorage | undefined;

  if (storage) {
    return storage.count;
  }

  return 0;
}

const increment = (caido: Caido) => {
  const count = getCount(caido);
  caido.storage.set({ count: count + 1 });
}

const decrement = (caido: Caido) => {
  const count = getCount(caido);
  caido.storage.set({ count: count - 1 });
}

const addPage = (caido: Caido) => {

  const count = getCount(caido);

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
    </div>
  `;

  const countElement = body.querySelector(".my-plugin__value") as HTMLElement;
  const incrementButton = body.querySelector(`[data-command="${Commands.increment}"]`) as HTMLElement;
  const decrementButton = body.querySelector(`[data-command="${Commands.decrement}"]`) as HTMLElement;

  caido.storage.onChange((newStorage) => {
    const storage = newStorage as PluginStorage | undefined;

    if (storage) {
      countElement.innerHTML = `${storage.count}`;
      return;
    }
  });

  incrementButton.addEventListener("click", () => {
    increment(caido);
  });

  decrementButton.addEventListener("click", () => {
    decrement(caido);
  });

  caido.navigation.addPage(Page, {
    body,
  });
}


export const init = (caido: Caido) => {

  // Register commands
  // Commands are registered with a unique identifier and a handler function
  // The run function is called when the command is executed
  // These commands can be registered in various places like command palette, context menu, etc.
  caido.commands.register(Commands.increment, {
    name: "Increment",
    run: () => increment(caido),
  });

  caido.commands.register(Commands.decrement, {
    name: "Decrement",
    run: () => decrement(caido),
  });

  // Register command palette items
  caido.commandPalette.register(Commands.increment);
  caido.commandPalette.register(Commands.decrement);

  // Register page
  addPage(caido);

  // Register sidebar
  caido.sidebar.registerItem("My plugin", Page, {
    icon: "fas fa-rocket",
  });
}

