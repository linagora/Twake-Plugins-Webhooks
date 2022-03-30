import { HookEvent, LinkOptions } from "./types";
import { t } from "./i18n";
import config from "config";

export const generateHookUrl = (
  user: HookEvent["content"]["user"],
  linkOptions: LinkOptions
) => {
  const lang = user?.preferences.locale || "";
  return [
    {
      type: "twacode",
      elements: [
        {
          type: "system",
          content: t(lang, "new_url"),
        },
        {
          type: "copiable",
          user_identifier: true,
          content: `${config.get(
            "server.endpoint"
          )}/my/webhook/plugins/hook?company_id=${
            linkOptions.company_id
          }&workspace_id=${linkOptions.workspace_id}&channel_id=${
            linkOptions.channel_id
          }${
            linkOptions.thread_id ? `&thread_id=${linkOptions.thread_id}` : ""
          }&user_id=${linkOptions.user_id}&name=${linkOptions.name}&icon=${
            linkOptions.icon
          }`,
        },
        { type: "br" },
        {
          type: "button",
          style: "default",
          action_id: "close",
          content: t(lang, "close"),
        },
      ],
    },
  ];
};

export const generateConfirmMsg = (user: HookEvent["content"]["user"]) => {
  const lang = user?.preferences.locale || "";
  return [
    {
      type: "twacode",
      elements: [
        {
          type: "system",
          content: t(lang, "webhook_name"),
        },
        { type: "br" },
        {
          type: "input",
          passive_id: "webHookName",
        },
        { type: "br" },
        {
          type: "system",
          content: t(lang, "copy_url"),
        },
        { type: "br" },
        {
          type: "input",
          passive_id: "webHookIcon",
        },
        { type: "br" },

        {
          type: "button",
          style: "default",
          action_id: "close",
          content: t(lang, "close"),
        },
        {
          type: "button",
          action_id: "generate",
          content: t(lang, "generate_url"),
        },
      ],
    },
  ];
};

export const formatMessage = (body: HookEvent) => {
  if (
    typeof body === "object" &&
    body.content &&
    typeof body.content === "string"
  ) {
    return [
      {
        type: "twacode",
        elements: [
          {
            type: "compile",
            content: body.content,
          },
        ],
      },
    ];
  } else if (typeof body === "object" && Object.keys(body).length === 1) {
    return [
      {
        type: "twacode",
        elements: [
          {
            type: "compile",
            content: Object.values(body)[0],
          },
        ],
      },
    ];
  } else {
    return [
      {
        type: "twacode",
        elements: [
          {
            type: "mcode",
            content: JSON.stringify(body, null, " ")
              .replace(/\{/g, " ")
              .replace(/\"/g, " ")
              .replace(/\}/g, " ")
              .replace(/\,/g, " "),
          },
        ],
      },
    ];
  }
};
