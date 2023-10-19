function detectLanguage(str) {
  const japaneseRegex = /[\u3040-\u30FF\u31F0-\u31FF\uFF66-\uFF9F]/;
  const chineseRegex = /[\u4E00-\u9FFF\u3400-\u4DBF]/;
  const englishRegex = /[A-Za-z]/;
  const koreanRegex = /[\uAC00-\uD7AF\u1100-\u11FF\u3130-\u318F]/;
  const germanRegex = /[ÄäÖöÜüß]/;
  const russianRegex = /[\u0400-\u04FF]/;
  const vietnameseRegex = /[\u0102\u0103\u0110\u0111\u0128\u0129\u0168\u0169\u01A0\u01A1\u01AF\u01B0\u1EA0-\u1EF9]/;
  const frenchRegex = /[ÀàÂâÆæÇçÉéÈèÊêËëÎîÏïÔôŒœÙùÛûŸÿ]/;
  const spanishRegex = /[¡¿ÁáÉéÍíÑñÓóÚúÜü]/;
  const portugueseRegex = /[ÃãÁáÀàÂâÇçÉéÊêÍíÓóÔôÕõÚúÜü]/;
  const arabicRegex = /[\u0600-\u06FF]/;
  const thaiRegex = /[\u0E00-\u0E7F]/;
  const hindiRegex = /[\u0900-\u097F]/;
  const indonesianRegex = /[\u1B80-\u1BBF]/;
  const malayRegex = /[\u1C00-\u1C4F]/;
  const filipinoRegex = /[\u1700-\u171F]/;
  const tamilRegex = /[\u0B80-\u0BFF]/;
  const teluguRegex = /[\u0C00-\u0C7F]/;
  const kannadaRegex = /[\u0C80-\u0CFF]/;
  const malayalamRegex = /[\u0D00-\u0D7F]/;
  const sinhalaRegex = /[\u0D80-\u0DFF]/;
  const burmeseRegex = /[\u1000-\u109F]/;
  const khmerRegex = /[\u1780-\u17FF]/;
  const laoRegex = /[\u0E80-\u0EFF]/;
  const nepaliRegex = /[\u0900-\u097F]/;
  const marathiRegex = /[\u0900-\u097F]/;
  const bengaliRegex = /[\u0980-\u09FF]/;
  const gujaratiRegex = /[\u0A80-\u0AFF]/;
  const oriyaRegex = /[\u0B00-\u0B7F]/;
  const punjabiRegex = /[\u0A00-\u0A7F]/;
  const urduRegex = /[\u0600-\u06FF]/;
  const mongolianRegex = /[\u1800-\u18AF]/;
  const amharicRegex = /[\u1200-\u137F]/;
  const tigrinyaRegex = /[\u1200-\u137F]/;
  const somaliRegex = /[\u1200-\u137F]/;
  const swahiliRegex = /[\u1200-\u137F]/;

  if (japaneseRegex.test(str)) {
    return 'ja';
  } if (chineseRegex.test(str)) {
    return 'zh-CN';
  } if (englishRegex.test(str)) {
    return 'en';
  } if (koreanRegex.test(str)) {
    return 'ko';
  } if (germanRegex.test(str)) {
    return 'de';
  } if (russianRegex.test(str)) {
    return 'ru';
  } if (vietnameseRegex.test(str)) {
    return 'vi';
  } if (frenchRegex.test(str)) {
    return 'fr';
  } if (spanishRegex.test(str)) {
    return 'es';
  } if (portugueseRegex.test(str)) {
    return 'pt';
  } if (arabicRegex.test(str)) {
    return 'ar';
  } if (thaiRegex.test(str)) {
    return 'th';
  } if (hindiRegex.test(str)) {
    return 'hi';
  } if (indonesianRegex.test(str)) {
    return 'id';
  } if (malayRegex.test(str)) {
    return 'ms';
  } if (filipinoRegex.test(str)) {
    return 'fil';
  } if (tamilRegex.test(str)) {
    return 'ta';
  } if (teluguRegex.test(str)) {
    return 'te';
  } if (kannadaRegex.test(str)) {
    return 'kn';
  } if (malayalamRegex.test(str)) {
    return 'ml';
  } if (sinhalaRegex.test(str)) {
    return 'si';
  } if (burmeseRegex.test(str)) {
    return 'my';
  } if (khmerRegex.test(str)) {
    return 'km';
  } if (laoRegex.test(str)) {
    return 'lo';
  } if (nepaliRegex.test(str)) {
    return 'ne';
  } if (marathiRegex.test(str)) {
    return 'mr';
  } if (bengaliRegex.test(str)) {
    return 'bn';
  } if (gujaratiRegex.test(str)) {
    return 'gu';
  } if (oriyaRegex.test(str)) {
    return 'or';
  } if (punjabiRegex.test(str)) {
    return 'pa';
  } if (urduRegex.test(str)) {
    return 'ur';
  } if (mongolianRegex.test(str)) {
    return 'mn';
  } if (amharicRegex.test(str)) {
    return 'am';
  } if (tigrinyaRegex.test(str)) {
    return 'ti';
  } if (somaliRegex.test(str)) {
    return 'so';
  } if (swahiliRegex.test(str)) {
    return 'sw';
  }
  return null;
}

export default async function requestGoogle(question) {
  const titleEle = document.getElementById('yt_ai_header_text');

  const questionLang = detectLanguage(question);
  const lang = titleEle.value;
  if (questionLang === null) {
    return 'We apologize, but translation in that language is currently not supported.';
  }
  if (questionLang === lang) {
    return `The language is in accordance with your browser language(${lang}).Please set your browser language first.`;
  }
  const googleTranslate = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${questionLang}&tl=${lang}&hl=${lang}&dt=t&dt=bd&dj=1&source=icon&tk=946553.946553&q=`;

  try {
    const res = await fetch(googleTranslate + encodeURIComponent(question));
    const data = await res.json();
    let str = '';
    data.sentences.forEach((element) => {
      str += element.trans;
    });
    return str;
  } catch (e) {
    return `由于Google翻译不再支持中国大陆地区，请用户在您VPN的PAC选项中添加translate.googleapis.com
    或VPN开启全局模式，以便您能够继续使用Google翻译`;
  }
}
