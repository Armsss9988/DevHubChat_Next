"use server";
export async function getCurrentUser() {
  const res = await fetch("/api/me", {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) return null;

  return res.json();
}
