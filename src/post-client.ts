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

import { Post } from "./post-content";

/**
 * Fetches a post from the app the widget is embedded in.
 *
 * `same-origin` credentials carry the user's own session, so the backend
 * applies exactly the permissions it would apply if the user opened the post
 * directly. The widget therefore cannot surface anything the user is not
 * already allowed to read.
 */
export async function fetchPost(postId: string): Promise<Post> {
  const response = await fetch(`/api/posts/${postId}`, {
    credentials: "same-origin",
    headers: { Accept: "application/json" },
  });

  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return (await response.json()) as Post;
}
