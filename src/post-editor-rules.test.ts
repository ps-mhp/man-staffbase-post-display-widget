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

import { filterPosts, postChangeStatus, validatePost } from "./post-editor-rules";

const ID = "6aa109586a1d0e1cfb6de5d3";
const OPTIONS = [
  { id: "a", title: "Betriebsversammlung", meta: "Unternehmen · 14.11.2026" },
  { id: "b", title: "IT-Sicherheitswoche", meta: "IT · 10.11.2026" },
];

describe("filterPosts", () => {
  it("returns every post for an empty query", () => {
    expect(filterPosts(OPTIONS, "  ")).toEqual(OPTIONS);
  });

  it("matches title and channel regardless of case", () => {
    expect(filterPosts(OPTIONS, "betrieb").map((o) => o.id)).toEqual(["a"]);
    expect(filterPosts(OPTIONS, "IT ·").map((o) => o.id)).toEqual(["b"]);
  });

  it("returns nothing when nothing matches", () => {
    expect(filterPosts(OPTIONS, "xyz")).toEqual([]);
  });
});

describe("validatePost", () => {
  it("accepts an empty draft, the block reports it itself", () => {
    expect(validatePost("")).toEqual([]);
  });

  it("accepts an id and an address that ends in one", () => {
    expect(validatePost(ID)).toEqual([]);
    expect(validatePost(`https://example.invalid/content/${ID}`)).toEqual([]);
  });

  it("rejects text without an id", () => {
    expect(validatePost("irgendwas")).toHaveLength(1);
  });
});

describe("postChangeStatus", () => {
  it("says nothing while the draft equals the saved value", () => {
    expect(postChangeStatus(ID, ID)).toBeUndefined();
  });

  it("names a chosen and a removed post", () => {
    expect(postChangeStatus(ID, "")).toBe("Beitrag gewählt");
    expect(postChangeStatus("", ID)).toBe("Beitrag entfernt");
  });
});
