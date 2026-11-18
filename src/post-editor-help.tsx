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
 * Die Hilfe des Beitrags-Editors in der Leiste des Rahmens. Tasten und den
 * Satz zu „Übernehmen“ ergänzt der Rahmen selbst.
 */

import * as React from "react";
import { ReactElement } from "react";

export function PostEditorHelp(): ReactElement {
  return (
    <div className="flex flex-col gap-3" data-testid="post-editor-help">
      <p>
        <strong className="text-foreground">Beitrag wählen.</strong> In der Liste links steht, was Sie lesen dürfen,
        die neuesten 100 zuerst – mit Kanal und Datum, denn derselbe Titel kommt oft in mehreren Kanälen vor. Die
        Suche filtert nach Titel und Kanal.
      </p>
      <p>
        <strong className="text-foreground">Beitrag nicht in der Liste.</strong> „ID oder Adresse eingeben“ führt zum
        Feld im Editor. Die komplette Adresse aus der Adresszeile des Browsers genügt; die 24-stellige ID am Ende
        liest das Widget selbst heraus.
      </p>
      <p>
        <strong className="text-foreground">Vorschau.</strong> Desktop, Tablet und Mobil zeigen den Beitrag, wie ihn
        Leserinnen und Leser sehen. Er lädt mit Ihren Rechten – wer weniger darf, sieht unter Umständen weniger.
      </p>
      <p>
        Ohne Beitrag zeigt der Block auf der Seite den Hinweis „Keine Beitrags-ID konfiguriert“; bitte nie leer
        veröffentlichen.
      </p>
    </div>
  );
}
