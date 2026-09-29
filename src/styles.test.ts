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

import { POST_DISPLAY_CSS } from "./styles";

const rule = (selector: string): string => {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = new RegExp(`(?:^|}|\\*/)\\s*${escaped}\\s*\\{([^}]*)\\}`).exec(POST_DISPLAY_CSS);
  return match === null ? "" : match[1];
};

// The headline has to read like the post's own headline in the news view:
// MANEurope Condensed Bold, 600, 28/34px, uppercase (measured 29.09.2026).
describe("post headline", () => {
  const title = (): string => rule(".post-display .post-display__title");

  it("uses the MAN head face at its weight", () => {
    expect(title()).toMatch(/font-family:\s*var\(--man-font-head,\s*"MANEurope Condensed Bold"/);
    expect(title()).toMatch(/font-weight:\s*600/);
  });

  it("has the news headline's size and leading", () => {
    expect(title()).toMatch(/font-size:\s*28px/);
    expect(title()).toMatch(/line-height:\s*34px/);
  });

  it("is set in capitals", () => {
    expect(title()).toMatch(/text-transform:\s*uppercase/);
  });
});
