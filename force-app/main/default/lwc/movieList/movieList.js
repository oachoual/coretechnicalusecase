import { LightningElement, wire } from 'lwc';
import MovieAddModal from 'c/movieAddModal';
import getMovies from '@salesforce/apex/MovieController.getMovies';
import { publish, subscribe, MessageContext } from 'lightning/messageService';
import MOVIESELECTEDMC from '@salesforce/messageChannel/MovieSelected__c';

export default class MovieList extends LightningElement {

    filter = '';

    @wire(getMovies, { filter: '$filter' })
    movies;

    @wire(MessageContext)
    messageContext;

    handleMovieSelect(e) {
        console.log('selected moveie with id ' + e.detail);
        const message = { movieId: e.detail };
        publish(this.messageContext, MOVIESELECTEDMC, message);
    }

    handleFilterChange(e) {
        this.filter = e.detail;
    }

    async openModal() {
        const result = await MovieAddModal.open();
    }
}