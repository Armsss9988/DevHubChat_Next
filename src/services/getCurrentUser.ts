export async function getCurrentUser() {
  const res = await fetch("http://localhost:3000/api/me", {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) return null;

  return res.json();
}
