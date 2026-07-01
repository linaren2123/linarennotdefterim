// Arayüz Temasını Hemen Yükle (Flashing'i Engellemek İçin)
(function() {
  const savedTheme = localStorage.getItem("linaren_theme") || localStorage.getItem("linaren_theme") || "dark";
  document.body.setAttribute("data-theme", savedTheme);
})();

// PURE JS SHA256 ALGORİTMASI (ÇEVRİMDIŞI ÇALIŞMA ALTYAPISI)
function sha256(ascii) {
  function rightRotate(value, amount) {
    return (value >>> amount) | (value << (32 - amount));
  }
  var mathPow = Math.pow;
  var maxWord = mathPow(2, 32);
  var lengthProperty = 'length';
  var i, j;
  var result = '';
  var words = [];
  var asciiLength = ascii[lengthProperty];
  var hash = [], k = [];
  var primeCounter = 0;
  var isPrime = {};
  for (var candidate = 2; primeCounter < 64; candidate++) {
    if (!isPrime[candidate]) {
      for (i = 0; i < 313; i += candidate) {
        isPrime[i] = 1;
      }
      if (primeCounter < 8) {
        hash[primeCounter] = (mathPow(candidate, .5) * maxWord) | 0;
      }
      k[primeCounter++] = (mathPow(candidate, 1 / 3) * maxWord) | 0;
    }
  }
  ascii += '\x80';
  while (ascii[lengthProperty] % 64 - 56) ascii += '\x00';
  for (i = 0; i < ascii[lengthProperty]; i++) {
    j = ascii.charCodeAt(i);
    if (j >> 8) return null;
    words[i >> 2] |= j << (24 - (i % 4) * 8);
  }
  words[words[lengthProperty]] = ((asciiLength * 8) / maxWord) | 0;
  words[words[lengthProperty]] = (asciiLength * 8) | 0;
  for (j = 0; j < words[lengthProperty]; j += 16) {
    var w = Array(64);
    for (i = 0; i < 16; i++) w[i] = words[j + i];
    for (i = 16; i < 64; i++) {
      var s0 = rightRotate(w[i - 15], 7) ^ rightRotate(w[i - 15], 18) ^ (w[i - 15] >>> 3);
      var s1 = rightRotate(w[i - 2], 17) ^ rightRotate(w[i - 2], 19) ^ (w[i - 2] >>> 10);
      w[i] = (w[i - 16] + s0 + w[i - 7] + s1) | 0;
    }
    var a = hash[0], b = hash[1], c = hash[2], d = hash[3], e = hash[4], f = hash[5], g = hash[6], h = hash[7];
    for (i = 0; i < 64; i++) {
      var S1 = rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25);
      var ch = (e & f) ^ (~e & g);
      var temp1 = (h + S1 + ch + k[i] + w[i]) | 0;
      var S0 = rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22);
      var maj = (a & b) ^ (a & c) ^ (b & c);
      var temp2 = (S0 + maj) | 0;
      h = g; g = f; f = e; e = (d + temp1) | 0;
      d = c; c = b; b = a; a = (temp1 + temp2) | 0;
    }
    hash[0] = (hash[0] + a) | 0; hash[1] = (hash[1] + b) | 0; hash[2] = (hash[2] + c) | 0; hash[3] = (hash[3] + d) | 0;
    hash[4] = (hash[4] + e) | 0; hash[5] = (hash[5] + f) | 0; hash[6] = (hash[6] + g) | 0; hash[7] = (hash[7] + h) | 0;
  }
  for (i = 0; i < 8; i++) {
    for (j = 3; j >= 0; j--) {
      var b = (hash[i] >> (j * 8)) & 255;
      result += ((b < 16) ? '0' : '') + b.toString(16);
    }
  }
  return result;
}

// GÜVENLİ XOR TABANLI HAFİF ŞİFRELEME (ÇEVRİMDIŞI PROTOKOLLERDE ÇALIŞIR)
function crypt(text, password) {
  const key = sha256(password);
  let result = '';
  for (let i = 0; i < text.length; i++) {
    const keyChar = key.charCodeAt(i % key.length);
    const textChar = text.charCodeAt(i);
    result += String.fromCharCode(textChar ^ keyChar);
  }
  return result;
}

// Düz metni şifreli hex dizgesine çevirir
function encryptText(plainText, password) {
  if (!plainText) return "";
  const cipherText = crypt(plainText, password);
  let hex = '';
  for (let i = 0; i < cipherText.length; i++) {
    hex += cipherText.charCodeAt(i).toString(16).padStart(4, '0');
  }
  return hex;
}

// Şifreli hex dizgesini düz metne çözümler
function decryptText(hexText, password) {
  if (!hexText) return "";
  let cipherText = '';
  try {
    for (let i = 0; i < hexText.length; i += 4) {
      cipherText += String.fromCharCode(parseInt(hexText.substr(i, 4), 16));
    }
    return crypt(cipherText, password);
  } catch (err) {
    console.error("Kripto şifre çözme hatası:", err);
    return "";
  }
}

