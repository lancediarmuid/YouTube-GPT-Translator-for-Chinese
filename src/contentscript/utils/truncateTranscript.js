const limit = 14000;

function textToBinaryString(str) {
  const escstr = decodeURIComponent(encodeURIComponent(escape(str)));
  const binstr = escstr.replace(/%([0-9A-F]{2})/gi, (match, hex) => {
    const i = parseInt(hex, 16);
    return String.fromCharCode(i);
  });
  return binstr;
}

export default function truncateTranscript(rawstr) {
  const str = rawstr.replace(/\[Music\]|\[音乐\]/g, '');

  const bytes = textToBinaryString(str).length;
  if (bytes > limit) {
    const ratio = limit / bytes;
    const newStr = str.substring(0, str.length * ratio);
    return newStr;
  }
  return str;
}
