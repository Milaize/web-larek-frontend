import { Component } from './base/Component';
import { IEvents } from './base/events';
import { ensureElement } from '../utils/utils';

/*
  * Интерфейс описывающий страницу
  * */
interface IPage {
  // Счётчик товаров в корзине
  counter: number;

  // Отключает прокрутку страницы
  locked: boolean;
}

/*
  * Класс, описывающий главную страницу
  * */
export class Page extends Component<IPage> {
  // Ссылки на внутренние элементы
  protected _counter: HTMLElement;
  protected _wrapper: HTMLElement;
  protected _basket: HTMLButtonElement;

  // Конструктор принимает родительский элемент и обработчик событий
  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this._counter = ensureElement<HTMLElement>('.header__basket-counter');
    this._wrapper = ensureElement<HTMLElement>('.page__wrapper');
    this._basket = ensureElement<HTMLButtonElement>('.header__basket');

    // Добавляем обработчик клика на корзину
    this._basket.addEventListener('click', () => {
      this.events.emit('basket:open');
    });

    // Подписываемся на обновление корзины
    this.events.on('basket:update', (payload: { items: unknown[], total: string }) => {
      this.counter = payload.items.length;
      this._basket.disabled = payload.items.length === 0;
    });
  }

  // Сеттер для счётчика товаров в корзине
  set counter(value: number) {
    this.setText(this._counter, String(value));
  }

  // Сеттер для блока прокрутки
  set locked(value: boolean) {
    if (value) {
      this._wrapper.classList.add('page__wrapper_locked');
    } else {
      this._wrapper.classList.remove('page__wrapper_locked');
    }
  }
}