import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { OrderUI } from "../../types/index";

interface ISuccessActions {
    onClick: () => void;
}

export class SuccessMessageView extends Component<OrderUI> {
    protected _close: HTMLElement;
    protected _message: HTMLElement;

    constructor(container: HTMLElement, actions?: ISuccessActions) {
        super(container);

        this._close = ensureElement<HTMLElement>('.order-success__close', this.container);
        this._message = ensureElement<HTMLElement>('.order-success__description', this.container);

        if (actions?.onClick) {
            this._close.addEventListener('click', actions.onClick);
        }
    }

    render(order: Partial<OrderUI> = {}): HTMLElement {
        if (order.id && order.total) {
            this.setText(this._message, `Заказ №${order.id} на сумму ${order.total} успешно оформлен.`);
        }
        return this.container;
    }
}