import UI from "/script/ui.js";
import Storage from "/script/storage.js";

const ui = new UI();

document.addEventListener("DOMContentLoaded", () => {
  Storage.getGamesData().then((games) => {
    Storage.saveGames(games);
    ui.scrollEffect();
    ui.displayGames(games);
    ui.addCartFunction();
    ui.cartLogic();
    ui.setUpCart();
  });
});
