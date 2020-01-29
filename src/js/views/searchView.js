import { elements } from './base';

export const getInput = () => elements.searchInput.value;

const innerRecipe = recipe => {
  const markUp = `
    <li>
        <a class="results__link" href="#${recipe.recipe_id}">
            <figure class="results__fig">
                <img src="${recipe.image_url}" alt="${recipe.title}">
            </figure>
            <div class="results__data">
                <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                <p class="results__author">${recipe.publisher}</p>
            </div>
        </a>
    </li>
    `;
  elements.resultList.insertAdjacentHTML('beforeend', markUp);
};

export const clearResultList = () => {
  elements.resultList.innerHTML = '';
  elements.resultPage.innerHTML = '';
};

export const clearInputField = () => {
  elements.searchInput.value = '';
};

// type = 'prev' or 'next'
const createButton = (page, type) => `
  <button class="btn-inline results__btn--${type}" data-goto=${
  type === 'prev' ? page - 1 : page + 1
}>
    <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
    <svg class="search__icon">
        <use href="img/icons.svg#icon-triangle-${
          type === 'prev' ? 'left' : 'right'
        }"></use>
    </svg>
    
  </button>
`;

const renderButtons = (page, numResults, resPerPages) => {
  const pages = Math.ceil(numResults / resPerPages);
  let button;
  if (page === 1 && pages > 1) {
    // only next button
    button = createButton(page, 'next');
  } else if (page < pages) {
    // both buttons
    button = `
      ${createButton(page, 'prev')}
      ${createButton(page, 'next')}
    `;
  } else if (page === pages && pages > 1) {
    // only prev button
    button = createButton(page, 'prev');
  }

  elements.resultPage.insertAdjacentHTML('afterbegin', button);
};

export const showResults = (recipes, page = 1, resPerPage = 10) => {
  // Render results of the current page
  const start = (page - 1) * resPerPage;
  const end = page * resPerPage;
  recipes.slice(start, end).forEach(el => innerRecipe(el));

  // Render page pagination
  renderButtons(page, recipes.length, resPerPage);
};

/**
 * 'pasta with tomato sauce'
 * acc: 0; acc + cur.length = 5; 5 <= 17; newTitle = ['pasta']
 * acc: 5; acc + cur.length = 9; 9 <= 17; newTitle = ['pasta', 'with']
 * acc: 9; acc + cur.length = 15; 15 <= 17; newTitle = ['pasta', 'with', 'tomato']
 * acc: 15; acc + cur.length = 20; 20 <= 17 -> false; newTitle = ['pasta', 'with', 'tomato']
 * newTitle.join(' ') ...   -> return -> 'pasta with tomato ...'
 */
export const limitRecipeTitle = (title, limit = 17) => {
  const newTitle = [];
  if (title.length > limit) {
    title.split(' ').reduce((acc, cur) => {
      if (acc + cur.length <= limit) {
        newTitle.push(cur);
      }
      return acc + cur.length;
    }, 0);
    return `${newTitle.join(' ')} ...`;
  }
  return title;
};
