# get-lyrics - Get lyrics in your apps

**get-lyrics** allows you to get lyrics from a song in your app.

## How to install

```
npm install get-lyrics --save
```

## How to use
Simple code :
`search('Artist name', 'Song name')`

Full code :
```javascript
include * as lyrics from 'get-lyrics'

lyrics.search('Hindi Zahra', 'Fascination)
/**
 * This will return a Promise which will resolve in :
 * "One of these days you know [...]"
 * /
```

## Why
I tried a couple of packages before creating this one. Most were outdated. Some needed API keys or iTunes user names. Some other were doing 10 other things that I did not need. So here it is, it just gets some lyrics, with some fallback capabilities. 
