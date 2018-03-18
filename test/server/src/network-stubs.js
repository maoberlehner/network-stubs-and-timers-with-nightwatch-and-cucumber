import nise from 'nise';

import { IDENTIFIERS } from '../../conf';

const server = nise.fakeServer.create({ respondImmediately: true });

function addNetworkStub({
  body,
  endpoint,
  status = 200,
  type = `GET`,
}) {
  server.respondWith(type, new RegExp(`${endpoint}$`), [
    status,
    { 'Content-Type': `application/json` },
    JSON.stringify(body),
  ]);
}

// We use the `sessionStorage` in order to make it
// possible to queue stubs in Nightwatch.js
const queuedStubs = sessionStorage.getItem(IDENTIFIERS.networkStubs);

if (queuedStubs) {
  JSON.parse(queuedStubs).forEach(x => addNetworkStub(x));
}

window.addNetworkStub = addNetworkStub;
