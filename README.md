# create-react-app React Project with Node Express Backend

> Example on using create-react-app with a Node Express Backend

## Usage

Install [nodemon](https://github.com/remy/nodemon) globally

```
npm i nodemon -g
```

Install server and client dependencies

```
yarn
cd client
yarn
```

To start the server and client at the same time (from the root of the project)

```
yarn dev
```

Running the production build on localhost. This will create a production build, then Node will serve the app on http://localhost:5000

```
NODE_ENV=production yarn dev:server
```

## API Endpoints

- adds a record to firebase
```
/addrecord
```
- gets record by wallet address
```
https://opteq-nft.herokuapp.com/get/walletaddress/1234
```
- search for data by providing a term
```
https://opteq-nft.herokuapp.com/search/term/basketball
```
- search for data by providing a description
```
https://opteq-nft.herokuapp.com/search/description/is a
```
- search for data by providing a nfthash
```
https://opteq-nft.herokuapp.com/search/nfthash/bafyreibxywz2kqpauasozwfcubhvk3oh6nt2jogjazbeyp7z6a2e5ehbki
```
- search for data by providing a uniqueid
```
https://opteq-nft.herokuapp.com/search/uniqueid/9ab9e25b-1647-43f5-87ad-fb4fd6877d44
```


## How this works

The key to use an Express backend with a project created with `create-react-app` is on using a **proxy**. We have a _proxy_ entry in `client/package.json`

```
"proxy": "http://localhost:5000/"
```

This tells Webpack development server to proxy our API requests to our API server, given that our Express server is running on **localhost:5000**
