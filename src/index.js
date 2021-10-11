import "./styles/index.scss";
// import Square from "./scripts/square";

const app_key = require('../config/keys').app_key;
const axios = require('axios').default;
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

let searchQuery = '';

mainSearchInput.addEventListener('keypress', (e) => {
  // e.preventDefault();
  if (e.key === 'Enter') {
    searchQuery = mainSearchInput.value;
    fetchSearchResults(searchQuery);
    // fetchSearchResults();
  }
})

scroopleSearchBtn.addEventListener('click', (e) => {
  // e.preventDefault();
  searchQuery = mainSearchInput.value;
  fetchSearchResults(searchQuery);
  // fetchSearchResults();
})

feelingLuckyBtn.addEventListener('mouseover', (e) => {
  var pos = -((Math.floor((Math.random() * 11) + 1)) * 5 - 3) * 5;
  let arr = []

  if (pos === -116) {
    // pos = -35;
  }

  // animate the ul ??
  feelingLuckyList

  if (pos === -24 || pos === -47 || pos === -70 || pos === -116) {
    // make the width 130px
  } else if (pos === -93 || -139) {
    // make the width 145px
  } else if (pos === -164 || -185) {
    // make the width 155px
  } else {
    // make the width 190px
  }


})

// $('#search_btns button:nth-child(2)').hover(function () {

//   btnTimeID = setTimeout(function () {

//     // We are using the math object to randomly pick a number between 1 - 11, and then applying the formula (5n-3)5 to this number, which leaves us with a randomly selected number that is applied to the <ul> (i.e. -185) and corresponds to the position of a word (or <li> element, i.e. "I'm Feeling Curious").
//     var pos = -((Math.floor((Math.random() * 11) + 1)) * 5 - 3) * 5;

//     if (pos === -135) {
//       console.log("position didn't change, let's force change")
//       pos = -35;
//     }

//     $('#search_btns button:nth-child(2) ul').animate({ 'bottom': pos + 'px' }, 300);

//     // Change the width of the button to fit the currently selected word.
//     if (pos === -35 || pos === -110 || pos === -185 || pos === -10 || pos === -60 || pos === -160) {
//       console.log(pos + ' = -35, -110, -185, -10, -60, -160');
//       $('#search_btns button:nth-child(2)').css('width', '149px');
//     } else if (pos === -85) {
//       console.log(pos + ' = -85');
//       $('#search_btns button:nth-child(2)').css('width', '160px');
//     } else if (pos === -210) {
//       console.log(pos + ' = -210');
//       $('#search_btns button:nth-child(2)').css('width', '165px');
//     } else {
//       console.log(pos + ' = -260, -235');
//       $('#search_btns button:nth-child(2)').css('width', '144px');
//     }
//   }, 200);
// });

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

let state = false;
tools.addEventListener('click', (e) => {
  if (!state) {
    state = true;
    document.querySelector('.filter-container').classList.remove('visibility');
  } else {
    state = false;
    document.querySelector('.filter-container').classList.add('visibility');
  }
  searchInput.value = searchQuery;
});

// SECOND GET REQUEST //

filter.addEventListener('click', () => {
  // e.preventDefault();
  let excludeQuery = excludeInput.value;
  let type = mealType.value;
  let diet = diets.value;
  fetchFilteredSearchResults(searchQuery, excludeQuery, type, diet);
})

excludeInput.addEventListener('keypress', (e) => {
  // e.preventDefault();
  let excludeQuery = excludeInput.value;
  let type = mealType.value;
  let diet = diets.value;
  if (e.key === 'Enter') {
    fetchFilteredSearchResults(searchQuery, excludeQuery, type, diet);
  }
})

function fetchFilteredSearchResults(searchQuery, excludeQuery, type, diet) {
  axios({
    method: 'GET',
    url: `/recipes/${searchQuery}/filter`,
    params: {
      searchQuery: searchQuery,
      excludeQuery: excludeQuery,
      type: type,
      diet: diet
    }
  })
    .then(res => {
      generateResults(res.data.results)
    })
    .catch(err => console.log(err))
}

searchX.addEventListener('click', function () {
  searchInput.value = "";
})

function generateResults(results) {

  let generatedResults = `<p>${results.length} results (0.13 seconds)</p>`;

  results.forEach(result => {
    const resultItem =
      `<div class="result">
            <p class="url">${result.sourceUrl}</p>
            <a href=${result.sourceUrl} target="_blank"><h3 class="title">${result.title}</h3></a>
            <p class="summary">${result.summary}</p>
            <div class="result-links">
                <p>${result.readyInMinutes} minutes</p>
                <p>${result.servings} servings</p>
            </div>
        </div>`
    generatedResults += resultItem;
  });

  searchResults.innerHTML = generatedResults;
}