function firstText(...values) {
  return values.find((value) => typeof value === "string" && value.trim()) || "";
}

export function localizedPlugin(plugin, lang, translations = {}) {
  const translation = lang === "en" ? translations.plugins?.[plugin.id] || {} : {};
  const descriptions = plugin.description_i18n || {};

  const description = lang === "en"
    ? firstText(
        descriptions.en,
        translation.description,
        plugin.description,
        descriptions.zh,
      )
    : firstText(
        descriptions.zh,
        plugin.description,
        descriptions.en,
        translation.description,
      );

  return {
    ...plugin,
    description,
    name: translation.name || plugin.name,
    usage: translation.usage || plugin.usage,
    privacy_notes: Array.isArray(translation.privacy_notes)
      ? translation.privacy_notes
      : plugin.privacy_notes,
    security_notes: Array.isArray(translation.security_notes)
      ? translation.security_notes
      : plugin.security_notes,
  };
}
