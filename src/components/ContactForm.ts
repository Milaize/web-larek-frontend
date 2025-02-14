import { Form } from './common/Form';
import { IEvents } from './base/events';
import { ContactFormView } from '../types';
import { debounce } from '../utils/utils';
import { formatPhoneNumber } from '../utils/utils';

interface IContactFormData {
    email: string;
    phone: string;
}

export class ContactForm extends Form<IContactFormData> implements ContactFormView {
    protected _email: HTMLInputElement;
    protected _phone: HTMLInputElement;
    protected _submit: HTMLButtonElement;

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);

        this._email = container.querySelector('input[name="email"]');
        this._phone = container.querySelector('input[name="phone"]');
        this._submit = container.querySelector('button[type="submit"]');

        // Инициализируем начальные значения
        events.emit('contacts:field:change', { 
            field: 'email', 
            value: this._email.value.trim() 
        });
        events.emit('contacts:field:change', { 
            field: 'phone', 
            value: this._phone.value.trim() 
        });

        // Обработчики ввода с debounce
        const debouncedEmit = debounce((field: string, value: string) => {
            events.emit('contacts:field:change', { field, value });
        }, 300);

        this._email.addEventListener('input', () => {
            const value = this._email.value.trim();
            console.log('Email input:', value);
            debouncedEmit('email', value);
        });

        this._phone.addEventListener('input', () => {
            const value = this._phone.value.trim();
            console.log('Phone input:', value);
            debouncedEmit('phone', value);
        });

        // Обработчик отправки формы
        container.addEventListener('submit', (e: Event) => {
            e.preventDefault();
            if (this.validateForm()) {
                const formData = {
                    email: this._email.value.trim(),
                    phone: this._phone.value.trim()
                };
                console.log('Submitting form with data:', formData);
                events.emit('contacts:submit', formData);
            }
        });
    }

    public validateForm(): boolean {
        const errors: string[] = [];
        
        if (!this._email.value.trim()) {
            errors.push('Введите email');
        }
        
        if (!this._phone.value.trim()) {
            errors.push('Введите телефон');
        }

        this.valid = errors.length === 0;
        this.errors = errors.join('; ');
        
        // Явно управляем состоянием кнопки
        if (this._submit) {
            this._submit.disabled = !this.valid;
        }

        return this.valid;
    }

    get email(): string {
        return this._email.value;
    }

    set email(value: string) {
        this._email.value = value;
    }

    get phone(): string {
        return this._phone.value;
    }

    set phone(value: string) {
        this._phone.value = value;
    }
} 