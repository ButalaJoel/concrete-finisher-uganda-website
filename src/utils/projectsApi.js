export async function fetchProjectsPage({
  apiUrl,
  page,
  limit,
  category,
  signal,
  fetchImpl = globalThis.fetch,
}) {
  const searchParams = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (category && category !== "All Projects") {
    searchParams.set("category", category);
  }

  const response = await fetchImpl(
    `${apiUrl}/api/projects?${searchParams.toString()}`,
    { signal }
  );

  if (!response.ok) {
    throw new Error("Failed to load projects.");
  }

  const result = await response.json();

  if (!Array.isArray(result?.data)) {
    throw new Error("Project data is unavailable.");
  }

  return {
    data: result.data,
    pagination: result.pagination || {},
  };
}

export async function fetchProjectBySlug({
  apiUrl,
  slug,
  signal,
  fetchImpl = globalThis.fetch,
}) {
  const response = await fetchImpl(
    `${apiUrl}/api/projects/${encodeURIComponent(slug)}`,
    { signal }
  );

  if (response.status === 404) {
    return { notFound: true };
  }

  if (!response.ok) {
    throw new Error("Unable to load project.");
  }

  const result = await response.json();

  if (!result?.data || typeof result.data !== "object" || Array.isArray(result.data)) {
    throw new Error("Project data is unavailable.");
  }

  return {
    data: result.data,
    notFound: false,
  };
}
