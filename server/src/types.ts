export type HookEvent = {
  type: "action" | "interactive_message_action" | "hook";
  name?: string;
  connection_id?: string;
  user_id?: string;
  title?: string;
  icon?: string;
  content: {
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
    };
  };
};

export type LinkOptions = {
  company_id: string;
  workspace_id: string;
  channel_id: string;
  user_id: string;
  context?: any;
  thread_id?: string;
  name?: string;
  icon?: string;
};
