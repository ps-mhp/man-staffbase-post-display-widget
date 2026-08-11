/*!
 * Copyright 2026, Staffbase SE and contributors.
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

import { UiSchema } from "@rjsf/utils";
import { JSONSchema7 } from "json-schema";

/**
 * Schema for the widget's configuration dialog.
 *
 * The key is byte-identical to `POST_ID_ATTRIBUTE` and to the attribute
 * registered in `widgets.json`: the host saves a value under its schema key
 * verbatim and reads it back off the element under the declared attribute
 * name, and it drops an attribute it was never told about.
 *
 * @see https://rjsf-team.github.io/react-jsonschema-form/docs/
 */
export const configurationSchema: JSONSchema7 = {
  properties: {
    "post-id": {
      type: "string",
      title: "Beitrags-ID",
    },
  },
};

/**
 * @see https://rjsf-team.github.io/react-jsonschema-form/docs/api-reference/uiSchema
 */
export const uiSchema: UiSchema = {
  "post-id": {
    "ui:help":
      "ID des Beitrags aus Staffbase — die 24-stellige Zeichenfolge am Ende der Beitrags-URL. " +
      "Die vollständige URL kann ebenfalls eingefügt werden.",
  },
};
