const express = require("express");
const app = express();
const path = require("path");

const axios = require('axios').default;

app.use(express.static("dist"));

const app_key = require('./config/keys').app_key;

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// route to get recipes based on ingredient(s)
app.get("/recipes/:searchQuery", (request, response) => {
  // make api call using axios
  const searchQuery = request.params.searchQuery;
  axios({
    method: 'GET',
    url: `https://api.spoonacular.com/recipes/complexSearch?apiKey=${app_key}&number=1000&addRecipeInformation=true&includeIngredients=${searchQuery}`
  })
    .then((res) => {
      response.send(res.data); // sends to frontend
    })
  .catch(err => console.log(err))
});

const PORT = process.env.PORT || 8000; // process.env accesses heroku's environment variables

app.listen(PORT, () => {
  console.log(__dirname);
  console.log(`listening on ${PORT}`);
});