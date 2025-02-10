import { Component } from '../base/Component';
import { IEvents } from '../base/events';
import { ensureElement } from '../../utils/utils';
import { Modal as IModal } from "../../types/index";

export class Modal extends Component<null> implements IModal {
    protected _closeButton: HTMLButtonElement;
    protected _content: HTMLElement;
    protected _title: HTMLElement;
  
    constructor(container: HTMLElement, protected events: IEvents) {
      super(container);
  
      this._closeButton = ensureElement<HTMLButtonElement>(".modal__close", container);
      this._content = ensureElement<HTMLElement>(".modal__content", container);
      this._title = ensureElement<HTMLElement>(".modal__title", container);
  
      this._closeButton.addEventListener("click", this.close.bind(this));
      this.container.addEventListener("click", this.close.bind(this));
      this._content.addEventListener("click", (event) => event.stopPropagation());
    }
  
    setTitle(title: string) {
      this._title.textContent = title;
    }
  
    open(content: HTMLElement) {
      this._content.replaceChildren(content);
      this.container.classList.add("modal_active");
      this.events.emit("modal:open");
    }
  
    close() {
      this.container.classList.remove("modal_active");
      this._content.innerHTML = "";
      this.events.emit("modal:close");
    }
  }
  