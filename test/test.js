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
        it('on wikia should be found', function (done) {
            let thisLyrics = lyrics.getLyricsText({ url: 'http://lyrics.wikia.com/wiki/Ariana_Grande:Break_Up_With_Your_Girlfriend,_I%27m_Bored', selector: '.lyricbox' })
            thisLyrics.should.eventually.have.property('lyrics').notify(done);;
        });
        it('on lyricsmania should be found', function (done) {
            let thisLyrics = lyrics.getLyricsText({ url: 'https://www.lyricsmania.com/523_lyrics_earl_sweatshirt.html', selector: '.lyrics-body' })
            thisLyrics.then(l => {
                console.log(l);
                thisLyrics.should.eventually.have.property('lyrics').notify(done);;
            })
        });


    });

    describe('Get pages', function () {
        it('wrong url should return an error', function (done) {
            let thisLyrics = lyrics.getLyricsText({ url: 'http://lyrics.wikia.com/wiki/this_is_a_wrong_url_just_for_test/randomTextHere', selector: '.lyricbox' })
            thisLyrics.should.eventually.be.rejected.notify(done);;
        });
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
        it('should give an error when the lyrics are not ok', function (done) {
            let thisLyrics = lyrics.getLyricsText({ url: 'http://lyrics.wikia.com/wiki/Hindi_Zahra:At_The_Same_Time', selector: '.lyricbox', rejectionTexts: ["Unfortunately, we are not licensed to display the full lyrics "] });
            thisLyrics.should.eventually.be.rejected.notify(done);
        });
    });
});