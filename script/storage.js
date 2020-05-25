export default class Storage {
  static async getGamesData() {
    const result = await fetch("game.json");
    const data = await result.json();

    let games = data.items;

    games = games.map((x) => {
      const { title, price } = x.fields;
      const { id } = x.sys;
      const img = x.fields.image.fields.file.url;
      return { title, price, id, img };
    });

    return games;
  }

  static saveGames(games) {
    localStorage.setItem("games", JSON.stringify(games));
  }

  static getGame(id) {
    const games = JSON.parse(localStorage.getItem("games"));
    return games.find((x) => x.id === id);
  }

  static saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  static removeGame(cart, id) {
    return cart.filter((x) => x.id !== id);
  }
}
