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

Given(/^network stubs are enabled$/, () => client.url(({ value }) => {
  const cookie = {
    name: IDENTIFIERS.network,
    value: `1`,
  };

  if (pageLoaded(value)) return client.setCookie(cookie);

  return cookies.push(cookie);
}));

Given(/^the endpoint "(.*?)" returns.*? `(.*?)`( when sending data)?$/, (endpoint, name, post) => {
  const type = post === undefined ? `GET` : `POST`;

  return client.url(({ value }) => {
    const networkStub = {
      body: resolveMockFile({ endpoint, name }),
      endpoint,
      type,
    };

    if (pageLoaded(value)) return client.execute(`addNetworkStub(${JSON.stringify(networkStub)})`);

    return networkStubs.push(networkStub);
  });
});

Given(/^time traveling is enabled$/, () => client.url(({ value }) => {
  const cookie = {
    name: IDENTIFIERS.timers,
    value: `1`,
  };

  if (pageLoaded(value)) return client.setCookie(cookie);

  return cookies.push(cookie);
}));

Given(/^"(.*)" seconds have passed$/, (seconds) => {
  client.execute(`clock.tick(${seconds} * 1000)`);
});

When(/^I (?:browse|open|visit).*? `(.*?)`$/, (pageName) => {
  const refresh = cookies.length || networkStubs.length;

  client.url(pages[pageName]);

  if (networkStubs.length) {
    client.execute(`sessionStorage.setItem('${IDENTIFIERS.networkStubs}', '${JSON.stringify(networkStubs)}')`);
    networkStubs = [];
  }

  cookies = cookies.filter(x => !client.setCookie(x));

  if (refresh) client.refresh();
});

When(/^I click.*? (`.*`)$/, (selectorChain) => {
  client.click(nestedSelector(selectorChain));
});

Then(/^I expect.*? (`.*`).*? to be visible$/, (selectorChain) => {
  client.expect.element(nestedSelector(selectorChain)).to.be.visible.before(DEFAULT_WAIT);
});

Then(/^I expect.*? (`.*`).*? to not be present$/, (selectorChain) => {
  // eslint-disable-next-line no-unused-expressions
  client.expect.element(nestedSelector(selectorChain)).to.not.be.present;
});

Then(/^I expect.*? (`.*`).*? to contain the text "(.*?)"$/, (selectorChain, text) => {
  client.expect.element(nestedSelector(selectorChain)).text.to.equal(text).before(DEFAULT_WAIT);
});
