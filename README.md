# Lexsury
Modern audience interaction

## Currently in active development

 [Demo](http://beta.lexsury.com)

## Building

Lexsur is served using Node.js. On MacOS::

`$ brew install node`
 
Dependencies can then be installed using NPM or Yarn:

`$ npm install`

`$ yarn install`

Initiate MySQL database. By default: mysql://lex@localhost/lexsur. This can be changed, along with all other settings in the `config` files.

`$ mysql.server start`

The Lexsury server can then be initialized:

- Dev server with reloading

`$ npm devServer`

- Production mode server

`$ npm start`

You should now be able to visit see Lexsury running at [http://localhost:3030](localhost:3030)
## If you'd like to contribute, checkout our [Trello Board](https://trello.com/b/mffBye8Z) and come [hangout with us](https://discord.gg/vJjgKT7)

## Tool Docs
- [Feathers](https://docs.feathersjs.com)
- [SocketIO](https://socket.io/docs/)
- [Sequelize](docs.sequelizejs.com)


## Client
- A bundled/minified version of our [React Client](https://github.com/mutiny/lexsur-react-client) is included within `public`
