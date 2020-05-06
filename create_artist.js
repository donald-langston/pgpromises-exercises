const config = {
    host: 'localhost',
    port: 5432,
    database: 'music',
    user: 'postgres',
    password: 'postgres'
}

const pgp = require('pg-promise')();
const db = pgp(config);

var prompt = require('prompt-promise');
var res = [];

prompt('Artist name? ')
.then(function artistname(val) {
    res.push(val);
    console.log(val);
    insertArtist();
    prompt.done();
})
.catch(function rejected(err) {
    console.log('error:', err.stack);
    prompt.finish();
});

function insertArtist() {
    var artistObj = {
        name: res[0]
    }
    var query = "INSERT INTO artist (artist_name) VALUES (${name})RETURNING id";
    db.result(query, artistObj)
    .then(function(result) {
    console.log(result);
    var id = result.rows[0].id;
    console.log(`Created artist with ID ${id}.`);
    pgp.end();
    });
}