import express from "express";
import config from "config";
import { HookEvent, LinkOptions } from "./types";
import {
  closeMenu,
  generatHookUrl,
  webHookConfig,
  webHookMessage,
} from "./events";

const app = express();
app.use(express.json());

// Entrypoint for every events comming from Twake
app.post(config.get("server.prefix") + "/hook", async (req, res) => {
  const event = req.body as HookEvent;
  if (event.type === "action" && event.name === "open") {
    //Open Webhooks guide
    return res.send(await webHookConfig(event));
  } else if (
    event.type === "interactive_message_action" &&
    event.name === "generate"
  ) {
    //Generate the hook URL
    return res.send(await generatHookUrl(event));
  } else if (
    event.type === "interactive_message_action" &&
    event.name === "close"
  ) {
    //Close ephemeral message
    return res.send(await closeMenu(event));
  }
});

app.post(
  config.get("server.prefix") + "/my/webhook/plugins/hook",
  async (req, res) => {
    const event = req.body as HookEvent;
    const params = req.query as LinkOptions;
    return res.send(await webHookMessage(event, params));
  }
);

const port = config.get("server.port");
app.listen(port, (): void => {
  console.log(`Plugin started on port ${port}`);
});
