import "./styles/index.scss";
// import Square from "./scripts/square";

const regeneratorRuntime = require("regenerator-runtime");

const searchInput = document.getElementById('search-input');
const mainSearchInput = document.querySelector('#main-search-input');
const searchContainer = document.querySelector('#search-container');
const searchResultsContainer = document.querySelector('#search-result-container');
const searchResults = document.querySelector('#search-results');
const scroopleSearchBtn = document.querySelector('#scroople-search-btn');
const feelingLuckyBtn = document.getElementById('feeling-lucky-btn');
const feelingLuckyList = document.getElementById('feeling-lucky-list');
const tools = document.getElementById('tools');
const loaderContainer = document.getElementById('loader-container');
const searchX = document.getElementById('search-x');
const filter = document.getElementById('filter');
let excludeInput = document.getElementById('exclude-input');
const mealType = document.querySelector('#meal-type');
const diets = document.querySelector('#diets');

const app_key = require('../config/keys').app_key;

// window.addEventListener('load', () => {
//   loaderContainer.style.display = 'none';
// })

let searchQuery = '';

mainSearchInput.addEventListener('keypress', (e) => {
  // e.preventDefault();
  if (e.key === 'Enter') {
    searchQuery = mainSearchInput.value;
    fetchSearchResults(searchQuery);
    // fetchSearchResults();
  }
})

// FIRST GET REQUEST
function fetchSearchResults(searchQuery) {
  axios({
    method: 'GET',
    url: `https://api.spoonacular.com/recipes/complexSearch?apiKey=${app_key}&number=1000&addRecipeInformation=true&includeIngredients=${searchQuery}`
  })
  .then(res => {
    searchContainer.style.display = "none";
    generateResults(res.data.results)

    searchInput.value = searchQuery;

    document.getElementById('logo').classList.remove('visibility');
    document.getElementById('input-filter-container').classList.remove('visibility');
    document.getElementById('tools').classList.remove('visibility');

  })
  .catch(err => console.log(err))
}