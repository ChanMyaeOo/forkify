import Search from './models/Search';
import Recipe from './models/Recipe';
import * as searchView from './views/searchView';
import { elements, renderLoader, clearLoader } from './views/base';

/* Global state of the app */
/**
 * - Search object
 * - Current recipe
 * - Shopping list object
 * - Liked recipes
 */
const state = {};

/**
 * SEARCH CONTROLLER
 */
const controlSearch = async () => {
  // 1) Get query for search
  const query = searchView.getInput();

  if (query) {
    // 2) New search object and add to the state
    state.search = new Search(query);

    // 3) Prepare to show in UI
    searchView.clearInputField();
    searchView.clearResultList();
    renderLoader(elements.searchRes);
    try {
      // 4) Search for recipe
      await state.search.getRecipe();

      // 5) Render result on UI
      clearLoader();
      searchView.showResults(state.search.result);
    } catch (error) {
      clearLoader();
      alert(error);
    }
  }
};

elements.searchForm.addEventListener('submit', e => {
  e.preventDefault();
  controlSearch();
});

elements.resultPage.addEventListener('click', e => {
  const btn = e.target.closest('.btn-inline');
  if (btn) {
    const goToPage = parseInt(btn.dataset.goto, 10);
    searchView.clearResultList();
    searchView.showResults(state.search.result, goToPage);
    console.log(goToPage);
  }
});

/**
 * RECIPE CONTROLLER
 */

const controlRecipe = async () => {
  const id = window.location.hash.replace('#', '');

  if (id) {
    // Prepare to show in UI

    // Create new recipe object
    state.recipe = new Recipe(id);
    try {
      // Get recipe data
      await state.recipe.getRecipe();
      state.recipe.parseIngredients();
      // calcTime and calcServing
      state.recipe.calcTime();
      state.recipe.calcServings();

      // Render result
      console.log(state.recipe);
    } catch (error) {
      alert(error);
    }
  }
};

// window.addEventListener('hashchange', controlRecipe);
// window.addEventListener('load', controlRecipe);

['hashchange', 'load'].forEach(event =>
  window.addEventListener(event, controlRecipe)
);
