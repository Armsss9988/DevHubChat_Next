export async function getCurrentUser() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_FE_URL}api/me`, {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) return null;

  return res.json();
}
