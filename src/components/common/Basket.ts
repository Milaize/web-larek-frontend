import {Component} from "../base/Component";
import {createElement, ensureElement} from "../../utils/utils";
import {EventEmitter} from "../base/events";
import { BasketView, BasketItemUI } from "../../types/index";
import { cloneTemplate } from "../../utils/utils";
import { CardBasket } from "../Card";

export class Basket extends Component<BasketItemUI[]> implements BasketView {
    protected _list: HTMLElement;
    protected _total: HTMLElement;
    protected _button: HTMLButtonElement;
    protected _cardTemplate: HTMLTemplateElement;
  
    constructor(container: HTMLElement, protected events: EventEmitter) {
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
  
    renderBasket(items: BasketItemUI[], total: string): void {
      if (items.length) {
        this._list.replaceChildren(...items.map(item => {
          const card = cloneTemplate(this._cardTemplate);
          const cardItem = new CardBasket(card, this.events);
          cardItem.setData(item);
          return card;
        }));
        // Активируем кнопку только если есть товары
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
      // Явно деактивируем кнопку при пустой корзине
      this._button.disabled = true;
      this.setText(this._total, "0 синапсов");
    }
  
    protected createBasketItem(item: BasketItemUI): HTMLElement {
      const element = createElement<HTMLLIElement>('li', {
        className: 'basket__item card card_compact'
      });

      element.append(
        createElement<HTMLElement>('span', {
          className: 'basket__item-title',
          textContent: item.title
        }),
        createElement<HTMLElement>('span', {
          className: 'basket__item-price',
          textContent: item.price
        }),
        createElement<HTMLElement>('button', {
          className: 'basket__item-delete',
          innerHTML: '&times;'
        })
      );

      // Добавляем обработчик удаления
      const deleteButton = element.querySelector('.basket__item-delete');
      deleteButton.addEventListener('click', () => {
        this.events.emit('card:remove', item);
      });

      return element;
    }
  }
  