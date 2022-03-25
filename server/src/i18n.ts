const defaultLanguage = "en";
const locales: any = {
  en: {
    close: "Close",
    generate_url: "Generate URL",
    copy_url: "Copy the icon URL you want to use for this Webhook",
    webhook_name: "What is the name of your Webhook ?",
    new_url: "This is your new webhook URL",
  },
  fr: {
    close: "Fermer",
    generate_url: "Générer l'URL",
    copy_url:
      "Copier l'URL de l'icône que vous souhaitez utiliser pour ce Webhook",
    webhook_name: "Quel est le nom de votre Webhook ?",
    new_url: "Voici la nouvelle URL pour votre webhook",
  },
};

export const t = (language: string, key: string, variables: string[] = []) => {
  let str = locales[language][key] || locales[defaultLanguage][key] || key;
  variables.forEach((v, i) => (str = str.replace("@" + (i + 1), v)));
  return str;
};
