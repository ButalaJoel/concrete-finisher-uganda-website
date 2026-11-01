import assert from "node:assert/strict";
import test from "node:test";
import { fetchProjectBySlug, fetchProjectsPage } from "../src/utils/projectsApi.js";

const apiUrl = "https://example.test";

function response({ status = 200, body = {} } = {}) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  };
}

test("projects request returns an empty success for an empty list", async () => {
  const result = await fetchProjectsPage({
    apiUrl,
    page: 1,
    limit: 3,
    category: "All Projects",
    fetchImpl: async () => response({ body: { data: [], pagination: { totalPages: 1 } } }),
  });

  assert.deepEqual(result, { data: [], pagination: { totalPages: 1 } });
});

test("projects request rejects HTTP and malformed-data failures", async () => {
  await assert.rejects(
    fetchProjectsPage({
      apiUrl,
      page: 1,
      limit: 3,
      fetchImpl: async () => response({ status: 503 }),
    }),
    /Failed to load projects/
  );

  await assert.rejects(
    fetchProjectsPage({
      apiUrl,
      page: 1,
      limit: 3,
      fetchImpl: async () => response({ body: { data: null } }),
    }),
    /Project data is unavailable/
  );
});

test("project detail treats only an HTTP 404 as not found", async () => {
  const result = await fetchProjectBySlug({
    apiUrl,
    slug: "missing-project",
    fetchImpl: async () => response({ status: 404 }),
  });

  assert.deepEqual(result, { notFound: true });

  await assert.rejects(
    fetchProjectBySlug({
      apiUrl,
      slug: "offline-project",
      fetchImpl: async () => {
        throw new TypeError("Failed to fetch");
      },
    }),
    /Failed to fetch/
  );

  await assert.rejects(
    fetchProjectBySlug({
      apiUrl,
      slug: "server-error",
      fetchImpl: async () => response({ status: 500 }),
    }),
    /Unable to load project/
  );
});

test("project detail returns valid data and rejects missing data", async () => {
  const result = await fetchProjectBySlug({
    apiUrl,
    slug: "valid-project",
    fetchImpl: async () => response({ body: { data: { _id: "project-1" } } }),
  });

  assert.deepEqual(result, { data: { _id: "project-1" }, notFound: false });

  await assert.rejects(
    fetchProjectBySlug({
      apiUrl,
      slug: "invalid-project",
      fetchImpl: async () => response({ body: {} }),
    }),
    /Project data is unavailable/
  );
});
