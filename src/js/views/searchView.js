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
                <h4 class="results__name">${recipe.title}</h4>
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
