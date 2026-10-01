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

import { PostBody } from "@shared/staffbase/post-body";
import { ensurePostStyles } from "@shared/staffbase/post-styles";
import { Post, PostContent, pickLocalizedContent, requestPost, userLocales } from "@shared/staffbase/posts";

const MISSING_ID = "Keine Beitrags-ID konfiguriert. Bitte die ID des Beitrags in den Widget-Einstellungen eintragen.";
const NO_CONTENT = "Der Beitrag enthält keine anzeigbaren Inhalte.";

/** What the view knows at any moment. */
type State =
  | { status: "loading" }
  | { status: "ready"; post: Post; content: PostContent }
  | { status: "error"; message: string };

/**
 * A single Staffbase post, in the language of the reader.
 *
 * Every outcome is visible: loading, failure and the post itself. A block that
 * silently renders nothing is indistinguishable from a broken widget, and in
 * the editor that is exactly where an author would be left guessing.
 */
export function PostView({ postId }: { postId: string | null }): React.JSX.Element {
  const [state, setState] = React.useState<State>(
    postId === null ? { status: "error", message: MISSING_ID } : { status: "loading" },
  );

  // A ref, not an effect on the document: the stylesheet has to land in the
  // root this element was rendered into, which is a shadow root in the
  // Content Designer (see `@shared/style-root`).
  const anchorStyles = React.useCallback((element: HTMLElement | null) => {
    if (element !== null) ensurePostStyles(element);
  }, []);

  React.useEffect(() => {
    if (postId === null) {
      setState({ status: "error", message: MISSING_ID });
      return;
    }

    // A changed id makes the running request's answer the wrong one; the flag
    // keeps it from overwriting the newer state after the component moved on.
    let current = true;
    setState({ status: "loading" });

    Promise.all([requestPost(postId), userLocales()])
      .then(([response, locales]) => {
        if (!current) return;
        if (response.post === null) {
          const reason = response.status === null ? "keine Antwort" : `HTTP ${response.status}`;
          setState({ status: "error", message: `Beitrag konnte nicht geladen werden: ${reason}` });
          return;
        }
        const content = pickLocalizedContent(response.post.contents, locales);
        setState(
          content === null
            ? { status: "error", message: NO_CONTENT }
            : { status: "ready", post: response.post, content },
        );
      })
      .catch((error: unknown) => {
        if (!current) return;
        const reason = error instanceof Error ? error.message : String(error);
        setState({ status: "error", message: `Beitrag konnte nicht geladen werden: ${reason}` });
      });

    return () => {
      current = false;
    };
  }, [postId]);

  if (state.status === "loading") {
    return (
      <div ref={anchorStyles} className="post-display" data-testid="post-display">
        <p className="post-display__status">Beitrag wird geladen …</p>
      </div>
    );
  }

  if (state.status === "error") {
    return (
      <div ref={anchorStyles} className="post-display" data-testid="post-display">
        <p className="post-display__error" role="alert">
          {state.message}
        </p>
      </div>
    );
  }

  return (
    <article ref={anchorStyles} className="post-display" data-testid="post-display">
      <PostBody post={state.post} content={state.content} />
    </article>
  );
}