// GÜVENLİ VE ÇEVRİMDIŞI UYUMLU YEREL İKON MOTORU (CDNSİZ ÇALIŞIR)
function safeCreateIcons() {
  const LOCAL_SVGS = {
    "bold": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 12a4 4 0 0 0 0-8H6v8"/><path d="M15 20a4 4 0 0 0 0-8H6v8Z"/></svg>`,
    "italic": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" x2="10" y1="4" y2="4"/><line x1="14" x2="5" y1="20" y2="20"/><line x1="15" x2="9" y1="4" y2="20"/></svg>`,
    "underline": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3"/><line x1="4" x2="20" y1="20" y2="20"/></svg>`,
    "strikethrough": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4H9a3 3 0 0 0-2.83 4H14a4 4 0 0 1 0 8H7"/><line x1="4" x2="20" y1="12" y2="12"/></svg>`,
    "align-left": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="21" x2="3" y1="6" y2="6"/><line x1="15" x2="3" y1="12" y2="12"/><line x1="17" x2="3" y1="18" y2="18"/></svg>`,
    "check-square": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><path d="m9 12 2 2 4-4"/></svg>`,
    "list": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" x2="21" y1="6" y2="6"/><line x1="8" x2="21" y1="12" y2="12"/><line x1="8" x2="21" y1="18" y2="18"/><line x1="3" x2="3.01" y1="6" y2="6"/><line x1="3" x2="3.01" y1="12" y2="12"/><line x1="3" x2="3.01" y1="18" y2="18"/></svg>`,
    "list-ordered": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="10" x2="21" y1="6" y2="6"/><line x1="10" x2="21" y1="12" y2="12"/><line x1="10" x2="21" y1="18" y2="18"/><path d="M4 6h1v4"/><path d="M4 10h2"/><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"/></svg>`,
    "table": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v18"/><path d="M3 12h18"/><rect width="18" height="18" x="3" y="3" rx="2"/></svg>`,
    "code": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`,
    "palette": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.92 0 1.63-.77 1.63-1.7 0-.42-.16-.83-.44-1.14-.29-.32-.46-.74-.46-1.19 0-.92.77-1.63 1.7-1.63h1.7c5.5 0 10-4.5 10-10S17.5 2 12 2Z"/></svg>`,
    "download": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>`,
    "star": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
    "trash": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>`,
    "trash-2": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>`,
    "search": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>`,
    "settings": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.1a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>`,
    "plus": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>`,
    "minus": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/></svg>`,
    "chevron-up": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m18 15-6-6-6 6"/></svg>`,
    "chevron-down": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>`,
    "chevrons-up-down": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m7 15 5 5 5-5"/><path d="m7 9 5-5 5 5"/></svg>`,
    "file-text": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>`,
    "book-open": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>`,
    "calendar": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/></svg>`,
    "lightbulb": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A5 5 0 0 0 8 8c0 1 .4 2.5 1.5 3.5.7.8 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>`,
    "terminal": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 17 10 11 4 5"/><line x1="12" x2="20" y1="19" y2="19"/></svg>`,
    "folder": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/></svg>`,
    "bookmark": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>`,
    "target": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>`,
    "inbox": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg>`,
    "info": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>`,
    "quote": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 .5V16c0 1-2.5 2.5-3 3h-.5M17 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-2c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 .5V16c0 1-2.5 2.5-3 3h-.5"/></svg>`,
    "check": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
    "presentation": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h20"/><path d="M21 3v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3"/><path d="m7 21 5-5 5 5"/></svg>`,
    "printer": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect width="12" height="8" x="6" y="14"/></svg>`,
    "feather": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"/><line x1="16" x2="2" y1="8" y2="22"/><line x1="17.5" x2="15" y1="15" y2="17.5"/></svg>`,
    "file": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/></svg>`,
    "menu": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>`,
    "rotate-ccw": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><polyline points="3 3 3 8 8 8"/></svg>`,
    "upload": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>`,
    "lock": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`,
    "unlock": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/></svg>`,
    "cloud": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.5 19A3.5 3.5 0 0 0 21 15.5c0-2.79-2.54-4.5-5-4.5-.42-1.04-1.37-3.5-4-3.5a5.5 5.5 0 0 0-5.5 5.5c-1.39.26-2.5 1.55-2.5 3A3.5 3.5 0 0 0 7.5 19z"/></svg>`,
    "refresh-cw": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 16h5v5"/></svg>`,
    "mail": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>`
  };

  const iconElements = document.querySelectorAll("[data-lucide]");
  iconElements.forEach(el => {
    const iconName = el.getAttribute("data-lucide");
    if (LOCAL_SVGS[iconName]) {
      el.innerHTML = LOCAL_SVGS[iconName];
      const svg = el.querySelector("svg");
      if (svg) {
        // Genişlik ve yüksekliği CSS stylesheet ezebilsin diye nitelik (attribute) olarak atıyoruz
        svg.setAttribute("width", "16");
        svg.setAttribute("height", "16");
        svg.style.stroke = "currentColor";
        svg.style.strokeWidth = "2";
      }
    }
  });
}

// BİRİNCİL İKON LİSTESİ (LUCIDE)
const ICON_LIST = [
  "file-text", "book-open", "calendar", "code", 
  "lightbulb", "check-square", "list", "bookmark", 
  "target", "inbox", "terminal", "folder"
];

// VARSAYILAN ŞABLONLAR
const DEFAULT_PAGES = [
  {
    id: "getting-started",
    title: "LinareN Başlangıç Rehberi",
    icon: "file-text",
    starred: false,
    deleted: false,
    content: `<h1>LinareN Çalışma Alanına Hoş Geldiniz</h1>
<p>Burası fikirlerinizi düzenlemek, planlar yapmak ve belgelerinizi güvenle arşivlemek için tasarlanmış minimalist yerel kütüphanenizdir. Bu uygulamada her enter tuşu doğal bir şekilde alt satıra geçerek tek bir bütün belge üzerinde çalışmanızı sağlar.</p>
<h2>Kullanım İpuçları</h2>
<p>Metinlerinizi biçimlendirmek için üstteki araç çubuğunu kullanabilirsiniz. Kalınlaştırabilir, renklendirebilir, başlıklar ve listeler oluşturabilirsiniz.</p>
<ul>
  <li>Maddeli listelerle fikirleri gruplayın</li>
  <li>Tablo simgesine tıklayarak belgenize anında veri tablosu yerleştirin</li>
  <li>Kod bloğu simgesiyle kodlarınızı yazın</li>
</ul>`
  }
];

// LINAREN YEREL VERİTABANI YÖNETİCİSİ V3 (VERSİYON GEÇMİŞİ EKLENDİ)
class LinareNDB {
  constructor() {
    this.dbName = "LinareNDB";
    this.dbVersion = 3;
    this.db = null;
  }

  init() {
    return new Promise((resolve, reject) => {
      if (typeof indexedDB === "undefined" || !window.indexedDB) {
        reject("IndexedDB bu tarayıcıda desteklenmiyor.");
        return;
      }

      // ESKİ AETHERNOTE VERİLERİNİ LİNAREN'E TAŞIMA (MIGRATION)
      try {
        const oldPages = localStorage.getItem("linaren_pages");
        const oldFolders = localStorage.getItem("linaren_folders");
        const oldPassHash = localStorage.getItem("linaren_password_hash");
        const oldRecHash = localStorage.getItem("linaren_recovery_hash");
        const oldEncRec = localStorage.getItem("linaren_encrypted_recovery");
        const oldTheme = localStorage.getItem("linaren_theme");

        if (oldPages && !localStorage.getItem("linaren_pages")) {
          localStorage.setItem("linaren_pages", oldPages);
        }
        if (oldFolders && !localStorage.getItem("linaren_folders")) {
          localStorage.setItem("linaren_folders", oldFolders);
        }
        if (oldPassHash && !localStorage.getItem("linaren_password_hash")) {
          localStorage.setItem("linaren_password_hash", oldPassHash);
        }
        if (oldRecHash && !localStorage.getItem("linaren_recovery_hash")) {
          localStorage.setItem("linaren_recovery_hash", oldRecHash);
        }
        if (oldEncRec && !localStorage.getItem("linaren_encrypted_recovery")) {
          localStorage.setItem("linaren_encrypted_recovery", oldEncRec);
        }
        if (oldTheme && !localStorage.getItem("linaren_theme")) {
          localStorage.setItem("linaren_theme", oldTheme);
        }
      } catch (e) {
        console.error("Veri taşıma hatası:", e);
      }
      
      const timeout = setTimeout(() => {
        reject("IndexedDB bağlantı zaman aşımı.");
      }, 1500);

      try {
        const request = indexedDB.open(this.dbName, this.dbVersion);

        request.onerror = (event) => {
          clearTimeout(timeout);
          console.error("IndexedDB bağlantı hatası:", event.target.error);
          reject(event.target.error);
        };

        request.onsuccess = (event) => {
          clearTimeout(timeout);
          this.db = event.target.result;
          resolve(this.db);
        };

        request.onupgradeneeded = (event) => {
          const db = event.target.result;
          if (!db.objectStoreNames.contains("pages")) {
            db.createObjectStore("pages", { keyPath: "id" });
          }
          if (!db.objectStoreNames.contains("folders")) {
            db.createObjectStore("folders", { keyPath: "id" });
          }
          if (!db.objectStoreNames.contains("version_history")) {
            const versionStore = db.createObjectStore("version_history", { keyPath: "id", autoIncrement: true });
            versionStore.createIndex("pageId", "pageId", { unique: false });
          }
        };

        request.onblocked = (event) => {
          clearTimeout(timeout);
          console.warn("IndexedDB yükseltmesi engellendi.");
          reject("IndexedDB yükseltmesi engellendi.");
        };
      } catch (err) {
        clearTimeout(timeout);
        reject(err);
      }
    });
  }

  // PAGES CRUD
  getAllPages() {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(["pages"], "readonly");
      const store = transaction.objectStore("pages");
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  savePage(page) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(["pages"], "readwrite");
      const store = transaction.objectStore("pages");
      const request = store.put(page);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  deletePage(id) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(["pages"], "readwrite");
      const store = transaction.objectStore("pages");
      const request = store.delete(id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // FOLDERS CRUD
  getAllFolders() {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(["folders"], "readonly");
      const store = transaction.objectStore("folders");
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  saveFolder(folder) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(["folders"], "readwrite");
      const store = transaction.objectStore("folders");
      const request = store.put(folder);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  deleteFolder(id) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(["folders"], "readwrite");
      const store = transaction.objectStore("folders");
      const request = store.delete(id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // VERSİYON GEÇMİŞİ CRUD METOTLARI
  saveVersion(version) {
    return new Promise((resolve, reject) => {
      if (!this.db) return resolve(null);
      const tx = this.db.transaction("version_history", "readwrite");
      const store = tx.objectStore("version_history");
      store.put(version);
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => reject(tx.error);
    });
  }

  getPageVersions(pageId) {
    return new Promise((resolve, reject) => {
      if (!this.db) return resolve([]);
      const tx = this.db.transaction("version_history", "readonly");
      const store = tx.objectStore("version_history");
      const index = store.index("pageId");
      const request = index.getAll(pageId);
      request.onsuccess = () => {
        const res = request.result || [];
        res.sort((a, b) => b.timestamp - a.timestamp);
        resolve(res);
      };
      request.onerror = () => reject(request.error);
    });
  }

  deletePageVersions(pageId) {
    return new Promise((resolve, reject) => {
      if (!this.db) return resolve(true);
      const tx = this.db.transaction("version_history", "readwrite");
      const store = tx.objectStore("version_history");
      const index = store.index("pageId");
      const request = index.openCursor(IDBKeyRange.only(pageId));
      request.onsuccess = (e) => {
        const cursor = e.target.result;
        if (cursor) {
          cursor.delete();
          cursor.continue();
        }
      };
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => reject(tx.error);
    });
  }

  clearAll() {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(["pages", "folders", "version_history"], "readwrite");
      transaction.objectStore("pages").clear();
      transaction.objectStore("folders").clear();
      transaction.objectStore("version_history").clear();
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  }
}

// UYGULAMA BELLEK DURUMU
const dbManager = new LinareNDB();
let pages = [];
let folders = [];
let currentPageId = null;

// Şifrelenmiş klasörler için geçici şifre önbelleği (RAM'de tutulur, diskte asla)
let unlockedFolderPasswords = {};
let openFolders = new Set();
let pendingUnlockFolderId = null;

// DOM ELEMANLARI
const elements = {
  sidebar: document.getElementById("sidebar"),
  sidebarToggle: document.getElementById("sidebar-toggle"),
  pagesList: document.getElementById("pages-list"),
  favoritesList: document.getElementById("favorites-list"),
  newPageBtn: document.getElementById("new-page-btn"),
  
  pageIconBtn: document.getElementById("page-icon-btn"),
  favoriteToggleBtn: document.getElementById("favorite-toggle-btn"),
  exportDropdownBtn: document.getElementById("export-dropdown-btn"),
  exportDropdown: document.getElementById("export-dropdown"),
  deletePageBtn: document.getElementById("delete-page-btn"),
  pageTitleInput: document.getElementById("page-title-input"),
  editorBody: document.getElementById("editor-body"),
  pageFolderSelect: document.getElementById("page-folder-select"),
  
  // Modaller
  searchTriggerBtn: document.getElementById("search-trigger-btn"),
  searchModal: document.getElementById("search-modal"),
  searchInput: document.getElementById("search-input"),
  searchResults: document.getElementById("search-results"),
  
  settingsBtn: document.getElementById("settings-btn"),
  settingsModal: document.getElementById("settings-modal"),
  closeSettingsModal: document.getElementById("close-settings-modal"),
  resetWorkspaceBtn: document.getElementById("reset-workspace-btn"),
  exportAllBtn: document.getElementById("export-all-btn"),
  importBackupBtn: document.getElementById("import-backup-btn"),
  importFileInput: document.getElementById("import-file-input"),
  
  trashTriggerBtn: document.getElementById("trash-trigger-btn"),
  trashModal: document.getElementById("trash-modal"),
  closeTrashModal: document.getElementById("close-trash-modal"),
  trashList: document.getElementById("trash-list"),
  trashCount: document.getElementById("trash-count"),
  
  // Yüzen Menüler
  iconPicker: document.getElementById("icon-picker"),
  
  // Klasör Yapıları
  foldersList: document.getElementById("folders-list"),
  newFolderBtn: document.getElementById("new-folder-btn"),
  folderModal: document.getElementById("folder-modal"),
  folderNameInput: document.getElementById("folder-name-input"),
  folderEncryptCheck: document.getElementById("folder-encrypt-check"),
  folderPasswordSection: document.getElementById("folder-password-section"),
  folderPasswordInput: document.getElementById("folder-password-input"),
  closeFolderModal: document.getElementById("close-folder-modal"),
  saveFolderBtn: document.getElementById("save-folder-btn"),
  
  unlockFolderModal: document.getElementById("unlock-folder-modal"),
  unlockPasswordInput: document.getElementById("unlock-password-input"),
  closeUnlockModal: document.getElementById("close-unlock-modal"),
  unlockFolderBtn: document.getElementById("unlock-folder-btn")
};

// UYGULAMAYI BAŞLAT
window.addEventListener("DOMContentLoaded", () => {
  checkAuthAndStart();
  registerServiceWorker();
});

// UYGULAMAYI BAŞLAT (GİRİŞ ONAYINDAN SONRA TETİKLENİR)
async function startApplication() {
  const overlay = document.getElementById("auth-overlay");
  if (overlay) overlay.style.display = "none";

  try {
    await initDatabaseAndLoad();
  } catch (e) {
    console.error("Veritabanı yükleme hatası:", e);
  }
  
  try {
    initEventListeners();
  } catch (e) {
    console.error("Olay dinleyicileri başlatma hatası:", e);
  }
  
  try {
    renderSidebar();
  } catch (e) {
    console.error("Kenar çubuğu çizim hatası:", e);
  }
  
  try {
    updateFolderSelectOptions();
  } catch (e) {
    console.error("Klasör seçenekleri güncelleme hatası:", e);
  }
  
  try {
    const activePages = pages.filter(p => p && !p.deleted);
    if (activePages.length > 0) {
      selectPage(activePages[0].id);
    } else {
      createNewPage();
    }
  } catch (e) {
    console.error("Varsayılan sayfa seçme hatası:", e);
  }
  
  try {
    safeCreateIcons();
  } catch (e) {
    console.error("İkon çizim hatası:", e);
  }

  // Bulut Eşitlemeyi Başlat ve Uzak Değişiklikleri Sorgula
  try {
    initCloudSyncUI();
    checkCloudSyncOnStart();
  } catch (e) {
    console.error("Bulut eşitleme başlatma hatası:", e);
  }

  // Otomatik yedekleme zamanlayıcısını başlat (60 saniyede bir kontrol et)
  try {
    setInterval(checkBackupScheduler, 60000);
    // İlk açılışta hemen bir kez kontrol et (kaçırılan yedekler için)
    setTimeout(checkBackupScheduler, 5000);
  } catch (e) {
    console.error("Zamanlayıcı başlatma hatası:", e);
  }

  // E-posta Ayarlarını Yükle
  try {
    initEmailSettings();
  } catch (e) {
    console.error("E-posta ayarları yükleme hatası:", e);
  }
}

// GİRİŞ KONTROLÜ VE EKRAN YÖNETİMİ
function checkAuthAndStart() {
  const overlay = document.getElementById("auth-overlay");
  const loginCard = document.getElementById("auth-login-card");
  const registerCard = document.getElementById("auth-register-card");
  const recoverCard = document.getElementById("auth-recover-card");

  if (!overlay) return;

  // Önce tüm kartları gizle
  loginCard.style.display = "none";
  registerCard.style.display = "none";
  recoverCard.style.display = "none";
  overlay.style.display = "flex";

  const passwordHash = localStorage.getItem("linaren_password_hash");

  if (!passwordHash) {
    // Şifre yoksa -> İlk Kayıt
    registerCard.style.display = "flex";
    initRegisterEvents();
  } else {
    // Şifre varsa -> Giriş Yap
    loginCard.style.display = "flex";
    initLoginEvents();
  }
}

// 16 HANELİ RASTGELE YEDEK KOD ÜRETİCİ
function generateRecoveryCode() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 16; i++) {
    if (i > 0 && i % 4 === 0) code += "-";
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// KAYIT OLAYLARI BINDING
function initRegisterEvents() {
  const registerBtn = document.getElementById("register-btn");
  const registerDoneBtn = document.getElementById("register-done-btn");
  const copyBtn = document.getElementById("copy-recovery-code-btn");
  const recoverySection = document.getElementById("register-recovery-section");
  const codeDisplay = document.getElementById("generated-recovery-code");

  if (!registerBtn) return;

  registerBtn.onclick = () => {
    const pass = document.getElementById("register-password").value;
    const confirm = document.getElementById("register-password-confirm").value;

    if (!pass || !confirm) {
      alert("Lütfen şifre alanlarını doldurun.");
      return;
    }
    if (pass.length < 6) {
      alert("Şifreniz en az 6 karakterden oluşmalıdır.");
      return;
    }
    if (pass !== confirm) {
      alert("Şifreler uyuşmuyor.");
      return;
    }

    // Şifre hash ve Kurtarma kodu üretim
    const passHash = sha256(pass);
    const recoveryCode = generateRecoveryCode();
    const recoveryHash = sha256(recoveryCode);

    // Kriptografik güvenli saklama: Kurtarma kodunu şifre ile simetrik olarak şifrele
    const encRecovery = encryptText(recoveryCode, pass);

    localStorage.setItem("linaren_password_hash", passHash);
    localStorage.setItem("linaren_recovery_hash", recoveryHash);
    localStorage.setItem("linaren_encrypted_recovery", encRecovery);
    localStorage.setItem("linaren_theme", "dark"); // Varsayılan koyu

    codeDisplay.textContent = recoveryCode;
    recoverySection.style.display = "flex";
    
    // Şifre girdilerini gizle
    document.getElementById("register-password").parentElement.style.display = "none";
    document.getElementById("register-password-confirm").parentElement.style.display = "none";
    registerBtn.style.display = "none";
    registerDoneBtn.style.display = "block";
  };

  copyBtn.onclick = () => {
    navigator.clipboard.writeText(codeDisplay.textContent);
    alert("Kurtarma yedek kodu panoya kopyalandı!");
  };

  registerDoneBtn.onclick = () => {
    startApplication();
  };
}

// GİRİŞ OLAYLARI BINDING
function initLoginEvents() {
  const loginBtn = document.getElementById("login-btn");
  const loginInput = document.getElementById("login-password");
  const goRecoverLink = document.getElementById("go-recover-btn");

  if (!loginBtn) return;

  const handleLogin = () => {
    const pass = loginInput.value;
    if (!pass) return;

    const hash = sha256(pass);
    const savedHash = localStorage.getItem("linaren_password_hash");

    if (hash === savedHash) {
      startApplication();
    } else {
      alert("Hatalı şifre!");
      loginInput.value = "";
      loginInput.focus();
    }
  };

  loginBtn.onclick = handleLogin;
  loginInput.onkeydown = (e) => {
    if (e.key === "Enter") handleLogin();
  };

  goRecoverLink.onclick = () => {
    document.getElementById("auth-login-card").style.display = "none";
    document.getElementById("auth-recover-card").style.display = "flex";
    initRecoverEvents();
  };
  
  setTimeout(() => loginInput.focus(), 50);
}

// ŞİFRE KURTARMA VE SIFIRLAMA BINDING
function initRecoverEvents() {
  const recoverBtn = document.getElementById("recover-btn");
  const goLoginLink = document.getElementById("go-login-btn");
  const codeInput = document.getElementById("recovery-code-input");
  const newPassInput = document.getElementById("new-password-input");

  if (!recoverBtn) return;

  recoverBtn.onclick = () => {
    const code = codeInput.value.trim().toUpperCase();
    const newPass = newPassInput.value;

    if (!code || !newPass) {
      alert("Lütfen tüm alanları doldurun.");
      return;
    }
    if (newPass.length < 6) {
      alert("Yeni şifre en az 6 karakter olmalıdır.");
      return;
    }

    const codeHash = sha256(code);
    const savedCodeHash = localStorage.getItem("linaren_recovery_hash");

    if (codeHash === savedCodeHash) {
      // Şifreyi sıfırla ve yeni şifreyle kurtarma kodunu tekrar şifrele
      const passHash = sha256(newPass);
      const encRecovery = encryptText(code, newPass);

      localStorage.setItem("linaren_password_hash", passHash);
      localStorage.setItem("linaren_encrypted_recovery", encRecovery);

      alert("Şifreniz başarıyla sıfırlandı ve giriş yapıldı!");
      startApplication();
    } else {
      alert("Girdiğiniz kurtarma kodu hatalı!");
    }
  };

  goLoginLink.onclick = () => {
    document.getElementById("auth-recover-card").style.display = "none";
    document.getElementById("auth-login-card").style.display = "flex";
    initLoginEvents();
  };
}

// VERİTABANI YÜKLEME VE KORUMA DÖNGÜSÜ + ESKİ VERİ GÖÇÜ (MIGRATION)
async function initDatabaseAndLoad() {
  try {
    await dbManager.init();
    const dbPages = await dbManager.getAllPages();
    const dbFolders = await dbManager.getAllFolders();
    
    if (dbPages && dbPages.length > 0) {
      pages = dbPages;
      pages.forEach(p => {
        if (p && p.folderId) {
          const folder = dbFolders ? dbFolders.find(f => f.id === p.folderId) : null;
          if (folder && folder.encrypted) {
            delete p.decrypted;
          }
        }
      });
    } else {
      const localData = localStorage.getItem("linaren_pages");
      if (localData) {
        pages = JSON.parse(localData);
      } else {
        pages = JSON.parse(JSON.stringify(DEFAULT_PAGES));
      }
    }
    
    if (dbFolders && dbFolders.length > 0) {
      folders = dbFolders;
    } else {
      const localFolders = localStorage.getItem("linaren_folders");
      if (localFolders) {
        folders = JSON.parse(localFolders);
      } else {
        folders = [];
      }
    }
  } catch (err) {
    console.error("IndexedDB hatası nedeniyle yedek katmana (LocalStorage) geçiliyor:", err);
    try {
      const storedPages = localStorage.getItem("linaren_pages");
      pages = storedPages ? JSON.parse(storedPages) : JSON.parse(JSON.stringify(DEFAULT_PAGES));
    } catch(e) {
      pages = JSON.parse(JSON.stringify(DEFAULT_PAGES));
    }
    try {
      const storedFolders = localStorage.getItem("linaren_folders");
      folders = storedFolders ? JSON.parse(storedFolders) : [];
    } catch(e) {
      folders = [];
    }
  }

  // Güvenlik: Dizi doğrulamaları
  if (!pages || !Array.isArray(pages)) {
    pages = JSON.parse(JSON.stringify(DEFAULT_PAGES));
  }
  if (!folders || !Array.isArray(folders)) {
    folders = [];
  }

  // Çöp Kutusu Otomatik Temizleme (30 Gün Geçenleri Sil)
  const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;
  const nowTime = Date.now();
  const pagesToPermanentlyDelete = pages.filter(p => p.deleted && p.deletedAt && (nowTime - p.deletedAt > THIRTY_DAYS_MS));
  let trashCleaned = false;
  
  if (pagesToPermanentlyDelete.length > 0) {
    console.log(`LinareN: 30 günü dolduran ${pagesToPermanentlyDelete.length} adet belge otomatik temizleniyor.`);
    for (const p of pagesToPermanentlyDelete) {
      try {
        await dbManager.deletePage(p.id);
        await dbManager.deletePageVersions(p.id);
      } catch (err) {
        console.error("Otomatik çöp silme IndexedDB hatası:", err);
      }
    }
    // Bellekten temizle
    pages = pages.filter(p => !pagesToPermanentlyDelete.some(dp => dp.id === p.id));
    trashCleaned = true;
  }

  // Eski Blok Verilerini Zengin HTML Biçimine Kayıpsız Dönüştür
  let migrated = trashCleaned;
  pages.forEach(page => {
    if (page && page.blocks && !page.content) {
      migrated = true;
      let html = "";
      page.blocks.forEach(b => {
        if (b) {
          if (b.type === "h1") html += `<h1>${b.content || ''}</h1>`;
          else if (b.type === "h2") html += `<h2>${b.content || ''}</h2>`;
          else if (b.type === "h3") html += `<h3>${b.content || ''}</h3>`;
          else if (b.type === "code") html += `<pre class="editor-code-block"><code>${b.content || ''}</code></pre>`;
          else if (b.type === "bullet") html += `<ul><li>${b.content || ''}</li></ul>`;
          else if (b.type === "number") html += `<ol><li>${b.content || ''}</li></ol>`;
          else if (b.type === "todo") {
            const checkedAttr = b.properties && b.properties.checked ? "checked" : "";
            html += `<p><input type="checkbox" style="margin-right:8px; width:14px; height:14px; accent-color:#6366f1;" ${checkedAttr}> ${b.content || ''}</p>`;
          }
          else html += `<p>${b.content || ''}</p>`;
        }
      });
      page.content = html;
      delete page.blocks;
    }
  });

  if (migrated) {
    await saveData();
  } else {
    try {
      await syncToIndexedDB();
    } catch (e) {
      console.warn("Kök veritabanı eşleme hatası yoksayıldı:", e);
    }
  }
}

// BÜTÜN SAYFALARI VE KLASÖRLERİ INDEXEDDB'YE YAZ
async function syncToIndexedDB() {
  try {
    for (const page of pages) {
      await dbManager.savePage(page);
    }
    for (const folder of folders) {
      await dbManager.saveFolder(folder);
    }
  } catch (err) {
    console.error("IndexedDB senkronizasyon hatası:", err);
  }
}

// ÇİFT KATMANLI GÜVENLİ VE ŞİFRELİ VERİ KAYDETME
async function saveData() {
  try {
    // RAM'de açık şifreli dosyaları disk için şifrelenmiş klon olarak kaydederiz
    const pagesClone = JSON.parse(JSON.stringify(pages));
    pagesClone.forEach(p => {
      // Eğer şifresi çözülmüş durumdaysa, kaydederken şifreleriz
      if (p.folderId && p.decrypted) {
        const folder = folders.find(f => f.id === p.folderId);
        const pass = unlockedFolderPasswords[p.folderId];
        if (folder && folder.encrypted && pass) {
          p.title = encryptText(p.title, pass);
          p.content = encryptText(p.content, pass);
        }
        delete p.decrypted;
      }
    });

    localStorage.setItem("linaren_pages", JSON.stringify(pagesClone));
    localStorage.setItem("linaren_folders", JSON.stringify(folders));
    
    // IndexedDB Yazımı
    for (const page of pagesClone) {
      await dbManager.savePage(page);
    }
    for (const folder of folders) {
      await dbManager.saveFolder(folder);
    }

    // Bulut Yedeklemesi (Push) tetikle
    scheduleCloudPush();
  } catch (err) {
    console.error("Veri kaydetme hatası:", err);
  }
}

// ÇÖP SAYISINI GÜNCELLE
function updateTrashCount() {
  const deletedCount = pages.filter(p => p.deleted).length;
  elements.trashCount.textContent = deletedCount;
}

// ETKİLEŞİM VE OLAY DİNLEYİCİLERİ
function initEventListeners() {
  // Arama Modalı
  elements.searchTriggerBtn.addEventListener("click", openSearch);
  elements.searchModal.addEventListener("click", (e) => {
    if (e.target === elements.searchModal) closeSearch();
  });
  elements.searchInput.addEventListener("input", performSearch);
  
  // Kısayollar
  window.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.key.toLowerCase() === "k") {
      e.preventDefault();
      openSearch();
    }
    if (e.key === "Escape") {
      closeAllModals();
    }
  });

  // Yeni Sayfa Ekleme
  elements.newPageBtn.addEventListener("click", () => createNewPage());

  // Mobil Sidebar & Overlay
  elements.sidebarToggle.addEventListener("click", () => {
    const isOpen = elements.sidebar.classList.toggle("open");
    const overlay = document.getElementById("sidebar-overlay");
    if (overlay) {
      overlay.classList.toggle("active", isOpen);
    }
  });

  // Kapatma tetikleyicileri
  document.addEventListener("click", (e) => {
    if (!elements.pageIconBtn.contains(e.target) && !elements.iconPicker.contains(e.target)) {
      elements.iconPicker.classList.remove("open");
    }
    if (elements.exportDropdown && !elements.exportDropdownBtn.contains(e.target) && !elements.exportDropdown.contains(e.target)) {
      elements.exportDropdown.classList.remove("open");
    }
    
    const tbarColorDropdown = document.getElementById("tbar-color-dropdown");
    const tbarBtnColor = document.getElementById("tbar-color-btn");
    if (tbarColorDropdown && tbarBtnColor && !tbarBtnColor.contains(e.target) && !tbarColorDropdown.contains(e.target)) {
      tbarColorDropdown.classList.remove("open");
    }
  });

  // İkon Seçici Tetikleme
  elements.pageIconBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleIconPicker();
  });

  // Favori ve Silme Butonları
  elements.favoriteToggleBtn.addEventListener("click", toggleFavorite);
  elements.deletePageBtn.addEventListener("click", deleteCurrentPage);

  // Ayarlar Modalı
  elements.settingsBtn.addEventListener("click", () => {
    const firstTabBtn = document.querySelector('.settings-tab-btn[data-tab="tab-general"]');
    if (firstTabBtn) firstTabBtn.click();
    elements.settingsModal.classList.add("open");
  });

  // Ayarlar Tab Geçiş Yönetimi
  const tabBtns = document.querySelectorAll(".settings-tab-btn");
  const tabContents = document.querySelectorAll(".settings-tab-content");
  tabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      tabBtns.forEach(b => b.classList.remove("active"));
      tabContents.forEach(c => c.style.display = "none");
      
      btn.classList.add("active");
      const tabId = btn.dataset.tab;
      const content = document.getElementById(tabId);
      if (content) {
        content.style.display = "flex";
      }
      
      if (tabId === "tab-history") {
        populateHistoryPageSelect();
      }
      
      safeCreateIcons();
    });
  });
  elements.closeSettingsModal.addEventListener("click", () => {
    elements.settingsModal.classList.remove("open");
  });
  elements.settingsModal.addEventListener("click", (e) => {
    if (e.target === elements.settingsModal) elements.settingsModal.classList.remove("open");
  });
  elements.resetWorkspaceBtn.addEventListener("click", resetWorkspace);
  elements.exportAllBtn.addEventListener("click", exportAllData);
  
  elements.importBackupBtn.addEventListener("click", () => {
    elements.importFileInput.click();
  });
  elements.importFileInput.addEventListener("change", handleImportBackup);

  // Tema Seçici Entegrasyonu
  const themeSelect = document.getElementById("theme-select");
  if (themeSelect) {
    themeSelect.value = localStorage.getItem("linaren_theme") || "dark";
    themeSelect.addEventListener("change", (e) => {
      const theme = e.target.value;
      localStorage.setItem("linaren_theme", theme);
      document.body.setAttribute("data-theme", theme);
    });
  }

  // Şifre Değiştirme Entegrasyonu
  const changePasswordBtn = document.getElementById("change-password-btn");
  if (changePasswordBtn) {
    changePasswordBtn.addEventListener("click", () => {
      const currentPass = document.getElementById("change-pass-current").value;
      const newPass = document.getElementById("change-pass-new").value;
      
      if (!currentPass || !newPass) {
        alert("Lütfen tüm alanları doldurun.");
        return;
      }
      if (newPass.length < 6) {
        alert("Yeni şifre en az 6 karakter olmalıdır.");
        return;
      }
      
      const currentHash = sha256(currentPass);
      const savedHash = localStorage.getItem("linaren_password_hash");
      
      if (currentHash === savedHash) {
        const newHash = sha256(newPass);
        // Önce kurtarma kodunu çözüp yeni şifreyle tekrar şifreleyelim (veri kaybını önlemek için)
        const encRecovery = localStorage.getItem("linaren_encrypted_recovery");
        const decRecovery = decryptText(encRecovery, currentPass);
        
        localStorage.setItem("linaren_password_hash", newHash);
        localStorage.setItem("linaren_encrypted_recovery", encryptText(decRecovery, newPass));
        
        document.getElementById("change-pass-current").value = "";
        document.getElementById("change-pass-new").value = "";
        alert("Şifreniz başarıyla güncellendi!");
      } else {
        alert("Mevcut şifreniz hatalı!");
      }
    });
  }

  // Kurtarma Kodu Görüntüleme Entegrasyonu
  const viewRecoveryBtn = document.getElementById("view-recovery-btn");
  const settingsRecoveryBox = document.getElementById("settings-recovery-display-box");
  const settingsRecoveryCode = document.getElementById("settings-recovery-code");
  if (viewRecoveryBtn) {
    viewRecoveryBtn.addEventListener("click", () => {
      const pass = document.getElementById("view-recovery-password").value;
      if (!pass) {
        alert("Lütfen şifrenizi girin.");
        return;
      }
      
      const currentHash = sha256(pass);
      const savedHash = localStorage.getItem("linaren_password_hash");
      
      if (currentHash === savedHash) {
        const encRecovery = localStorage.getItem("linaren_encrypted_recovery");
        const decRecovery = decryptText(encRecovery, pass);
        if (decRecovery) {
          settingsRecoveryCode.textContent = decRecovery;
          settingsRecoveryBox.style.display = "block";
          document.getElementById("view-recovery-password").value = "";
        } else {
          alert("Kurtarma kodu çözülemedi!");
        }
      } else {
        alert("Şifreniz hatalı!");
      }
    });
  }

  // Çöp Kutusu
  elements.trashTriggerBtn.addEventListener("click", openTrashModal);
  elements.closeTrashModal.addEventListener("click", () => elements.trashModal.classList.remove("open"));
  elements.trashModal.addEventListener("click", (e) => {
    if (e.target === elements.trashModal) elements.trashModal.classList.remove("open");
  });

  // Başlık Girdi Olayı
  elements.pageTitleInput.addEventListener("input", handleTitleChange);

  // Dışa Aktarım Dropdown Menüsü Tetikleme
  elements.exportDropdownBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    elements.exportDropdown.classList.toggle("open");
  });

  // Dışa Aktarım Butonları Olayları
  const exportOptions = elements.exportDropdown.querySelectorAll(".export-option-btn");
  exportOptions.forEach(btn => {
    btn.addEventListener("click", () => {
      const format = btn.dataset.format;
      exportCurrentPageFormat(format);
      elements.exportDropdown.classList.remove("open");
    });
  });

  // Editör içi klavye ve kaydetme olayları
  elements.editorBody.addEventListener("input", () => {
    const page = pages.find(p => p.id === currentPageId);
    if (page) {
      page.content = elements.editorBody.innerHTML;
      saveData();
      
      // Kelime sayacı ve backlinks listesini güncelle
      updateStatusBar();
      scheduleVersionSnapshot(page.id);
    }
  });

  // Markdown kısayolları, WikiLink arama tetikleyicileri
  elements.editorBody.addEventListener("keydown", (e) => {
    handleMarkdownShortcuts(e);
    handleWikiLinkTrigger(e);
  });

  // Zen Modu Klavye Kısayolu (Ctrl+Shift+Z)
  window.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "z") {
      e.preventDefault();
      toggleZenMode();
    }
  });

  // Zen Butonları Olay Dinleyicileri
  const zenTriggerBtn = document.getElementById("zen-trigger-btn");
  const zenFloatBtn = document.getElementById("zen-toggle-floating-btn");
  if (zenTriggerBtn) zenTriggerBtn.addEventListener("click", toggleZenMode);
  if (zenFloatBtn) zenFloatBtn.addEventListener("click", toggleZenMode);

  // Yağmur Sesi Sentezleyici Düğmesi
  const ambientBtn = document.getElementById("ambient-sound-btn");
  if (ambientBtn) {
    ambientBtn.addEventListener("click", () => {
      toggleAmbientSound();
    });
  }

  // Zihin Ağ Haritası (Graph View) Açma Düğmesi
  const graphBtn = document.getElementById("graph-trigger-btn");
  if (graphBtn) {
    graphBtn.addEventListener("click", () => {
      openGraphModal();
    });
  }
  const closeGraphBtn = document.getElementById("close-graph-modal");
  if (closeGraphBtn) {
    closeGraphBtn.addEventListener("click", () => {
      document.getElementById("graph-modal").classList.remove("open");
    });
  }

  // Sürüm Geçmişi Belge Seçimi ve Geri Yükleme
  const histPageSelect = document.getElementById("history-page-select");
  if (histPageSelect) {
    histPageSelect.addEventListener("change", (e) => {
      loadPageVersionsList(e.target.value);
    });
  }
  const histRestoreBtn = document.getElementById("history-restore-btn");
  if (histRestoreBtn) {
    histRestoreBtn.addEventListener("click", () => {
      restoreSelectedVersion();
    });
  }

  // Tablo içi Tab tuşu ile satır ekleme (Tablatör)
  elements.editorBody.addEventListener("keydown", (e) => {
    if (e.key === "Tab") {
      const sel = window.getSelection();
      if (sel.rangeCount > 0) {
        const td = sel.anchorNode.nodeType === 3 ? sel.anchorNode.parentElement.closest("td") : sel.anchorNode.closest("td");
        if (td) {
          e.preventDefault();
          const tr = td.parentElement;
          const tbody = tr.parentElement;
          const nextTd = td.nextElementSibling;
          if (nextTd) {
            nextTd.focus();
          } else {
            const nextTr = tr.nextElementSibling;
            if (nextTr) {
              nextTr.firstElementChild.focus();
            } else {
              // Son hücredeyken Tab'a basılırsa yeni satır ekle
              const colsCount = tr.children.length;
              const newTr = document.createElement("tr");
              for (let i = 0; i < colsCount; i++) {
                const newTd = document.createElement("td");
                newTd.innerHTML = "";
                newTr.appendChild(newTd);
              }
              tbody.appendChild(newTr);
              newTr.firstElementChild.focus();
              
              const page = pages.find(p => p.id === currentPageId);
              if (page) {
                page.content = elements.editorBody.innerHTML;
                saveData();
              }
            }
          }
        }
      }
    }
  });

  // SABİT ARAÇ ÇUBUĞU BUTON OLAYLARI
  const tbarButtons = [
    { id: "tbar-bold", cmd: "bold" },
    { id: "tbar-italic", cmd: "italic" },
    { id: "tbar-underline", cmd: "underline" },
    { id: "tbar-strike", cmd: "strikeThrough" }
  ];

  tbarButtons.forEach(btn => {
    const el = document.getElementById(btn.id);
    if (el) {
      el.addEventListener("mousedown", (e) => {
        e.preventDefault();
        document.execCommand(btn.cmd, false, null);
        elements.editorBody.dispatchEvent(new Event("input"));
      });
    }
  });

  // Blok Tipi Dönüştürücü Butonları (H1, H2, H3, P, Liste vb.)
  const typeButtons = ["h1", "h2", "h3", "p", "todo", "bullet", "number", "table", "code"];
  typeButtons.forEach(type => {
    const el = document.getElementById("tbar-" + type);
    if (el) {
      el.addEventListener("click", (e) => {
        e.preventDefault();
        elements.editorBody.focus();
        
        switch (type) {
          case 'h1': document.execCommand("formatBlock", false, "H1"); break;
          case 'h2': document.execCommand("formatBlock", false, "H2"); break;
          case 'h3': document.execCommand("formatBlock", false, "H3"); break;
          case 'p': document.execCommand("formatBlock", false, "P"); break;
          case 'todo':
            document.execCommand("insertHTML", false, `<p><input type="checkbox" style="margin-right:8px; width:14px; height:14px; accent-color:#6366f1;"> </p>`);
            break;
          case 'bullet': document.execCommand("insertUnorderedList"); break;
          case 'number': document.execCommand("insertOrderedList"); break;
          case 'table':
            const tableHtml = `
              <table class="editor-table">
                <thead>
                  <tr><th>Başlık 1</th><th>Başlık 2</th><th>Başlık 3</th></tr>
                </thead>
                <tbody>
                  <tr><td></td><td></td><td></td></tr>
                  <tr><td></td><td></td><td></td></tr>
                </tbody>
              </table><p></p>
            `;
            document.execCommand("insertHTML", false, tableHtml);
            break;
          case 'code':
            const codeHtml = `<pre class="editor-code-block"><code>// Kod yazın...</code></pre><p></p>`;
            document.execCommand("insertHTML", false, codeHtml);
            break;
        }
        elements.editorBody.dispatchEvent(new Event("input"));
      });
    }
  });

  // Sabit Araç Çubuğu Renk Dropdown Tetikleme
  const tbarBtnColor = document.getElementById("tbar-color-btn");
  const tbarColorDropdown = document.getElementById("tbar-color-dropdown");
  if (tbarBtnColor && tbarColorDropdown) {
    tbarBtnColor.addEventListener("click", (e) => {
      e.stopPropagation();
      tbarColorDropdown.classList.toggle("open");
    });

    // Renk seçenekleri
    const tbarColorOptions = tbarColorDropdown.querySelectorAll(".tbar-color-option-btn");
    tbarColorOptions.forEach(opt => {
      opt.addEventListener("mousedown", (e) => {
        e.preventDefault();
        const color = opt.dataset.color;
        const bg = opt.dataset.bg;
        
        if (color) {
          document.execCommand("foreColor", false, color);
        } else if (bg) {
          document.execCommand("backColor", false, bg);
        }
        
        elements.editorBody.dispatchEvent(new Event("input"));
        tbarColorDropdown.classList.remove("open");
      });
    });
  }

  // KLASÖR OLAYLARI VE MODALLARI BINDING
  elements.newFolderBtn.addEventListener("click", () => {
    elements.folderModal.classList.add("open");
    elements.folderNameInput.value = "";
    elements.folderEncryptCheck.checked = false;
    elements.folderPasswordSection.style.display = "none";
    elements.folderPasswordInput.value = "";
  });

  elements.closeFolderModal.addEventListener("click", () => {
    elements.folderModal.classList.remove("open");
  });

  elements.folderEncryptCheck.addEventListener("change", (e) => {
    elements.folderPasswordSection.style.display = e.target.checked ? "block" : "none";
  });

  elements.saveFolderBtn.addEventListener("click", createFolder);

  elements.closeUnlockModal.addEventListener("click", () => {
    elements.unlockFolderModal.classList.remove("open");
    pendingUnlockFolderId = null;
  });

  elements.unlockFolderBtn.addEventListener("click", unlockPendingFolder);
  
  elements.unlockPasswordInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") unlockPendingFolder();
  });

  // Sayfa Klasörü Değiştirildiğinde
  elements.pageFolderSelect.addEventListener("change", handlePageFolderChange);

  // Kök Sayfa Listesi Sürükle Bırak Desteği (Klasörden çıkarmak için)
  elements.pagesList.addEventListener("dragover", (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  });
  elements.pagesList.addEventListener("dragenter", (e) => {
    e.preventDefault();
    elements.pagesList.classList.add("drag-over");
  });
  elements.pagesList.addEventListener("dragleave", () => {
    elements.pagesList.classList.remove("drag-over");
  });
  elements.pagesList.addEventListener("drop", (e) => {
    e.preventDefault();
    elements.pagesList.classList.remove("drag-over");
    const pageId = e.dataTransfer.getData("text/plain");
    if (pageId) {
      movePageToFolder(pageId, null);
    }
  });

  // Bulut Eşitleme UI Olayları
  const syncTokenInput = document.getElementById("sync-github-token");
  const syncGistInput = document.getElementById("sync-gist-id");
  const syncAutoCheck = document.getElementById("sync-auto-check");
  const syncCreateBtn = document.getElementById("sync-create-gist-btn");
  const syncPushBtn = document.getElementById("sync-push-btn");
  const syncPullBtn = document.getElementById("sync-pull-btn");
  const syncDisconnectBtn = document.getElementById("sync-disconnect-btn");

  if (syncTokenInput) {
    syncTokenInput.addEventListener("input", (e) => {
      localStorage.setItem("linaren_gist_token", e.target.value.trim());
      updateSyncUIState();
    });
  }
  if (syncGistInput) {
    syncGistInput.addEventListener("input", (e) => {
      localStorage.setItem("linaren_gist_id", e.target.value.trim());
      updateSyncUIState();
    });
  }
  if (syncAutoCheck) {
    syncAutoCheck.addEventListener("change", (e) => {
      localStorage.setItem("linaren_gist_autosync", e.target.checked ? "true" : "false");
    });
  }
  if (syncCreateBtn) {
    syncCreateBtn.addEventListener("click", handleCreateGist);
  }
  if (syncPushBtn) {
    syncPushBtn.addEventListener("click", () => handlePushToGist(false));
  }
  if (syncPullBtn) {
    syncPullBtn.addEventListener("click", () => handlePullFromGist(false));
  }
  if (syncDisconnectBtn) {
    syncDisconnectBtn.addEventListener("click", handleDisconnectSync);
  }

  // Mobil Arayüz Overlay Tıklama Olayı (Yan menüyü kapatmak için)
  const sidebarOverlay = document.getElementById("sidebar-overlay");
  if (sidebarOverlay) {
    sidebarOverlay.addEventListener("click", () => {
      elements.sidebar.classList.remove("open");
      sidebarOverlay.classList.remove("active");
    });
  }

  // Yazdır Butonu
  const printPageBtn = document.getElementById("print-page-btn");
  if (printPageBtn) {
    printPageBtn.addEventListener("click", () => {
      window.print();
    });
  }

  // E-posta Gönder Butonu (Toolbar'daki)
  const emailPageBtn = document.getElementById("email-page-btn");
  if (emailPageBtn) {
    emailPageBtn.addEventListener("click", () => {
      sendNoteViaEmail();
    });
  }

  // E-posta Ayarları UI Olayları
  const emailTargetInput = document.getElementById("email-target-address");
  const emailMethodSelect = document.getElementById("email-send-method");
  const emailPubKeyInput = document.getElementById("email-js-public-key");
  const emailServiceInput = document.getElementById("email-js-service-id");
  const emailTemplateInput = document.getElementById("email-js-template-id");
  const emailSaveBtn = document.getElementById("email-save-btn");
  const emailTestBtn = document.getElementById("email-test-btn");
  const emailjsFields = document.getElementById("email-emailjs-fields");

  if (emailMethodSelect) {
    emailMethodSelect.addEventListener("change", (e) => {
      if (emailjsFields) {
        emailjsFields.style.display = e.target.value === "emailjs" ? "flex" : "none";
      }
    });
  }

  if (emailSaveBtn) {
    emailSaveBtn.addEventListener("click", () => {
      saveEmailSettings();
    });
  }

  if (emailTestBtn) {
    emailTestBtn.addEventListener("click", () => {
      sendNoteViaEmail(true); // true means test email
    });
  }

  // Sağlayıcı sekme butonları
  const providerTabs = document.querySelectorAll("[data-provider]");
  providerTabs.forEach(btn => {
    btn.addEventListener("click", () => {
      const provider = btn.getAttribute("data-provider");
      setActiveBackupProvider(provider);
    });
  });

  // Google Drive Olayları
  const gdriveClientInput = document.getElementById("sync-gdrive-client-id");
  const gdriveApiKeyInput = document.getElementById("sync-gdrive-api-key");
  const gdriveLoginBtn = document.getElementById("sync-gdrive-login-btn");
  const gdriveLogoutBtn = document.getElementById("sync-gdrive-logout-btn");
  const gdrivePushBtn = document.getElementById("sync-gdrive-push-btn");

  if (gdriveClientInput) {
    gdriveClientInput.addEventListener("input", (e) => {
      localStorage.setItem("linaren_gdrive_client_id", e.target.value.trim());
      initGoogleDrive(); // Client ID değişince init et
    });
  }
  if (gdriveApiKeyInput) {
    gdriveApiKeyInput.addEventListener("input", (e) => {
      localStorage.setItem("linaren_gdrive_api_key", e.target.value.trim());
    });
  }
  if (gdriveLoginBtn) {
    gdriveLoginBtn.addEventListener("click", () => {
      requestGoogleAccessToken();
    });
  }
  if (gdriveLogoutBtn) {
    gdriveLogoutBtn.addEventListener("click", () => {
      logoutGoogleDrive();
    });
  }
  if (gdrivePushBtn) {
    gdrivePushBtn.addEventListener("click", () => {
      uploadToGoogleDrive(false); // false means manual upload
    });
  }

  // WebDAV Olayları
  const webdavUrlInput = document.getElementById("sync-webdav-url");
  const webdavUserInput = document.getElementById("sync-webdav-username");
  const webdavPassInput = document.getElementById("sync-webdav-password");
  const webdavPushBtn = document.getElementById("sync-webdav-push-btn");
  const webdavTestBtn = document.getElementById("sync-webdav-test-btn");

  if (webdavUrlInput) {
    webdavUrlInput.addEventListener("input", (e) => {
      localStorage.setItem("linaren_webdav_url", e.target.value.trim());
    });
  }
  if (webdavUserInput) {
    webdavUserInput.addEventListener("input", (e) => {
      localStorage.setItem("linaren_webdav_username", e.target.value.trim());
    });
  }
  if (webdavPassInput) {
    webdavPassInput.addEventListener("input", (e) => {
      localStorage.setItem("linaren_webdav_password", e.target.value.trim());
    });
  }
  if (webdavPushBtn) {
    webdavPushBtn.addEventListener("click", () => {
      uploadToWebDAV(false); // false means manual
    });
  }
  if (webdavTestBtn) {
    webdavTestBtn.addEventListener("click", () => {
      testWebDAVConnection();
    });
  }

  // Zamanlayıcı (Scheduler) Olayları
  const backupFreqSelect = document.getElementById("backup-frequency");
  const backupSchedulerSaveBtn = document.getElementById("backup-scheduler-save-btn");

  if (backupFreqSelect) {
    backupFreqSelect.addEventListener("change", (e) => {
      updateSchedulerInputsVisibility(e.target.value);
    });
  }

  if (backupSchedulerSaveBtn) {
    backupSchedulerSaveBtn.addEventListener("click", () => {
      saveBackupSchedulerSettings();
    });
  }
}

