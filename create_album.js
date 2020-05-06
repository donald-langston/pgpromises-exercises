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

prompt('Album name? ')
.then(function albumname(val) {
    res.push(val);
    return prompt('Album year? ');
})
.then(function albumyear(val) {
    res.push(val);
    return prompt('Artist id? ');
})
.then(function artistid(val) {
    res.push(val);
    console.log(res);
    insertAlbum();
    prompt.done();
})
.catch(function rejected(err) {
    console.log('error:', err.stack);
    prompt.finish();
});

function insertAlbum() {
    var albumObj = {name: res[0], year: res[1], id: res[2]};
    var query = "INSERT INTO album (album_name, release_year, artist_id) VALUES (${name}, ${year}, ${id})RETURNING id";
    db.result(query, albumObj)
    .then(function(result) {
    console.log(result);
    var id = result.rows[0].id;
    console.log(`Created album with ID ${id}.`);
    pgp.end();
    });
}


