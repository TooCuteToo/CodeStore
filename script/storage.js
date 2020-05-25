export default class Storage {
	// Xu ly bat dong bo de lay du lieu 
	// Lay du lieu tu game.json
	// Va tra ve du lieu da lay cho nguoi dung
	static async getGamesData() {
		// Doi du lieu tra ve tu game.json moi tiep tuc
		const result = await fetch('game.json');
		// Doi loc du lieu tra ve xong roi moi tiep tuc
		const data = await result.json();
		// Lay thong tin can thiet trong du lieu da loc
		// Du lieu tra ve la mot mang object
		let games = data.items;

		// Tao mot mang object moi voi du lieu da duoc toi gian hoa
		games = games.map(x => {
			const { title, price } =  x.fields;
			const { id } = x.sys;
			const img = x.fields.image.fields.file.url;
			return { title, price, id, img };
		});

		// Tra ve du lieu cho nguoi dung
		return games;
	}

	// Luu du lieu vao trong local storage
	static saveGames(games) { localStorage.setItem('games', JSON.stringify(games)); }

	// Lay game tu du lieu thong wa id
	static getGame(id) {
		const games = JSON.parse(localStorage.getItem('games'));
		return games.find(x => x.id === id);
	}

	// Luu gio hang vao local storage
	static saveCart(cart) { localStorage.setItem('cart', JSON.stringify(cart)); }

	// Xoa game khoi gio hang
	// Do cart la mang toan cuc cua ui class 
	// Nen ham nay phai tra ve gia tri 
	static removeGame(cart, id) {
		return cart.filter(x => x.id !== id);
		// Gia tri cua cart chi thay doi trong ham
		// Gia tri se tro lai nhu cu khi ham ket thuc
		/* cart = cart.filter(x => x.id !== id) */
	}
}