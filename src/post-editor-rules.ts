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
 * Die Regeln des Beitrags-Editors ohne Oberfläche: Suche in der Liste, Prüfung
 * der Eingabe, Text am Status. Der Entwurf ist der Wert des Feldes selbst, so
 * wie er im Studio steht – eine ID oder eine Adresse –, damit Öffnen und
 * Übernehmen ihn nicht verändern.
 */

import type { ValidationIssue } from "@man/config-ui/shell/shell-context";
import { readPostId } from "@shared/staffbase/posts";

import type { PostOption } from "./post-catalog";

/** Die Beiträge, deren Titel oder Unterzeile den Suchtext enthalten. */
export function filterPosts(options: readonly PostOption[], query: string): PostOption[] {
  const needle = query.trim().toLocaleLowerCase();
  if (needle === "") return [...options];
  return options.filter((option) => `${option.title} ${option.meta}`.toLocaleLowerCase().includes(needle));
}

/** Kennung des Eingabefelds, an der die Prüfung hängt. */
export const POST_ID_ISSUE = "post-id";

/**
 * Eine Eingabe, aus der sich keine ID lesen lässt, würde im Block den Hinweis
 * „Keine Beitrags-ID konfiguriert“ zeigen. Leer bleibt erlaubt, so war es
 * schon immer: der Block meldet es selbst.
 */
export function validatePost(draft: string): readonly ValidationIssue[] {
  if (draft.trim() === "" || readPostId(draft) !== null) return [];
  return [{ id: POST_ID_ISSUE, message: "Aus der Eingabe lässt sich keine Beitrags-ID lesen." }];
}

/** Was am Status steht, solange der Entwurf vom übernommenen Stand abweicht. */
export function postChangeStatus(draft: string, saved: string): string | undefined {
  if (draft === saved) return undefined;
  return readPostId(draft) === null ? "Beitrag entfernt" : "Beitrag gewählt";
}
