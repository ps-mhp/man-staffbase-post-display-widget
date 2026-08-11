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

import { POST_ID_ATTRIBUTE } from "./index";
import { configurationSchema, uiSchema } from "./configuration-schema";

describe("POST_ID_ATTRIBUTE", () => {
  it("is the very key the configuration schema stores under", () => {
    // The host writes the configuration value under the schema key verbatim
    // and reads it back under the declared attribute. Any difference — even
    // only in case — puts the value where nothing looks.
    expect(Object.keys(configurationSchema.properties!)).toEqual([POST_ID_ATTRIBUTE]);
    expect(POST_ID_ATTRIBUTE).toBe(POST_ID_ATTRIBUTE.toLowerCase());
  });

  it("is the key the dialog's ui hints are filed under", () => {
    expect(Object.keys(uiSchema)).toEqual([POST_ID_ATTRIBUTE]);
  });
});
