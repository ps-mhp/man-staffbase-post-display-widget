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

import "./docs-examples";
import { getDocsExamplesResolver } from "@shared/docs/register-docs-examples";
import { POST_SEARCH_ENDPOINT } from "./docs-examples";

function mockFetch(implementation: (input: RequestInfo | URL) => Promise<Response>): jest.SpyInstance {
  return jest.spyOn(globalThis, "fetch").mockImplementation(implementation as never);
}

describe("post-display-widget docs-examples", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("registers a resolver that returns the first available post's id", async () => {
    mockFetch(async (input: RequestInfo | URL) => {
      const url = input.toString();
      if (url.startsWith(POST_SEARCH_ENDPOINT)) {
        return new Response(JSON.stringify({ data: [{ id: "post-1" }] }), { status: 200 });
      }
      throw new Error(`unexpected fetch: ${url}`);
    });

    const resolver = getDocsExamplesResolver("post-display-widget");
    expect(resolver).toBeDefined();

    const result = await resolver!();
    expect(result["post-id"]).toBe("post-1");
  });

  it("omits the post-id key when no post is available", async () => {
    mockFetch(async (input: RequestInfo | URL) => {
      const url = input.toString();
      if (url.startsWith(POST_SEARCH_ENDPOINT)) {
        return new Response(JSON.stringify({ data: [] }), { status: 200 });
      }
      throw new Error(`unexpected fetch: ${url}`);
    });

    const resolver = getDocsExamplesResolver("post-display-widget");
    const result = await resolver!();

    expect(result["post-id"]).toBeUndefined();
  });

  it("omits the post-id key when the request fails", async () => {
    mockFetch(async () => new Response("", { status: 500 }));

    const resolver = getDocsExamplesResolver("post-display-widget");
    const result = await resolver!();

    expect(result["post-id"]).toBeUndefined();
  });
});
