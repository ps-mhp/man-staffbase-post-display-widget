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

import React from "react";
import { render, screen } from "@testing-library/react";

import { PostView } from "./post-view";

const POST_ID = "6a7b21b41baaaf6f5d64b460";

const post = {
  contents: {
    de_DE: { title: "Titel", teaser: "Der Teaser", content: "<p>Der Inhalt</p>" },
    en_US: { title: "Title", teaser: "The teaser", content: "<p>The body</p>" },
  },
};

function mockFetch(implementation: () => Promise<unknown>): jest.SpyInstance {
  return jest.spyOn(globalThis, "fetch").mockImplementation(implementation as never);
}

describe("PostView", () => {
  beforeEach(() => {
    document.documentElement.setAttribute("lang", "de-DE");
  });

  afterEach(() => {
    jest.restoreAllMocks();
    document.documentElement.removeAttribute("lang");
  });

  it("shows a loading notice while the post is on its way", async () => {
    mockFetch(() => new Promise(() => {}));
    render(<PostView postId={POST_ID} />);
    expect(await screen.findByText(/wird geladen/i)).toBeInTheDocument();
  });

  it("renders the post in the document's language", async () => {
    mockFetch(async () => new Response(JSON.stringify(post), { status: 200 }));

    render(<PostView postId={POST_ID} />);

    expect(await screen.findByText("Titel")).toBeInTheDocument();
    expect(screen.getByText("Der Teaser")).toBeInTheDocument();
    expect(screen.getByText("Der Inhalt")).toBeInTheDocument();
    expect(screen.queryByText("Title")).not.toBeInTheDocument();
    expect(globalThis.fetch).toHaveBeenCalledWith(
      `/api/posts/${POST_ID}`,
      expect.objectContaining({ credentials: "same-origin" }),
    );
  });

  it("reports an unreachable post instead of staying blank", async () => {
    mockFetch(async () => new Response("", { status: 404 }));

    render(<PostView postId={POST_ID} />);

    expect(await screen.findByRole("alert")).toHaveTextContent(/404/);
  });

  it("reports a missing id without asking the backend", async () => {
    const fetchMock = mockFetch(async () => new Response("", { status: 200 }));

    render(<PostView postId={null} />);

    expect(await screen.findByRole("alert")).toHaveTextContent(/Beitrags-ID/i);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("reports a post that carries no content at all", async () => {
    mockFetch(async () => new Response(JSON.stringify({ contents: {} }), { status: 200 }));

    render(<PostView postId={POST_ID} />);

    expect(await screen.findByRole("alert")).toBeInTheDocument();
  });
});
