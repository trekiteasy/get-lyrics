let lyrics = require("../index.js");
var chai = require('chai')
var should = chai.should()
var expect = chai.expect
var chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)

describe('Sources', function () {
    describe('Sources is an Array', function () {
        it('should be an array', function () {
            lyrics.getSources('artist', 'track').should.be.an('array');
        });
    });
});
describe('Fetch url', function () {
    describe('Url fetch  resultshould be a cheerio object', function () {
        it('should be a cheerio object', function (done) {
            let cheerioFn = lyrics.getHtml('https://www.google.com')
            cheerioFn.should.eventually.have.property('fn').notify(done);
        });
    });
});

describe('Get lyrics', function () {
    describe('Looking for lyrics', function () {
        it('on lyricsmania should be found', function (done) {
            let thisLyrics = lyrics.getLyricsText({ url: 'https://www.lyricsmania.com/forever_after_all_lyrics_luke_combs.html', selector: '.lyrics-body' })
            thisLyrics.then(l => {
                console.log(l);
                thisLyrics.should.eventually.have.property('lyrics').notify(done);;
            })
        });
    });

    describe('Looking for lyrics', function () {
        it('on musixmatch should be found', function (done) {
            let thisLyrics = lyrics.getLyricsText({ url: 'https://www.musixmatch.com/lyrics/Olivia-Rodrigo/drivers-license', selector: '.lyrics__content__ok' })
            thisLyrics.then(l => {
                console.log(l);
                thisLyrics.should.eventually.have.property('lyrics').notify(done);;
            })
        });
    });

    describe('Get pages', function () {
        it('inexisting url should return an error', function (done) {
            let thisLyrics = lyrics.getLyricsText({ url: 'http://non-existing-url.com/non-existing-folder/sdffzez', selector: '.lyricbox' })
            thisLyrics.should.eventually.be.rejected.notify(done);;
        });
    });
    describe('Search', function () {
        it('should get a result', function (done) {
            let thisLyrics = lyrics.search('Hindi Zahra', 'Fascination')
            thisLyrics.should.eventually.have.property('lyrics').notify(done);;
        });
        it('should give an error when inexisting artist', function (done) {
            let thisLyrics = lyrics.search('Inexisting Artist for test purpose', 'Inexisting track for test purpose')
            thisLyrics.should.eventually.be.rejected.notify(done);;
        });
    });
});