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

prompt('Track name? ')
.then(function trackname(val) {
    res.push(val);
    return prompt('Track Duration? ');
})
.then(function trackduration(val) {
    res.push(val);
    return prompt('Release Year? ');
})
.then(function releaseyear(val) {
    res.push(val);
    return prompt('Album ID? ');
})
.then(function albumid(val) {
    res.push(val);
    console.log(res);
    insertTrack();
    prompt.done();
})
.catch(function rejected(err) {
    console.log('error:', err.stack);
    prompt.finish();
});

function insertTrack() {
    var songObj = {name: res[0], duration: res[1], year: parseInt(res[2])};
    var songQuery = "INSERT INTO song (song_name, duration, release_year) VALUES (${name}, ${duration}, ${year})RETURNING id";
    db.result(songQuery, songObj)
    .then(function(result) {
        console.log(result);
        var songID = result.rows[0].id;
        var albumID = res[3];
        var trackObj = {album: albumID, song: songID};
        var trackQuery = "INSERT INTO track (album_id, song_id) VALUES (${album}, ${song})RETURNING id";
        db.result(trackQuery, trackObj)
        .then(function(result) {
            console.log(result);
            var id = result.rows[0].id;
            console.log(`Created track with ID ${id}.`);
            pgp.end();
        });
    });
}