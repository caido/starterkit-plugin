const m = window.Caido, e = () => {
  alert("Hello world");
};
m.commands.register("my-sample-command", {
  name: "My Sample Command",
  run: () => {
    e();
  }
});
m.commandPalette.register("my-sample-command");
