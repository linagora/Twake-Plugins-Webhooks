import express from "express";
import config from "config";
import { HookEvent, LinkOptions } from "./types";
import {
  closeMenu,
  generatHookUrl,
  webHookConfig,
  webHookMessage,
} from "./events";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const prefix_conf = config.get("server.prefix");
const prefix =
  (prefix_conf ? "/" : "") +
  ((prefix_conf || "") as string).replace(/(^\/|\/$)/g, "");

const app = express();
app.use(express.json());

app.use(prefix + "/assets", express.static(__dirname + "/../assets"));

// Entrypoint for every events comming from Twake
app.post(prefix + "/hook", async (req, res) => {
  const event = req.body as HookEvent;

  const signature = req.headers["x-twake-signature"];

  const expectedSignature = crypto
    .createHmac("sha256", config.get("credentials.secret"))
    .update(JSON.stringify(req.body))
    .digest("hex");

  if (signature !== expectedSignature) {
    res.status(403).send({ error: "Wrong signature" });
    return;
  }
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

app.post(prefix + "/hook/send", async (req, res) => {
  const event = req.body as HookEvent;
  const params = req.query as LinkOptions;

  const token: string = params.context;

  try {
    jwt.verify(token, (config.get("credentials.secret") as string).toString());
  } catch (err) {
    res.status(401).send("Unauthorized");
    return;
  }
  return res.send(await webHookMessage(event, params));
});

const port = config.get("server.port");
app.listen(port, (): void => {
  console.log(`Plugin started on port ${port}`);
});
