import Storage from '/script/storage.js';

const gameContainer = document.querySelector('#game-container');
const cartContainer = document.querySelector('.cart-container');
const cartDOM = document.querySelector('.cart');
const cartItemContainer = document.querySelector('#cart-items-container');

// Mang cart dung de setup du lieu tu gio hang
let cart = [];

// Mang chua cac nut add item de chuan bi cho setup gio hang
let buttonDOM = [];

export default class UI {
	// Hien thi cac game co trong du lieu
	displayGames(games) {
		let gameContent = '';
		games.forEach(x => {
			gameContent += `
				<article class="game">
					<div class="game-img">
						<img src="${x.img}">
						<button class="add-btn" data-id="${x.id}">add to cart</button>
					</div>
					<div class="game-detail">
						<h3 class="title"></h3>
						<h3 class="price">$${x.price.toFixed(2)}</h3>
					</div>
				</article>
			`;
		});
		gameContainer.innerHTML = gameContent;
	}

	// Hieu ung cuon trang 
	scrollEffect() {
		lax.setup(); // init
		const updateLax = () => {
			lax.update(window.scrollY);
			window.requestAnimationFrame(updateLax);
		}
		window.requestAnimationFrame(updateLax);
	}

	addItemToCart(game) {
		// Tao ra wrapper element de goi item vao
		let cartItem = document.createElement('div');
		cartItem.classList.add('cart-items');
		
		// Cau truc dom cua item 
		let item = `
			<img src="${game.img}">
			<div class="item-detail">
				<p class="title">${game.title}</p>
				<p class="price">$${game.price.toFixed(2)}</p>
				<p class="remove-btn" data-id="${game.id}">remove</p>
			</div>
			<div class="item-btn">
				<i class="fas fa-chevron-up" data-id="${game.id}"></i>
				<p class="item-amount">${game.amount}</p>
				<i class="fas fa-chevron-down" data-id="${game.id}"></i>
			</div>
		`;

		// Them item vao cart dom
		cartItem.innerHTML = item;
		cartItemContainer.appendChild(cartItem);
	}

	setUpCart() {
		cart = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : [];
		this.setCartValue(cart);
		
		// Cau truc dom cua item 
		cart.forEach(game => {
			this.addItemToCart(game);
		});	

		buttonDOM.forEach(btn => {
			if (cart.find(x => x.id === btn.dataset.id))
				this.disabledBtn(btn);
		});
	}

	// Hien thi gio hang
	showCart() {
		cartContainer.classList.add('transparentBG');
		cartDOM.classList.add('showCart');
	}

	// Dong gio hang
	closeCart() {
		cartContainer.classList.remove('transparentBG');
		cartDOM.classList.remove('showCart');
	}

	// Tinh gia tri cua gio hang
	setCartValue(cart) {
		let cartTotal = document.querySelector('.cart-total');
		let itemAmount = document.querySelector('#item-amount');
		let tempTotal = 0;
		let tempAmount = 0;

		if (cart) {
			cart.forEach(x => {
				tempTotal += x.price * x.amount; // Tinh tong tien trong gio hang
				tempAmount += x.amount // Tinh tong so luong trong gio
			});
		}
		cartTotal.innerText = tempTotal;
		itemAmount.innerText = tempAmount;
	}

	// Vo hieu hoa no them vao gio
	disabledBtn(btn) {
		btn.disabled = true;
		btn.innerHTML = 'in cart';
	}

	// Them item vao gio hang va thuc hien cac chuc nang kem theo
	addCartFunction() {
		const buttons = [...document.querySelectorAll('.add-btn')];
		buttonDOM = buttons;
		buttons.forEach((btn) => {
			btn.addEventListener('click', (event) => {

				const id = btn.dataset.id;
				// Dung spread operator de copy object va tao ra object moi
				const game = { ...Storage.getGame(id), amount : 1 };

				// Push game da dc them vao trong mang cart va save mang cart lai
				cart.push(game);
				// Tao lien ket giua cart va local storage cua no
				Storage.saveCart(cart);
				this.addItemToCart(game);
				
				// Vo hieu hoa nut them vao gio hang neu nhu da them
				this.disabledBtn(btn);
				// Hien thi gio hang 
				this.showCart();
				// Tinh tong tien va so luong item trong gio hang
				this.setCartValue(cart);
			});
		});
	}

	activeBtn(btn) {
		btn.disabled = false;
		btn.innerText = 'add to cart';
	}

	removeOffCart(id) {
		const removeBtn = document.querySelectorAll('.remove-btn');
		removeBtn.forEach(removebtn => {
			if (removebtn.dataset.id === id) {
				cartItemContainer.removeChild(event.target.parentElement.parentElement);
				buttonDOM.forEach(x => {
					if (x.dataset.id === removebtn.dataset.id)
						this.activeBtn(x);
				})
			}
		});
	}

	// Chay cac nut dong, xoa gio hang, tang/giam so luong,...
	cartLogic() {
		cartDOM.addEventListener('click', (event) => {
			// Dong gio hang khi nhan nut close
			if (event.target.classList.contains('fa-window-close'))
				this.closeCart();

			// Thiet lap chuc nang cho clear btn
			else if (event.target.classList.contains('clear-cart')) {
				localStorage.removeItem('cart');
				cart = [];
				this.setCartValue();
				this.closeCart();
				while(cartItemContainer.childNodes[0])
					cartItemContainer.removeChild(cartItemContainer.childNodes[0]);
				buttonDOM.forEach(x => {
					this.activeBtn(x);
				});
			} else if (event.target.classList.contains('remove-btn')) {
				const id = event.target.dataset.id;
				this.removeOffCart(id);
				cart = Storage.removeGame(cart, id);
				Storage.saveCart(cart);
				this.setCartValue(cart);
			}  else if (event.target.classList.contains('fa-chevron-up')) {
				const id = event.target.dataset.id;
				// Tra ve game co id phu hop
				let itemAmount = cart.find(x => x.id === id);
				// Luu y: Do local storage da lien ket voi 
				// Cua 1 bien 
				itemAmount.amount += 1;
				Storage.saveCart(cart);
				this.setCartValue(cart);
				// Dom hien thi so luong trong gio hang
				const amountDOM = event.target.nextElementSibling;
				amountDOM.innerText = itemAmount.amount;
			} else if (event.target.classList.contains('fa-chevron-down')) {
				const id = event.target.dataset.id;
				let itemAmount = cart.find(x => x.id === id);
				if (itemAmount.amount > 1) {
					itemAmount.amount -= 1;
				} else {
					this.removeOffCart(id);
					cart = Storage.removeGame(cart, id);
				
				}
				Storage.saveCart(cart);
				this.setCartValue(cart);
				// Dom hien thi so luong trong gio hang
				const amountDOM = event.target.previousElementSibling;
				amountDOM.innerText = itemAmount.amount;
			}
		});

		// Hien thi gio hang khi nhan nut gio hang
		const cartBtn = document.querySelector('.show-cart');
		cartBtn.addEventListener('click', () => {
			this.showCart();
		});
	}
}