'use strict';
const cheerio = require('cheerio');
const _ = require('lodash');
const Promise = require('bluebird');
const fetch = require('node-fetch')


const cleanText = (cheerioHtml) => {
    cheerioHtml.find('br').replaceWith('\n');
    cheerioHtml = groupReplaceWith(cheerioHtml, ['#video-musictory', 'img', 'h2', 'script', 'strong'], '')
    cheerioHtml = _.trim(cheerioHtml.text());
    cheerioHtml = cheerioHtml.replace(/\r\n\n/g, '\n');
    cheerioHtml = cheerioHtml.replace(/\t/g, '');
    cheerioHtml = cheerioHtml.replace(/\n\r\n/g, '\n');
    cheerioHtml = cheerioHtml.replace(/ +/g, ' ');
    cheerioHtml = cheerioHtml.replace(/\n /g, '\n');
    return cheerioHtml;
};

function groupReplaceWith (source, arr, replacement) {
    for (let i in arr) {
        source.find(arr[i]).replaceWith(replacement)
    }
    return source
}

function checkStatus (response) {
    if (response.status !== 200 || !response.ok) {
        let error = new Error(response.statusText);
        error.response = response;
        return Promise.reject(error);
    }
    return Promise.resolve(response);
}

function getHtml (url) {
    return fetch(url)
        .then(response => checkStatus(response))
        .then(response => response.text())
        .then(html => cheerio.load(html))
}

function selectLyrics (html, selector) {
    if (html(selector).length === 0) {
        let error = new Error('No text was found');
        error.response = html;
        return Promise.reject(error);
    }
    return cleanText(html(selector));
}

function filterErrorText (text, source) {
    if (source.rejectionTexts) {
        for (var i in source.rejectionTexts) {
            if (text.search(source.rejectionTexts[i]) > -1) {
                let error = new Error('These lyrics are not valid');
                error.response = text;
                return Promise.reject(error)
            }
        }
    }
    return Promise.resolve(text)
}

function lyricsObject (source, text) {
    return {
        lyrics: text,
        provider: source.identifier,
        url: source.url
    }
}

function getLyricsText (source) {
    let url = source.url;
    let selector = source.selector;
    return getHtml(url)
        .then((html) => selectLyrics(html, selector))
        .then(text => filterErrorText(text, source))
        .then(text => lyricsObject(source, text))
        .catch(function (err) {
            let error = new Error('Unable to get the lyrics with ' + source.identifier);
            error.response = err;
            return Promise.reject(error);
        });
}

function getSources (artistName, trackName) {
    const lyricsUrl = (title) => _.kebabCase(_.trim(_.toLower(_.deburr(title))))
    const sourceParolesNet = {
        identifier: 'paroles.net',
        url: 'http://www.paroles.net/' + lyricsUrl(artistName) + '/paroles-' + lyricsUrl(trackName),
        selector: '.song-text'
    }

    const sourceWikia = {
        identifier: 'wikia.com',
        url: 'http://lyrics.wikia.com/wiki/' + encodeURIComponent(artistName) + ':' + encodeURIComponent(trackName),
        selector: '.lyricbox',
        rejectionTexts: ["Unfortunately, we are not licensed to display the full lyrics "]
    }

    const lyricsManiaUrl = (title) => {
        return _.snakeCase(_.trim(_.toLower(_.deburr(title))));
    };

    const sourceLyricsMania = {
        identifier: 'lyricsmania.com',
        url: 'http://www.lyricsmania.com/' + lyricsManiaUrl(trackName) + '_lyrics_' + lyricsManiaUrl(artistName) + '.html',
        selector: '.lyrics-body'
    }

    return [sourceParolesNet, sourceWikia, sourceLyricsMania]
}

function search (artistName, trackName) {
    const sources = getSources(artistName, trackName)
    return Promise.any(sources.map(source => getLyricsText(source)))
        .catch(Promise.AggregateError, function (err) {
            return Promise.reject(err)
        });
}

module.exports = {
    search,
    getSources,
    getHtml,
    getLyricsText
}
