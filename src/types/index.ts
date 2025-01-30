// Входные данные

interface ProductAPI {
    id: string;
    title: string;
    description: string;
    category: string;
    price: number | null; //цена может прийти пустая
    image: string;
  }
  
  interface BasketItemAPI {
    productId: string;
    quantity: number;
  }
  
  interface OrderAPI {
    id: string;
    items: BasketItemAPI[];
    total: number;
    status: "pending" | "paid" | "shipped";
  }
  
  interface UserAPI {
    email: string;
    phone: string;
    address: string;
  }

//  Выходные данные

  interface ProductUI {
    id: string;
    title: string;
    category: string;
    price: string; 
    image: string;
    description?: string; 
  }
  
  interface BasketItemUI {
    id: string;
    title: string;
    price: string; 
    quantity: number;
  }
  
  interface OrderUI {
    id: string;
    total: string; 
    items: BasketItemUI[];
    status: string; 
  }
//   Интерфейс API-клиента

  interface ApiClient {
    getProducts(): Promise<ProductAPI[]>;
    addToBasket(productId: string, quantity: number): Promise<BasketItemAPI[]>;
    removeFromBasket(productId: string): Promise<BasketItemAPI[]>;
    createOrder(user: UserAPI, items: BasketItemAPI[]): Promise<OrderAPI>; 
    sendOrder(order: OrderAPI): Promise<OrderAPI>;
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
    setOrderData(user: UserAPI): void;
    validateOrder(): string[]; 
    createOrder(basket: BasketItemUI[]): OrderUI | null;
}

//   Интерфейсы отображений

  interface ProductView {
    renderProductList(products: ProductUI[]): void;
    renderProductDetails(product: ProductUI): void;
  }
  
  interface BasketView {
    renderBasket(items: BasketItemUI[], total: string): void;
    showEmptyBasketMessage(): void;
  }
  
  interface OrderView {
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
  
  interface Modal {
    open(content: HTMLElement): void;
    close(): void;
    setTitle(title: string): void;
  }
  
  interface Card {
    renderCard(product: ProductUI): HTMLElement;
  }
  
  interface Form {
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
    "order:submitted": { user: UserAPI; items: BasketItemUI[] };
    "order:success": { order: OrderUI };
  }

//   Форматировщик

  interface Formatter {
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
  handleOrderSubmit(user: UserAPI): Promise<void>;
  prepareAndSendOrder(): Promise<void>; //объединить данные заказа и корзины
}