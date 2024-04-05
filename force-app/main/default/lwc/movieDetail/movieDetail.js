import { LightningElement, wire } from 'lwc';
import { getFieldValue, getRecord } from 'lightning/uiRecordApi';
import {
    subscribe,
    unsubscribe,
    MessageContext
} from 'lightning/messageService';
import getMovieDetail from '@salesforce/apex/MovieController.getMovieDetail';
import NAME_FIELD from '@salesforce/schema/Movie__c.Name';
import MOVIESELECTEDMC from '@salesforce/messageChannel/MovieSelected__c';

export default class MovieDetail extends LightningElement {

    movieId;
    subscription;
    movie;
    error;

    @wire(getMovieDetail, {movieId: '$movieId'})
    movie;

    @wire(MessageContext)
    messageContext;

    get name() {
        return this.movie.data.Name;
    }

    get releaseDate() {
        return this.movie.data.Release_Date__c;
    }

    get category() {
        return this.movie.data.Category__c;
    }

    get actors() {
        return this.movie.data.MovieActors__r.map(({Actor__r}) => Actor__r.Name);
    }

    handleMovieSelected(message) {
        this.movieId = message.movieId;
        console.log(message.movieId);
    }

    connectedCallback() {
        this.subscription = subscribe(
            this.messageContext,
            MOVIESELECTEDMC,
            (message) => {
                this.handleMovieSelected(message);
            }
        );
    }

    disconnectedCallback() {
        unsubscribe(this.subscription);
        this.subscription = null;
    }
}