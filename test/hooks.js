const { After } = require(`cucumber`);
const { client } = require(`nightwatch-cucumber`);

After(() => {
  client.deleteCookies();
  client.execute(`sessionStorage.clear()`);
});
