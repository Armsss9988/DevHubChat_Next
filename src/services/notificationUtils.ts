let originalTitle = document.title;

export function showNewNotificationIndicator() {
  if (!document.title.startsWith("(*)")) {
    originalTitle = document.title;
    document.title = `(*) ${originalTitle}`;
  }
}

export function clearNotificationIndicator() {
  document.title = originalTitle;
}
export function setFaviconWithNotification() {
  let link =
    (document.querySelector("link[rel~='icon']") as HTMLLinkElement | null) ||
    (document.createElement("link") as HTMLLinkElement | null);
  if (!link) {
    link = (document.createElement("link") as HTMLLinkElement) || null;
    document.head.appendChild(link);
  }

  link.rel = "icon";

  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext("2d");

  const img = new Image();
  img.src = "/favicon.ico";

  img.onload = () => {
    ctx?.drawImage(img, 0, 0, 64, 64);

    // 🔴 Vẽ chấm đỏ góc trên phải
    ctx!.beginPath();
    ctx!.arc(56, 8, 8, 0, 2 * Math.PI);
    ctx!.fillStyle = "#FF0000";
    ctx!.fill();

    link.href = canvas.toDataURL("image/png");
    document.head.appendChild(link);
  };
}
export function resetFavicon() {
  let link =
    (document.querySelector("link[rel~='icon']") as HTMLLinkElement | null) ||
    (document.createElement("link") as HTMLLinkElement | null);
  if (!link) {
    link = (document.createElement("link") as HTMLLinkElement) || null;
    document.head.appendChild(link);
  }

  link.rel = "icon";
  link.href = "/favicon.ico";
  document.head.appendChild(link);
}
