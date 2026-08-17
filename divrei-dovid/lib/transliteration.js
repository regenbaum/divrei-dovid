// Normalizes common transliteration variance in Hebrew/Yiddish terms so
// search matches regardless of spelling convention — important here since
// this archive spans decades and mixes American/Ashkenazi-style spelling
// (Shabbos, Sukkos, Boruch) with Israeli/Sephardi-style spelling (Shabbat,
// Sukkot, Baruch), plus general guttural-letter variance (Chanukah vs
// Hanukkah). This is intentionally about spelling CONVENTIONS, not typo
// tolerance — "tehsuva" won't match "teshuva" here, by design.
//
// Handles systematically:
//   - kh / ch / h  (guttural chet/chaf: Chanukah, Hanukkah, Hanuka)
//   - ts / tz      (tzadi: Mitzvah, Mitsva)
//   - w / v        (vav: Vayishlach, Wayishlach)
//   - doubled letters (Hanukkah -> Hanukah)
//   - silent trailing h (teshuva / teshuvah)
//   - Ashkenazi "-os" endings vs Sephardi/Modern "-ot" (Sukkos / Sukkot)
//
// Plus a short list of common words where Ashkenazi pronunciation shifts
// a vowel too, not just a consonant (Shabbos/Shabbat, Boruch/Baruch) —
// those can't be caught by a general rule without risking unrelated
// false matches, so they're special-cased explicitly. Extend this list
// any time a real search doesn't find what it should.
const SPECIAL_CASES = {
  shabbos: 'shabbat', shabbes: 'shabbat', shabbat: 'shabbat',
  boruch: 'baruch', baruch: 'baruch',
  yisroel: 'yisrael', yisrael: 'yisrael',
  hashono: 'hashana', hashana: 'hashana', hashanah: 'hashana',
  yomtov: 'yomtov', yontif: 'yomtov',
  koton: 'katan', katan: 'katan',
  moshiach: 'moshiach', moshiah: 'moshiach', moshiakh: 'moshiach',
}

function normalizeWord(rawWord) {
  const cleaned = rawWord.replace(/['’`]/g, '')
  if (SPECIAL_CASES[cleaned]) return SPECIAL_CASES[cleaned]

  let w = cleaned
    .replace(/kh/g, 'h')
    .replace(/ch/g, 'h')
    .replace(/ts/g, 'tz')
    .replace(/w/g, 'v')

  if (/os$/i.test(w) && w.length > 3) w = w.replace(/os$/i, 'ot')
  w = w.replace(/(.)\1+/g, '$1') // collapse doubled letters
  if (/[a-z]h$/.test(w) && w.length > 3) w = w.replace(/h$/, '') // silent trailing h

  return w
}

export function normalizeTransliteration(str) {
  return str.toLowerCase().split(/\s+/).map(normalizeWord).join(' ')
}
