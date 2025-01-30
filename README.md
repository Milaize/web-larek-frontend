# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

## Архитектура приложения  

Приложение основано на паттерне проектирования MVP (Model-View-Presenter).  
В рамках этой архитектуры:  
* Модель (Model) отвечает за хранение данных.  
* Представление (View) отображает данные и реагирует на события пользователя.  
* Презентер (Presenter) обрабатывает пользовательские события, запрашивает данные из API и обновляет модель.  

### Классы с группировкой по слоям.  
**1. Слой модели:**  

1.1. BasketModel  
Хранит состояние корзины. 
Поля:  

* basket: BasketItemUI[] - массив товаров в корзине.  

* total: string - общая стоимость корзины в форматированной строке "1000 синапсов".  

* formatter: Formatter - объект для форматирования данных.  

Методы:  

* getBasket(): BasketItemUI[] - возвращает текущее состояние корзины.  
_Задача: управление локальным состоянием корзины._  

* addItemToBasket(product: BasketItemUI): void — добавляет товар в локальную корзину.   
_Задача: обновить состояние корзины на клиенте._  

* removeItemFromBasket(id: string): void; - удаляет товар из корзины.  
_Задача: обновить состояние корзины на клиенте._  

* getTotalPrice(): string - возвращает общую стоимость корзины в форматированном виде.  
_Задача: рассчитать и отобразить стоимость всех товаров._  

1.2. OrderModel  
Хранит данные формы заказа.  
Поля:  

* formatter: Formatter - объект для форматирования статусов и цен.  
* orderData: UserAPI | null — данные пользователя, оформляющего заказ.

Методы: 

setOrderData(user: UserAPI): void
_Задача: сохраняет данные формы заказа._  

validateOrder(): string[] — проверяет корректность данных заказа.  
_Задача: убедиться, что данные корректны перед оформлением заказа._  

createOrder(basket: BasketItemUI[]): OrderUI | null 
_Задача: сформировать объект заказа, используя данные корзины.._  

1.3. ProductModel  
Поля:  
* products: ProductUI[] — массив товаров.  
* apiClient: ApiClient - объект для взаимодействия с API.  

Методы:  

* setProducts(products: ProductUI[]): void
_Задача: сохранить список товаров._    

* getProductById(id: string): ProductUI | undefined - получает данные конкретного товара.  
_Задача:  получать данные конкретного товара по ID._  

**2. Слой представления:**  

2.1. BasketView  
Поля:  

* container: HTMLElement - DOM-элемент, где отображается корзина.  

Методы:  

* renderBasket(items: BasketItemUI[], total: string): void - отображает список товаров и общую стоимость.  
_Задача: отрисовать корзину на основе переданных данных._  

* showEmptyBasketMessage(): void
_Задача: информировать пользователя о том, что корзина пуста._  

2.2. OrderView
Поля:

* formContainer: HTMLElement - DOM-элемент, где отображается форма заказа.  

Методы:  

* renderOrderForm(): void  
_Задача: отображает форму._  

* showFormErrors(errors: string[]): void   
_Задача: отображает ошибки валидации формы._  

2.3. ProductView  
Поля:  

* galleryContainer: HTMLElement - DOM-элемент для списка товаров.  
* detailsContainer: HTMLElement - DOM-элемент для деталей товара.  

Методы:  

* renderProductList(products: ProductUI[]): void - отображает список товаров.
_Задача: отрисовать каталог товаров._
* renderProductDetails(product: ProductUI): void - отображает подробную информацию о товаре.
_Задача: показать информацию выбранного товара._  

2.4 SuccessMessageView  

Методы:  
render(message: string): void  
_Задача: отображает сообщение об успешной оплате._  

**3. Слой презентера:**  

3.1 BasketPresenter 
Обрабатывает корзину.  

Поля:

* model: BasketModel
* view: BasketView
* apiClient: ApiClient

Методы:

* init(): void — загружает данные корзины.
* handleAddToBasket(product: BasketItemUI): void — добавляет товар.
* handleRemoveFromBasket(productId: string): void — удаляет товар.

