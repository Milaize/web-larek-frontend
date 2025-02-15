import { Component } from './base/Component';

export class GalleryView extends Component<HTMLElement[]> {
    constructor(container: HTMLElement) {
        super(container);
    }

    clearGallery(): void {
        this.container.innerHTML = '';
    }

    addCard(cardElement: HTMLElement): void {
        this.container.appendChild(cardElement);
    }

    renderCards(cards: HTMLElement[]): void {
        this.container.replaceChildren(...cards);
    }
} 