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

import { fetchPost } from "./post-client";
import { PostContent, documentLocales, pickLocalizedContent } from "./post-content";
import { ensureStyles } from "./styles";

const MISSING_ID = "Keine Beitrags-ID konfiguriert. Bitte die ID des Beitrags in den Widget-Einstellungen eintragen.";
const NO_CONTENT = "Der Beitrag enthält keine anzeigbaren Inhalte.";

/** What the view knows at any moment. */
type State =
  | { status: "loading" }
  | { status: "ready"; content: PostContent }
  | { status: "error"; message: string };

/**
 * A part of the post, rendered as the HTML it is.
 *
 * The markup comes from the same Staffbase backend that the surrounding page
 * comes from, written through the editor that already governs what a post may
 * contain. Escaping it here would show authors their own tags as text.
 */
function Html({ html, className }: { html: string; className: string }): React.JSX.Element | null {
  if (html.trim() === "") return null;
  return <div className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}

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

  React.useEffect(() => {
    ensureStyles();

    if (postId === null) {
      setState({ status: "error", message: MISSING_ID });
      return;
    }

    // A changed id makes the running request's answer the wrong one; the flag
    // keeps it from overwriting the newer state after the component moved on.
    let current = true;
    setState({ status: "loading" });

    fetchPost(postId)
      .then((post) => {
        if (!current) return;
        const content = pickLocalizedContent(post.contents, documentLocales());
        setState(
          content === null
            ? { status: "error", message: NO_CONTENT }
            : { status: "ready", content },
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
      <div className="post-display" data-testid="post-display">
        <p className="post-display__status">Beitrag wird geladen …</p>
      </div>
    );
  }

  if (state.status === "error") {
    return (
      <div className="post-display" data-testid="post-display">
        <p className="post-display__error" role="alert">
          {state.message}
        </p>
      </div>
    );
  }

  const { title, teaser, content } = state.content;
  return (
    <article className="post-display" data-testid="post-display">
      <Html html={title ?? ""} className="post-display__title" />
      <Html html={teaser ?? ""} className="post-display__teaser" />
      <Html html={content ?? ""} className="post-display__body" />
    </article>
  );
}
