# simple-get-lyrics - Get lyrics in your apps

**simple-get-lyrics** allows you to get lyrics from a song in your app.

## How to install

```
npm install simple-get-lyrics --save
```

## How to use
Simple code :
`search('Artist name', 'Song name')`

Full code :
```javascript
include * as lyrics from 'simple-get-lyrics'

lyrics.search('Hindi Zahra', 'Fascination')
/**
 * This will return a Promise which will resolve in :
 * "One of these days you know [...]"
 * /
```

the response object will be with the following format :
```
{
    lyrics, // Contains the lyrics in a text format
    provider, // Contains an identifier of the source
    url // Contains a link to the lyrics
}
```

## Why
I tried a couple of packages before creating this one. Most were outdated. Some needed API keys or iTunes user names. Some other were doing 10 other things that I did not need. So here it is, it just gets some lyrics, with some fallback capabilities. 