// BÜTÜN AÇIK MODALLARI KAPAT
function closeAllModals() {
  elements.searchModal.classList.remove("open");
  elements.settingsModal.classList.remove("open");
  elements.trashModal.classList.remove("open");
  elements.iconPicker.classList.remove("open");
  elements.folderModal.classList.remove("open");
  elements.unlockFolderModal.classList.remove("open");
}

// YAN MENÜYÜ ÇİZ (KLASÖRLER VE BELGELER)
function renderSidebar() {
  elements.pagesList.innerHTML = "";
  elements.favoritesList.innerHTML = "";
  elements.foldersList.innerHTML = "";

  const activePages = pages.filter(p => !p.deleted);
  const starredPages = activePages.filter(p => p.starred);

  // 1. Favori Sayfalar
  starredPages.forEach(page => {
    const li = createSidebarPageItem(page);
    elements.favoritesList.appendChild(li);
  });

  // 2. Klasörler Listesi
  folders.forEach(folder => {
    const folderLi = createSidebarFolderItem(folder, activePages);
    elements.foldersList.appendChild(folderLi);
  });

  // 3. Kök Seviyedeki (Klasörsüz) Belgeler Listesi
  const rootPages = activePages.filter(p => !p.folderId);
  if (rootPages.length === 0) {
    elements.pagesList.innerHTML = `<li class="page-item" style="color:var(--text-muted); cursor:default; justify-content:center; font-size:12px;">Sayfa bulunamadı</li>`;
  } else {
    rootPages.forEach(page => {
      const li = createSidebarPageItem(page);
      elements.pagesList.appendChild(li);
    });
  }

  updateTrashCount();
  safeCreateIcons();
}

