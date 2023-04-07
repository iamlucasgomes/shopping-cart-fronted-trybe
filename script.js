const sectionItem = document.querySelector('.items');
const cartItems = document.querySelector('.cart__items');
const emptyBtn = document.querySelector('.empty-cart');
const totalPrice = document.querySelector('.total-price');
const preloader = document.querySelector('.loading');
const initialPrice = 0;
let total = 0;

const removeLoader = () => {
  preloader.remove();
};

const createProductImageElement = (imageSource) => {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
};

const createCustomElement = (element, className, innerText) => {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
};

const createProductItemElement = ({ sku, name, image }) => {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
};

const getSkuFromProductItem = (item) => item.querySelector('span.item__sku').innerText;

const cartItemClickListener = (event) => {
  if (event.target.classList.contains('remove__item')) {
    const li = event.target.parentNode;
    const priceElement = li.querySelector('.price');
    const price = parseFloat(priceElement.innerText);

    // if (!li.classList.contains('removed')) {
    //   if (price > total) {
    //     total = 0;
    //   } else {
    //     total -= price;
    //     console.log(total, price)
    //   }
    //   totalPrice.innerHTML = `Subtotal: <span class='price'>${total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>`;
    //   li.classList.add('removed');
    // }

    if (event.target.classList.contains('remove__item')) {
      const button = event.target;
      const li = button.parentNode;

      button.setAttribute('disabled', true);

      setTimeout(() => {
        button.removeAttribute('disabled');
      }, 1000);
    }
    li.remove();


    saveCartItems(cartItems.innerHTML);
    saveTotalPrice(totalPrice.innerHTML);
  }
};

const createCartItemElement = ({ sku, name, salePrice, image }) => {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerHTML = `<img class='img_item_cart' src="${image}"><div class='descriptionItem'>${name}<p>
  <span class='price'>${salePrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span></div>`;
  const removeBtn = document.createElement('button')
  removeBtn.className = 'remove__item'
  removeBtn.innerHTML = '<button>X</button>';
  removeBtn.addEventListener('click', () => {
    totalSale = total;
    total = Array.from(cartItems.children).reduce((acc, curr) => {
      const price = parseFloat(curr.querySelector('.price').innerText.replace(/\D/g, '')) / 100
      return acc + price;
    }, 0);
    // total = Array.from(cartItems.children).reduce((acc, curr) => { 
    //   return acc - salePrice;
    // }, 0);
    console.log(total)
    totalPrice.innerHTML = `Subtotal: <span class='price'>${total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>`;
    li.remove();
    saveCartItems(cartItems.innerHTML);
    saveTotalPrice(totalPrice.innerHTML);
  });
  li.appendChild(removeBtn);
  li.addEventListener('click', cartItemClickListener);
  return li;
};

const showProducts = async () => {
  const { results } = await fetchProducts('games');
  results.forEach(({ id: sku, title: name, thumbnail: image }) =>
    sectionItem.appendChild(createProductItemElement({ sku, name, image })));
};

const addCart = async () => {
  const btnsAddCart = document.querySelectorAll('.item__add');
  btnsAddCart.forEach((element) =>
    element.addEventListener('click', async (event) => {
      const { id: sku, title: name, price: salePrice, thumbnail: image } = await fetchItem(
        getSkuFromProductItem(event.target.parentElement)
      );
      cartItems.appendChild(createCartItemElement({ sku, name, salePrice, image }));

      total = Array.from(cartItems.children).reduce((acc, curr) => {
        const price = parseFloat(curr.querySelector('.price').innerText.replace(/\D/g, '')) / 100
        return acc + price;
      }, 0);
      totalPrice.innerHTML = `Subtotal: <span class='price'>${total.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      })}</span>`;
      saveCartItems(cartItems.innerHTML);
      saveTotalPrice(totalPrice.innerHTML);
    })
  );
};

const emptyCart = async () => emptyBtn.addEventListener('click', () => {
  const cartSection = document.querySelectorAll('.cart__item');
  cartSection.forEach((list) => list.remove());
  localStorage.removeItem('cartItems');
  total = 0;
  totalPrice.innerHTML = `Subtotal: <span class='price'>${initialPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>`;
  localStorage.removeItem('totalPrice');
});

const calls = async () => {
  await showProducts();
  await addCart();
  emptyCart();
};
calls();

window.onload = () => {
  cartItems.innerHTML = getSavedCartItems();
  totalPrice.innerHTML = getTotalPrice();
  const cartItem = document.querySelectorAll('.cart__item');
  cartItem.forEach((list) => list.addEventListener('click', cartItemClickListener));
  removeLoader();
};
