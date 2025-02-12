import './scss/styles.scss';
import {API_URL} from './utils/constants';
import { ProjectApi } from './components/ProjectAPI'; 
import { cloneTemplate, ensureElement } from './utils/utils';
import { AppData } from './components/AppData';
import { Page } from './components/Page';
import { Card, CardPreview } from './components/Card';
import { Modal } from './components/common/Modal';
import { EventEmitter } from './components/base/events';
import { ProductUI, BasketItemUI } from './types';
import { Basket } from './components/common/Basket';
import { OrderForm } from './components/OrderForm';
import { ContactForm } from './components/ContactForm';
import { Success } from './components/Success';


const api = new ProjectApi(API_URL);
const events = new EventEmitter();
const appState = new AppData(events);
const page = new Page(document.body, events);

const gallery = ensureElement('.gallery');
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const modalContainer = ensureElement<HTMLElement>('#modal-container');
const modal = new Modal(modalContainer, events);

// Создаем экземпляр корзины из шаблона
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const basketContainer = cloneTemplate(basketTemplate);
const basket = new Basket(basketContainer, events);

// Получаем элемент счетчика корзины
const basketCounter = ensureElement<HTMLElement>('.header__basket-counter');

// Обработчик события обновления продуктов, сгенерированного моделью
events.on('products:updated', (products: ProductUI[]) => {
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
    const productsUI = products.map(p => ({
      ...p,
      price: String(p.price)
    } as ProductUI));
    appState.setProducts(productsUI);
  } catch (error) {
    console.error('Ошибка загрузки товаров:', error);
  }
}
fetchProducts();

// Обработчик выбора карточки товара – открытие модального окна с детальной информацией
events.on('card:select', (product: ProductUI) => {
  const cardPreviewElement = cloneTemplate(cardPreviewTemplate);
  const cardPreview = new CardPreview(cardPreviewElement);
  
  cardPreview.title = product.title;
  cardPreview.image = product.image;
  cardPreview.text = product.description || 'Описание отсутствует';
  cardPreview.price = String(product.price);
  cardPreview.category = product.category;
  
  // Добавляем обработчик клика на кнопку "В корзину"
  const addToCartButton = ensureElement<HTMLButtonElement>('.card__button', cardPreviewElement);
  addToCartButton.addEventListener('click', () => {
    events.emit('card:add', product);
  });
  
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

//Добавление товара в заказ и корзину, обновление счетчика корзины на главной страницы
events.on('card:add', (item: ProductUI) => {
    appState.addItemToBasket(item);
    events.emit('basket:update', {
        items: appState.getBasket(),
        total: appState.getTotalPrice()
    });
    modal.close();
})

// Открытие корзины, отображение товаров и суммы заказа
events.on('basket:open', () => {
    const basketItems = appState.getBasket();
    const total = appState.getTotalPrice();
    
    events.emit('basket:update', {
        items: basketItems,
        total: total
    });
    
    modal.open(basketContainer);
});

// Также нужно добавить обработчик клика на кнопку корзины в шапке
const basketButton = ensureElement<HTMLButtonElement>('.header__basket');
basketButton.addEventListener('click', () => {
    events.emit('basket:open');
});

// Обновление счетчика корзины и содержимого корзины при изменении
events.on('basket:update', (payload: { items: BasketItemUI[], total: string }) => {
    basketCounter.textContent = String(payload.items.length);
    basket.renderBasket(payload.items, payload.total);
});

// Удаление товара из корзины
events.on('card:remove', (item: BasketItemUI) => {
    appState.removeItemFromBasket(item.id);
    events.emit('basket:update', {
        items: appState.getBasket(),
        total: appState.getTotalPrice()
    });
});

// Открытие формы доставки
events.on('order:open', () => {
    const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
    const orderElement = cloneTemplate(orderTemplate) as HTMLFormElement;
    const orderForm = new OrderForm(orderElement, events);
    
    modal.open(orderElement);
    appState.setOrderItems(appState.getBasket().map(item => ({ 
        productId: item.id, 
        quantity: item.quantity 
    })));
});

// Обработка изменения способа оплаты
events.on('payment:change', (button: HTMLButtonElement) => {
    appState.setPaymentType(button.name);
});

// Обработка изменений в форме заказа
events.on('order:field:change', (data: { field: string, value: string }) => {
    appState.setOrderData({ [data.field]: data.value });
});

// Валидация форм
events.on('order:validate', () => {
    const errors = appState.validateOrder();
    events.emit('formErrors:change', errors);
});

// Отправка заказа и переход к контактам
events.on('order:submit', () => {
    const contactTemplate = ensureElement<HTMLTemplateElement>('#contacts');
    const contactElement = cloneTemplate(contactTemplate) as HTMLFormElement;
    const contactForm = new ContactForm(contactElement, events);
    
    modal.open(contactElement);
});

// Обработка изменений в форме контактов
events.on('contacts:field:change', (data: { field: string, value: string }) => {
    appState.setOrderData({ ...appState.getOrder(), [data.field]: data.value });
});

// Финальная отправка заказа
events.on('contacts:submit', async () => {
    try {
        const order = appState.getOrder();
        await api.orderCard(order);
        
        appState.clearBasket();
        events.emit('basket:update', {
            items: appState.getBasket(),
            total: appState.getTotalPrice()
        });
        
        const successTemplate = ensureElement<HTMLTemplateElement>('#success');
        const successElement = cloneTemplate(successTemplate);
        const success = new Success(successElement, {
            onClick: () => modal.close()
        });
        
        success.total = appState.getTotalPrice();
        modal.open(successElement);
        
    } catch (error) {
        console.error(error);
    }
});