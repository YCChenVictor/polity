import * as Client from "./frontendClient";

(Object.assign(window as any, { Client }));
console.log(`
Client loaded on window.Client

Try in DevTools:
  await Client.getGreeting()
`);