// YAN MENÜ KLASÖR ÖĞESİ
function createSidebarFolderItem(folder, activePages) {
  const li = document.createElement("li");
  li.className = `folder-item ${openFolders.has(folder.id) ? 'open' : ''}`;
  li.dataset.id = folder.id;

  const isUnlocked = !folder.encrypted || !!unlockedFolderPasswords[folder.id];
  const lockIconName = folder.encrypted ? (isUnlocked ? 'unlock' : 'lock') : '';
  const folderIconName = folder.encrypted ? 'bookmark' : 'folder';

  li.innerHTML = `
    <div class="folder-item-header">
      <span class="folder-icon" data-lucide="${folderIconName}"></span>
      <span class="folder-title-text" style="font-weight:600;">${folder.name}</span>
      ${folder.encrypted ? `<span class="folder-lock-icon" data-lucide="${lockIconName}"></span>` : ''}
      <div class="folder-actions-group">
        <button class="folder-add-page-btn" title="Klasöre Yeni Sayfa Ekle"><span data-lucide="plus"></span></button>
        <button class="folder-delete-btn" title="Klasörü Sil"><span data-lucide="trash"></span></button>
      </div>
    </div>
    <ul class="folder-pages-list"></ul>
  `;

  const folderPagesList = li.querySelector(".folder-pages-list");

  // Sürükle-Bırak Olayları (Klasör için Drop Zone)
  li.addEventListener("dragover", (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  });
  li.addEventListener("dragenter", (e) => {
    e.preventDefault();
    li.classList.add("drag-over");
  });
  li.addEventListener("dragleave", () => {
    li.classList.remove("drag-over");
  });
  li.addEventListener("drop", (e) => {
    e.preventDefault();
    li.classList.remove("drag-over");
    const pageId = e.dataTransfer.getData("text/plain");
    if (pageId) {
      movePageToFolder(pageId, folder.id);
    }
  });
  
  // Klasör içindeki sayfaları çiz
  const folderPages = activePages.filter(p => p.folderId === folder.id);
  
  if (isUnlocked) {
    if (folderPages.length === 0) {
      folderPagesList.innerHTML = `<li style="padding:4px 12px; color:var(--text-muted); font-size:11.5px; cursor:default;">Boş Klasör</li>`;
    } else {
      folderPages.forEach(page => {
        const pageLi = createSidebarPageItem(page);
        folderPagesList.appendChild(pageLi);
      });
    }
  } else {
    folderPagesList.innerHTML = `<li style="padding:4px 12px; color:var(--text-muted); font-size:11.5px; cursor:default;"><i data-lucide="lock" style="width:10px; height:10px; display:inline-block; margin-right:4px;"></i>Klasör Kilitli</li>`;
  }

  // Tıklama Olayları
  const header = li.querySelector(".folder-item-header");
  header.addEventListener("click", (e) => {
    // Sayfa ekleme tetiklendiyse
    if (e.target.closest(".folder-add-page-btn")) {
      e.stopPropagation();
      if (!isUnlocked) {
        promptUnlockFolder(folder.id);
      } else {
        createNewPageInFolder(folder.id);
      }
      return;
    }
    // Klasör silme tetiklendiyse
    if (e.target.closest(".folder-delete-btn")) {
      e.stopPropagation();
      deleteFolder(folder.id);
      return;
    }
    // Kilidi geri takma
    if (e.target.closest(".folder-lock-icon") && folder.encrypted && isUnlocked) {
      e.stopPropagation();
      lockFolder(folder.id);
      return;
    }

    // Klasörü açma/kapama veya Kilit açma
    if (folder.encrypted && !isUnlocked) {
      promptUnlockFolder(folder.id);
    } else {
      if (openFolders.has(folder.id)) {
        openFolders.delete(folder.id);
        li.classList.remove("open");
      } else {
        openFolders.add(folder.id);
        li.classList.add("open");
      }
    }
  });

  return li;
}

// YAN MENÜ BELGE ÖĞESİ
function createSidebarPageItem(page) {
  const li = document.createElement("li");
  li.className = `page-item ${page.id === currentPageId ? 'active' : ''} ${page.starred ? 'starred' : ''}`;
  li.dataset.id = page.id;
  
  // Sürükle-Bırak Sürükleme Başlangıcı
  li.setAttribute("draggable", "true");
  li.addEventListener("dragstart", (e) => {
    e.dataTransfer.setData("text/plain", page.id);
    e.dataTransfer.effectAllowed = "move";
    li.classList.add("dragging");
  });
  li.addEventListener("dragend", () => {
    li.classList.remove("dragging");
  });

  const isEncrypted = page.folderId && folders.find(f => f.id === page.folderId)?.encrypted;
  const isLocked = isEncrypted && !unlockedFolderPasswords[page.folderId];
  
  const displayTitle = isLocked ? "🔒 Şifreli Belge" : (page.title || 'Başlıksız');

  li.innerHTML = `
    <span class="page-icon" data-lucide="${isLocked ? 'lock' : (page.icon || 'file-text')}"></span>
    <span class="page-title-text">${displayTitle}</span>
    <span class="page-star" data-lucide="star"></span>
  `;

  li.addEventListener("click", (e) => {
    if (e.target.closest(".page-star")) {
      e.stopPropagation();
      toggleFavoritePage(page.id);
      return;
    }
    
    // Eğer sayfa kilitli bir klasördeyse önce şifreyi sor
    if (isLocked) {
      promptUnlockFolder(page.folderId, () => selectPage(page.id));
    } else {
      selectPage(page.id);
    }
    elements.sidebar.classList.remove("open");
    const overlay = document.getElementById("sidebar-overlay");
    if (overlay) overlay.classList.remove("active");
  });

  return li;
}

// ŞİFRE PANELİNİ AÇMA TETİKLEYİCİSİ
function promptUnlockFolder(folderId, callback = null) {
  pendingUnlockFolderId = folderId;
  elements.unlockFolderModal.classList.add("open");
  elements.unlockPasswordInput.value = "";
  setTimeout(() => elements.unlockPasswordInput.focus(), 50);
  
  // Kilidi açtıktan sonra çalıştırılacak işlem
  elements.unlockFolderBtn.onclick = () => {
    unlockPendingFolder(callback);
  };
}

// ŞİFRELİ KLASÖRÜN KİLİDİNİ RAM ÜZERİNDE AÇ
function unlockPendingFolder(successCallback = null) {
  const folder = folders.find(f => f.id === pendingUnlockFolderId);
  const password = elements.unlockPasswordInput.value;
  
  if (!folder) return;

  const hash = sha256(password);
  if (hash === folder.passwordHash) {
    // RAM'e şifreyi ekle
    unlockedFolderPasswords[folder.id] = password;
    openFolders.add(folder.id);
    
    // Klasör içindeki belgelerin şifresini hafızada çöz (decrypted flag eklenir)
    pages.forEach(p => {
      if (p.folderId === folder.id && !p.decrypted) {
        p.title = decryptText(p.title, password);
        p.content = decryptText(p.content, password);
        p.decrypted = true;
      }
    });

    elements.unlockFolderModal.classList.remove("open");
    renderSidebar();
    updateFolderSelectOptions();
    
    if (successCallback && typeof successCallback === "function") {
      successCallback();
    } else {
      // Eğer şu an aktif sayfa bu klasördeyse, sayfayı tekrar seçip ekranı güncelle
      const activePage = pages.find(p => p.id === currentPageId);
      if (activePage && activePage.folderId === folder.id) {
        selectPage(currentPageId);
      }
    }
    pendingUnlockFolderId = null;
  } else {
    alert("Hatalı şifre!");
  }
}

// KLASÖRÜ YENİDEN KİLİTLE (BELLEKTEN ŞİFRESİNİ SİL)
function lockFolder(folderId) {
  const folder = folders.find(f => f.id === folderId);
  const password = unlockedFolderPasswords[folderId];
  if (!folder || !password) return;

  // Belgeleri hafızada geri şifrele
  pages.forEach(p => {
    if (p.folderId === folderId && p.decrypted) {
      p.title = encryptText(p.title, password);
      p.content = encryptText(p.content, password);
      delete p.decrypted;
    }
  });

  delete unlockedFolderPasswords[folderId];
  openFolders.delete(folderId);
  
  saveData();
  renderSidebar();
  updateFolderSelectOptions();
  
  // Eğer kilitlenen klasördeki bir sayfadaysak ilk klasörsüz sayfaya yönlendir
  const activePage = pages.find(p => p.id === currentPageId);
  if (activePage && activePage.folderId === folderId) {
    const fallback = pages.find(p => !p.folderId && !p.deleted);
    if (fallback) {
      selectPage(fallback.id);
    } else {
      createNewPage();
    }
  }
}

// KLASÖR OLUŞTURMA
function createFolder() {
  const name = elements.folderNameInput.value.trim();
  const encrypt = elements.folderEncryptCheck.checked;
  const password = elements.folderPasswordInput.value;

  if (!name) {
    alert("Lütfen klasör adı girin.");
    return;
  }

  if (encrypt && !password) {
    alert("Lütfen bir koruma şifresi belirleyin.");
    return;
  }

  const folderId = "folder_" + Date.now();
  const newFolder = {
    id: folderId,
    name: name,
    encrypted: encrypt,
    passwordHash: encrypt ? sha256(password) : ""
  };

  // Yeni şifreli klasörler güvenlik nedeniyle doğrudan kilitli (locked) başlar.

  folders.push(newFolder);
  saveData();
  renderSidebar();
  updateFolderSelectOptions();
  elements.folderModal.classList.remove("open");
}

// KLASÖR SİLME
async function deleteFolder(folderId) {
  const folder = folders.find(f => f.id === folderId);
  if (!folder) return;

  if (confirm(`"${folder.name}" klasörünü silmek istediğinize emin misiniz? Klasörün içindeki notlar silinmeyecek, kütüphane köküne (Klasörsüz) taşınacaktır.`)) {
    // Klasör içindeki sayfaları klasörsüz yap
    pages.forEach(p => {
      if (p.folderId === folderId) {
        // Eğer kilitliyse önce çözmek gerek
        if (folder.encrypted && !p.decrypted) {
          const pass = unlockedFolderPasswords[folderId];
          if (pass) {
            p.title = decryptText(p.title, pass);
            p.content = decryptText(p.content, pass);
          } else {
            // Şifre girilmediyse şifreli metin olarak çıkar (kullanıcıya uyarı ver)
            p.title = "Kilitli Belge (Kurtarıldı)";
            p.content = "<p>Bu belgenin klasörü silindiği için şifreli kaldı.</p>";
          }
        }
        p.folderId = null;
        delete p.decrypted;
      }
    });

    folders = folders.filter(f => f.id !== folderId);
    delete unlockedFolderPasswords[folderId];
    openFolders.delete(folderId);

    await dbManager.deleteFolder(folderId);
    await saveData();
    renderSidebar();
    updateFolderSelectOptions();
    
    // Aktif sayfayı güncelle
    selectPage(currentPageId);
  }
}

// SAYFA İÇİ KLASÖR SEÇENEKLERİNİ GÜNCELLE
function updateFolderSelectOptions() {
  const select = elements.pageFolderSelect;
  // İlk seçeneği koru
  select.innerHTML = '<option value="">Klasörsüz (Kök)</option>';
  
  folders.forEach(f => {
    const opt = document.createElement("option");
    opt.value = f.id;
    const lockLabel = f.encrypted ? " [Şifreli]" : "";
    opt.textContent = f.name + lockLabel;
    select.appendChild(opt);
  });
}

// SAYFAYI KLASÖRE TAŞI (SÜRÜKLE-BIRAK VEYA ÜST SEÇİM MENÜSÜ)
function movePageToFolder(pageId, newFolderId) {
  const page = pages.find(p => p.id === pageId);
  if (!page) return;

  const oldFolderId = page.folderId;

  // 1. Eski klasör şifreliyse ve kilitliyse taşımayı iptal et
  if (oldFolderId) {
    const oldFolder = folders.find(f => f.id === oldFolderId);
    if (oldFolder && oldFolder.encrypted && page.decrypted === false) {
      alert("Bu belge kilitlidir, taşınabilmesi için önce klasör kilidini açmalısınız.");
      if (currentPageId === pageId) {
        elements.pageFolderSelect.value = oldFolderId;
      }
      return;
    }
  }

  // 2. Yeni klasör şifreliyse
  if (newFolderId) {
    const newFolder = folders.find(f => f.id === newFolderId);
    if (newFolder && newFolder.encrypted) {
      const pass = unlockedFolderPasswords[newFolderId];
      if (!pass) {
        // Hedef klasör kilitliyse şifresini sor
        promptUnlockFolder(newFolderId, () => {
          page.folderId = newFolderId;
          page.decrypted = true; // Artık açık
          saveData();
          renderSidebar();
          if (currentPageId === pageId) {
            elements.pageFolderSelect.value = newFolderId;
          }
        });
        if (currentPageId === pageId) {
          elements.pageFolderSelect.value = oldFolderId || "";
        }
        return;
      } else {
        page.folderId = newFolderId;
        page.decrypted = true;
      }
    } else {
      page.folderId = newFolderId;
      delete page.decrypted;
    }
  } else {
    page.folderId = null;
    delete page.decrypted;
  }

  saveData();
  renderSidebar();

  if (currentPageId === pageId) {
    elements.pageFolderSelect.value = newFolderId || "";
  }
}

// SAYFA KLASÖRÜ DEĞİŞTİRİLDİĞİNDE TETİKLENİR
function handlePageFolderChange() {
  const newFolderId = elements.pageFolderSelect.value;
  movePageToFolder(currentPageId, newFolderId);
}

// KLASÖR İÇİNDE DOĞRUDAN SAYFA OLUŞTURMA
function createNewPageInFolder(folderId) {
  const newPage = {
    id: "page_" + Date.now(),
    title: "",
    icon: "file-text",
    starred: false,
    deleted: false,
    content: "",
    folderId: folderId,
    decrypted: true
  };

  pages.push(newPage);
  saveData();
  renderSidebar();
  selectPage(newPage.id);
  
  setTimeout(() => {
    elements.pageTitleInput.focus();
  }, 50);
}

// FAVORİLERE EKLE/ÇIKAR
function toggleFavoritePage(pageId) {
  const page = pages.find(p => p.id === pageId);
  if (page) {
    page.starred = !page.starred;
    saveData();
    renderSidebar();
  }
}

// YENİ SAYFA OLUŞTURMA
function createNewPage() {
  const newPage = {
    id: "page_" + Date.now(),
    title: "",
    icon: "file-text",
    starred: false,
    deleted: false,
    content: ""
  };

  pages.push(newPage);
  saveData();
  renderSidebar();
  selectPage(newPage.id);
  
  setTimeout(() => {
    elements.pageTitleInput.focus();
  }, 50);
}

// SAYFA SEÇ VE DETAYLARI DOLDUR
function selectPage(pageId) {
  const page = pages.find(p => p.id === pageId);
  if (!page) return;

  // Kilit kontrolü
  const isEncrypted = page.folderId && folders.find(f => f.id === page.folderId)?.encrypted;
  const isLocked = isEncrypted && !unlockedFolderPasswords[page.folderId];
  
  if (isLocked) {
    promptUnlockFolder(page.folderId, () => selectPage(pageId));
    return;
  }

  currentPageId = pageId;

  elements.pageTitleInput.value = page.title || "";
  autoResizeTitle();
  
  elements.pageIconBtn.innerHTML = `<span data-lucide="${page.icon || 'file-text'}"></span>`;
  elements.pageFolderSelect.value = page.folderId || "";
  
  document.querySelectorAll(".page-list .page-item").forEach(item => {
    item.classList.toggle("active", item.dataset.id === pageId);
  });

  updatePageActionUI();
  elements.editorBody.innerHTML = page.content || "";
  
  // Kelime sayacı ve backlinks listesini güncelle
  updateStatusBar();
  updateBacklinks();

  // Açık otomatik arama pencerelerini kapat
  const autoCmp = document.getElementById("wiki-autocomplete");
  if (autoCmp) autoCmp.style.display = "none";
  
  safeCreateIcons();
}

// SAYFA BAŞLIĞI DEĞİŞTİRME
function handleTitleChange() {
  const page = pages.find(p => p.id === currentPageId);
  if (!page) return;

  page.title = elements.pageTitleInput.value;
  saveData();
  autoResizeTitle();

  const sidebarItems = document.querySelectorAll(`.page-item[data-id="${currentPageId}"] .page-title-text`);
  sidebarItems.forEach(item => {
    item.textContent = page.title || "Başlıksız";
  });
}

// BAŞLIK BOYUTUNU OTOMATİK AYARLA
function autoResizeTitle() {
  elements.pageTitleInput.style.height = "auto";
  elements.pageTitleInput.style.height = elements.pageTitleInput.scrollHeight + "px";
}

// FAVORİ BUTONUNUN UI DURUMU
function updatePageActionUI() {
  const page = pages.find(p => p.id === currentPageId);
  if (!page) return;

  if (page.starred) {
    elements.favoriteToggleBtn.classList.add("starred");
  } else {
    elements.favoriteToggleBtn.classList.remove("starred");
  }
}

// FAVORİ DURUMUNU DEĞİŞTİR
function toggleFavorite() {
  const page = pages.find(p => p.id === currentPageId);
  if (!page) return;

  page.starred = !page.starred;
  saveData();
  renderSidebar();
  updatePageActionUI();
}

// SAYFAYI ÇÖPE TAŞI
function deleteCurrentPage() {
  const page = pages.find(p => p.id === currentPageId);
  if (!page) return;

  page.deleted = true;
  page.starred = false;
  page.deletedAt = Date.now();
  saveData();
  renderSidebar();

  const activePages = pages.filter(p => !p.deleted);
  if (activePages.length > 0) {
    selectPage(activePages[0].id);
  } else {
    createNewPage();
  }
}

// İKON SEÇİCİYİ AÇ/KAPAT
function toggleIconPicker() {
  elements.iconPicker.innerHTML = "";
  elements.iconPicker.classList.toggle("open");

  if (elements.iconPicker.classList.contains("open")) {
    ICON_LIST.forEach(iconName => {
      const btn = document.createElement("button");
      btn.className = "icon-picker-option";
      btn.innerHTML = `<span data-lucide="${iconName}"></span>`;
      btn.addEventListener("click", () => {
        const page = pages.find(p => p.id === currentPageId);
        if (page) {
          page.icon = iconName;
          saveData();
          renderSidebar();
          elements.pageIconBtn.innerHTML = `<span data-lucide="${iconName}"></span>`;
          safeCreateIcons();
        }
        elements.iconPicker.classList.remove("open");
      });
      elements.iconPicker.appendChild(btn);
    });
    safeCreateIcons();
  }
}

// ARAMA DÖNGÜSÜ
function openSearch() {
  elements.searchModal.classList.add("open");
  elements.searchInput.value = "";
  elements.searchResults.innerHTML = "";
  setTimeout(() => elements.searchInput.focus(), 50);
}

function closeSearch() {
  elements.searchModal.classList.remove("open");
}

