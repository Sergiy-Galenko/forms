async function request({
  id,
  action,
  method = "GET",
  body,
  ownerToken,
  signal,
} = {}) {
  const params = new URLSearchParams();
  if (id) params.set("id", id);
  if (action) params.set("action", action);
  let response;
  try {
    response = await fetch(`/api/tests?${params}`, {
      method,
      signal,
      credentials: "same-origin",
      headers: {
        ...(body ? { "Content-Type": "application/json" } : {}),
        ...(ownerToken ? { Authorization: `Bearer ${ownerToken}` } : {}),
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });
  } catch (error) {
    if (error.name === "AbortError") throw error;
    throw new Error(
      "Немає зв’язку із сервером. Перевірте інтернет і спробуйте ще раз.",
    );
  }
  let data;
  try {
    data = await response.json();
  } catch {
    throw new Error(
      "Сервер тестів ще не налаштований. Зверніться до адміністратора сайту.",
    );
  }
  if (!response.ok)
    throw Object.assign(new Error(data.error || "Не вдалося виконати запит."), {
      code: data.code,
      status: response.status,
      fields: data.fields,
    });
  return data;
}
export const testsApi = {
  publish: (form) =>
    request({ action: "publish", method: "POST", body: { form } }),
  update: (publication, form) =>
    request({
      id: publication.id,
      method: "PUT",
      body: { form },
      ownerToken: publication.ownerToken,
    }),
  close: (publication) =>
    request({
      id: publication.id,
      method: "DELETE",
      body: {},
      ownerToken: publication.ownerToken,
    }),
  owner: (publication) =>
    request({
      id: publication.id,
      action: "owner",
      ownerToken: publication.ownerToken,
    }),
  get: (id, signal) => request({ id, signal }),
  access: (id, password, viewId) =>
    request({
      id,
      action: "access",
      method: "POST",
      body: { password, viewId },
    }),
  submit: (id, body) => request({ id, action: "submit", method: "POST", body }),
};
export const publicTestUrl = (publication) =>
  `${window.location.origin}/form/${publication.id}`;
