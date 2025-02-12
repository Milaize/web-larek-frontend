import './scss/styles.scss';
import {API_URL} from './utils/constants';
import { ProjectApi } from './components/ProjectAPI'; 
import { cloneTemplate, ensureElement } from './utils/utils';
import { AppData } from './components/AppData';
import { Page } from './components/Page';
import { Card, CardPreview } from './components/Card';
import { Modal } from './components/common/Modal';
import { EventEmitter } from './components/base/events';

const api = new ProjectApi(API_URL);
const events = new EventEmitter();
const appState = new AppData(events);
const page = new Page(document.body, events);

const gallery = ensureElement('.gallery');
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const modalContainer = ensureElement<HTMLElement>('#modal-container');
const modal = new Modal(modalContainer, events);

// Обработчик события обновления продуктов, сгенерированного моделью
events.on('products:updated', (products) => {
  gallery.innerHTML = '';
  products.forEach(product => {
    // Клонируем не весь content, а конкретный элемент разметки внутри шаблона
    const cardElement = cloneTemplate(cardCatalogTemplate);
    const card = new Card(cardElement, () => events.emit('card:select', product));
    
    card.category = product.category;
    card.title = product.title;
    card.image = product.image;
    card.price = String(product.price);
    
    gallery.appendChild(cardElement);
  });
});

// Запрос данных с сервера – только получение и передача в модель
async function fetchProducts() {
  try {
    const products = await api.getProducts();
    appState.setProducts(products); // Внутри модели будет сгенерировано событие "products:updated"
  } catch (error) {
    console.error('Ошибка загрузки товаров:', error);
  }
}
fetchProducts();

// Обработчик выбора карточки товара – открытие модального окна с детальной информацией
events.on('card:select', (product) => {
  const cardPreviewElement = cloneTemplate(cardPreviewTemplate);
  const cardPreview = new CardPreview(cardPreviewElement);
  
  cardPreview.title = product.title;
  cardPreview.image = product.image;
  cardPreview.text = product.description || 'Описание отсутствует';
  cardPreview.price = String(product.price);
  cardPreview.category = product.category;
  
  // Передаём заполненную разметку карточки в модальное окно
  modal.open(cardPreviewElement);
});

// Блокировка прокрутки страницы при открытии модального окна
events.on('modal:open', () => {
  page.locked = true;
});

// Разблокировка прокрутки страницы при закрытии модального окна
events.on('modal:close', () => {
  page.locked = false;
});