// Входные данные

export interface ProductApi {
    id: string;
    title: string;
    description: string;
    category: string;
    price: number | null; //цена может прийти пустая
    image: string;
  }

  export type ApiListResponse<Type> = {
    total: number;
    items: Type[];
  }
  
  export interface BasketItemApi {
    productId: string;
    quantity: number;
  }
  
  export interface OrderApi {
    id: string;
    items: BasketItemApi[];
    total: number;
    status: "pending" | "paid" | "shipped";
  }
  
  export interface UserApi {
    email: string;
    phone: string;
    address: string;
  }

//  Выходные данные

  export interface ProductUI {
    id: string;
    title: string;
    category: string;
    price: string; 
    image: string;
    description?: string; 
  }
  
  export interface BasketItemUI {
    id: string;
    title: string;
    price: string; 
    quantity: number;
  }
  
  export interface OrderUI {
    id: string;
    total: string; 
    items: BasketItemUI[];
    status: string; 
  }
//   Интерфейс API-клиента

  export interface ApiClient {
    getProducts(): Promise<ProductUI[]>;
    addToBasket(productId: string, quantity: number): Promise<BasketItemApi[]>;
    removeFromBasket(productId: string): Promise<BasketItemApi[]>;
    createOrder(user: UserApi, items: BasketItemApi[]): Promise<OrderApi>; 
    sendOrder(order: OrderApi): Promise<OrderApi>;
  }

// Интерфейсы модели данных

  interface ProductModel {
    setProducts(products: ProductUI[]): void;
    getProductById(id: string): ProductUI | undefined;
  }

  interface BasketModel {
    getBasket(): BasketItemUI[];
    addItemToBasket(productId: string): Promise<BasketItemUI[]>; 
    removeItemFromBasket(productId: string): Promise<BasketItemUI[]>;
    getTotalPrice(): string;
    clearBasket(): Promise<void>;
  }
  
  interface OrderModel {
    setOrderData(user: UserApi): void;
    validateOrder(): string[]; 
    getOrder(user: UserApi, basket: BasketItemUI[]): OrderUI;
}

//   Интерфейсы отображений

  export interface ProductView {
    renderProductList(products: ProductUI[]): void;
    renderProductDetails(product: ProductUI): void;
  }
  
  export interface BasketView {
    renderBasket(items: BasketItemUI[], total: string): void;
    showEmptyBasketMessage(): void;
  }
  
  export interface OrderView {
    renderOrderForm(): void;
    renderSuccessMessage(order: OrderUI): void;
    showFormErrors(errors: string[]): void;
  }

  interface SuccessMessageView {
    render(message: string): void;
  }

// Интерфейсы базовых классов

  interface EventEmitter {
    on(event: string, listener: (...args: any[]) => void): void;
    off(event: string, listener: (...args: any[]) => void): void;
    emit(event: string, ...args: any[]): void;
  }
  
  export interface ModalData {
    content: HTMLElement;
  }
  
  interface Card {
    renderCard(product: ProductUI): HTMLElement;
  }
  
  export interface Form {
    validate(): boolean;
    getData(): Record<string, string>;
    render(): HTMLElement;
  }

//  Перечисление событий и их интерфейсы

  type AppEvents =
    | "product:addToBasket"
    | "basket:removeItem"
    | "basket:update"
    | "order:submitted"
    | "order:success";
  
  interface AppEventPayloads {
    "product:addToBasket": { productId: string };
    "basket:removeItem": { productId: string };
    "basket:update": { items: BasketItemUI[]; total: string };
    "order:submitted": { user: UserApi; items: BasketItemUI[] };
    "order:success": { order: OrderUI };
  }

//   Форматировщик

  export interface Formatter {
    formatPrice(price: number): string; // Пример: 1000 -> "1 000 синапсов"
    formatStatus(status: string): string; // Пример: "pending" -> "В обработке"
  }

//   Шаблоны для UI

  interface TemplateProvider {
    getProductCardTemplate(): HTMLElement;
    getBasketItemTemplate(): HTMLElement;
    getOrderSuccessTemplate(): HTMLElement;
  }

// Презентеры

interface ProductPresenter {
  showProductList(): Promise<void>;
  showProductDetails(productId: string): Promise<void>;
}

interface BasketPresenter {
  showBasket(): Promise<void>;
  handleAddToBasket(productId: string): Promise<void>;
  handleRemoveFromBasket(productId: string): Promise<void>;
}

interface OrderPresenter {
  showOrderForm(): Promise<void>;
  handleOrderSubmit(user: UserApi): Promise<void>;
  prepareAndSendOrder(): Promise<void>; //объединить данные заказа и корзины
}