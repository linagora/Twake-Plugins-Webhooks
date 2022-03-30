export type HookEvent = {
  type: "action" | "interactive_message_action" | "hook";
  name?: string;
  connection_id?: string;
  user_id?: string;
  title?: string;
  icon?: string;
  content: {
    command?: string;
    channel?: any;
    thread?: any;
    message?: any;
    form?: {
      webHookName: string;
      webHookIcon: string;
    };
    user?: {
      preferences: {
        locale: string;
      };
      first_name: string;
      last_name: string;
    };
    text?: string;
  };
};

export type LinkOptions = {
  company_id: string;
  workspace_id: string;
  channel_id: string;
  user_id: string;
  thread_id?: string;
  name?: string;
  icon?: string;
};
