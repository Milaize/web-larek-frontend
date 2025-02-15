import {Component} from "../base/Component";
import {createElement, ensureElement} from "../../utils/utils";
import {EventEmitter} from "../base/events";
import { BasketView, BasketItemUI } from "../../types/index";
import { cloneTemplate } from "../../utils/utils";
import { CardBasket } from "../Card";
import { IEvents } from "../base/events";

export class Basket extends Component<BasketItemUI[]> implements BasketView {
    protected _list: HTMLElement;
    protected _total: HTMLElement;
    protected _button: HTMLButtonElement;
    protected _cardTemplate: HTMLTemplateElement;
  
    constructor(container: HTMLElement, protected events: IEvents) {
      super(container);
      this._list = ensureElement<HTMLElement>(".basket__list", this.container);
      this._button = ensureElement<HTMLButtonElement>(".basket__button", this.container);
      this._total = ensureElement<HTMLElement>(".basket__price", this.container);
      this._cardTemplate = ensureElement<HTMLTemplateElement>("#card-basket");
  
      // Изначально деактивируем кнопку
      this._button.disabled = true;

      this._button.addEventListener("click", () => {
        events.emit("order:open");
      });
    }
  
    renderBasket(items: HTMLElement[], total: string): void {
      if (items.length) {
        this._list.replaceChildren(...items);
        
        // Проверяем, есть ли "бесценные" товары
        const hasPricelessItems = items.some(item => 
          item.querySelector('.card__price')?.textContent === 'Бесценно'
        );
        
        // Активируем кнопку только если нет "бесценных" товаров
        this._button.disabled = hasPricelessItems;
        if (hasPricelessItems) {
          this._button.title = 'Бесценные товары нельзя заказать';
        } else {
          this._button.title = '';
        }
        
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
      // Явно деактивируем кнопку при пустой корзине
      this._button.disabled = true;
      this._button.title = '';
      this.setText(this._total, "0 синапсов");
    }
}
  