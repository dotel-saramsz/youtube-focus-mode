# Contributing

This document details some of the current limitations of the project and possible areas of improvement. **Please open an issue if you have any feedback or feature requests**

## Current Limitations

- YouTube Data API only allows 10,000 API requests per day in its free tier. The total number of API requests for a single user itself will be very high considering the usage in home feed, recommendation sections, search results, etc. (When a page of results are blocked/hidden, YouTube fetches the next page thanks to its lazy loading). 
I have tried to reduce the amount of API requests by queueing the requests and sending the request in bulk when 25 requests are queued or 1 second is passed (whichever comes earlier). Youtube's API provides an [endpoint](https://developers.google.com/youtube/v3/docs/videos/list?apix_params=%7B%22part%22%3A%5B%22snippet%2CcontentDetails%2Cstatistics%22%5D%2C%22id%22%3A%5B%22Ks-_Mh1QhMc%2Cc0KYU2j0TM4%2CeIho2S0ZahI%2CeIho2S0ZahI%2CeIho2S0ZahI%2CeIho2S0ZahI%2CeIho2S0ZahI%2CeIho2S0ZahI%2CeIho2S0ZahI%2CeIho2S0ZahI%2CeIho2S0ZahI%2CeIho2S0ZahI%2CeIho2S0ZahI%2CeIho2S0ZahI%2CeIho2S0ZahI%22%5D%7D&apix=true) that can take in multiple video ids as parameters.

## Possible Improvements

- Improve the request queuing mechanism or find other ways to be frugal with API requests.
- Optimize the app's performance. The extension is bulky and can feel laggy at times (although this could be a result of my slow internet connection).

## New Features

- **Timer functionality**: Inspired by the Focus Mode from Digital Wellbeing in Android, allow the users to choose the period of time in the day when they want to activate the **Focus Mode**.

- **Data Visualization**: Track the user's YouTube usage pattern and visualize the amount of time spent on different categories, channels, etc.

- **Client-side ML**: The categories are currently taken from YouTube Data API. Use NLP to infer category or type of the video from its title and descriptions to avoid API request?
