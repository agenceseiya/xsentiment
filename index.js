const express = require('express');
const bodyParser = require('body-parser');
const Twitter = require('twitter');
const Sentiment = require('sentiment');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const sentiment = new Sentiment();

const client = new Twitter({
  consumer_key: 'aQ5255r8gPLs7h2XlJF1yCCMs',
  consumer_secret: 'Cf04FR3APn8EsiqnHHIqmPH3JeZdSklZrGeDH0OKRp39ZFFvQ4',
  access_token_key: '863426033923629058-7B0ZBbeSGmP5VcngVJPpKsVMxYaPnAC',
  access_token_secret: '26eyBW5fdc0BN5AIRiTuIVXxWCGTdxJHflL7gRnNPlhet'
});

app.post('/analyze', (req, res) => {
  const handle = req.body.handle;
  client.get('statuses/user_timeline', { screen_name: handle, count: 100 }, (error, tweets, response) => {
    if (!error) {
      const tweetTexts = tweets.map(tweet => tweet.text);
      const results = tweetTexts.map(text => sentiment.analyze(text));
      const score = results.reduce((acc, cur) => acc + cur.score, 0);
      res.json({ handle, score });
    } else {
      res.status(500).json({ error });
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
