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

import { EntityCatalogSource, EntityOption } from "@shared/entity-picker/entity-catalog";
import { pickLocalizedTitle } from "@shared/entity-picker/localized-title";

/**
 * Where the app lists the posts the current user can read.
 *
 * Deliberately not `/api/branch/posts`: that one also lists posts the author
 * only administers, and a post the readers cannot open would leave the widget
 * showing an error on the published page. Both answered on 29.09.2026, with 53
 * and 90 posts respectively.
 */
export const CATALOG_ENDPOINT = "/api/posts";

/**
 * How many posts the list offers at most.
 *
 * Newest first, so the cut-off hits what an author is least likely to be
 * looking for; anything beyond it is still reachable by typing the id.
 */
const CATALOG_LIMIT = 100;

type Localization = Record<string, { title?: unknown }>;

interface RawPost {
  id?: unknown;
  published?: unknown;
  contents?: Localization;
  channel?: { config?: { localization?: Localization } };
}

interface CatalogResponse {
  data?: RawPost[];
}

const formatDate = (raw: unknown): string | null => {
  if (typeof raw !== "string") return null;
  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return null;
  const language = document.documentElement.getAttribute("lang") || undefined;
  return date.toLocaleDateString(language);
};

/**
 * How the picker gets its post list.
 *
 * Titles alone repeat — the same announcement goes out in several channels,
 * numbered or not — so channel and date are part of the label.
 */
export const postCatalogSource: EntityCatalogSource<RawPost> = {
  async fetchList(): Promise<RawPost[]> {
    const query = new URLSearchParams({ limit: String(CATALOG_LIMIT), sort: "published_DESC" });
    const response = await fetch(`${CATALOG_ENDPOINT}?${query}`, {
      credentials: "same-origin",
      headers: { Accept: "application/json" },
    });
    if (!response.ok) return [];

    const body = (await response.json()) as CatalogResponse;
    return body.data ?? [];
  },

  toOption(entry: RawPost): EntityOption | null {
    const id = entry?.id;
    if (typeof id !== "string" || id === "") return null;

    const title = pickLocalizedTitle(entry.contents);
    if (title === null) return { id, title: id };

    const parts = [title.trim(), pickLocalizedTitle(entry.channel?.config?.localization), formatDate(entry.published)];
    return { id, title: parts.filter((part): part is string => part !== null && part !== "").join(" · ") };
  },
};
