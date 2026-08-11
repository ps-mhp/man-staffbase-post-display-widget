/*!
 * Copyright 2026, Staffbase SE and contributors.
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

/** One language version of a post, as the API returns it under `contents`. */
export interface PostContent {
  title?: string;
  teaser?: string;
  content?: string;
}

/** A post as far as this widget cares about it. */
export interface Post {
  contents?: Record<string, PostContent>;
}

/** The shape of a Staffbase backend id: 24 hex digits. */
const POST_ID = /[0-9a-f]{24}/i;

/**
 * The post id out of whatever the author typed.
 *
 * The id is also accepted inside a longer string, because the obvious thing to
 * paste into the field is the URL of the post one is looking at, and the id is
 * the last such run of hex digits in it. Anything without an id is treated as
 * no id at all rather than passed on to produce a 404.
 */
export function readPostId(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const matches = raw.trim().match(new RegExp(POST_ID, "gi"));
  return matches === null ? null : matches[matches.length - 1].toLowerCase();
}

/**
 * The user's languages, most trustworthy first, in the API's `de_DE` spelling.
 *
 * The widget SDK's user profile carries no language, so the document is the
 * source: the Staffbase app serves it in the language the user has chosen.
 * `navigator.language` comes last — it is the browser's setting, which is a
 * guess about the user, not their choice inside the app.
 */
export function documentLocales(): string[] {
  const meta = document.querySelector('meta[http-equiv="content-language"]');
  const candidates = [
    document.documentElement.getAttribute("lang"),
    meta?.getAttribute("content"),
    navigator.language,
  ];

  const locales: string[] = [];
  for (const candidate of candidates) {
    const locale = candidate?.trim().replace("-", "_");
    if (locale && !locales.includes(locale)) locales.push(locale);
  }
  return locales;
}

/**
 * The language version to show.
 *
 * Three passes: the exact locale, then the language part alone (`de` takes
 * `de_DE`), then whatever is there. The last pass is deliberate — a post that
 * exists only in English should still be readable by a German user, and an
 * empty widget would be a worse answer than the wrong language.
 */
export function pickLocalizedContent(
  contents: Record<string, PostContent> | undefined,
  locales: string[],
): PostContent | null {
  const keys = Object.keys(contents ?? {});
  if (contents === undefined || keys.length === 0) return null;

  for (const locale of locales) {
    if (contents[locale]) return contents[locale];
  }

  for (const locale of locales) {
    const language = locale.split("_")[0].toLowerCase();
    const match = keys.find((key) => key.split("_")[0].toLowerCase() === language);
    if (match !== undefined) return contents[match];
  }

  return contents[keys[0]];
}
