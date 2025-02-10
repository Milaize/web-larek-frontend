import { Component } from './base/Component';
import { ProductUI, BasketItemUI} from "../types/index";
import { ensureElement } from "../utils/utils";


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
        this.setText(this._price, value ? `${value} синапсов` : "Бесценно");
    }
}

class CardPreview extends Card {
    protected _text: HTMLElement;
    protected _button: HTMLElement;

    constructor(container: HTMLElement, onClick?: () => void) {
        super(container, onClick);
        this._text = ensureElement<HTMLElement>(".card__text", container);
        this._button = ensureElement<HTMLElement>(".card__button", container);

        if (onClick) {
            container.removeEventListener("click", onClick);
            this._button.addEventListener("click", onClick);
        }
    }

    set text(value: string) {
        this.setText(this._text, value);
    }
}

class CardBasket extends Component<BasketItemUI> {
    protected _index: HTMLElement;
    protected _title: HTMLElement;
    protected _price: HTMLElement;
    protected _button: HTMLElement;

    constructor(container: HTMLElement, onClick?: () => void) {
        super(container);
        this._index = ensureElement<HTMLElement>(".basket__item-index", container);
        this._title = ensureElement<HTMLElement>(".card__title", container);
        this._price = ensureElement<HTMLElement>(".card__price", container);
        this._button = ensureElement<HTMLElement>(".card__button", container);

        if (onClick) {
            this._button.addEventListener("click", onClick);
        }
    }

    set index(value: number) {
        this.setText(this._index, value);
    }

    set title(value: string) {
        this.setText(this._title, value);
    }

    set price(value: string) {
        this.setText(this._price, value ? `${value} синапсов` : "Бесценно");
    }
}

export { Card, CardPreview, CardBasket };