function performSearch() {
  const query = elements.searchInput.value.toLowerCase().trim();
  elements.searchResults.innerHTML = "";

  if (!query) return;

  const results = pages.filter(p => !p.deleted && (
    p.title.toLowerCase().includes(query) || 
    (p.content && p.content.toLowerCase().includes(query))
  ));

  if (results.length === 0) {
    elements.searchResults.innerHTML = `<div class="search-no-results">Sonuç bulunamadı</div>`;
    return;
  }

  results.forEach(page => {
    const isEncrypted = page.folderId && folders.find(f => f.id === page.folderId)?.encrypted;
    const isLocked = isEncrypted && !unlockedFolderPasswords[page.folderId];
    
    // Kilitli sayfaları aramada sansürle
    const displayTitle = isLocked ? "🔒 Şifreli Belge" : (page.title || 'Başlıksız');

    const div = document.createElement("div");
    div.className = "search-result-item";
    div.innerHTML = `
      <span class="page-icon" data-lucide="${isLocked ? 'lock' : (page.icon || 'file-text')}"></span>
      <span class="search-result-title">${displayTitle}</span>
    `;
    div.addEventListener("click", () => {
      if (isLocked) {
        promptUnlockFolder(page.folderId, () => {
          selectPage(page.id);
          closeSearch();
        });
      } else {
        selectPage(page.id);
        closeSearch();
      }
    });
    elements.searchResults.appendChild(div);
  });
  safeCreateIcons();
}

// ÇÖP KUTUSU MODALI
function openTrashModal() {
  elements.trashModal.classList.add("open");
  elements.trashList.innerHTML = "";

  const deletedPages = pages.filter(p => p.deleted);
  if (deletedPages.length === 0) {
    elements.trashList.innerHTML = `<div style="text-align:center; padding:20px; color:var(--text-muted); font-size:13px;">Çöp kutusu boş</div>`;
    return;
  }

  deletedPages.forEach(page => {
    const div = document.createElement("div");
    div.className = "trash-item";
    
    // Kalan gün sayısını hesapla (30 gün sınırına göre)
    let remainingDaysText = "";
    if (page.deletedAt) {
      const diffMs = (page.deletedAt + (30 * 24 * 60 * 60 * 1000)) - Date.now();
      const diffDays = Math.ceil(diffMs / (24 * 60 * 60 * 1000));
      remainingDaysText = diffDays > 0 ? `${diffDays} gün kaldı` : "Süre doldu (yakında silinecek)";
    } else {
      // Eğer deletedAt yoksa (eski silinenler için), silinme tarihini şimdi olarak varsayalım
      page.deletedAt = Date.now();
      saveData();
      remainingDaysText = "30 gün kaldı";
    }

    div.innerHTML = `
      <div style="display:flex; flex-direction:column; gap:2px;">
        <span class="page-title" style="font-weight:500;">${page.title || 'Başlıksız'}</span>
        <span style="font-size:10px; color:var(--text-muted);">${remainingDaysText}</span>
      </div>
      <div class="trash-item-actions">
        <button class="trash-btn restore" title="Kurtar"><span data-lucide="rotate-ccw"></span></button>
        <button class="trash-btn delete" title="Kalıcı Olarak Sil"><span data-lucide="trash-2"></span></button>
      </div>
    `;

    div.querySelector(".restore").addEventListener("click", () => restorePage(page.id));
    div.querySelector(".delete").addEventListener("click", () => permanentlyDeletePage(page.id));

    elements.trashList.appendChild(div);
  });
  safeCreateIcons();
}

function restorePage(pageId) {
  const page = pages.find(p => p.id === pageId);
  if (page) {
    page.deleted = false;
    delete page.deletedAt;
    saveData();
    renderSidebar();
    openTrashModal();
    selectPage(page.id);
  }
}

async function permanentlyDeletePage(pageId) {
  if (confirm("Bu belge kalıcı olarak silinecektir. Bu işlem geri alınamaz. Devam etmek istiyor musunuz?")) {
    pages = pages.filter(p => p.id !== pageId);
    await dbManager.deletePage(pageId);
    await saveData();
    renderSidebar();
    openTrashModal();
  }
}

// ÇALIŞMA ALANINI SIFIRLA
async function resetWorkspace() {
  if (confirm("DİKKAT: Tüm çalışma alanınız sıfırlanacak, tüm klasörleriniz ve tüm notlarınız kalıcı olarak silinecektir! Devam etmek istiyor musunuz?")) {
    pages = JSON.parse(JSON.stringify(DEFAULT_PAGES));
    folders = [];
    unlockedFolderPasswords = {};
    openFolders.clear();
    
    await dbManager.clearAll();
    await saveData();
    renderSidebar();
    updateFolderSelectOptions();
    selectPage(pages[0].id);
    elements.settingsModal.classList.remove("open");
    alert("Çalışma alanı sıfırlandı.");
  }
}

// TÜM VERİLERİ JSON YEDEKLE
function exportAllData() {
  const backup = {
    pages: pages,
    folders: folders
  };
  const dataStr = JSON.stringify(backup, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  downloadBlob(blob, `linaren_yedek_${Date.now()}.json`);
}

// YEDEKTEN GERİ YÜKLE
async function handleImportBackup(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = async (event) => {
    try {
      const importedData = JSON.parse(event.target.result);
      // Eski sürüm yedeklerini de destekle
      const hasPages = Array.isArray(importedData) || (importedData.pages && Array.isArray(importedData.pages));
      
      if (hasPages) {
        if (confirm("Bu yedek dosyası mevcut tüm belgelerinizi ve klasörlerinizi silerek kütüphaneyi bu yedekle değiştirecektir. Devam etmek istiyor musunuz?")) {
          await dbManager.clearAll();
          
          if (Array.isArray(importedData)) {
            pages = importedData;
            folders = [];
          } else {
            pages = importedData.pages;
            folders = importedData.folders || [];
          }
          
          await saveData();
          renderSidebar();
          updateFolderSelectOptions();
          
          if (pages.length > 0) {
            selectPage(pages[0].id);
          } else {
            createNewPage();
          }
          alert("Kütüphane yedeği başarıyla geri yüklendi!");
          elements.settingsModal.classList.remove("open");
        }
      } else {
        alert("Hatalı yedek dosyası biçimi!");
      }
    } catch (err) {
      alert("Yedek yüklenirken hata oluştu: " + err.message);
    }
  };
  reader.readAsText(file);
  elements.importFileInput.value = "";
}

// BELGE DIŞA AKTARIM YÖNLENDİRİCİSİ
function exportCurrentPageFormat(format) {
  const page = pages.find(p => p.id === currentPageId);
  if (!page) return;

  const fileName = (page.title || 'basliksiz').toLowerCase().replace(/\s+/g, '_');

  switch (format) {
    case 'txt': exportAsNotepadTXT(page, fileName); break;
    case 'doc': exportAsWordDOC(page, fileName); break;
    case 'csv': exportAsExcelCSV(page, fileName); break;
    case 'ppt': exportAsPowerPointPPT(page, fileName); break;
    case 'pdf': exportAsPDF(); break;
  }
}

// NOTEPAD (.txt) DIŞA AKTARIMI
function exportAsNotepadTXT(page, fileName) {
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = page.content || "";
  
  let txt = `==================================================\n`;
  txt += `BELGE: ${page.title || 'Başlıksız'}\n`;
  txt += `==================================================\n\n`;
  
  txt += tempDiv.innerText;

  const blob = new Blob([txt], { type: "text/plain;charset=utf-8" });
  downloadBlob(blob, `${fileName}.txt`);
}

// WORD (.doc) DIŞA AKTARIMI
function exportAsWordDOC(page, fileName) {
  let html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  body { font-family: Arial, sans-serif; line-height: 1.6; padding: 20px; color: #333; }
  h1 { font-size: 24pt; font-weight: bold; margin-top: 18pt; margin-bottom: 6pt; color: #6366f1; }
  h2 { font-size: 18pt; font-weight: bold; margin-top: 14pt; margin-bottom: 4pt; }
  h3 { font-size: 14pt; font-weight: bold; margin-top: 12pt; margin-bottom: 2pt; }
  p { font-size: 11pt; margin-bottom: 6pt; }
  ul, ol { margin-bottom: 6pt; padding-left: 20pt; }
  li { font-size: 11pt; margin-bottom: 3pt; }
  table { border-collapse: collapse; width: 100%; margin: 12pt 0; }
  th, td { border: 1px solid #ccc; padding: 6px 10px; text-align: left; font-size: 10.5pt; }
  th { background-color: #f3f4f6; font-weight: bold; color: #6366f1; }
  pre { background-color: #f4f4f5; border: 1px solid #e4e4e7; padding: 10pt; border-radius: 4px; font-family: Courier, monospace; }
</style>
</head>
<body>
<h1>${page.title || 'Başlıksız'}</h1>
${page.content || ''}
</body>
</html>`;

  const blob = new Blob([html], { type: "application/msword;charset=utf-8" });
  downloadBlob(blob, `${fileName}.doc`);
}

// EXCEL (.csv) DIŞA AKTARIMI
function exportAsExcelCSV(page, fileName) {
  let csv = "\uFEFF"; // UTF-8 BOM
  csv += `"Belge Başlığı";"${page.title || 'Başlıksız'}"\n\n`;
  
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = page.content || "";
  const tables = tempDiv.querySelectorAll("table");
  
  if (tables.length > 0) {
    tables.forEach((table, tIdx) => {
      csv += `"Tablo ${tIdx + 1}"\n`;
      const rows = table.querySelectorAll("tr");
      rows.forEach(row => {
        const cells = row.querySelectorAll("th, td");
        const cellValues = Array.from(cells).map(cell => `"${cell.textContent.replace(/"/g, '""').trim()}"`);
        csv += cellValues.join(";") + "\n";
      });
      csv += "\n";
    });
  } else {
    const lines = tempDiv.innerText.split("\n");
    lines.forEach((line, idx) => {
      if (line.trim()) {
        csv += `"${idx + 1}";"${line.replace(/"/g, '""').trim()}"\n`;
      }
    });
  }

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  downloadBlob(blob, `${fileName}.csv`);
}

// POWERPOINT (.ppt) DIŞA AKTARIMI
function exportAsPowerPointPPT(page, fileName) {
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = page.content || "";
  
  let outline = `${page.title || 'Başlıksız'}\n`;
  
  const elementsList = tempDiv.querySelectorAll("h1, h2, h3, p, li");
  elementsList.forEach(el => {
    const text = el.textContent.trim();
    if (!text) return;
    
    if (el.tagName.startsWith("H")) {
      outline += `${text}\n`;
    } else {
      outline += `\t- ${text}\n`;
    }
  });

  const blob = new Blob([outline], { type: "text/plain;charset=utf-8" });
  downloadBlob(blob, `${fileName}_sunum.ppt`);
}

// NATIVE PDF DIŞA AKTARIMI
function exportAsPDF() {
  window.print();
}

// DOSYA İNDİRME TETİKLEYİCİSİ
function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// =========================================================================
// LINAREN GÜÇ SÜRÜMÜ PREMİUM SİSTEMLERİ VE YARDIMCI FONKSİYONLARI
// =========================================================================

// 1. PROCEDURAL PINK NOISE VE YAĞMUR/RÜZGÂR SESİ SENTEZLEYİCİSİ (WEB AUDIO API)
function createPinkNoiseBuffer(ctx, durationSec) {
  const sampleRate = ctx.sampleRate;
  const bufferSize = sampleRate * durationSec;
  const buffer = ctx.createBuffer(1, bufferSize, sampleRate);
  const data = buffer.getChannelData(0);
  
  let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
  
  for (let i = 0; i < bufferSize; i++) {
    const white = Math.random() * 2 - 1;
    b0 = 0.99886 * b0 + white * 0.0555179;
    b1 = 0.99332 * b1 + white * 0.0750759;
    b2 = 0.96900 * b2 + white * 0.1538520;
    b3 = 0.86650 * b3 + white * 0.3104856;
    b4 = 0.55000 * b4 + white * 0.5329522;
    b5 = -0.7616 * b5 - white * 0.0168980;
    
    data[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
    data[i] *= 0.11; // normalizasyon
    b6 = white * 0.115926;
  }
  return buffer;
}

const AudioZen = {
  ctx: null,
  rainSource: null,
  lfoOsc: null,
  gainNode: null,
  isActive: false,

  init() {
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return false;
      this.ctx = new AudioContextClass();
      return true;
    } catch (e) {
      console.error("Web Audio API başlatılamadı:", e);
      return false;
    }
  },

  startRain() {
    if (!this.ctx) {
      const ok = this.init();
      if (!ok) return;
    }
    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }

    // 1. Pink Noise Düğümü (Rüzgar & Yağmur gövdesi)
    const noiseBuffer = createPinkNoiseBuffer(this.ctx, 3);
    const noiseSource = this.ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    noiseSource.loop = true;

    // 2. Düşük Geçişli Filtre (Low Pass) - Yağmurun uğultusu
    const rumbleFilter = this.ctx.createBiquadFilter();
    rumbleFilter.type = "lowpass";
    rumbleFilter.frequency.value = 850;

    // 3. Yüksek Geçişli Filtre - Yağmur damlalarının tıkırtısı (peaking)
    const pitterFilter = this.ctx.createBiquadFilter();
    pitterFilter.type = "peaking";
    pitterFilter.frequency.value = 2800;
    pitterFilter.Q.value = 3.5;
    pitterFilter.gain.value = 10;

    const pitterGain = this.ctx.createGain();
    pitterGain.gain.value = 0.04;

    // 4. Ana Gain ve LFO (Rüzgar salınımı / şiddet değişimi için)
    this.gainNode = this.ctx.createGain();
    this.gainNode.gain.value = 0.22; // Başlangıç sesi

    this.lfoOsc = this.ctx.createOscillator();
    this.lfoOsc.frequency.value = 0.08; // Yavaş salınım (12 saniyede bir rüzgar şiddeti dalgalanır)
    
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.value = 0.07; // %7 ses dalgalanması

    // Bağlantıları Kur
    noiseSource.connect(rumbleFilter);
    noiseSource.connect(pitterFilter);

    rumbleFilter.connect(this.gainNode);
    pitterFilter.connect(pitterGain);
    pitterGain.connect(this.gainNode);

    // LFO modülasyonu bağlantısı
    this.lfoOsc.connect(lfoGain);
    lfoGain.connect(this.gainNode.gain);

    this.gainNode.connect(this.ctx.destination);

    noiseSource.start(0);
    this.lfoOsc.start(0);

    this.rainSource = noiseSource;
    this.isActive = true;
  },

  stopRain() {
    if (this.rainSource) {
      try {
        this.rainSource.stop();
      } catch(e){}
      this.rainSource = null;
    }
    if (this.lfoOsc) {
      try {
        this.lfoOsc.stop();
      } catch(e){}
      this.lfoOsc = null;
    }
    this.isActive = false;
  },

  toggle() {
    if (this.isActive) {
      this.stopRain();
      return false;
    } else {
      this.startRain();
      return true;
    }
  }
};

function toggleAmbientSound() {
  const active = AudioZen.toggle();
  const ambientBtn = document.getElementById("ambient-sound-btn");
  if (ambientBtn) {
    if (active) {
      ambientBtn.classList.add("active");
      ambientBtn.style.color = "var(--accent)";
      ambientBtn.style.backgroundColor = "var(--bg-active)";
    } else {
      ambientBtn.classList.remove("active");
      ambientBtn.style.color = "";
      ambientBtn.style.backgroundColor = "";
    }
  }
}

// 2. ZEN ODAKLANMA MODU YÖNETİMİ
let isZenMode = false;
function toggleZenMode() {
  isZenMode = !isZenMode;
  document.body.classList.toggle("zen-active", isZenMode);
  
  const zenTriggerBtn = document.getElementById("zen-trigger-btn");
  if (zenTriggerBtn) {
    if (isZenMode) {
      zenTriggerBtn.classList.add("active");
      zenTriggerBtn.style.color = "var(--accent)";
      zenTriggerBtn.style.backgroundColor = "var(--bg-active)";
    } else {
      zenTriggerBtn.classList.remove("active");
      zenTriggerBtn.style.color = "";
      zenTriggerBtn.style.backgroundColor = "";
    }
  }
}

// 3. KELİME OKUMA SÜRESİ DURUM ÇUBUĞU (STATUS BAR)
function updateStatusBar() {
  const text = elements.editorBody.innerText || elements.editorBody.textContent || "";
  const cleanText = text.trim();
  
  let wordCount = 0;
  if (cleanText) {
    wordCount = cleanText.split(/\s+/).filter(w => w.length > 0).length;
  }
  const charCount = cleanText.length;
  const readTime = Math.max(1, Math.round(wordCount / 200)); // Dakikada ortalama 200 kelime okuma hızı

  const statusWord = document.getElementById("status-word-count");
  const statusChar = document.getElementById("status-char-count");
  const statusTime = document.getElementById("status-read-time");

  if (statusWord) statusWord.textContent = `${wordCount} kelime`;
  if (statusChar) statusChar.textContent = `${charCount} karakter`;
  if (statusTime) statusTime.textContent = `${readTime} dk okuma`;
}

// 4. ÇİFT YÖNLÜ BAĞLANTI (BACKLINKS) VE WIKILINK OTO-TAMAMLAMA popup MANTIKLARI
function updateBacklinks() {
  const backlinksArea = document.getElementById("backlinks-area");
  const backlinksList = document.getElementById("backlinks-list");
  if (!backlinksArea || !backlinksList) return;

  if (!currentPageId) {
    backlinksArea.style.display = "none";
    return;
  }

  const linkingPages = pages.filter(p => {
    if (p.id === currentPageId || p.deleted) return false;
    
    // Sayfanın içeriğinde bu sayfanın kimliğini ararız
    const searchString = `data-page-id="${currentPageId}"`;
    return p.content && p.content.includes(searchString);
  });

  if (linkingPages.length > 0) {
    backlinksList.innerHTML = "";
    linkingPages.forEach(p => {
      const item = document.createElement("div");
      item.className = "backlink-item";
      item.innerHTML = `<span data-lucide="${p.icon || 'file-text'}" style="width:12px; height:12px;"></span> <span>${p.title || 'Başlıksız'}</span>`;
      item.onclick = () => selectPage(p.id);
      backlinksList.appendChild(item);
    });
    backlinksArea.style.display = "flex";
    safeCreateIcons();
  } else {
    backlinksArea.style.display = "none";
  }
}

// WIKILINK ARAMA POPUP TETİKLEYİCİ
let autocompleteActive = false;
let autocompleteQueryIndex = -1;
let autocompleteFilteredPages = [];
let autocompleteSelectedIdx = 0;

function handleWikiLinkTrigger(e) {
  const autocompleteBox = document.getElementById("wiki-autocomplete");
  if (!autocompleteBox) return;

  if (autocompleteActive) {
    // Klavye kontrolleri
    if (e.key === "ArrowDown") {
      e.preventDefault();
      autocompleteSelectedIdx = (autocompleteSelectedIdx + 1) % autocompleteFilteredPages.length;
      renderWikiAutocompleteList();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      autocompleteSelectedIdx = (autocompleteSelectedIdx - 1 + autocompleteFilteredPages.length) % autocompleteFilteredPages.length;
      renderWikiAutocompleteList();
    } else if (e.key === "Enter") {
      e.preventDefault();
      insertSelectedWikiLink();
    } else if (e.key === "Escape") {
      e.preventDefault();
      closeWikiAutocomplete();
    }
    return;
  }

  // [[ tuş kontrolü
  if (e.key === "[") {
    setTimeout(() => {
      const selection = window.getSelection();
      if (!selection.rangeCount) return;
      const range = selection.getRangeAt(0);
      const text = range.startContainer.textContent || "";
      const offset = range.startOffset;
      
      if (offset >= 2 && text.substring(offset - 2, offset) === "[[") {
        openWikiAutocomplete();
      }
    }, 10);
  }
}

