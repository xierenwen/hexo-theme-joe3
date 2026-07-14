const CJK_PATTERN = /[\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff]/g;
const LATIN_WORD_PATTERN = /[A-Za-z0-9]+(?:['-][A-Za-z0-9]+)*/g;

const stripHtml = (content) => String(content || '')
  .replace(/<(pre|code)\b[^>]*>[\s\S]*?<\/\1>/gi, ' ')
  .replace(/<[^>]+>/g, ' ')
  .replace(/&[a-zA-Z0-9#]+;/g, ' ');

const countWords = (content) => {
  const text = stripHtml(content);
  const cjkCount = (text.match(CJK_PATTERN) || []).length;
  const latinCount = (text.match(LATIN_WORD_PATTERN) || []).length;

  return cjkCount + latinCount;
};

const readingTime = (words, wpm = 300) => Math.max(1, Math.ceil(words / wpm));

module.exports = {
  stripHtml,
  countWords,
  readingTime
};
