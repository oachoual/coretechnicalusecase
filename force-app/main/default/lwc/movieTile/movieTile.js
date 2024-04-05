import { LightningElement, api } from 'lwc';

export default class MovieTile extends LightningElement {

    @api
    movie;

    handleSelect() {
        this.dispatchEvent(new CustomEvent('movieselect', {
            detail: this.movie.Id
        }));
    }

    get name() {
        return this.movie.Name;
    }
}