function openWikiAutocomplete() {
  autocompleteActive = true;
  autocompleteSelectedIdx = 0;
  
  // Pozisyon belirle
  const caretCoords = getCaretCoordinates();
  const autocompleteBox = document.getElementById("wiki-autocomplete");
  
  autocompleteBox.style.left = `${caretCoords.x}px`;
  autocompleteBox.style.top = `${caretCoords.y + 20}px`;
  
  // Sayfaları getir
  autocompleteFilteredPages = pages.filter(p => !p.deleted && p.id !== currentPageId);
  renderWikiAutocompleteList();
}

function renderWikiAutocompleteList() {
  const autocompleteBox = document.getElementById("wiki-autocomplete");
  if (!autocompleteBox) return;

  if (autocompleteFilteredPages.length === 0) {
    autocompleteBox.innerHTML = `<div style="font-size:12px; color:var(--text-muted); padding:8px; text-align:center;">Sayfa bulunamadı</div>`;
    autocompleteBox.style.display = "flex";
    return;
  }

  autocompleteBox.innerHTML = "";
  autocompleteFilteredPages.forEach((p, idx) => {
    const item = document.createElement("button");
    item.className = `wiki-autocomplete-item ${idx === autocompleteSelectedIdx ? 'active' : ''}`;
    item.innerHTML = `<span data-lucide="${p.icon || 'file-text'}" style="width:13px; height:13px;"></span> <span>${p.title || 'Başlıksız'}</span>`;
    
    item.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      autocompleteSelectedIdx = idx;
      insertSelectedWikiLink();
    };
    
    autocompleteBox.appendChild(item);
  });
  
  autocompleteBox.style.display = "flex";
  safeCreateIcons();
}

function insertSelectedWikiLink() {
  const targetPage = autocompleteFilteredPages[autocompleteSelectedIdx];
  if (!targetPage) return;

  const selection = window.getSelection();
  if (!selection.rangeCount) return;
  const range = selection.getRangeAt(0);
  const textNode = range.startContainer;
  const offset = range.startOffset;

  // [[ tetikleyicisini sil
  const textVal = textNode.textContent || "";
  const beforeText = textVal.substring(0, offset - 2);
  const afterText = textVal.substring(offset);
  
  textNode.textContent = beforeText;

  // WikiLink HTML elemanı oluştur
  const link = document.createElement("a");
  link.className = "wiki-link";
  link.setAttribute("data-page-id", targetPage.id);
  link.href = "#";
  link.textContent = targetPage.title || "Başlıksız";
  link.contentEditable = "false";
  
  // Bağlantı tıklandığında sayfaya yönlendir
  link.onclick = (e) => {
    e.preventDefault();
    selectPage(targetPage.id);
  };

  // Ekleme yap
  range.insertNode(link);
  
  // Sonrasına boşluk bırak ve kürsörü yerleştir
  const spaceNode = document.createTextNode("\u00A0");
  link.parentNode.insertBefore(spaceNode, link.nextSibling);
  
  const newRange = document.createRange();
  newRange.setStartAfter(spaceNode);
  newRange.collapse(true);
  selection.removeAllRanges();
  selection.addRange(newRange);

  closeWikiAutocomplete();
  elements.editorBody.dispatchEvent(new Event("input"));
}

function closeWikiAutocomplete() {
  autocompleteActive = false;
  const autocompleteBox = document.getElementById("wiki-autocomplete");
  if (autocompleteBox) autocompleteBox.style.display = "none";
}

function getCaretCoordinates() {
  const selection = window.getSelection();
  if (selection.rangeCount === 0) return { x: 0, y: 0 };
  const range = selection.getRangeAt(0).cloneRange();
  
  let rect;
  if (range.startContainer.nodeType === Node.TEXT_NODE && range.startOffset === 0) {
    const span = document.createElement("span");
    span.innerHTML = "&#8203;";
    range.insertNode(span);
    rect = span.getBoundingClientRect();
    span.parentNode.removeChild(span);
  } else {
    range.collapse(false);
    rect = range.getBoundingClientRect();
  }
  
  return {
    x: rect.left + window.scrollX,
    y: rect.top + window.scrollY
  };
}

// 5. MARKDOWN OTOMATİK DÖNÜŞTÜRÜCÜ (AUTOREPLACE ENGINE)
function handleMarkdownShortcuts(e) {
  if (e.key !== " ") return; // Yalnızca boşluk tuşunda tetiklenir
  
  const selection = window.getSelection();
  if (!selection.rangeCount) return;
  const range = selection.getRangeAt(0);
  const textNode = range.startContainer;
  
  if (textNode.nodeType !== Node.TEXT_NODE) return;
  
  // Üst paragraf/blok elemanını buluruz
  let block = textNode.parentNode;
  while (block && block.parentNode !== elements.editorBody && block !== elements.editorBody) {
    block = block.parentNode;
  }
  if (!block || block === elements.editorBody) return;
  
  const textVal = textNode.textContent || "";
  const offset = range.startOffset;
  const prefix = textVal.substring(0, offset).trim();

  let targetTag = null;
  let textLength = 0;
  let isCheckbox = false;

  if (prefix === "#") {
    targetTag = "h1";
    textLength = 1;
  } else if (prefix === "##") {
    targetTag = "h2";
    textLength = 2;
  } else if (prefix === "###") {
    targetTag = "h3";
    textLength = 3;
  } else if (prefix === "-") {
    targetTag = "li";
    textLength = 1;
  } else if (prefix === "[]") {
    targetTag = "li";
    textLength = 2;
    isCheckbox = true;
  }

  if (targetTag) {
    e.preventDefault();
    
    // Tetikleyici kısmı sil
    const restText = textVal.substring(offset);
    textNode.textContent = restText;

    if (targetTag === "li") {
      // Liste oluşturma mantığı
      const ul = document.createElement("ul");
      if (isCheckbox) ul.className = "todo-list";
      const li = document.createElement("li");
      
      if (isCheckbox) {
        li.innerHTML = `<input type="checkbox" style="margin-right:6px; cursor:pointer;"> `;
      }
      
      // Kalan metni aktar
      li.appendChild(document.createTextNode(restText.trim()));
      ul.appendChild(li);
      
      block.parentNode.replaceChild(ul, block);
      
      // Kürsörü içeri yerleştir
      const newRange = document.createRange();
      newRange.selectNodeContents(li);
      newRange.collapse(false);
      selection.removeAllRanges();
      selection.addRange(newRange);
    } else {
      // Başlık oluşturma mantığı
      const heading = document.createElement(targetTag);
      heading.appendChild(document.createTextNode(restText.trim() || "\u200B"));
      
      block.parentNode.replaceChild(heading, block);
      
      const newRange = document.createRange();
      newRange.selectNodeContents(heading);
      newRange.collapse(false);
      selection.removeAllRanges();
      selection.addRange(newRange);
    }
    
    elements.editorBody.dispatchEvent(new Event("input"));
  }
}

// 6. YEREL SÜRÜM GEÇMİŞİ YÖNETİCİSİ (INDEXEDDB YEDEKLEME)
let versionTimers = {};
function scheduleVersionSnapshot(pageId) {
  if (versionTimers[pageId]) clearTimeout(versionTimers[pageId]);
  
  // Son değişiklikten 6 saniye sonra otomatik bir sürüm geçmişi kaydı alırız
  versionTimers[pageId] = setTimeout(() => {
    saveVersionSnapshot(pageId);
  }, 6000);
}

async function saveVersionSnapshot(pageId) {
  const page = pages.find(p => p.id === pageId);
  if (!page || page.deleted) return;

  try {
    const versions = await dbManager.getPageVersions(pageId);
    
    // Eğer en son kaydedilen sürümün içeriği birebir aynıysa kaydetmeyiz
    if (versions.length > 0 && versions[0].content === page.content) {
      return;
    }

    const version = {
      pageId: pageId,
      timestamp: Date.now(),
      title: page.title || "Başlıksız",
      content: page.content || ""
    };
    
    await dbManager.saveVersion(version);
    console.log(`LinareN: '${page.title}' belgesinin yeni bir yerel sürüm kaydı alındı.`);
  } catch (err) {
    console.error("Sürüm kaydı oluşturulamadı:", err);
  }
}

// AYARLAR ARAYÜZÜ İÇİN SÜRÜM GEÇMİŞİ DOLDURMA
async function populateHistoryPageSelect() {
  const select = document.getElementById("history-page-select");
  if (!select) return;

  select.innerHTML = '<option value="">Seçiniz...</option>';
  
  pages.filter(p => !p.deleted).forEach(p => {
    const opt = document.createElement("option");
    opt.value = p.id;
    opt.textContent = p.title || "Başlıksız";
    select.appendChild(opt);
  });

  document.getElementById("history-versions-list").innerHTML = '<span style="font-size:11.5px; color:var(--text-muted); text-align:center; margin-top:20px;">Lütfen bir belge seçin</span>';
  document.getElementById("history-preview-content").innerHTML = 'Önizlemek için soldan bir sürüm seçin.';
  document.getElementById("history-preview-time").textContent = 'Sürüm Önizleme';
  document.getElementById("history-restore-btn").style.display = "none";
}

let activeHistoryVersions = [];
let selectedVersionToRestore = null;

async function loadPageVersionsList(pageId) {
  const listContainer = document.getElementById("history-versions-list");
  if (!listContainer) return;

  if (!pageId) {
    listContainer.innerHTML = '<span style="font-size:11.5px; color:var(--text-muted); text-align:center; margin-top:20px;">Lütfen bir belge seçin</span>';
    return;
  }

  listContainer.innerHTML = '<span style="font-size:11px; color:var(--text-muted);">Sürümler yükleniyor...</span>';

  try {
    const versions = await dbManager.getPageVersions(pageId);
    activeHistoryVersions = versions;
    selectedVersionToRestore = null;
    
    document.getElementById("history-restore-btn").style.display = "none";
    document.getElementById("history-preview-content").innerHTML = 'Önizlemek için soldan bir sürüm seçin.';
    document.getElementById("history-preview-time").textContent = 'Sürüm Önizleme';

    if (versions.length === 0) {
      listContainer.innerHTML = '<span style="font-size:11px; color:var(--text-muted); text-align:center; margin-top:20px;">Kayıtlı eski sürüm bulunmuyor.</span>';
      return;
    }

    listContainer.innerHTML = "";
    versions.forEach((v, idx) => {
      const dateStr = new Date(v.timestamp).toLocaleString("tr-TR");
      const item = document.createElement("div");
      item.className = "history-version-item";
      item.innerHTML = `<strong>Sürüm #${versions.length - idx}</strong> <span style="font-size:10px; color:var(--text-muted);">${dateStr}</span>`;
      
      item.onclick = () => {
        document.querySelectorAll(".history-version-item").forEach(i => i.classList.remove("active"));
        item.classList.add("active");
        previewVersion(v);
      };
      
      listContainer.appendChild(item);
    });
  } catch (err) {
    console.error("Versiyon listesi getirme hatası:", err);
    listContainer.innerHTML = '<span style="color:var(--danger); font-size:11px;">Hata oluştu</span>';
  }
}

function previewVersion(version) {
  selectedVersionToRestore = version;
  
  const previewBox = document.getElementById("history-preview-content");
  const previewTime = document.getElementById("history-preview-time");
  const restoreBtn = document.getElementById("history-restore-btn");

  const dateStr = new Date(version.timestamp).toLocaleString("tr-TR");
  previewTime.textContent = `${dateStr} Sürümü`;
  
  // Zengin metin önizleme
  previewBox.innerHTML = version.content || '<span style="color:var(--text-muted);">Boş sayfa</span>';
  restoreBtn.style.display = "block";
}

async function restoreSelectedVersion() {
  if (!selectedVersionToRestore) return;

  const confirmRestore = confirm("Seçilen sürümü geri yüklemek istiyor musunuz? Mevcut yazılarınızın üzerine yazılacaktır.");
  if (!confirmRestore) return;

  const page = pages.find(p => p.id === selectedVersionToRestore.pageId);
  if (page) {
    page.title = selectedVersionToRestore.title;
    page.content = selectedVersionToRestore.content;
    
    // Diske kaydet
    await saveData();
    
    // Eğer şu an o belgedeysek ekranı yenileyelim
    if (currentPageId === page.id) {
      selectPage(page.id);
    }
    
    alert("Belge seçilen sürüme başarıyla geri yüklendi!");
    document.getElementById("settings-modal").classList.remove("open");
  }
}

// 7. HTML5 CANVAS BAZLI ZİHİN AĞ HARİTASI (GRAPH VIEW ENGINE)
let graphNodes = [];
let graphLinks = [];
let graphAnimId = null;
let graphCanvas = null;
let graphCtx = null;
let graphWidth = 0;
let graphHeight = 0;
let draggedNode = null;

function openGraphModal() {
  const modal = document.getElementById("graph-modal");
  if (!modal) return;

  modal.classList.add("open");
  
  graphCanvas = document.getElementById("graph-canvas");
  if (!graphCanvas) return;

  graphCtx = graphCanvas.getContext("2d");
  
  // Boyutları ayarla
  resizeGraphCanvas();
  window.addEventListener("resize", resizeGraphCanvas);

  // Ağ verilerini oluştur
  buildGraphData();

  // Mouse etkileşimlerini bağla
  setupGraphInteraction();

  // Simülasyon döngüsünü başlat
  if (graphAnimId) cancelAnimationFrame(graphAnimId);
  graphAnimId = requestAnimationFrame(runGraphSimulationLoop);
}

function resizeGraphCanvas() {
  if (!graphCanvas) return;
  const parent = graphCanvas.parentElement;
  graphWidth = parent.clientWidth;
  graphHeight = parent.clientHeight;
  
  graphCanvas.width = graphWidth;
  graphCanvas.height = graphHeight;
}

function buildGraphData() {
  // Sayfaları düğümlere dönüştür
  graphNodes = pages.filter(p => !p.deleted).map(p => {
    // Eğer zaten düğüm önceden varsa koordinatlarını sakla (sıçramayı önlemek için)
    const existing = graphNodes.find(n => n.id === p.id);
    return {
      id: p.id,
      title: p.title || "Başlıksız",
      x: existing ? existing.x : Math.random() * (graphWidth - 200) + 100,
      y: existing ? existing.y : Math.random() * (graphHeight - 200) + 100,
      vx: 0,
      vy: 0,
      radius: p.id === currentPageId ? 10 : 7,
      isCurrent: p.id === currentPageId
    };
  });

  // Bağlantıları (wiki-link) tara
  graphLinks = [];
  pages.filter(p => !p.deleted).forEach(p => {
    if (!p.content) return;
    
    // data-page-id="id" kalıplarını regex ile buluruz
    const regex = /data-page-id="([^"]+)"/g;
    let match;
    while ((match = regex.exec(p.content)) !== null) {
      const targetId = match[1];
      
      // Hem kaynak hem hedef düğüm mevcutsa bağlantı ekle
      if (graphNodes.some(n => n.id === p.id) && graphNodes.some(n => n.id === targetId)) {
        // Çift yönlü mükerrer eklemeyi engelle
        const exists = graphLinks.some(l => 
          (l.sourceId === p.id && l.targetId === targetId) || 
          (l.sourceId === targetId && l.targetId === p.id)
        );
        if (!exists) {
          graphLinks.push({ sourceId: p.id, targetId: targetId });
        }
      }
    }
  });
}

function setupGraphInteraction() {
  if (!graphCanvas) return;

  const getMousePos = (e) => {
    const rect = graphCanvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  graphCanvas.onmousedown = (e) => {
    const pos = getMousePos(e);
    // Mouse tıklamasına en yakın düğümü bul (tıklama yarıçapı 20px)
    draggedNode = graphNodes.find(n => {
      const dx = n.x - pos.x;
      const dy = n.y - pos.y;
      return Math.sqrt(dx*dx + dy*dy) < 20;
    });
  };

  graphCanvas.onmousemove = (e) => {
    if (!draggedNode) return;
    const pos = getMousePos(e);
    draggedNode.x = pos.x;
    draggedNode.y = pos.y;
    draggedNode.vx = 0;
    draggedNode.vy = 0;
  };

  graphCanvas.onmouseup = () => {
    draggedNode = null;
  };

  // Çift tıklayınca sayfayı aç
  graphCanvas.ondblclick = (e) => {
    const pos = getMousePos(e);
    const clickedNode = graphNodes.find(n => {
      const dx = n.x - pos.x;
      const dy = n.y - pos.y;
      return Math.sqrt(dx*dx + dy*dy) < 20;
    });

    if (clickedNode) {
      selectPage(clickedNode.id);
      document.getElementById("graph-modal").classList.remove("open");
      if (graphAnimId) cancelAnimationFrame(graphAnimId);
    }
  };
}

function runGraphSimulationLoop() {
  if (!document.getElementById("graph-modal").classList.contains("open")) {
    return;
  }

  // 1. FİZİK İTEÇ-ÇEKİM HESAPLAMALARI (Force-Directed Graph)
  const repulsion = 240; // coulomb itme katsayısı
  const attraction = 0.055; // hooke çekme katsayısı
  const centerForce = 0.015; // merkeze çekme katsayısı
  const dampening = 0.82; // sönümleme

  // 1.a. Düğümler Arası İtme (Herkes herkesten kaçar)
  for (let i = 0; i < graphNodes.length; i++) {
    for (let j = i + 1; j < graphNodes.length; j++) {
      const n1 = graphNodes[i];
      const n2 = graphNodes[j];
      
      const dx = n2.x - n1.x;
      const dy = n2.y - n1.y;
      const distSq = dx*dx + dy*dy + 0.1;
      const dist = Math.sqrt(distSq);
      
      if (dist < 320) {
        const force = repulsion / distSq;
        const fx = force * (dx / dist);
        const fy = force * (dy / dist);
        
        n1.vx -= fx;
        n1.vy -= fy;
        n2.vx += fx;
        n2.vy += fy;
      }
    }
  }

  // 1.b. Bağlar Arası Çekme (Bağlı notlar birbirini çeker)
  graphLinks.forEach(link => {
    const source = graphNodes.find(n => n.id === link.sourceId);
    const target = graphNodes.find(n => n.id === link.targetId);
    
    if (source && target) {
      const dx = target.x - source.x;
      const dy = target.y - source.y;
      const dist = Math.sqrt(dx*dx + dy*dy) || 0.1;
      const springRestingLength = 120; // İdeal yay boyu
      
      const force = (dist - springRestingLength) * attraction;
      const fx = force * (dx / dist);
      const fy = force * (dy / dist);
      
      source.vx += fx;
      source.vy += fy;
      target.vx -= fx;
      target.vy -= fy;
    }
  });

  // 1.c. Merkeze Çekim & Sürükleme Hızı & Sınırlandırma
  const cx = graphWidth / 2;
  const cy = graphHeight / 2;

  graphNodes.forEach(node => {
    if (node === draggedNode) return; // sürüklenen düğüme fizik uygulama

    // Merkeze yönelme kuvveti
    node.vx += (cx - node.x) * centerForce;
    node.vy += (cy - node.y) * centerForce;

    // Hızları koordinatlara uygula
    node.x += node.vx;
    node.y += node.vy;

    // Sönümleme uygula
    node.vx *= dampening;
    node.vy *= dampening;

    // Canvas sınırlarından dışarı çıkmasını engelle
    node.x = Math.max(15, Math.min(graphWidth - 15, node.x));
    node.y = Math.max(15, Math.min(graphHeight - 15, node.y));
  });

  // 2. CANVAS TEMİZLEME VE ÇİZİM İŞLEMLERİ
  graphCtx.clearRect(0, 0, graphWidth, graphHeight);

  // 2.a. Bağlantı Çizgilerini Çiz
  graphLinks.forEach(link => {
    const source = graphNodes.find(n => n.id === link.sourceId);
    const target = graphNodes.find(n => n.id === link.targetId);
    
    if (source && target) {
      graphCtx.beginPath();
      graphCtx.moveTo(source.x, source.y);
      graphCtx.lineTo(target.x, target.y);
      
      // Aktif tema rengine duyarlı çizgiler
      const isLightTheme = document.body.getAttribute("data-theme") === "light";
      graphCtx.strokeStyle = isLightTheme ? "rgba(99, 102, 241, 0.15)" : "rgba(99, 102, 241, 0.35)";
      graphCtx.lineWidth = 1.5;
      graphCtx.stroke();
    }
  });

  // 2.b. Düğümleri Çiz (Glow efektli neon parıltılar)
  const isLightTheme = document.body.getAttribute("data-theme") === "light";
  
  graphNodes.forEach(node => {
    graphCtx.beginPath();
    graphCtx.arc(node.x, node.y, node.radius, 0, 2 * Math.PI);
    
    // Parıltı efekti (Glow)
    graphCtx.shadowBlur = node.isCurrent ? 12 : 5;
    graphCtx.shadowColor = node.isCurrent ? "#6366f1" : "rgba(99, 102, 241, 0.5)";
    
    if (node.isCurrent) {
      graphCtx.fillStyle = "#6366f1"; // Aktif sayfa parlak mavi/indigo
    } else {
      graphCtx.fillStyle = isLightTheme ? "#4f46e5" : "#a1a1aa"; // Diğer notlar
    }
    
    graphCtx.fill();
    
    // Gölgeyi resetle (çizgilerin bulanıklaşmasını engellemek için)
    graphCtx.shadowBlur = 0;

    // Not Başlığını Çiz
    graphCtx.font = node.isCurrent ? "bold 11px Inter, sans-serif" : "11px Inter, sans-serif";
    graphCtx.fillStyle = isLightTheme ? "#1f2937" : "#e4e4e7";
    graphCtx.textAlign = "center";
    graphCtx.fillText(node.title, node.x, node.y - node.radius - 6);
  });

  // Kareyi yenile
  graphAnimId = requestAnimationFrame(runGraphSimulationLoop);
}

// =========================================================================
// 8. PWA & SERVICE WORKER KAYIT MOTORU
// =========================================================================
function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("./sw.js")
      .then((reg) => {
        console.log("LinareN: Service Worker başarıyla kaydedildi:", reg.scope);
      })
      .catch((err) => {
        console.error("LinareN: Service Worker kaydı başarısız:", err);
      });
  }
}

