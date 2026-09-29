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

import { ensureStyleElement } from "@shared/style-root";

/** Id of the single style element, which is also how it is recognised again. */
export const STYLE_ELEMENT_ID = "post-display-widget-styles";

/**
 * The widget's stylesheet.
 *
 * Colours and fonts are inherited on purpose: the post is embedded in a page
 * that already has a design, and a block bringing its own palette would look
 * bolted on. The exception is the headline, which follows the MAN CI for a
 * post headline. Otherwise only spacing, the teaser's relative size and the
 * containment of images are stated here.
 */
export const POST_DISPLAY_CSS = `
.post-display {
  box-sizing: border-box;
  display: block;
  line-height: 1.55;
  min-width: 0;
}

/*
 * The headline reads like the post's own headline in the news view:
 * MANEurope Condensed Bold, 600, 28/34px, capitals, slightly tightened
 * (measured on onetruck on 29.09.2026). Two classes, so the Content
 * Designer's \`[data-c13y-region="root"] *\` reset does not win by order.
 */
.post-display .post-display__title {
  font-family: var(--man-font-head, "MANEurope Condensed Bold", "MAN Europe", Arial, sans-serif);
  font-weight: 600;
  font-size: 28px;
  line-height: 34px;
  letter-spacing: -0.015em;
  text-transform: uppercase;
  color: var(--man-slate, #303c49);
  margin: 0 0 0.5em;
}

.post-display__teaser {
  font-size: 1.1em;
  margin: 0 0 1em;
  opacity: 0.85;
}

.post-display__body > *:first-child {
  margin-top: 0;
}

.post-display__body > *:last-child {
  margin-bottom: 0;
}

.post-display__body img,
.post-display__body video,
.post-display__body iframe {
  max-width: 100%;
  height: auto;
}

.post-display__body table {
  max-width: 100%;
}

.post-display__status,
.post-display__error {
  margin: 0;
  opacity: 0.75;
}

.post-display__error {
  color: #b3261e;
  opacity: 1;
}
`;

/**
 * Puts the stylesheet where `anchor` lives, once per root.
 *
 * Several posts may sit on one page, and every block would otherwise add its
 * own copy. The id is both the marker and the way back to it.
 *
 * Where that is differs by editor: `document.head` for a classic page, the
 * page's shadow root in the Content Designer — see `@shared/style-root`.
 */
export function ensureStyles(anchor?: Node | null): void {
  ensureStyleElement(anchor, STYLE_ELEMENT_ID, POST_DISPLAY_CSS);
}
