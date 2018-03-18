const DEFAULT_WAIT = 5000;
const PORT = 8080;
const DOMAIN = `http://localhost:${PORT}`;
const IDENTIFIERS = {
  network: `TEST_NETWORK`,
  networkStubs: `TEST_NETWORK_STUBS`,
  timers: `TEST_TIMERS`,
};

module.exports = {
  DEFAULT_WAIT,
  DOMAIN,
  IDENTIFIERS,
  PORT,
};