// =========================================================================
// 9. BULUT EŞİTLEME (CLOUD SYNC) ENTEGRASYON MOTORU (GITHUB GIST API)
// =========================================================================
let cloudSyncTimeout = null;

function initCloudSyncUI() {
  const token = localStorage.getItem("linaren_gist_token") || "";
  const gistId = localStorage.getItem("linaren_gist_id") || "";
  const autoSync = localStorage.getItem("linaren_gist_autosync") === "true";

  const tokenInput = document.getElementById("sync-github-token");
  const gistInput = document.getElementById("sync-gist-id");
  const autoCheck = document.getElementById("sync-auto-check");

  if (tokenInput) tokenInput.value = token;
  if (gistInput) gistInput.value = gistId;
  if (autoCheck) autoCheck.checked = autoSync;

  updateSyncUIState();

  try {
    initMultiCloudUI();
    initBackupSchedulerUI();
  } catch (e) {
    console.error("Çoklu bulut arayüz başlatma hatası:", e);
  }
}

function updateSyncUIState() {
  const token = localStorage.getItem("linaren_gist_token");
  const gistId = localStorage.getItem("linaren_gist_id");
  const syncPushBtn = document.getElementById("sync-push-btn");
  const syncPullBtn = document.getElementById("sync-pull-btn");
  const syncCreateBtn = document.getElementById("sync-create-gist-btn");

  const hasToken = !!token;
  const hasGist = !!gistId;

  if (syncPushBtn) syncPushBtn.disabled = !hasToken || !hasGist;
  if (syncPullBtn) syncPullBtn.disabled = !hasToken || !hasGist;
  if (syncCreateBtn) syncCreateBtn.disabled = !hasToken;
}

function showSyncStatus(message, type = "info") {
  const box = document.getElementById("sync-status-message");
  if (!box) return;

  box.textContent = message;
  box.className = `sync-status-message ${type}`;
  box.style.display = "block";
}

function hideSyncStatus() {
  const box = document.getElementById("sync-status-message");
  if (box) box.style.display = "none";
}

// Debounced Auto-Sync Push tetikleyici
function scheduleCloudPush() {
  const token = localStorage.getItem("linaren_gist_token");
  const gistId = localStorage.getItem("linaren_gist_id");
  const autoSync = localStorage.getItem("linaren_gist_autosync") === "true";

  if (!token || !gistId || !autoSync) return;

  if (cloudSyncTimeout) clearTimeout(cloudSyncTimeout);
  cloudSyncTimeout = setTimeout(async () => {
    console.log("LinareN: Otomatik bulut yedeklemesi başlatılıyor...");
    await handlePushToGist(true); // silent = true
  }, 6000);
}

// 1. Yeni Gizli Gist Oluşturma
async function handleCreateGist() {
  const token = localStorage.getItem("linaren_gist_token");
  if (!token) {
    alert("Lütfen önce geçerli bir GitHub Erişim Jetonu (PAT) girin.");
    return;
  }

  showSyncStatus("GitHub üzerinde yeni Gist oluşturuluyor...", "info");
  
  try {
    const pagesClone = JSON.parse(JSON.stringify(pages));
    pagesClone.forEach(p => {
      if (p.folderId && p.decrypted) {
        const folder = folders.find(f => f.id === p.folderId);
        const pass = unlockedFolderPasswords[p.folderId];
        if (folder && folder.encrypted && pass) {
          p.title = encryptText(p.title, pass);
          p.content = encryptText(p.content, pass);
        }
        delete p.decrypted;
      }
    });

    const backupData = {
      pages: pagesClone,
      folders: folders,
      clientLastUpdated: Date.now()
    };

    const response = await fetch("https://api.github.com/gists", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Accept": "application/vnd.github+json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        description: "LinareN Workspace Backup (Secret)",
        public: false,
        files: {
          "linaren_backup.json": {
            "content": JSON.stringify(backupData, null, 2)
          }
        }
      })
    });

    if (!response.ok) {
      throw new Error(`GitHub API Hatası: ${response.statusText} (${response.status})`);
    }

    const data = await response.json();
    const gistId = data.id;

    localStorage.setItem("linaren_gist_id", gistId);
    const gistInput = document.getElementById("sync-gist-id");
    if (gistInput) gistInput.value = gistId;

    localStorage.setItem("linaren_last_sync_time", Date.now().toString());

    updateSyncUIState();
    showSyncStatus(`Gist başarıyla oluşturuldu! ID: ${gistId}`, "success");
    alert(`Yeni gizli Gist başarıyla oluşturuldu ve bağlandı!\n\nGist ID: ${gistId}`);
  } catch (err) {
    console.error("Gist oluşturulurken hata:", err);
    showSyncStatus(`Hata: ${err.message}`, "error");
  }
}

// 2. Verileri Buluta Gönderme (Push)
async function handlePushToGist(silent = false) {
  const token = localStorage.getItem("linaren_gist_token");
  const gistId = localStorage.getItem("linaren_gist_id");

  if (!token || !gistId) {
    if (!silent) alert("Bulut bağlantısı eksik. Lütfen Token ve Gist ID girin.");
    return;
  }

  if (!silent) showSyncStatus("Veriler buluta yükleniyor (Push)...", "info");

  try {
    const pagesClone = JSON.parse(JSON.stringify(pages));
    pagesClone.forEach(p => {
      if (p.folderId && p.decrypted) {
        const folder = folders.find(f => f.id === p.folderId);
        const pass = unlockedFolderPasswords[p.folderId];
        if (folder && folder.encrypted && pass) {
          p.title = encryptText(p.title, pass);
          p.content = encryptText(p.content, pass);
        }
        delete p.decrypted;
      }
    });

    const backupData = {
      pages: pagesClone,
      folders: folders,
      clientLastUpdated: Date.now()
    };

    const response = await fetch(`https://api.github.com/gists/${gistId}`, {
      method: "PATCH",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Accept": "application/vnd.github+json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        files: {
          "linaren_backup.json": {
            "content": JSON.stringify(backupData, null, 2)
          }
        }
      })
    });

    if (!response.ok) {
      throw new Error(`GitHub API Hatası: ${response.statusText} (${response.status})`);
    }

    localStorage.setItem("linaren_last_sync_time", Date.now().toString());
    showSyncStatus("Tüm verileriniz başarıyla buluta yedeklendi!", "success");
    console.log("LinareN: Bulut yedeklemesi (Push) başarılı.");
  } catch (err) {
    console.error("Buluta yedekleme sırasında hata:", err);
    if (!silent) {
      showSyncStatus(`Yedekleme hatası: ${err.message}`, "error");
    }
  }
}

// 3. Verileri Buluttan Çekme (Pull)
async function handlePullFromGist(silent = false) {
  const token = localStorage.getItem("linaren_gist_token");
  const gistId = localStorage.getItem("linaren_gist_id");

  if (!token || !gistId) {
    if (!silent) alert("Bulut bağlantısı eksik. Lütfen Token ve Gist ID girin.");
    return;
  }

  if (!silent) showSyncStatus("Buluttaki veriler sorgulanıyor (Pull)...", "info");

  try {
    const response = await fetch(`https://api.github.com/gists/${gistId}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Accept": "application/vnd.github+json"
      }
    });

    if (!response.ok) {
      throw new Error(`GitHub API Hatası: ${response.statusText} (${response.status})`);
    }

    const data = await response.json();
    const backupFile = data.files["linaren_backup.json"];
    
    if (!backupFile || !backupFile.content) {
      throw new Error("Gist içerisinde 'linaren_backup.json' dosyası bulunamadı.");
    }

    const backupData = JSON.parse(backupFile.content);
    const pulledPages = backupData.pages || [];
    const pulledFolders = backupData.folders || [];

    if (!Array.isArray(pulledPages)) {
      throw new Error("Gist verileri geçersiz.");
    }

    if (!silent) {
      const confirmPull = confirm("Buluttaki notlar indirilecektir. Cihazınızdaki mevcut tüm notlar ve klasörler silinerek buluttaki yedekle güncellenecektir. Devam etmek istiyor musunuz?");
      if (!confirmPull) {
        hideSyncStatus();
        return;
      }
    }

    await dbManager.clearAll();
    
    pages = pulledPages;
    folders = pulledFolders;
    unlockedFolderPasswords = {};
    openFolders.clear();

    await saveData();
    renderSidebar();
    updateFolderSelectOptions();

    const activePages = pages.filter(p => !p.deleted);
    if (activePages.length > 0) {
      selectPage(activePages[0].id);
    } else {
      createNewPage();
    }

    localStorage.setItem("linaren_last_sync_time", Date.now().toString());
    showSyncStatus("Senkronizasyon tamamlandı! Verileriniz buluttan çekildi.", "success");
    if (!silent) {
      alert("Bulut yedeğiniz başarıyla yerel kütüphanenize uygulandı!");
      elements.settingsModal.classList.remove("open");
    }
  } catch (err) {
    console.error("Buluttan veri çekilirken hata:", err);
    if (!silent) {
      showSyncStatus(`Veri çekme hatası: ${err.message}`, "error");
    }
  }
}

// 4. Başlangıçta Bulut Durumunu Sorgulama
async function checkCloudSyncOnStart() {
  const token = localStorage.getItem("linaren_gist_token");
  const gistId = localStorage.getItem("linaren_gist_id");

  if (!token || !gistId) return;

  try {
    const response = await fetch(`https://api.github.com/gists/${gistId}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Accept": "application/vnd.github+json"
      }
    });

    if (!response.ok) return;

    const data = await response.json();
    const backupFile = data.files["linaren_backup.json"];
    if (!backupFile || !backupFile.content) return;

    const backupData = JSON.parse(backupFile.content);
    const cloudLastUpdated = backupData.clientLastUpdated || 0;
    
    const lastSyncLocalStr = localStorage.getItem("linaren_last_sync_time") || "0";
    const lastSyncLocal = parseInt(lastSyncLocalStr, 10);

    if (cloudLastUpdated > lastSyncLocal) {
      showSyncStatus("Bulutta daha yeni bir yedek bulundu. Güncellemek için 'Buluttan Çek' butonuna tıklayabilirsiniz.", "info");
      console.log("LinareN: Bulutta daha güncel veri mevcut.");
    }
  } catch (e) {
    console.warn("Bulut başlangıç sorgusu başarısız:", e);
  }
}

// 5. Bağlantıyı Kesme
function handleDisconnectSync() {
  if (confirm("Bulut senkronizasyonu bağlantısını kesmek istediğinize emin misiniz? Erişim anahtarınız ve Gist ID yerel hafızadan silinecektir (Verileriniz kaybolmaz).")) {
    localStorage.removeItem("linaren_gist_token");
    localStorage.removeItem("linaren_gist_id");
    localStorage.removeItem("linaren_gist_autosync");
    localStorage.removeItem("linaren_last_sync_time");

    const tokenInput = document.getElementById("sync-github-token");
    const gistInput = document.getElementById("sync-gist-id");
    const autoCheck = document.getElementById("sync-auto-check");

    if (tokenInput) tokenInput.value = "";
    if (gistInput) gistInput.value = "";
    if (autoCheck) autoCheck.checked = false;

    updateSyncUIState();
    hideSyncStatus();
    alert("Bulut bağlantısı sonlandırıldı.");
  }
}

// =========================================================================
// 9. E-POSTA GÖNDERİM VE YAPILANDIRMA MANTISI
// =========================================================================
function initEmailSettings() {
  const target = localStorage.getItem("linaren_email_target") || "";
  const method = localStorage.getItem("linaren_email_method") || "mailto";
  const pubKey = localStorage.getItem("linaren_email_pubkey") || "";
  const serviceId = localStorage.getItem("linaren_email_service") || "";
  const templateId = localStorage.getItem("linaren_email_template") || "";

  const emailTargetInput = document.getElementById("email-target-address");
  const emailMethodSelect = document.getElementById("email-send-method");
  const emailPubKeyInput = document.getElementById("email-js-public-key");
  const emailServiceInput = document.getElementById("email-js-service-id");
  const emailTemplateInput = document.getElementById("email-js-template-id");
  const emailjsFields = document.getElementById("email-emailjs-fields");

  if (emailTargetInput) emailTargetInput.value = target;
  if (emailMethodSelect) {
    emailMethodSelect.value = method;
    if (emailjsFields) {
      emailjsFields.style.display = method === "emailjs" ? "flex" : "none";
    }
  }
  if (emailPubKeyInput) emailPubKeyInput.value = pubKey;
  if (emailServiceInput) emailServiceInput.value = serviceId;
  if (emailTemplateInput) emailTemplateInput.value = templateId;

  // EmailJS kütüphanesini initialize et
  if (method === "emailjs" && pubKey && typeof emailjs !== "undefined") {
    try {
      emailjs.init({ publicKey: pubKey });
      console.log("LinareN: EmailJS başarıyla initialize edildi.");
    } catch (e) {
      console.error("LinareN: EmailJS init hatası:", e);
    }
  }
}

function saveEmailSettings() {
  const target = document.getElementById("email-target-address")?.value.trim() || "";
  const method = document.getElementById("email-send-method")?.value || "mailto";
  const pubKey = document.getElementById("email-js-public-key")?.value.trim() || "";
  const serviceId = document.getElementById("email-js-service-id")?.value.trim() || "";
  const templateId = document.getElementById("email-js-template-id")?.value.trim() || "";

  if (method === "emailjs" && (!target || !pubKey || !serviceId || !templateId)) {
    showEmailStatus("Lütfen EmailJS için tüm alanları ve alıcı e-posta adresini doldurun.", "error");
    return;
  } else if (method === "mailto" && !target) {
    showEmailStatus("Lütfen alıcı e-posta adresini girin.", "error");
    return;
  }

  localStorage.setItem("linaren_email_target", target);
  localStorage.setItem("linaren_email_method", method);
  localStorage.setItem("linaren_email_pubkey", pubKey);
  localStorage.setItem("linaren_email_service", serviceId);
  localStorage.setItem("linaren_email_template", templateId);

  // EmailJS tekrar init et
  if (method === "emailjs" && pubKey && typeof emailjs !== "undefined") {
    try {
      emailjs.init({ publicKey: pubKey });
    } catch (e) {
      console.error(e);
    }
  }

  showEmailStatus("E-posta ayarları başarıyla kaydedildi.", "success");
}

function showEmailStatus(msg, type) {
  const container = document.getElementById("email-status-message");
  if (!container) return;

  container.className = "";
  container.classList.add(type); // success, error, info
  container.textContent = msg;
  container.style.display = "block";

  setTimeout(() => {
    container.style.display = "none";
  }, 5000);
}

async function sendNoteViaEmail(isTest = false) {
  const target = localStorage.getItem("linaren_email_target");
  const method = localStorage.getItem("linaren_email_method") || "mailto";

  if (!target) {
    alert("Lütfen önce Ayarlar -> E-posta Ayarları sekmesinden alıcı e-posta adresini yapılandırın.");
    // Ayarlar modalini aç ve o sekmeye odaklan
    const settingsBtn = document.getElementById("settings-btn");
    if (settingsBtn) settingsBtn.click();
    const emailTabBtn = document.querySelector('.settings-tab-btn[data-tab="tab-email"]');
    if (emailTabBtn) emailTabBtn.click();
    return;
  }

  // Not detayları
  let title = "Test E-postası";
  let htmlContent = "Bu bir test e-postasıdır. LinareN e-posta yapılandırmanız çalışıyor!";

  if (!isTest) {
    const page = pages.find(p => p.id === currentPageId);
    if (!page) return;
    title = page.title || "Başlıksız Not";
    htmlContent = elements.editorBody.innerHTML || "";
  }

  // Plain text içeriği oluştur (HTML etiketlerinden arındırılmış)
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = htmlContent;
  const textContent = tempDiv.textContent || tempDiv.innerText || "";

  if (method === "mailto") {
    // Mailto linki oluştur
    const subject = encodeURIComponent(title);
    const body = encodeURIComponent(textContent);
    const mailtoUrl = `mailto:${target}?subject=${subject}&body=${body}`;
    window.location.href = mailtoUrl;
  } else if (method === "emailjs") {
    const pubKey = localStorage.getItem("linaren_email_pubkey");
    const serviceId = localStorage.getItem("linaren_email_service");
    const templateId = localStorage.getItem("linaren_email_template");

    if (!pubKey || !serviceId || !templateId) {
      alert("Lütfen önce Ayarlar -> E-posta Ayarları sekmesinden EmailJS parametrelerini eksiksiz girin.");
      return;
    }

    if (typeof emailjs === "undefined") {
      alert("EmailJS SDK'sı yüklenemedi. Lütfen internet bağlantınızı kontrol edin.");
      return;
    }

    // Gönderim durumunu göster
    if (isTest) {
      showEmailStatus("Test e-postası gönderiliyor...", "info");
    } else {
      alert("E-posta arka planda gönderiliyor...");
    }

    try {
      const templateParams = {
        to_email: target,
        note_title: title,
        note_content: textContent
      };

      const response = await emailjs.send(serviceId, templateId, templateParams);
      if (response.status === 200) {
        if (isTest) {
          showEmailStatus("Test e-postası başarıyla gönderildi!", "success");
        } else {
          alert("E-posta başarıyla gönderildi!");
        }
      } else {
        throw new Error("Yanıt kodu: " + response.status);
      }
    } catch (err) {
      console.error("LinareN: E-posta gönderim hatası:", err);
      if (isTest) {
        showEmailStatus(`Gönderim başarısız: ${err.message || err}`, "error");
      } else {
        alert(`E-posta gönderimi başarısız oldu: ${err.message || err}`);
      }
    }
  }
}

