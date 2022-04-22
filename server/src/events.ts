import { v4 as uuidv4 } from "uuid";
import fetch from "node-fetch";
import { HookEvent, LinkOptions } from "./types";
import { getAccessToken } from "./utils";
import { generateHookUrl, generateConfirmMsg, formatMessage } from "./messages";
import config from "config";
import jwt from "jsonwebtoken";

export const closeMenu = async (event: HookEvent) => {
  const deletedMessage = event.content.message;
  deletedMessage.subtype = "deleted";
  deletedMessage.id = undefined;
  await sendMessage(deletedMessage, {
    company_id: event.content.message.context.company_id,
    workspace_id: event.content.message.context.workspace_id,
    channel_id: event.content.message.context.channel_id,
  });
};

export const webHookMessage = async (event: HookEvent, params: LinkOptions) => {
  const context = jwt.decode(params.context) as LinkOptions;
  const msg = {
    subtype: "application",
    override: {
      title: event.title ? event.title : params.name,
      picture: event.icon ? event.icon : params.icon,
    },
    blocks: formatMessage(event),
    user_id: context.user_id,
    context: { allow_delete: "everyone" },
  };
  await sendMessage(msg, {
    company_id: context.company_id,
    workspace_id: context.workspace_id,
    channel_id: context.channel_id,
    thread_id: context.thread_id,
  });
};

export const webHookConfig = async (event: HookEvent) => {
  const msg = {
    subtype: "application",
    blocks: generateConfirmMsg(event.content.user),
    ephemeral: {
      id: event.content.thread?.id || "",
      recipient: event.user_id,
      recipient_context_id: event.connection_id,
    },
    context: {
      company_id: event.content.channel.company_id,
      workspace_id: event.content.channel.workspace_id,
      channel_id: event.content.channel.id,
    },
  };

  await sendMessage(msg, {
    company_id: event.content.channel.company_id,
    workspace_id: event.content.channel.workspace_id,
    channel_id: event.content.channel.id,
    thread_id: event.content.thread?.id || undefined,
  });
};

export const generatHookUrl = async (event: HookEvent) => {
  const linkOptions: LinkOptions = {
    company_id: event.content.message.cache.company_id,
    workspace_id: event.content.message.cache.workspace_id,
    channel_id: event.content.message.cache.channel_id,
    user_id: event.user_id || "",
    thread_id: event.content.message.ephemeral.id,
    icon: event.content.form?.webHookIcon
      ? event.content.form.webHookIcon
      : undefined,
    name: event.content.form?.webHookName
      ? event.content.form.webHookName
      : undefined,
  };

  const msg = {
    subtype: "application",
    blocks: generateHookUrl(event.content.user, linkOptions),
    ephemeral: {
      id: uuidv4(),
      recipient: event.user_id,
      recipient_context_id: event.connection_id,
    },
    override: {
      title: linkOptions.name,
      picture: linkOptions.icon,
    },
    context: {
      company_id: event.content.message.cache.company_id,
      workspace_id: event.content.message.cache.workspace_id,
      channel_id: event.content.message.cache.channel_id,
    },
  };

  await sendMessage(msg, {
    company_id: event.content.message.cache.company_id,
    workspace_id: event.content.message.cache.workspace_id,
    channel_id: event.content.message.cache.channel_id,
  });
};

//Send message
const sendMessage = async (
  message: any,
  options: {
    company_id: string;
    workspace_id: string;
    channel_id: string;
    thread_id?: string;
  }
) => {
  const url =
    config.get("credentials.endpoint") +
    (options.thread_id
      ? `/api/messages/v1/companies/${options.company_id}/threads/${options.thread_id}/messages`
      : `/api/messages/v1/companies/${options.company_id}/threads`);

  let data: any = {
    resource: message,
  };
  if (!options.thread_id) {
    data = {
      resource: {
        participants: [
          {
            type: "channel",
            id: options.channel_id,
            company_id: options.company_id,
            workspace_id: options.workspace_id,
          },
        ],
      },
      options: {
        message,
      },
    };
  }

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${await getAccessToken()}`,
      },
      body: JSON.stringify(data),
    });
    return await res.json();
  } catch (err) {
    console.log(err);
    return null;
  }
};
