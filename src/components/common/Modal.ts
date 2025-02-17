import { Component } from '../base/Component';
import { IEvents } from '../base/events';
import { ensureElement } from '../../utils/utils';
import { ModalData } from "../../types/index";

export class Modal extends Component<ModalData>  {
  protected _closeButton: HTMLButtonElement;
  protected _content: HTMLElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this._closeButton = ensureElement<HTMLButtonElement>(".modal__close", container);
    this._content = ensureElement<HTMLElement>(".modal__content", container);

    this._closeButton.addEventListener("click", this.close.bind(this));
    this.container.addEventListener("click", this.close.bind(this));
    this._content.addEventListener("click", (event) => event.stopPropagation());
  }

  open(content: HTMLElement) {
    this._content.replaceChildren(content);
    this.container.classList.add("modal_active");
    this.events.emit("modal:open");
  }

  close() {
    // Проверяем, является ли текущее окно окном успешного заказа
    const isSuccessModal = this._content.querySelector('.order-success');
    
    this.container.classList.remove("modal_active");
    this._content.innerHTML = "";
    
    // Если закрываем окно успешного заказа, эмитим событие order:success
    if (isSuccessModal) {
      this.events.emit("order:success");
    }
    
    this.events.emit("modal:close");
  }
}

  