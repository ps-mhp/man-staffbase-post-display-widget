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
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";

import { PostEditor } from "./post-editor";
import type { PostOption } from "./post-catalog";

const ID_A = "6aa109586a1d0e1cfb6de5d3";
const ID_B = "5bb109586a1d0e1cfb6de5d4";
const OPTIONS: PostOption[] = [
  { id: ID_A, title: "Betriebsversammlung", meta: "Unternehmen · 14.11.2026" },
  { id: ID_B, title: "IT-Sicherheitswoche", meta: "IT · 10.11.2026" },
];

async function renderEditor(
  value: string,
  loadPosts: () => Promise<PostOption[]> = () => Promise.resolve(OPTIONS),
): Promise<jest.Mock> {
  const onChange = jest.fn();
  await act(async () => {
    render(<PostEditor value={value} onChange={onChange} loadPosts={loadPosts} />);
  });
  return onChange;
}

describe("PostEditor", () => {
  it("lists the posts with channel and date and marks the chosen one", async () => {
    await renderEditor(ID_A);
    const rows = await screen.findAllByRole("row");
    expect(rows).toHaveLength(2);
    expect(screen.getByText("Unternehmen · 14.11.2026")).toBeTruthy();
    expect(rows[0].getAttribute("aria-selected")).toBe("true");
    expect(rows[1].getAttribute("aria-selected")).toBe("false");
  });

  it("writes the id of a clicked post", async () => {
    const onChange = await renderEditor("");
    fireEvent.click(await screen.findByText("IT-Sicherheitswoche"));
    expect(onChange).toHaveBeenCalledWith(ID_B);
  });

  it("filters the list by the search text", async () => {
    await renderEditor("");
    await screen.findAllByRole("row");
    fireEvent.change(screen.getByLabelText("Beitrag suchen"), { target: { value: "sicherheit" } });
    expect(screen.getAllByRole("row")).toHaveLength(1);
    expect(screen.getByText("IT-Sicherheitswoche")).toBeTruthy();
  });

  it("shows the value as typed, an address included, and passes edits on unchanged", async () => {
    const onChange = await renderEditor(`https://example.invalid/${ID_A}`);
    const input = screen.getByLabelText("ID oder Adresse") as HTMLInputElement;
    expect(input.value).toBe(`https://example.invalid/${ID_A}`);
    fireEvent.change(input, { target: { value: ID_B } });
    expect(onChange).toHaveBeenCalledWith(ID_B);
  });

  it("tells the author when the list cannot be loaded", async () => {
    await renderEditor("", () => Promise.resolve([]));
    expect(await screen.findByText(/Die Liste der Beiträge konnte nicht geladen werden/)).toBeTruthy();
  });

  it("survives a failing load", async () => {
    await renderEditor("", () => Promise.reject(new Error("offline")));
    await waitFor(() => expect(screen.getByText(/konnte nicht geladen werden/)).toBeTruthy());
  });

  it("notes a post that is not among the newest in the list", async () => {
    await renderEditor("0123456789abcdef01234567");
    expect(await screen.findByText("Nicht in den neuesten Beiträgen der Liste")).toBeTruthy();
  });
});
