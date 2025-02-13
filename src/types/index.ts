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
    payment?: string;
    address: string;
    email: string;
    phone: string;
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

// Интерфейсы компонентов

export interface BasketView {
    renderBasket(items: BasketItemUI[], total: string): void;
    showEmptyBasketMessage(): void;
}

export interface Form {
    validate(): boolean;
    getData(): Record<string, string>;
    render(): HTMLElement;
}

export interface ModalData {
    content: HTMLElement;
}

// События приложения

export type AppEvents =
    | "product:addToBasket"
    | "basket:removeItem"
    | "basket:update"
    | "basket:open"
    | "order:open"
    | "order:submit"
    | "order:validate"
    | "order:field:change"
    | "contacts:field:change"
    | "contacts:submit"
    | "payment:change"
    | "formErrors:change"
    | "modal:open"
    | "modal:close";

export interface AppEventPayloads {
    "basket:update": { items: BasketItemUI[]; total: string };
    "order:field:change": { field: string; value: string };
    "contacts:field:change": { field: string; value: string };
    "payment:change": HTMLButtonElement;
    "formErrors:change": string[];
}

// Интерфейсы отображений
export interface OrderFormView {
    payment: string;
    address: string;
    valid: boolean;
    errors: string;
    validateForm(): void;
}

export interface ContactFormView {
    email: string;
    phone: string;
    valid: boolean;
    errors: string;
    validateForm(): void;
}

export interface SuccessView {
    total: string;
    render(): HTMLElement;
}

// Интерфейс API-клиента
export interface ApiClient {
    getProducts(): Promise<ProductUI[]>;
    getProductById(id: string): Promise<ProductUI>;
    orderCard(order: OrderApi): Promise<OrderUI>;
}

// Интерфейсы модели данных
export interface ProductModel {
    products: ProductUI[];
    setProducts(products: ProductUI[]): void;
    getProductById(id: string): ProductUI | undefined;
}

export interface BasketModel {
    basket: BasketItemUI[];
    addItemToBasket(product: ProductUI): void;
    removeItemFromBasket(productId: string): void;
    getTotalPrice(): string;
    clearBasket(): void;
}

export interface OrderModel {
    order: OrderApi;
    user: UserApi;
    setOrderData(data: Partial<OrderApi>): void;
    setUserData(data: Partial<UserApi>): void;
    validateOrder(): string[];
    getOrder(): OrderApi;
}