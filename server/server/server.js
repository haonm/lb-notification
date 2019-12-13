// Copyright IBM Corp. 2016. All Rights Reserved.
// Node module: loopback-workspace
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

'use strict';

var ds = require('./datasources');
var connectionString = `${ds.db.host}://${ds.db.user}:${ds.db.password}@${ds.db.host}/${ds.db.database}`;

var loopback = require('loopback');
var boot = require('loopback-boot');
var pg = require('pg');
var pgNotify = require('@becual/pg-notify');

var app = module.exports = loopback();


app.start = function() {
  // start the web server
  (async () => {
      const client = new pg.Client({ connectionString });
      const tableList = ['user', 'message'];

      try {
          // Try to generate configuration
          await client.connect();
          await pgNotify(client, {schema: 'public'}).config(tableList);
      }
      catch(error) {
          // Show errors
          console.log(error.message);
      }
      finally {
          // Close connection
          await client.end();
      }
  })();

  return app.listen(function() {
    app.emit('started');
    var baseUrl = app.get('url').replace(/\/$/, '');
    console.log('Web server listening at: %s', baseUrl);
    if (app.get('loopback-component-explorer')) {
      var explorerPath = app.get('loopback-component-explorer').mountPath;
      console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
    }
  });
};

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function(err) {
  if (err) throw err;

  // start the server if `$ node server.js`
  if (require.main === module) {
    app.io = require('socket.io')(app.start());

    app.io.on('connection', function(socket){
      console.log('a user connected');
      socket.on('disconnect', function(){
          console.log('user disconnected');
      });

      const pgClient = new pg.Client(connectionString);

      pgClient.connect();
      pgClient.query('LISTEN notify_table_channel');
      pgClient.on('notification', async (data) => {
        const payload = JSON.parse(data.payload);
        if (payload && payload.type === 'UPDATE' && payload.table === 'message') {
          socket.emit('updated_message', payload.data);
        }
      });
    });
  }
});
