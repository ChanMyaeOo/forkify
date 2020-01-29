import Search from './models/Search';
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
    // 4) Search for recipe
    await state.search.getRecipe();

    // 5) Render result on UI
    clearLoader();
    searchView.showResults(state.search.result);
  }
};

elements.searchForm.addEventListener('submit', e => {
  e.preventDefault();
  controlSearch();
});
