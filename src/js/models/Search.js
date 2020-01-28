import axios from 'axios';

export default class Search {
  constructor(query) {
    this.query = query;
  }

  async getRecipe() {
    try {
      const res = await axios(
        `https://forkify-api.herokuapp.com/api/search?q=${this.query}`
      );
      //   console.log(res.data.recipes);
      this.result = res.data.recipes;
    } catch (error) {
      console.log(error);
    }
  }
}
