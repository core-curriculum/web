const sliceByNumber = (src: string, num: number) => {
  const len = Math.ceil(src.length / num);
  return [...Array(len).keys()].map((i) => src.slice(i * num, i * num + num));
}

const toBase64 = (uuid: string) => {
  const bytes = sliceByNumber(uuid.replaceAll("-", ""), 2).map(t => parseInt(t, 16));
  const str = String.fromCharCode(...bytes);
  return btoa(str)
    .replaceAll("=", "")
    .replaceAll("+", "-")
    .replaceAll("/", "_")
}

const toUUID = (base64ShortId: string) => {
  const padLen = (4 - base64ShortId.length % 4) % 4;
  const pad = [...new Array(padLen)].map(_ => "=").join("");
  const bytes = atob(base64ShortId.replaceAll("-", "+")
    .replaceAll("_", "/") + pad);
  const uint8Array = bytes.split("").map(b => b.charCodeAt(0))
  const str = uint8Array.map(u => u.toString(16).padStart(2, "0")).join("");
  return str.replace(/(.{8})(.{4})(.{4})(.{4})(.{12})/, "$1-$2-$3-$4-$5")
}

export { toBase64, toUUID }
