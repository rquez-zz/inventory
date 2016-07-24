## Synopsis

COP4331 Project

## Installation

* Install [Docker](https://www.docker.com/).
* Make sure you have docker-compose installed with `docker-compose version`, if not install it using the directions [here](https://docs.docker.com/compose/install/)
* You'll need an key to sign the JWTs. Place the key in the `backend` directory and name it `privateKey`
* For google authentication to work you'll have to include your own google API credentials json. Place it in the `backend` directory and name it `googleApiKey.json`.
* Run `docker-compose up`
* Visit your docker IP in your browser.
