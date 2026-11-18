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

import { CATALOG_ENDPOINT, fetchPostList, fetchPostOptions, toPostOption } from "./post-catalog";

const ID = "6aa109586a1d0e1cfb6de5d3";

const post = (overrides: Record<string, unknown> = {}): Record<string, unknown> => ({
  id: ID,
  published: "2026-09-09T07:23:04.648Z",
  contents: { de_DE: { title: "Neuer TGX auf der IAA" }, en_US: { title: "New TGX on IAA" } },
  channel: { config: { localization: { de_DE: { title: "Ignition Point" } } } },
  ...overrides,
});

const respondWith = (body: unknown): jest.SpyInstance =>
  jest.spyOn(globalThis, "fetch").mockResolvedValue(new Response(JSON.stringify(body), { status: 200 }));

describe("fetchPostList", () => {
  afterEach(() => jest.restoreAllMocks());

  it("asks for the newest posts the author can read", async () => {
    const fetchMock = respondWith({ total: 0, data: [] });

    await fetchPostList();

    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url.startsWith(CATALOG_ENDPOINT)).toBe(true);
    expect(url).toContain("limit=100");
    expect(url).toContain("sort=published_DESC");
    expect(init.credentials).toBe("same-origin");
  });

  it("returns the raw posts for toPostOption to map", async () => {
    respondWith({ total: 1, data: [post()] });
    await expect(fetchPostList()).resolves.toEqual([post()]);
  });

  it("answers with an empty list when the request is refused", async () => {
    jest.spyOn(globalThis, "fetch").mockResolvedValue(new Response("", { status: 403 }));
    await expect(fetchPostList()).resolves.toEqual([]);
  });
});

describe("toPostOption", () => {
  beforeEach(() => document.documentElement.setAttribute("lang", "de-DE"));
  afterEach(() => document.documentElement.removeAttribute("lang"));

  it("labels a post with its title, channel and date in the reader's language", () => {
    expect(toPostOption(post() as never)).toEqual({
      id: ID,
      title: "Neuer TGX auf der IAA",
      meta: "Ignition Point · 9.9.2026",
    });
  });

  it("falls back to the id when a post has no title", () => {
    const option = toPostOption(post({ contents: {}, channel: undefined, published: null }) as never);
    expect(option).toEqual({ id: ID, title: ID, meta: "" });
  });

  it("skips an entry without a usable id", () => {
    expect(toPostOption(post({ id: 42 }) as never)).toBeNull();
    expect(toPostOption(null as never)).toBeNull();
  });
});

describe("fetchPostOptions", () => {
  beforeEach(() => document.documentElement.setAttribute("lang", "de-DE"));
  afterEach(() => {
    document.documentElement.removeAttribute("lang");
    jest.restoreAllMocks();
  });

  it("maps the posts and drops entries without an id", async () => {
    respondWith({ total: 2, data: [post(), post({ id: null })] });
    await expect(fetchPostOptions()).resolves.toEqual([
      { id: ID, title: "Neuer TGX auf der IAA", meta: "Ignition Point · 9.9.2026" },
    ]);
  });

  it("answers with an empty list instead of throwing when the request fails", async () => {
    jest.spyOn(globalThis, "fetch").mockRejectedValue(new Error("offline"));
    await expect(fetchPostOptions()).resolves.toEqual([]);
  });
});
