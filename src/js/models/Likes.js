export default class Likes {
  constructor() {
    this.likes = [];
  }

  addLike(id, title, image, author) {
    const like = {
      id,
      title,
      image,
      author
    };
    this.likes.push(like);
    // Save likes data to localStorage
    this.persistData();
    return like;
  }

  deleteLike(id) {
    const index = this.likes.findIndex(el => el.id === id);
    this.likes.splice(index, 1);

    this.persistData();
    // Delete likes data from localStorage
  }

  isLiked(id) {
    return this.likes.findIndex(el => el.id === id) !== -1;
  }

  getNumLikes() {
    return this.likes.length;
  }

  persistData() {
    localStorage.setItem('likes', JSON.stringify(this.likes));
  }

  restoreData() {
    const data = JSON.parse(localStorage.getItem('likes'));
    if (data) this.likes = data;
  }
}
