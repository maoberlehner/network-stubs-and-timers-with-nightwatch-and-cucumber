const { client } = require(`nightwatch-cucumber`);
const { Given, Then, When } = require(`cucumber`);

const { nestedSelector } = require(`../helpers/nested-selector`);
const { pageLoaded } = require(`../helpers/page-loaded`);
const { pages } = require(`../helpers/mappings`);
const { resolveMockFile } = require(`../helpers/resolve-mock-file`);

const {
  IDENTIFIERS,
  DEFAULT_WAIT,
} = require(`../conf.js`);

let cookies = [];
let networkStubs = [];

Given(/^time traveling is enabled$/, () => {
  const cookie = {
    name: IDENTIFIERS.timers,
    value: `1`,
  };

  return cookies.push(cookie);
});

Given(/^"(.*)" seconds have passed$/, (seconds) => {
  client.execute(`clock.tick(${seconds} * 1000)`);
});

Given(/^network stubs are enabled$/, () => {
  const cookie = {
    name: IDENTIFIERS.network,
    value: `1`,
  };

  return cookies.push(cookie);
});

// Changing the request type from `GET`
// to `POST` is possible by adding the
// phrase `when sending data` when using
// this step definition.
Given(/^the endpoint "(.*?)" returns.*? `(.*?)`( when sending data)?$/, (endpoint, name, post) => {
  const type = post === undefined ? `GET` : `POST`;

  return client.url(({ value }) => {
    const networkStub = {
      // The `resolveMockFile()` function
      // tries to find a `.json` file in the
      // `test/mocks` directory, which matches
      // the given name.
      body: resolveMockFile({ endpoint, name }),
      endpoint,
      type,
    };

    // Execute the `addNetworkStub()` function
    // immediately if a page was already loaded.
    if (pageLoaded(value)) return client.execute(`addNetworkStub(${JSON.stringify(networkStub)})`);

    return networkStubs.push(networkStub);
  });
});

When(/^I (?:browse|open|visit).*? `(.*?)`$/, (pageName) => {
  const refresh = cookies.length || networkStubs.length;

  // Initially load the page so we
  // are able to set cookies and use
  // the session storage.
  client.url(pages[pageName]);

  if (networkStubs.length) {
    client.execute(`sessionStorage.setItem('${IDENTIFIERS.networkStubs}', '${JSON.stringify(networkStubs)}')`);
    networkStubs = [];
  }

  // Set the cookies we've prepared
  // and clear the queue.
  cookies = cookies.filter(x => !client.setCookie(x));

  // We have to refresh the page so
  // cookies are sent correctly.
  if (refresh) client.refresh();
});

When(/^I click.*? (`.*`)$/, selectorChain => client.click(nestedSelector(selectorChain)));

Then(/^I expect.*? (`.*`).*? to be visible$/, selectorChain =>
  client.expect.element(nestedSelector(selectorChain)).to.be.visible.before(DEFAULT_WAIT));

Then(/^I expect.*? (`.*`).*? to not be present$/, selectorChain =>
  client.expect.element(nestedSelector(selectorChain)).to.not.be.present);

Then(/^I expect.*? (`.*`).*? to contain the text "(.*?)"$/, (selectorChain, text) =>
  client.expect.element(nestedSelector(selectorChain)).text.to.equal(text).before(DEFAULT_WAIT));
