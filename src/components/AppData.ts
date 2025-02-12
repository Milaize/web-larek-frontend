import { Model } from "./base/Model";
import { IEvents } from "./base/events";
import { ProductUI, BasketItemUI, OrderUI, UserApi, OrderApi, BasketItemApi } from "../types/index";

export class AppData extends Model<AppData> {
  private products: ProductUI[] = [];
  private basket: BasketItemUI[] = [];
  private order: OrderApi = { id: "", items: [], total: 0, status: "pending" };
  private user: UserApi = { email: "", phone: "", address: "" };
  
  constructor(events: IEvents) {
    super({}, events);
  }

  setProducts(products: ProductUI[]) {
    this.products = products;
    this.emitChanges("products:updated", this.products);
  }

  getProductById(id: string): ProductUI | undefined {
    return this.products.find(product => product.id === id);
  }

  getBasket(): BasketItemUI[] {
    return this.basket;
  }

  addItemToBasket(product: ProductUI) {
    const existingItem = this.basket.find(item => item.id === product.id);
    if (existingItem) {
      existingItem.quantity++;
    } else {
      this.basket.push({ id: product.id, title: product.title, price: product.price, quantity: 1 });
    }
    this.emitChanges("basket:updated", this.basket);
  }

  removeItemFromBasket(productId: string) {
    this.basket = this.basket.filter(item => item.id !== productId);
    this.emitChanges("basket:updated", this.basket);
  }

  clearBasket() {
    this.basket = [];
    this.emitChanges("basket:updated", this.basket);
  }

  getTotalPrice(): string {
    return this.basket.reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0).toFixed(2);
  }

  setOrderData(data: Partial<OrderApi>) {
    this.order = { ...this.order, ...data };
    this.emitChanges("order:updated", this.order);
  }

  validateOrder(): string[] {
    const errors: string[] = [];
    if (!this.user.email.includes("@")) errors.push("Некорректный email");
    if (this.user.phone.length < 10) errors.push("Некорректный номер телефона");
    if (!this.user.address) errors.push("Адрес не должен быть пустым");
    return errors;
  }

  getOrder(): OrderApi {
    return {
        id: this.order.id,
        total: parseFloat(this.getTotalPrice()),
        items: this.basket.map(item => ({
            productId: item.id,
            quantity: item.quantity
        })),
        status: this.order.status,
        payment: this.order.payment
    };
  }

  setOrderItems(items: BasketItemApi[]) {
    this.order.items = items;
  }

  setPaymentType(payment: string) {
    this.order.payment = payment;
  }
}