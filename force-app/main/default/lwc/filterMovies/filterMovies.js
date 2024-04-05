import { LightningElement } from 'lwc';

export default class FilterMovies extends LightningElement {
    searchTerm = '';
    timeout;

    handleChange(e) {
        this.searchTerm = e.detail.value;
        this.fireCustomEvent();
    }

    fireCustomEvent() {
        if (this.timeout) {
            clearTimeout(this.timeout);
        }
        this.timeout = setTimeout(() => {
            this.dispatchEvent(new CustomEvent('filterchange', {
                detail: this.searchTerm
            }, 500));
        });
    }
}