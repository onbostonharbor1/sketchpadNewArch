/* settings/settings.js
   ============================================================
   Reading and changing settings (SETTINGS.md ST-2 to ST-8).
   ============================================================
   Values are kept in one object, settingsState.values, holding only the
   values that differ from the defaults. setting(name) gives the value
   in force: the stored one, or the schema's default. A name not in the
   schema is an error (it is a mistake in the code, not a setting).

   For document-scope settings, a document carries its own values
   (doc.settings); documentSetting(doc, name) reads them, falling back to
   the application value.

   loadSettings(values) and the values themselves come from the service
   (library/settings.json); this file does no input or output, so tests
   can set values freely.

   Exports:
     settingsState              the one state object (values, unused)
     setting(name)              the value in force
     documentSetting(doc, name) a document's own value, or the app value
     setSetting(name, value)    change one; the default removes it
     loadSettings(values)       take values read from the file
     storedValues()             what to write to the file
   ============================================================ */

import { SCHEMA } from "./schema.js";

export const settingsState = {
  values: {},          // name -> value, only those that differ from the default
  unused: {}           // values in the file for names no longer in the schema (ST-8)
};

export function setting(name) {
  const def = SCHEMA[name];
  if (!def) throw new Error("setting: no setting named " + name);
  return name in settingsState.values ? settingsState.values[name] : def.default;
} // end setting

export function documentSetting(doc, name) {
  if (doc && doc.settings && name in doc.settings) return doc.settings[name];
  return setting(name);
} // end documentSetting

export function setSetting(name, value) {
  const def = SCHEMA[name];
  if (!def) throw new Error("setSetting: no setting named " + name);
  if (value === def.default) delete settingsState.values[name];
  else settingsState.values[name] = value;
} // end setSetting

export function loadSettings(values = {}) {
  settingsState.values = {};
  settingsState.unused = {};
  for (const [name, value] of Object.entries(values)) {
    if (SCHEMA[name]) settingsState.values[name] = value;
    else settingsState.unused[name] = value;       // kept, ignored, listed (ST-8)
  }
} // end loadSettings

export function storedValues() {
  return { ...settingsState.unused, ...settingsState.values };
} // end storedValues

// end settings.js
