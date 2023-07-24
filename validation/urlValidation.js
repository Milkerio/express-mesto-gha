function validateUrl(url) {
  const regex = /^https?:\/\/(www\.)?[a-zA-Z\d]+\.[\w\-._~:/?#[\]@!$&'()*+,;=]{1,}#?$/g;
  if (regex.test(url)) {
    return url;
  }
  throw new Error('Некорректная ссылка.');
}
module.exports = validateUrl;
