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

import * as React from "react";
import { ReactElement, useEffect, useMemo, useRef, useState } from "react";

import { Field } from "@man/config-ui/form/field";
import { FormSection } from "@man/config-ui/form/form-section";
import { ConfigWorkspace } from "@man/config-ui/layout/config-workspace";
import { Button } from "@man/config-ui/primitives/button";
import { Input } from "@man/config-ui/primitives/input";
import { useConfigShell } from "@man/config-ui/shell/shell-context";
import { SidebarPanel } from "@man/config-ui/sidebar/sidebar-panel";
import { SidebarSearch } from "@man/config-ui/sidebar/sidebar-search";
import { ItemList, type ListItem } from "@man/config-ui/sidebar/item-list";
import { StatusBar } from "@man/config-ui/toolbar/status-bar";
import { useEntityCatalog } from "@shared/entity-picker/use-entity-catalog";
import { readPostId } from "@shared/staffbase/posts";

import { PostOption, fetchPostOptions } from "./post-catalog";
import { POST_ID_ISSUE, filterPosts } from "./post-editor-rules";
import { PostPreview } from "./post-preview";

/** Was die Liste sagt, wenn sie nichts zeigen kann. */
const LIST_UNAVAILABLE =
  "Die Liste der Beiträge konnte nicht geladen werden. Bitte die Beitrags-ID oder -Adresse eintragen.";

export interface PostEditorProps {
  /** Der Wert des Feldes, wie er im Studio steht: eine ID oder eine Adresse. */
  value: string;
  /** Bekommt den neuen Wert; übernommen wird erst über „Übernehmen“ im Kopf. */
  onChange: (value: string) => void;
  /** Wie die Beiträge geladen werden; für Tests austauschbar. */
  loadPosts?: () => Promise<PostOption[]>;
}

function toListItem(option: PostOption): ListItem {
  return { id: option.id, label: option.title, description: option.meta === "" ? undefined : option.meta };
}

/**
 * Der Beitrags-Editor im Rahmen von `@man/config-ui`: links die Liste der
 * Beiträge mit Suche, in der Mitte die Eingabe von ID oder Adresse, in den
 * Geräte-Ansichten der Beitrag selbst – die echte Leseansicht.
 *
 * Es gibt nichts weiter einzustellen als den Beitrag, deshalb kein Inspektor.
 */
export function PostEditor({ value, onChange, loadPosts = fetchPostOptions }: PostEditorProps): ReactElement {
  const catalog = useEntityCatalog(loadPosts);
  const { setView, issuesVisible } = useConfigShell();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [wantsInput, setWantsInput] = useState(false);

  const postId = readPostId(value);
  const options = catalog.items;
  const shown = useMemo(() => filterPosts(options, query), [options, query]);
  const items = useMemo(() => shown.map(toListItem), [shown]);
  const known = postId !== null && options.some((option) => option.id === postId);
  const invalid = value.trim() !== "" && postId === null;

  // „ID oder Adresse eingeben“ aus einer Geräte-Ansicht: erst zurück in den
  // Editor, dann – wenn das Feld da ist – der Fokus.
  useEffect(() => {
    if (!wantsInput) return;
    inputRef.current?.focus();
    setWantsInput(false);
  });

  const enterId = (): void => {
    setView("editor");
    setWantsInput(true);
  };

  const emptyText =
    catalog.status === "loading"
      ? "Beiträge werden geladen …"
      : options.length === 0
        ? LIST_UNAVAILABLE
        : "Kein Beitrag gefunden";

  return (
    <ConfigWorkspace
      sidebar={
        <SidebarPanel
          title="Beiträge"
          count={catalog.status === "ready" ? options.length : undefined}
          footer={
            <Button variant="ghost" size="sm" className="-ml-3" onClick={enterId}>
              ID oder Adresse eingeben
            </Button>
          }
        >
          <SidebarSearch
            aria-label="Beitrag suchen"
            placeholder="Titel oder Kanal suchen"
            value={query}
            onValueChange={setQuery}
          />
          <ItemList
            aria-label="Beiträge"
            items={items}
            selectedId={known ? postId : null}
            onSelect={onChange}
            emptyState={emptyText}
          />
        </SidebarPanel>
      }
      preview={<PostPreview postId={postId} />}
    >
      <div className="flex h-full min-h-0 flex-col">
      <div className="mx-auto flex w-full max-w-[640px] flex-1 flex-col gap-6 overflow-auto p-8">
        <FormSection
          title="Beitrag"
          description="Den Beitrag in der Liste links wählen. Steht er dort nicht, ID oder Adresse hier eintragen."
        >
          <Field
            label="ID oder Adresse"
            hint="Die 24-stellige Zeichenfolge am Ende der Beitrags-Adresse oder die ganze Adresse aus der Adresszeile; die ID liest das Widget selbst heraus."
            error={invalid && issuesVisible ? "Aus der Eingabe lässt sich keine Beitrags-ID lesen." : undefined}
          >
            <Input
              ref={inputRef}
              data-issue={POST_ID_ISSUE}
              value={value}
              onChange={(event) => onChange(event.target.value)}
              spellCheck={false}
              autoComplete="off"
            />
          </Field>
        </FormSection>
      </div>
        <StatusBar
          start={postId === null ? "Noch kein Beitrag gewählt" : `Beitrag ${postId}`}
          end={postId !== null && catalog.status === "ready" && !known ? "Nicht in den neuesten Beiträgen der Liste" : undefined}
        />
      </div>
    </ConfigWorkspace>
  );
}

export { PostEditorHelp } from "./post-editor-help";
