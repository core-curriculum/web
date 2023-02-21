const sliceByNumber = (src: string, num: number) => {
  const len = Math.ceil(src.length / num);
  return [...Array(len).keys()].map(i => src.slice(i * num, i * num + num));
};

const defaultOption = { ignoreError: false };

const toBase64 = (uuid: string, option?: { ignoreError: boolean }) => {
  const opt = { ...defaultOption, ...option };
  try {
    const bytes = sliceByNumber(uuid.replaceAll("-", ""), 2).map(t => parseInt(t, 16));
    const str = String.fromCharCode(...bytes);
    return btoa(str).replaceAll("=", "").replaceAll("+", "-").replaceAll("/", "_");
  } catch (e) {
    if (opt.ignoreError) return uuid;
    throw e;
  }
};

const toUUID = (base64ShortId: string, option?: { ignoreError: boolean }) => {
  const opt = { ...defaultOption, ...option };
  try {
    const padLen = (4 - (base64ShortId.length % 4)) % 4;
    const pad = [...new Array(padLen)].map(_ => "=").join("");
    const bytes = atob(base64ShortId.replaceAll("-", "+").replaceAll("_", "/") + pad);
    const uint8Array = bytes.split("").map(b => b.charCodeAt(0));
    const str = uint8Array.map(u => u.toString(16).padStart(2, "0")).join("");
    return str.replace(/(.{8})(.{4})(.{4})(.{4})(.{12})/, "$1-$2-$3-$4-$5");
  } catch (e) {
    if (opt.ignoreError) return base64ShortId;
    throw e;
  }
};

export { toBase64, toUUID };