// =========================================================================
// 10. ÇOKLU BULUT YEDEKLEME & ZAMANLAYICI SİSTEMİ (GDrive, WebDAV & Scheduler)
// =========================================================================

function setActiveBackupProvider(provider) {
  const providers = ["gist", "gdrive", "webdav"];
  const activeProvider = providers.includes(provider) ? provider : "gist";
  localStorage.setItem("linaren_active_backup_provider", activeProvider);

  // Sekme butonlarını güncelle
  providers.forEach(p => {
    const btn = document.getElementById(`provider-tab-${p}`);
    const panel = document.getElementById(`panel-sync-${p}`);
    if (btn) {
      if (p === activeProvider) {
        btn.style.background = "var(--accent)";
        btn.style.color = "#ffffff";
      } else {
        btn.style.background = "transparent";
        btn.style.color = "var(--text-secondary)";
      }
    }
    if (panel) {
      panel.style.display = p === activeProvider ? "block" : "none";
    }
  });

  // Google Drive ise ve Client ID varsa init et
  if (activeProvider === "gdrive") {
    initGoogleDrive();
    updateGDriveUI();
  }
  
  // Zamanlayıcı ayarlarındaki aktif durum metnini güncelle
  updateBackupSchedulerUI();
}

function initMultiCloudUI() {
  const activeProvider = localStorage.getItem("linaren_active_backup_provider") || "gist";
  setActiveBackupProvider(activeProvider);

  // Google Drive input değerlerini yükle
  const gdriveClientId = localStorage.getItem("linaren_gdrive_client_id") || "";
  const gdriveApiKey = localStorage.getItem("linaren_gdrive_api_key") || "";
  const gdriveClientInput = document.getElementById("sync-gdrive-client-id");
  const gdriveApiKeyInput = document.getElementById("sync-gdrive-api-key");
  
  if (gdriveClientInput) gdriveClientInput.value = gdriveClientId;
  if (gdriveApiKeyInput) gdriveApiKeyInput.value = gdriveApiKey;

  // WebDAV input değerlerini yükle
  const webdavUrl = localStorage.getItem("linaren_webdav_url") || "";
  const webdavUser = localStorage.getItem("linaren_webdav_username") || "";
  const webdavPass = localStorage.getItem("linaren_webdav_password") || "";
  const webdavUrlInput = document.getElementById("sync-webdav-url");
  const webdavUserInput = document.getElementById("sync-webdav-username");
  const webdavPassInput = document.getElementById("sync-webdav-password");

  if (webdavUrlInput) webdavUrlInput.value = webdavUrl;
  if (webdavUserInput) webdavUserInput.value = webdavUser;
  if (webdavPassInput) webdavPassInput.value = webdavPass;
}

let tokenClient = null;
let gdriveAccessToken = localStorage.getItem("linaren_gdrive_token") || null;

function initGoogleDrive() {
  const clientId = localStorage.getItem("linaren_gdrive_client_id");
  if (!clientId || typeof google === "undefined" || !google.accounts) return;
  
  try {
    tokenClient = google.accounts.oauth2.initTokenClient({
      client_id: clientId,
      scope: 'https://www.googleapis.com/auth/drive.file',
      callback: (resp) => {
        if (resp.error !== undefined) {
          console.error("Google login error:", resp);
          showSyncStatus("Google giriş hatası: " + resp.error, "error");
          return;
        }
        gdriveAccessToken = resp.access_token;
        localStorage.setItem("linaren_gdrive_token", gdriveAccessToken);
        localStorage.setItem("linaren_gdrive_token_expires", Date.now() + (resp.expires_in * 1000));
        updateGDriveUI();
        showSyncStatus("Google Drive başarıyla bağlandı!", "success");
      },
    });
  } catch (e) {
    console.error("GIS initClient hatası:", e);
  }
}

function requestGoogleAccessToken(callback) {
  if (!tokenClient) {
    initGoogleDrive();
  }
  if (!tokenClient) {
    alert("Lütfen önce geçerli bir Google Client ID (İstemci Kimliği) girin ve kaydedin.");
    return;
  }
  
  if (callback) {
    tokenClient.callback = (resp) => {
      if (resp.error !== undefined) {
        console.error(resp);
        showSyncStatus("Google yetkilendirme hatası.", "error");
        return;
      }
      gdriveAccessToken = resp.access_token;
      localStorage.setItem("linaren_gdrive_token", gdriveAccessToken);
      localStorage.setItem("linaren_gdrive_token_expires", Date.now() + (resp.expires_in * 1000));
      updateGDriveUI();
      callback();
    };
  }
  
  const tokenExpires = parseInt(localStorage.getItem("linaren_gdrive_token_expires") || "0", 10);
  const isExpired = Date.now() > tokenExpires;

  if (gdriveAccessToken && !isExpired) {
    if (callback) callback();
  } else {
    tokenClient.requestAccessToken({ prompt: gdriveAccessToken ? '' : 'consent' });
  }
}

function logoutGoogleDrive() {
  gdriveAccessToken = null;
  localStorage.removeItem("linaren_gdrive_token");
  localStorage.removeItem("linaren_gdrive_token_expires");
  updateGDriveUI();
  showSyncStatus("Google Drive bağlantısı kesildi.", "info");
}

function updateGDriveUI() {
  const loginBtn = document.getElementById("sync-gdrive-login-btn");
  const logoutBtn = document.getElementById("sync-gdrive-logout-btn");
  const statusDot = document.getElementById("gdrive-status-dot");
  const statusText = document.getElementById("gdrive-login-status");
  const actionsDiv = document.getElementById("gdrive-actions");

  const tokenExpires = parseInt(localStorage.getItem("linaren_gdrive_token_expires") || "0", 10);
  const isExpired = Date.now() > tokenExpires;
  const isConnected = !!gdriveAccessToken && !isExpired;

  if (isConnected) {
    if (loginBtn) loginBtn.style.display = "none";
    if (logoutBtn) logoutBtn.style.display = "block";
    if (statusDot) statusDot.style.background = "var(--success)";
    if (statusText) statusText.innerHTML = `<span style="width:8px; height:8px; border-radius:50%; background:var(--success); display:inline-block;" id="gdrive-status-dot"></span> Bağlandı`;
    if (actionsDiv) actionsDiv.style.display = "block";
  } else {
    if (loginBtn) loginBtn.style.display = "block";
    if (logoutBtn) logoutBtn.style.display = "none";
    if (statusDot) statusDot.style.background = "var(--danger)";
    if (statusText) statusText.innerHTML = `<span style="width:8px; height:8px; border-radius:50%; background:var(--danger); display:inline-block;" id="gdrive-status-dot"></span> Bağlı Değil`;
    if (actionsDiv) actionsDiv.style.display = "none";
  }
}

async function uploadToGoogleDrive(isScheduled = false) {
  const clientId = localStorage.getItem("linaren_gdrive_client_id");

  if (!clientId) {
    if (!isScheduled) alert("Lütfen önce Google Client ID girin.");
    return;
  }

  requestGoogleAccessToken(async () => {
    try {
      showSyncStatus("Google Drive yedeklemesi başlatılıyor...", "info");

      let folderId = null;
      const searchUrl = `https://www.googleapis.com/drive/v3/files?q=name='LinareN_Backups' and mimeType='application/vnd.google-apps.folder' and trashed=false`;
      
      const searchResp = await fetch(searchUrl, {
        headers: {
          "Authorization": `Bearer ${gdriveAccessToken}`,
          "Accept": "application/json"
        }
      });

      if (!searchResp.ok) throw new Error("Klasör sorgulanamadı.");
      const searchData = await searchResp.json();
      
      if (searchData.files && searchData.files.length > 0) {
        folderId = searchData.files[0].id;
      } else {
        showSyncStatus("Yedek klasörü oluşturuluyor...", "info");
        const createFolderResp = await fetch("https://www.googleapis.com/drive/v3/files", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${gdriveAccessToken}`,
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify({
            name: "LinareN_Backups",
            mimeType: "application/vnd.google-apps.folder"
          })
        });

        if (!createFolderResp.ok) throw new Error("Yedek klasörü oluşturulamadı.");
        const folderData = await createFolderResp.json();
        folderId = folderData.id;
      }

      const backupObj = {
        clientLastUpdated: Date.now(),
        pages: pages,
        folders: folders
      };

      const backupContent = JSON.stringify(backupObj, null, 2);
      const fileName = `linaren_backup_${new Date().toISOString().replace(/[:.]/g, "-")}.json`;

      const metadata = {
        name: fileName,
        parents: [folderId],
        mimeType: "application/json"
      };

      const boundary = "linaren_boundary_marker";
      let body = "";
      body += `--${boundary}\r\n`;
      body += `Content-Type: application/json; charset=UTF-8\r\n\r\n`;
      body += `${JSON.stringify(metadata)}\r\n`;
      body += `--${boundary}\r\n`;
      body += `Content-Type: application/json\r\n\r\n`;
      body += `${backupContent}\r\n`;
      body += `--${boundary}--`;

      const uploadResp = await fetch("https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${gdriveAccessToken}`,
          "Content-Type": `multipart/related; boundary=${boundary}`
        },
        body: body
      });

      if (!uploadResp.ok) throw new Error("Yedek dosyası yüklenemedi.");

      localStorage.setItem("linaren_last_drive_backup", Date.now().toString());
      updateBackupSchedulerUI();
      showSyncStatus("Google Drive yedeklemesi başarıyla tamamlandı!", "success");
      
      if (!isScheduled) {
        alert("Yedek dosyanız Google Drive'da 'LinareN_Backups' klasörüne başarıyla yüklendi!");
      }
    } catch (err) {
      console.error(err);
      showSyncStatus("Google Drive yedekleme hatası: " + err.message, "error");
      if (!isScheduled) {
        alert("Google Drive yedeklemesi başarısız oldu: " + err.message);
      }
    }
  });
}

async function uploadToWebDAV(isScheduled = false) {
  const url = localStorage.getItem("linaren_webdav_url");
  const user = localStorage.getItem("linaren_webdav_username");
  const pass = localStorage.getItem("linaren_webdav_password");

  if (!url || !user || !pass) {
    if (!isScheduled) alert("Lütfen önce WebDAV bağlantı ayarlarını doldurun.");
    return;
  }

  showSyncStatus("WebDAV yedeklemesi başlatılıyor...", "info");

  const backupObj = {
    clientLastUpdated: Date.now(),
    pages: pages,
    folders: folders
  };

  const backupContent = JSON.stringify(backupObj, null, 2);
  const fileName = `linaren_backup_${new Date().toISOString().replace(/[:.]/g, "-")}.json`;
  
  let targetUrl = url;
  if (!targetUrl.endsWith("/")) {
    targetUrl += "/";
  }
  targetUrl += fileName;

  try {
    const authHeader = "Basic " + btoa(unescape(encodeURIComponent(user + ":" + pass)));
    
    const response = await fetch(targetUrl, {
      method: "PUT",
      headers: {
        "Authorization": authHeader,
        "Content-Type": "application/json; charset=utf-8"
      },
      body: backupContent
    });

    if (!response.ok) {
      throw new Error("HTTP Hata Kodu: " + response.status);
    }

    localStorage.setItem("linaren_last_drive_backup", Date.now().toString());
    updateBackupSchedulerUI();
    showSyncStatus("WebDAV yedeklemesi başarıyla tamamlandı!", "success");
    
    if (!isScheduled) {
      alert("Yedek dosyanız WebDAV sunucusuna başarıyla yüklendi!");
    }
  } catch (err) {
    console.error(err);
    showSyncStatus("WebDAV yedekleme hatası: " + err.message, "error");
    if (!isScheduled) {
      alert("WebDAV yedeklemesi başarısız oldu: " + err.message);
    }
  }
}

async function testWebDAVConnection() {
  const url = localStorage.getItem("linaren_webdav_url");
  const user = localStorage.getItem("linaren_webdav_username");
  const pass = localStorage.getItem("linaren_webdav_password");

  if (!url || !user || !pass) {
    alert("Lütfen önce tüm WebDAV alanlarını doldurun.");
    return;
  }

  showSyncStatus("WebDAV bağlantısı test ediliyor...", "info");
  
  let targetUrl = url;
  if (!targetUrl.endsWith("/")) {
    targetUrl += "/";
  }
  targetUrl += "linaren_connection_test.txt";

  try {
    const authHeader = "Basic " + btoa(unescape(encodeURIComponent(user + ":" + pass)));
    
    const response = await fetch(targetUrl, {
      method: "PUT",
      headers: {
        "Authorization": authHeader,
        "Content-Type": "text/plain; charset=utf-8"
      },
      body: "LinareN WebDAV Connection Test"
    });

    if (response.ok) {
      showSyncStatus("WebDAV bağlantısı başarılı!", "success");
      alert("Tebrikler! WebDAV sunucusuna bağlantı başarıyla sağlandı ve yazma yetkisi doğrulandı.");
      
      fetch(targetUrl, {
        method: "DELETE",
        headers: {
          "Authorization": authHeader
        }
      }).catch(() => {});
    } else {
      throw new Error("HTTP Hata Kodu: " + response.status);
    }
  } catch (err) {
    console.error(err);
    showSyncStatus("WebDAV bağlantı testi başarısız: " + err.message, "error");
    alert("WebDAV bağlantı testi başarısız oldu: " + err.message);
  }
}

function initBackupSchedulerUI() {
  const freq = localStorage.getItem("linaren_backup_frequency") || "off";
  const time = localStorage.getItem("linaren_backup_time") || "00:00";
  const day = localStorage.getItem("linaren_backup_day") || "1";

  const backupFreqSelect = document.getElementById("backup-frequency");
  const backupTimeInput = document.getElementById("backup-time");
  const backupDaySelect = document.getElementById("backup-day");

  if (backupFreqSelect) backupFreqSelect.value = freq;
  if (backupTimeInput) backupTimeInput.value = time;
  if (backupDaySelect) backupDaySelect.value = day;

  updateSchedulerInputsVisibility(freq);
  updateBackupSchedulerUI();
}

function updateSchedulerInputsVisibility(freq) {
  const timeWrapper = document.getElementById("backup-time-wrapper");
  const dayWrapper = document.getElementById("backup-day-wrapper");

  if (freq === "off" || freq === "hourly") {
    if (timeWrapper) timeWrapper.style.display = "none";
    if (dayWrapper) dayWrapper.style.display = "none";
  } else if (freq === "daily") {
    if (timeWrapper) timeWrapper.style.display = "block";
    if (dayWrapper) dayWrapper.style.display = "none";
  } else if (freq === "weekly") {
    if (timeWrapper) timeWrapper.style.display = "block";
    if (dayWrapper) dayWrapper.style.display = "block";
  }
}

function saveBackupSchedulerSettings() {
  const freq = document.getElementById("backup-frequency")?.value || "off";
  const time = document.getElementById("backup-time")?.value || "00:00";
  const day = document.getElementById("backup-day")?.value || "1";

  localStorage.setItem("linaren_backup_frequency", freq);
  localStorage.setItem("linaren_backup_time", time);
  localStorage.setItem("linaren_backup_day", day);

  updateBackupSchedulerUI();
  alert("Otomatik yedekleme zamanlayıcısı ayarları kaydedildi.");
}

function updateBackupSchedulerUI() {
  const textContainer = document.getElementById("scheduler-status-text");
  if (!textContainer) return;

  const freq = localStorage.getItem("linaren_backup_frequency") || "off";
  const lastBackupStr = localStorage.getItem("linaren_last_drive_backup") || "0";
  const lastBackup = parseInt(lastBackupStr, 10);

  if (freq === "off") {
    textContainer.innerHTML = `<span style="color:var(--text-muted);">Durum: Devre Dışı</span>`;
    return;
  }

  let lastBackupText = "Hiç yedek alınmadı";
  if (lastBackup > 0) {
    lastBackupText = new Date(lastBackup).toLocaleString();
  }

  let infoText = "";
  if (freq === "hourly") infoText = "Saatlik";
  else if (freq === "daily") infoText = `Günlük (${localStorage.getItem("linaren_backup_time")})`;
  else if (freq === "weekly") {
    const dayNames = ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"];
    const dVal = parseInt(localStorage.getItem("linaren_backup_day") || "1", 10);
    infoText = `Haftalık (${dayNames[dVal]} günleri, saat ${localStorage.getItem("linaren_backup_time")})`;
  }

  textContainer.innerHTML = `<span style="color:var(--success);"><i data-lucide="check" style="width:12px; height:12px; display:inline-block; vertical-align:middle; margin-right:4px;"></i> Aktif (${infoText})</span> <span style="margin-left: 12px; color:var(--text-muted);">Son Yedek: ${lastBackupText}</span>`;
  safeCreateIcons();
}

async function checkBackupScheduler() {
  const freq = localStorage.getItem("linaren_backup_frequency") || "off";
  if (freq === "off") return;

  const provider = localStorage.getItem("linaren_active_backup_provider") || "gist";
  if (provider === "gist") {
    return;
  }

  const lastBackupStr = localStorage.getItem("linaren_last_drive_backup") || "0";
  const lastBackup = parseInt(lastBackupStr, 10);
  const now = Date.now();

  let shouldBackup = false;

  if (freq === "hourly") {
    if (now - lastBackup >= 3600000) {
      shouldBackup = true;
    }
  } else if (freq === "daily" || freq === "weekly") {
    const timeVal = localStorage.getItem("linaren_backup_time") || "00:00";
    const [targetHour, targetMinute] = timeVal.split(":").map(Number);
    
    const nowTimeObj = new Date();
    const currentHour = nowTimeObj.getHours();
    const currentMinute = nowTimeObj.getMinutes();

    const targetTimeToday = new Date();
    targetTimeToday.setHours(targetHour, targetMinute, 0, 0);

    const MIN_INTERVAL_MS = 20 * 60 * 60 * 1000;

    if (freq === "daily") {
      if (nowTimeObj >= targetTimeToday && (now - lastBackup >= MIN_INTERVAL_MS)) {
        shouldBackup = true;
      }
    } else if (freq === "weekly") {
      const targetDay = parseInt(localStorage.getItem("linaren_backup_day") || "1", 10);
      const currentDay = nowTimeObj.getDay();
      if (currentDay === targetDay && nowTimeObj >= targetTimeToday && (now - lastBackup >= MIN_INTERVAL_MS)) {
        shouldBackup = true;
      }
    }
  }

  if (shouldBackup) {
    console.log(`LinareN Scheduler: Zamanlanmış yedekleme tetikleniyor. Sağlayıcı: ${provider}`);
    if (provider === "gdrive") {
      uploadToGoogleDrive(true);
    } else if (provider === "webdav") {
      uploadToWebDAV(true);
    }
  }
}