3.2 OrderPresenter  
Обрабатывает заказ.  

Поля:

* model: OrderModel  
* view: OrderView  
* apiClient: ApiClient  

Методы:  

* handleSubmit(data: Partial): void 
_олучает данные из OrderModel и BasketModel, затем передает их в apiClient.sendOrder(orderData)_

3.3 ProductPresenter
Обрабатывает каталог.  

Поля:  

* model: ProductModel  
* view: ProductView  
* apiClient: ApiClient  

Методы:

* init(): void — загружает каталог.
* handleSelectProduct(id: string): void — отображает детали товара.

### Пользовательские события.  
1. product:addToBasket  
Описание: Пользователь добавляет товар в корзину.
Обработчик: BasketPresenter.handleAddToBasket(product)

2. basket:removeItem  
Описание: Пользователь удаляет товар из корзины.
Обработчик: BasketPresenter.handleRemoveFromBasket(productId)

3. order:submitted  
Описание: Пользователь отправляет заказ.
Обработчик: OrderPresenter.handleSubmit(data)


#### В рамках архитектуры приложения некоторые сущности имеют модель данных и представления, другим же достаточно только представления.  

### Сущности, имеющие модель данных и представление (View + Model):  

1. Класс EventEmitter  
Модель данных: управляет состоянием зарегистрированных событий и их обработчиков - регистрация слушателей событий (on), удаление слушателей (off), генерация событий (emit).   
Представление: фактически отсутствует, но опосредованно участвует через управление событиями  между различными частями приложения.  
```typescript
    interface EventEmitter {
    on(event: string, listener: (...args: any[]) => void): void;
    off(event: string, listener: (...args: any[]) => void): void;
    emit(event: string, ...args: any[]): void;
  }
```  

2. Класс Modal  
Модель данных: состояние модального окна (открыто/закрыто), текущий контент.  
Представление: отвечает за отображение модального окна и динамическое наполнение контента.  
```typescript
   interface Modal {
    open(content: HTMLElement): void;
    close(): void;
    setTitle(title: string): void;
  }
``` 

3. Класс Card  
Модель данных: данные о товаре (название, цена, категория, изображение).  
```typescript
   interface Card {
    renderCard(product: ProductUI): HTMLElement;
  }
``` 
Представление: создание и обновление отображения карточек для каталога, корзины и модальных окон.  

4. Класс Basket  
Модель данных: содержимое корзины (список товаров, их количество, общая стоимость).  
Представление: отображает содержимое корзины, кнопки удаления и оформление заказа.  
```typescript
 interface BasketModel {
    getBasket(): BasketItemUI[];
    addItemToBasket(productId: string): Promise<void>;
    removeItemFromBasket(productId: string): Promise<void>;
    getTotalPrice(): string;
  }
``` 

5. Класс OrderForm 
Модель данных: состояние формы (введённые данные, ошибки валидации, текущий этап).  
Представление: управляет отображением полей, ошибок и переходами между этапами оформления.  
```typescript
 interface OrderModel {
    createOrder(user: UserAPI, basket: BasketItemUI[]): OrderUI;
}
```   

### Сущности, имеющие только с представления (View):  

1. Компонент Header  
Представление: отображает логотип и счётчик товаров в корзине.  
Связь с моделью: получает данные о количестве товаров из модели Basket.  

2. Компонент Gallery  
Представление: отображает карточки товаров.  
Связь с моделью: получает данные о товарах из класса Card.  

3. Компонент SuccessMessage  
Представление: отображает сообщение об успешном оформлении заказа.  
Связь с моделью: использует данные об итогах заказа из модели OrderForm.  

### Шаблоны (Templates)
Шаблоны предоставляют структуру для динамически генерируемого контента. 
Используются для создания карточек (card-catalog, card-basket), корзины (basket), форм заказа (order, contacts), а также сообщений о завершении (success). 
Шаблоны наполняются данными через соответствующие классы и вставляются в DOM.
Они динамически наполняются данными из соответствующих моделей (Card, Basket, OrderForm) через представление.