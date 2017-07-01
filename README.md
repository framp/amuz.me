<img src="http://framp.me/amuz.me/img/amuz-bunny.png" width="100" />

[amuz.me](http://amuz.me)

No frills, instant player and playlist maker

## Description
The aim of the project is to have an opensource, sleek YouTube player and playlist maker which lives entirely in the browser.
This means you can download the page or clone the project and use the website even if the main website go down.

Personally I was tired with alternatives and needed something to listen music off YouTube without being bothered with account or ads.

## Status
The main features are there (even though it still needs some polishing).
The big missing one is saving the playlist using [OpenKeyval](http://openkeyval.org) or a similar service.

As of now OpenKeyval doesn't support CORS headers, which means amuz.me can't POST playlist data to their server. 
Given the size of a common playlist sending those data through GET is unfeasible (due to limit in GET requests length).
I've sent a pull request to the OpenKeyval project and I'm looking for alternatives.

## Contribute
Fork the repo and send me a pull request!

To work on the code I use `grunt` and `http-server`

      npm install -g http-server grunt
      npm install
      http-server &
      grunt watch


## License
MIT
