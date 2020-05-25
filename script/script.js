import UI from '/script/ui.js';
import Storage from '/script/storage.js';

const ui = new UI();

// Dung promise de thuc hien tuan tu cac ham
// lay du lieu xong roi moi hien thi game
// Chi khi DOM da load xong moi thuc hien promise
document.addEventListener('DOMContentLoaded', () => {
		Storage.getGamesData().then((games) => {
		Storage.saveGames(games);
		ui.scrollEffect();
		ui.displayGames(games);
		ui.addCartFunction();
		ui.cartLogic();
		ui.setUpCart();
	});
});