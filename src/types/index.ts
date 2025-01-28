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
    index: number;
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
    addToBasket(productId: string, quantity: number): Promise<void>;
    removeFromBasket(productId: string): Promise<void>;
    createOrder(user: UserAPI, items: BasketItemAPI[]): Promise<OrderAPI>;
  }

// Интерфейсы модели данных

  interface ProductModel {
    fetchProducts(): Promise<ProductUI[]>;
    getProductById(id: string): Promise<ProductUI>;
  }

  interface BasketModel {
    getBasket(): BasketItemUI[];
    addItemToBasket(productId: string): Promise<void>;
    removeItemFromBasket(productId: string): Promise<void>;
    getTotalPrice(): string;
  }
  
  interface OrderModel {
    createOrder(user: UserAPI): Promise<OrderUI>;
    fetchOrder(id: string): Promise<OrderUI>;
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

// Контроллеры

  interface ProductController {
    showProductList(): Promise<void>;
    showProductDetails(productId: string): Promise<void>;
  }
  
  interface BasketController {
    showBasket(): Promise<void>;
    handleAddToBasket(productId: string): Promise<void>;
    handleRemoveFromBasket(productId: string): Promise<void>;
  }
  
  interface OrderController {
    showOrderForm(): Promise<void>;
    handleOrderSubmit(data: UserAPI): Promise<void>;
  }