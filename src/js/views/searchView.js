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
};

export const clearInputField = () => {
  elements.searchInput.value = '';
};

export const showResults = recipes => {
  recipes.forEach(el => innerRecipe(el));
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
