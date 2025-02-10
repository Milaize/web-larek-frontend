import { Model } from "./base/Model";
import { IEvents } from "./base/events";
import { ProductUI, BasketItemUI, OrderUI, UserAPI, OrderAPI } from "../types/index";

export class AppState extends Model<AppState> {
  private products: ProductUI[] = [];
  private basket: BasketItemUI[] = [];
  private order: OrderAPI = { id: "", items: [], total: 0, status: "pending" };
  private user: UserAPI = { email: "", phone: "", address: "" };
  
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

  setOrderData(user: UserAPI) {
    this.user = user;
    this.emitChanges("order:userDataUpdated", this.user);
  }

  validateOrder(): string[] {
    const errors: string[] = [];
    if (!this.user.email.includes("@")) errors.push("Некорректный email");
    if (this.user.phone.length < 10) errors.push("Некорректный номер телефона");
    if (!this.user.address) errors.push("Адрес не должен быть пустым");
    return errors;
  }

  getOrder(): OrderUI {
    return {
      id: this.order.id,
      total: this.getTotalPrice(),
      items: this.basket,
      status: this.order.status,
    };
  }
}