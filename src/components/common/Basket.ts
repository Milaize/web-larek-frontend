import {Component} from "../base/Component";
import {createElement, ensureElement} from "../../utils/utils";
import {EventEmitter} from "../base/events";
import { BasketView, BasketItemUI } from "../../types/index";

export class Basket extends Component<BasketItemUI[]> implements BasketView {
    protected _list: HTMLElement;
    protected _total: HTMLElement;
    protected _button: HTMLButtonElement;
  
    constructor(container: HTMLElement, protected events: EventEmitter) {
      super(container);
      this._list = ensureElement<HTMLElement>(".basket__list", this.container);
      this._button = ensureElement<HTMLButtonElement>(".basket__button", this.container);
      this._total = ensureElement<HTMLElement>(".basket__price", this.container);
  
      this._button.addEventListener("click", () => {
        events.emit("order:open");
      });
    }
  
    renderBasket(items: BasketItemUI[], total: string): void {
      if (items.length) {
        this._list.replaceChildren(...items.map(this.createBasketItem));
        this._button.disabled = false;
        this.setText(this._total, total);
      } else {
        this.showEmptyBasketMessage();
      }
    }
  
    showEmptyBasketMessage(): void {
      this._list.replaceChildren(
        createElement<HTMLParagraphElement>("p", {
          textContent: "Корзина пуста",
        })
      );
      this._button.disabled = true;
      this.setText(this._total, "0 синапсов");
    }
  
    private createBasketItem(item: BasketItemUI): HTMLElement {
      const element = createElement<HTMLDivElement>("div", {
        className: "basket__item",
      });
      element.append(
        createElement<HTMLSpanElement>("span", { textContent: item.title }),
        createElement<HTMLSpanElement>("span", { textContent: item.price }),
        createElement<HTMLSpanElement>("span", { textContent: `x${item.quantity}` })
      );
      return element;
    }
  }
  