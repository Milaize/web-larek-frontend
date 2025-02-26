import { Component } from './base/Component';
import { ProductUI, BasketItemUI } from "../types/index";
import { ensureElement } from "../utils/utils";
import { IEvents } from "./base/events";

class Card extends Component<ProductUI> {
    protected _category: HTMLElement;
    protected _title: HTMLElement;
    protected _image: HTMLImageElement;
    protected _price: HTMLElement;
    protected _colors: Record<string, string> = {
        "софт-скил": "soft",
        "другое": "other",
        "дополнительное": "additional",
        "кнопка": "button",
        "хард-скил": "hard"
    };

    constructor(container: HTMLElement, onClick?: () => void) {
        super(container);
        this._category = ensureElement<HTMLElement>(".card__category", container);
        this._title = ensureElement<HTMLElement>(".card__title", container);
        this._image = ensureElement<HTMLImageElement>(".card__image", container);
        this._price = ensureElement<HTMLElement>(".card__price", container);

        if (onClick) {
            container.addEventListener("click", onClick);
        }
    }

    set category(value: string) {
        this.setText(this._category, value);
        this._category.className = `card__category card__category_${this._colors[value] || "default"}`;
    }

    set title(value: string) {
        this.setText(this._title, value);
    }

    set image(value: string) {
        this.setImage(this._image, value, this._title.textContent || "");
    }

    set price(value: string) {
        if (value === 'Бесценно') {
            this.setText(this._price, value);
        } else {
            this.setText(this._price, `${value} синапсов`);
        }
    }
}

class CardPreview extends Card {
    protected _text: HTMLElement;
    protected _button: HTMLButtonElement;

    constructor(container: HTMLElement, events: IEvents) {
        super(container);
        this._text = ensureElement<HTMLElement>(".card__text", container);
        this._button = ensureElement<HTMLButtonElement>(".card__button", container);

        this._button.addEventListener('click', () => {
            events.emit('card:add', this.data);
        });
    }

    set text(value: string) {
        this.setText(this._text, value);
    }

    private data: ProductUI;

    setData(product: ProductUI, isInBasket: boolean): void {
        this.data = product;
        this.title = product.title;
        this.image = product.image;
        this.text = product.description || 'Описание отсутствует';
        this.price = String(product.price);
        this.category = product.category;

        // Обновляем состояние кнопки
        if (isInBasket) {
            this._button.textContent = 'В корзине';
            this._button.disabled = true;
        } else {
            this._button.textContent = 'В корзину';
            this._button.disabled = false;
        }
    }
}

class CardBasket extends Component<BasketItemUI> {
    protected _index: HTMLElement;
    protected _title: HTMLElement;
    protected _price: HTMLElement;
    protected _button: HTMLElement;
    protected _item: BasketItemUI;

    constructor(container: HTMLElement, events: IEvents) {
        super(container);
        this._index = ensureElement<HTMLElement>(".basket__item-index", container);
        this._title = ensureElement<HTMLElement>(".card__title", container);
        this._price = ensureElement<HTMLElement>(".card__price", container);
        this._button = ensureElement<HTMLElement>(".basket__item-delete", container);

        this._button.addEventListener('click', () => {
            events.emit('card:remove', this._item);
        });
    }

    set index(value: number) {
        this.setText(this._index, value);
    }

    set title(value: string) {
        this.setText(this._title, value);
    }

    set price(value: string) {
        if (value === 'Бесценно') {
            this.setText(this._price, value);
        } else {
            this.setText(this._price, value);
        }
    }

    setData(item: BasketItemUI): void {
        this._item = item;
        this.title = item.title;
        this.price = item.price;
    }
}

export { Card, CardPreview, CardBasket };