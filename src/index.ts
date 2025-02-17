import './scss/styles.scss';
import {API_URL} from './utils/constants';
import { ProjectApi } from './components/ProjectAPI'; 
import { cloneTemplate, ensureElement } from './utils/utils';
import { AppData } from './components/AppData';
import { Page } from './components/Page';
import { Card, CardPreview, CardBasket } from './components/Card';
import { Modal } from './components/common/Modal';
import { EventEmitter } from './components/base/events';
import { ProductUI, BasketItemUI } from './types';
import { Basket } from './components/common/Basket';
import { OrderForm } from './components/OrderForm';
import { ContactForm } from './components/ContactForm';
import { SuccessMessageView } from './components/common/Success';
import { GalleryView } from './components/GalleryView';

// Перенесем объявление шаблона в начало файла, после других шаблонов
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');

const api = new ProjectApi(API_URL);
const events = new EventEmitter();
const appState = new AppData(events);
const page = new Page(document.body, events);

// Инициализируем представление галереи
const gallery = new GalleryView(ensureElement<HTMLElement>('.gallery'));

const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const modalContainer = ensureElement<HTMLElement>('#modal-container');
const modal = new Modal(modalContainer, events);

// Создаем экземпляр корзины из шаблона
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const basketContainer = cloneTemplate(basketTemplate);
const basket = new Basket(basketContainer, events);

// В начале файла после инициализации других компонентов
const successTemplate = ensureElement<HTMLTemplateElement>('#success');
const successElement = cloneTemplate(successTemplate);
const success = new SuccessMessageView(successElement, {
    onClick: () => {
        modal.close();
    }
});

// В начале файла после инициализации других компонентов
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const orderElement = cloneTemplate(orderTemplate) as HTMLFormElement;
const orderForm = new OrderForm(orderElement, events);

const contactTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const contactElement = cloneTemplate(contactTemplate) as HTMLFormElement;
const contactForm = new ContactForm(contactElement, events);

// Динамические экземпляры создаются для каждого элемента
events.on('products:updated', (products: ProductUI[]) => {
    const cardElements = products.map(product => {
        const cardElement = cloneTemplate(cardCatalogTemplate);
        const card = new Card(cardElement, () => events.emit('card:select', product));
        
        card.category = product.category;
        card.title = product.title;
        card.image = product.image;
        card.price = String(product.price);
        
        return cardElement;
    });
    
    gallery.renderCards(cardElements);
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

// Обработчик выбора карточки товара
events.on('card:select', (product: ProductUI) => {
    const cardPreviewElement = cloneTemplate(cardPreviewTemplate);
    const cardPreview = new CardPreview(cardPreviewElement, events);
    
    // Проверяем, есть ли товар в корзине
    const isInBasket = appState.basket.some(item => item.id === product.id);
    
    cardPreview.setData(product, isInBasket);
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
        items: appState.basket,
        total: appState.getTotalPrice()
    });
    modal.close();
})

// Открытие корзины
events.on('basket:open', () => {
    modal.open(basketContainer);
});

// Удаление товара из корзины
events.on('card:remove', (item: BasketItemUI) => {
    appState.removeItemFromBasket(item.id);
    events.emit('basket:update', {
        items: appState.basket,
        total: appState.getTotalPrice()
    });
});

// Изменим обработчик открытия формы заказа
events.on('order:open', () => {
    modal.open(orderElement);
    appState.setOrderItems(appState.basket.map(item => ({ 
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
    if (data.field === 'address') {
        // Сохраняем адрес в данных пользователя
        appState.setUserData({ address: data.value });
    }
    appState.setOrderData({ [data.field]: data.value });
    events.emit('order:validate');
});

// Обработка изменений в форме контактов
events.on('contacts:field:change', (data: { field: string, value: string }) => {
    if (data.value) {
        appState.setUserData({ [data.field]: data.value });
    }
    const errors = appState.validateOrder();
    events.emit('formErrors:change', errors);
});

// Валидация форм
events.on('order:validate', () => {
    const errors = appState.validateOrder();
    console.log('Validation errors:', errors); // Для отладки
    events.emit('formErrors:change', errors);
});

// Изменим обработчик отправки заказа
events.on('order:submit', () => {
    modal.open(contactElement);
});

// Финальная отправка заказа
events.on('contacts:submit', async () => {
    try {
        const errors = appState.validateOrder();
        if (!errors.length) {
            const orderData = appState.getOrder();
            if (!orderData.items.length) {
                return;
            }
            try {
                const result = await api.orderCard(orderData);
                success.render({
                    id: result.id,
                    total: result.total
                });
                modal.open(successElement);
                appState.clearBasket();
                events.emit('basket:update', {
                    items: appState.basket,
                    total: appState.getTotalPrice()
                });
                
                orderForm.render({
                    payment: '',
                    address: '',
                    valid: false,
                    errors: []
                });
                
                contactForm.render({
                    email: '',
                    phone: '',
                    valid: false,
                    errors: []
                });
            } catch (apiError) {
                console.error('API Error:', apiError);
            }
        }
    } catch (error) {
        console.error('Error:', error);
    }
});

// Обработка ошибок формы
events.on('formErrors:change', (errors: string[]) => {
    const currentForm = document.querySelector('.form:not(.is-hidden)') as HTMLFormElement;
    if (currentForm.name === 'contacts') {
        const submitButton = currentForm.querySelector('button[type="submit"]') as HTMLButtonElement;
        if (submitButton) {
            submitButton.disabled = errors.length > 0;
            console.log('Button state:', { disabled: errors.length > 0, errors }); // Для отладки
        }
    }
});

// Обновление корзины
events.on('basket:update', (payload: { items: BasketItemUI[], total: string }) => {
    page.counter = payload.items.length;
    page.setBasketDisabled(payload.items.length === 0);
    const cardElements = payload.items.map(item => {
        const card = cloneTemplate(cardBasketTemplate);
        const cardItem = new CardBasket(card, events);
        cardItem.setData(item);
        return card;
    });
    
    basket.renderBasket(cardElements, payload.total);
});

// Добавим обработчик успешного оформления заказа
events.on('order:success', () => {
    modal.close();
});