function pageLoaded(url) {
  return url.includes(`http`);
}

module.exports = {
  pageLoaded,
};
