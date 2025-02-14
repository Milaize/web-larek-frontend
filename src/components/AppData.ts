import { Model } from "./base/Model";
import { IEvents } from "./base/events";
import { ProductUI, BasketItemUI, OrderUI, UserApi, OrderApi, BasketItemApi } from "../types/index";
import { ProductModel, BasketModel, OrderModel } from '../types';

export class AppData extends Model<AppData> implements ProductModel, BasketModel, OrderModel {
  protected _products: ProductUI[] = [];
  protected _basket: BasketItemUI[] = [];
  protected _order: OrderApi = {
    id: "",
    items: [],
    total: 0,
    status: "pending",
    address: "",
    email: "",
    phone: ""
  };
  protected _user: UserApi = { email: "", phone: "", address: "" };
  
  constructor(events: IEvents) {
    super({}, events);
  }

  get products(): ProductUI[] {
    return this._products;
  }

  get basket(): BasketItemUI[] {
    return this._basket;
  }

  get order(): OrderApi {
    return this._order;
  }

  setProducts(products: ProductUI[]) {
    this._products = products;
    this.emitChanges("products:updated", this._products);
  }

  getProductById(id: string): ProductUI | undefined {
    return this._products.find(product => product.id === id);
  }

  addItemToBasket(product: ProductUI) {
    const existingItem = this._basket.find(item => item.id === product.id);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        this._basket.push({ 
            id: product.id, 
            title: product.title, 
            price: product.price === 'Бесплатно' ? product.price : `${product.price} синапсов`,
            quantity: 1 
        });
    }
    this.events.emit('basket:update', {
        items: this._basket,
        total: this.getTotalPrice()
    });
  }

  removeItemFromBasket(productId: string) {
    this._basket = this._basket.filter(item => item.id !== productId);
    // При любом изменении корзины эмитим событие
    this.events.emit('basket:update', {
        items: this._basket,
        total: this.getTotalPrice()
    });
  }

  clearBasket() {
    this._basket = [];
    this.events.emit('basket:update', {
        items: [],
        total: this.getTotalPrice()
    });
  }

  getTotalPrice(): string {
    const total = this._basket.reduce((sum, item) => {
        // Извлекаем числовое значение из строки цены
        const price = parseFloat(item.price.replace(/[^\d.-]/g, ''));
        return sum + price * item.quantity;
    }, 0);
    
    return `${total.toFixed(2)} синапсов`;
  }

  setOrderData(data: Partial<OrderApi>) {
    this._order = { ...this._order, ...data };
    this.emitChanges("order:updated", this._order);
  }

  validateOrder(): string[] {
    const errors: string[] = [];
    
    // Проверка адреса
    if (!this._user.address) {
        errors.push('Не указан адрес');
    }
    
    // Проверка email
    if (!this._user.email) {
        errors.push('Email не может быть пустым');
    }
    
    // Проверка телефона
    if (!this._user.phone) {
        errors.push('Телефон не может быть пустым');
    }
    
    console.log('Validation with data:', {
        address: this._user.address,
        email: this._user.email,
        phone: this._user.phone,
        errors: errors
    });
    
    return errors;
  }

  getOrder(): OrderApi {
    return {
        id: this._order.id,
        total: this._basket.reduce((sum, item) => {
            const price = parseFloat(item.price.replace(/[^\d.-]/g, ''));
            return sum + price * item.quantity;
        }, 0),
        items: this._basket.map(item => ({
            productId: item.id,
            quantity: item.quantity
        })),
        status: "pending",
        payment: this._order.payment || 'card',
        address: this._user.address,
        email: this._user.email,
        phone: this._user.phone
    };
  }

  setOrderItems(items: BasketItemApi[]) {
    this._order.items = items.map(item => ({
        productId: String(item.productId), // Убедимся, что id - строка
        quantity: item.quantity
    }));
  }

  setPaymentType(payment: string) {
    this._order.payment = payment;
  }

  get user(): UserApi {
    return this._user;
  }

  setUserData(data: Partial<UserApi>) {
    if (data.email !== undefined || data.phone !== undefined || data.address !== undefined) {
        this._user = { 
            ...this._user, 
            ...data 
        };
        this.emitChanges("user:updated", this._user);
    }
  }
}