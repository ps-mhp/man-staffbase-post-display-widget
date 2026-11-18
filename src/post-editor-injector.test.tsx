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
import { act, render } from "@testing-library/react";
import Form from "@rjsf/mui";
import validator from "@rjsf/validator-ajv8";

import { startPostEditorInjector, postEditorShell } from "./post-editor-injector";
import { configurationSchema, uiSchema } from "./configuration-schema";
import { queryInModal, settleModal } from "@shared/ui/config-modal.testing";

const ID = "6aa109586a1d0e1cfb6de5d3";

async function open(post: string): Promise<{ container: HTMLElement; stop: () => void }> {
  const { container } = render(
    <Form schema={configurationSchema} uiSchema={uiSchema} validator={validator} formData={{ "post-id": post }} onSubmit={jest.fn()} />,
  );
  let stop = (): void => {};
  await act(async () => {
    stop = startPostEditorInjector(container);
  });
  for (let round = 0; round < 5 && queryInModal('[aria-label="Beitrag suchen"]') === null; round += 1) {
    await settleModal();
  }
  return { container, stop };
}

describe("postEditorShell", () => {
  it("asks for the device preview and names the widget", () => {
    expect(postEditorShell.preview).toBe(true);
    expect(postEditorShell.widgetName).toBe("Beitrags-Anzeige");
  });

  it("accepts an id, an address and an empty field, but not free text", () => {
    expect(postEditorShell.validate?.(ID)).toEqual([]);
    expect(postEditorShell.validate?.("")).toEqual([]);
    expect(postEditorShell.validate?.("nur text")).toHaveLength(1);
  });
});

describe("startPostEditorInjector", () => {
  beforeEach(() => {
    jest.spyOn(globalThis, "fetch").mockResolvedValue(new Response(JSON.stringify({ data: [] }), { status: 200 }));
  });
  afterEach(() => jest.restoreAllMocks());

  it("opens the editor over the post-id field with the stored value", async () => {
    const { stop } = await open(ID);
    const input = queryInModal<HTMLInputElement>('input[aria-label], input[type="text"]');
    expect(queryInModal('[aria-label="Beitrag suchen"]')).not.toBeNull();
    expect(input).not.toBeNull();
    stop();
  });
});
