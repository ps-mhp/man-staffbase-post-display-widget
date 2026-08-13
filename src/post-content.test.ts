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

import { readPostId, documentLocales, pickLocalizedContent } from "./post-content";

describe("readPostId", () => {
  it("accepts a 24-digit hex id and trims it", () => {
    expect(readPostId("  6a7b21b41baaaf6f5d64b460 ")).toBe("6a7b21b41baaaf6f5d64b460");
  });

  it("rejects anything that is not such an id", () => {
    expect(readPostId("")).toBeNull();
    expect(readPostId("nope")).toBeNull();
    expect(readPostId("6a7b21b41baaaf6f5d64b4")).toBeNull();
    expect(readPostId(undefined)).toBeNull();
    expect(readPostId(42)).toBeNull();
  });

  it("reads the id out of a pasted post url", () => {
    expect(readPostId("https://app.staffbase.com/content/news/article/6a7b21b41baaaf6f5d64b460")).toBe(
      "6a7b21b41baaaf6f5d64b460",
    );
  });
});

describe("documentLocales", () => {
  afterEach(() => {
    document.documentElement.removeAttribute("lang");
    document.head.innerHTML = "";
  });

  it("prefers the document language over the browser language", () => {
    document.documentElement.setAttribute("lang", "fr-FR");
    expect(documentLocales()[0]).toBe("fr_FR");
  });

  it("falls back to the content-language meta tag", () => {
    document.head.innerHTML = '<meta http-equiv="content-language" content="it-IT">';
    expect(documentLocales()).toContain("it_IT");
  });

  it("always ends up with the browser language and no duplicates", () => {
    document.documentElement.setAttribute("lang", navigator.language);
    const locales = documentLocales();
    expect(new Set(locales).size).toBe(locales.length);
    expect(locales.length).toBeGreaterThan(0);
  });
});

describe("pickLocalizedContent", () => {
  const de = { title: "Titel", teaser: "Teaser", content: "<p>Inhalt</p>" };
  const en = { title: "Title", teaser: "Teaser", content: "<p>Body</p>" };

  it("takes the exact locale match", () => {
    expect(pickLocalizedContent({ de_DE: de, en_US: en }, ["de_DE"])).toBe(de);
  });

  it("matches on the language part alone", () => {
    expect(pickLocalizedContent({ de_DE: de, en_US: en }, ["de_AT"])).toBe(de);
    expect(pickLocalizedContent({ de_DE: de, en_US: en }, ["en"])).toBe(en);
  });

  it("falls back to the first entry rather than showing nothing", () => {
    expect(pickLocalizedContent({ en_US: en }, ["de_DE"])).toBe(en);
  });

  it("returns null when there is nothing to show", () => {
    expect(pickLocalizedContent({}, ["de_DE"])).toBeNull();
    expect(pickLocalizedContent(undefined, ["de_DE"])).toBeNull();
  });
});
