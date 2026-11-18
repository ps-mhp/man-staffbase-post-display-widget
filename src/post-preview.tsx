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

/**
 * Der Beitrag in den Geräte-Ansichten: die echte Leseansicht (`PostView`),
 * nicht eine Nachbildung. Sie liest den Beitrag nur (`GET /api/posts/<id>`),
 * wie die Seite es auch tut; geschrieben wird nichts.
 *
 * Die Bühne ist `inert`: Links im Beitrag führen hier nirgends hin, und der
 * Tabulator springt nicht durch Elemente, die in der Vorschau nichts bedeuten.
 *
 * Grenze: Der Geräterahmen ist kein iframe, Medienabfragen des Beitrags
 * fragen das Fenster des Studios, nicht den Rahmen.
 */

import * as React from "react";
import { ReactElement } from "react";

import { PostView } from "./post-view";

export function PostPreview({ postId }: { postId: string | null }): ReactElement {
  return (
    <div inert data-testid="post-preview" className="p-6">
      <PostView postId={postId} />
    </div>
  );
}
