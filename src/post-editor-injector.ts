/*!
 * Copyright 2026, MHP Management und IT-Beratung GmbH and contributors.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Der Beitrags-Editor im Vollbild-Rahmen von `@man/config-ui`: ersetzt die
 * Auswahlliste vor dem Feld `post-id`.
 */

import * as React from "react";
import { FileText } from "lucide-react";

import { FieldModalShellOptions, startFieldModalInjector } from "@shared/config-modal";

import { postChangeStatus, validatePost } from "./post-editor-rules";

/** Das Schema-Feld, das der Editor übernimmt; der Name ist das Attribut im Block. */
const FIELD_KEY = "post-id";

/**
 * Der Editor kommt erst, wenn ein Dialog ihn zeigt: er baut auf
 * `@man/config-ui` (Radix, react-aria, Tailwind) – nichts davon gehört ins
 * Seitenbündel, das jede Leserin lädt. Hier bleibt, was der Rahmen braucht,
 * bevor der Editor da ist: Name, Icon, Status.
 */
const loadEditor = () => import("./post-editor");

const LazyPostEditor = React.lazy(() => loadEditor().then((module) => ({ default: module.PostEditor })));

/** Die Hilfe aus demselben Chunk wie der Editor. */
const LazyPostEditorHelp = React.lazy(() => loadEditor().then((module) => ({ default: module.PostEditorHelp })));

const LOADING = React.createElement("p", { className: "p-6 text-sm text-muted-foreground" }, "Editor wird geladen …");

/** Was der gemeinsame Rahmen vom Widget wissen muss; offengelegt für Tests. */
export const postEditorShell: FieldModalShellOptions<string> = {
  widgetName: "Beitrags-Anzeige",
  title: "Beitrag wählen",
  icon: FileText,
  preview: true,
  help: React.createElement(React.Suspense, { fallback: null }, React.createElement(LazyPostEditorHelp)),
  statusText: postChangeStatus,
  validate: validatePost,
};

/**
 * Watches for the widget's configuration dialog and injects the post editor
 * in front of its `post-id` field.
 *
 * Der Wert bleibt, wie er im Feld steht – eine ID oder eine Adresse: Öffnen
 * und Übernehmen ändern nichts, was die Nutzerin nicht angefasst hat. Die ID
 * liest erst der Block (`readPostId`).
 *
 * @param root the subtree to watch; defaults to the document.
 * @returns a function that stops watching and unmounts the editor.
 */
export function startPostEditorInjector(root: ParentNode = document): () => void {
  return startFieldModalInjector<string>({
    fieldKey: FIELD_KEY,
    root,
    reopenLabel: "Beitrag wählen",
    modalTestId: "post-editor-modal",
    reopenTestId: "post-editor-reopen",
    parse: (raw) => raw,
    serialize: (value) => value,
    shell: postEditorShell,
    render: ({ value, onChange }) =>
      React.createElement(React.Suspense, { fallback: LOADING }, React.createElement(LazyPostEditor, { value, onChange })),
  });
}
