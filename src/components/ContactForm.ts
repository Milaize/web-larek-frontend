import { Form } from './common/Form';
import { IEvents } from './base/events';

interface IContactFormData {
    email: string;
    phone: string;
}

export class ContactForm extends Form<IContactFormData> {
    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);
    }
} 