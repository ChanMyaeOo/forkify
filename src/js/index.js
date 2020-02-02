import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likeView from './views/likeView';
import { elements, renderLoader, clearLoader } from './views/base';

/* Global state of the app */
/**
 * - Search object
 * - Current recipe
 * - Shopping list object
 * - Liked recipes
 */
const state = {};
window.state = state;

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
    recipeView.clearRecipe();
    renderLoader(elements.recipe);

    // Highlight selected
    if (state.search) searchView.highlightSelected(id);

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
      clearLoader();
      recipeView.renderRecipe(state.recipe, state.likes.isLiked(id));
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

/**
 * LIST CONTROLLER
 */
const controlList = () => {
  // Create a list if there is no yet
  if (!state.list) state.list = new List();

  // Add each ingredients to the list and UI
  state.recipe.ingredients.forEach(el => {
    const item = state.list.addItem(el.count, el.unit, el.ingredient);
    listView.renderItem(item);
  });
};

// Handle delete and update item list
elements.item.addEventListener('click', e => {
  const id = e.target.closest('.shopping__item').dataset.itemid;

  // Handle delete button
  if (e.target.matches('.shopping__delete, .shopping__delete *')) {
    // Delete from state
    state.list.deleteItem(id);

    // Delete from UI
    listView.deleteItem(id);
  } else if (e.target.matches('.shopping__item-value')) {
    const val = parseFloat(e.target.value, 10);
    state.list.updateCount(id, val);
  }
});

/**
 * LIKE CONTROLLER
 */
//TESTING
state.likes = new Likes();
likeView.toggleLikeMenu(state.likes.getNumLikes());

const controlLike = () => {
  if (!state.likes) state.likes = new Likes();
  const currentId = state.recipe.id;

  // user has NOT yet like current recipe
  if (!state.likes.isLiked(currentId)) {
    // Add like to the state
    const newLikes = state.likes.addLike(
      currentId,
      state.recipe.title,
      state.recipe.img,
      state.recipe.author
    );
    // Toggle the like button
    likeView.toggleLikeBtn(true);

    // Add to the UI list
    likeView.renderLike(newLikes);
  }
  // user HAS liked current recipe
  else {
    // Remove like from the state
    state.likes.deleteLike(currentId);
    // Toggle the like button
    likeView.toggleLikeBtn(false);
    // Remove from the UI list
    likeView.deleteLike(currentId);
  }

  likeView.toggleLikeMenu(state.likes.getNumLikes());
};

// Handling recipt button clicks + or - button
elements.recipe.addEventListener('click', e => {
  if (e.target.matches('.btn-decrease, .btn-decrease *')) {
    // Decrease button is clicked
    if (state.recipe.servings > 1) state.recipe.updateServings('dec');

    recipeView.updateServingsIngredients(state.recipe);
  } else if (e.target.matches('.btn-increase, .btn-increase *')) {
    // Decrease button is clicked
    state.recipe.updateServings('inc');
    recipeView.updateServingsIngredients(state.recipe);
  } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
    // Add ingredients to the shopping list
    controlList();
  } else if (e.target.matches('.recipe__love, .recipe__love *')) {
    // Like controller
    controlLike();
  }
});
