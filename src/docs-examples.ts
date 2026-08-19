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

import { registerDocsExamples } from "@shared/docs/register-docs-examples";

/** Where the app lists the posts the current user may read, newest first. */
export const POST_SEARCH_ENDPOINT = "/api/posts";

interface RawPostEntry {
  id?: unknown;
}

interface PostSearchResponse {
  data?: RawPostEntry[];
}

/**
 * The pragmatic "first available entity" rule: this widget has no picker UI
 * of its own (unlike podcast-display-widget or survey-display-widget), just
 * a manual id field -- so the docs example asks the same search endpoint the
 * widget's config dialog help text points authors at, and takes whatever
 * post comes back first.
 */
async function fetchFirstPostId(): Promise<string | null> {
  const query = new URLSearchParams({ limit: "1", sort: "publishing.publishedAt_DESC" });

  const response = await fetch(`${POST_SEARCH_ENDPOINT}?${query}`, {
    credentials: "same-origin",
    headers: { Accept: "application/json" },
  });
  if (!response.ok) return null;

  const body = (await response.json()) as PostSearchResponse;
  const id = body.data?.[0]?.id;
  return typeof id === "string" && id !== "" ? id : null;
}

registerDocsExamples("post-display-widget", async () => {
  const postId = await fetchFirstPostId();
  const attributes: Record<string, string> = {};
  if (postId) attributes["post-id"] = postId;
  return attributes;
});
