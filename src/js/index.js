import Search from './models/Search';

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
  const query = 'pizza';

  if (query) {
    // 2) New search object and add to the state
    state.search = new Search(query);

    // 3) Prepare to show in UI

    // 4) Search for recipe
    await state.search.getRecipe();

    // 5) Render result on UI
    console.log(state.search.result);
  }
};

document.querySelector('.search').addEventListener('submit', e => {
  e.preventDefault();
  controlSearch();
});
