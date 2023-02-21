const apiPost = async <PostData extends object, Response extends object>(
  api: string,
  data: PostData,
): Promise<Response> => {
  const posted = await fetch(api, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (posted.ok) {
    const response = (await posted.json()) as Response;
    return response;
  }
  throw new Error(`Cannot post to api:${api},${posted}`);
};

const apiGet = async <Response extends object>(api: string): Promise<Response> => {
  const res = await fetch(api, {
    method: "GET",
  });
  if (res.ok) {
    const data = (await res.json()) as Response;
    return data;
  }
  throw new Error(`Cannot get fromapi:${api},${JSON.stringify(res, null, 2)}`);
};

export { apiPost, apiGet };
