const path = require(`path`);

function resolveMockFile({ endpoint, name }) {
  const mockDirectory = path.resolve(__dirname, `..`, `mocks`);
  const mockPath = path.join(mockDirectory, endpoint, `${name.replace(/ /g, `-`)}.json`);

  // eslint-disable-next-line global-require, import/no-dynamic-require
  return require(mockPath);
}

module.exports = {
  resolveMockFile,
};
