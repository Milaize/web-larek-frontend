import './scss/styles.scss';
import {API_URL, CDN_URL} from './utils/constants';
import {EventEmitter} from './components/base/events';//Импорт слушателя
import {ProjectApi} from './components/ProjectAPI';//Импорт апи
import {cloneTemplate, ensureElement } from './utils/utils';//Импорт утилит клонирования темплэйта и элемента обеспечения
import {AppState} from './components/AppData';//Импорт бизнес логики
import {Page} from './components/Page';//Импорт главной страницы
import {Card, CardPreview, CardBasket} from './components/Card';//Импорт карточки
import {Modal} from './components/common/Modal';//Импорт модального окна
import {Basket} from './components/common/Basket';//Импорт корзины
import {Order} from './components/Order';//Импорт формы адреса
import {SuccessMessageView} from './components/common/Success';//Импорт успешного заказа
import {ProductUI} from './types/index';

document.addEventListener("DOMContentLoaded", async () => {
  const api = new ProjectApi("https://cdn.example.com/", "https://api.example.com");
  const productList = document.getElementById("product-list");

  if (!productList) {
      console.error("Element #product-list not found");
      return;
  }

  try {
      const products: ProductUI[] = await api.getProducts();
      products.forEach(product => {
          const card = createProductCard(product);
          productList.appendChild(card);
      });
  } catch (error) {
      console.error("Failed to load products", error);
  }
});

function createProductCard(product: ProductUI): HTMLElement {
  const card = document.createElement("div");
  card.classList.add("product-card");

  card.innerHTML = `
      <img src="${product.image}" alt="${product.title}" class="product-image" />
      <h3 class="product-title">${product.title}</h3>
      <p class="product-category">${product.category}</p>
      <p class="product-price">${product.price}</p>
      <button class="add-to-basket" data-id="${product.id}">Добавить в корзину</button>
  `;

  return card;
}