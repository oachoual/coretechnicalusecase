import { LightningElement, wire } from 'lwc';
import { getObjectInfo, getPicklistValues } from 'lightning/uiObjectInfoApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import saveMovie from '@salesforce/apex/MovieController.saveMovie';
import getAllActors from '@salesforce/apex/ActorController.getAllActors';
import MOVIE_OBJECT from '@salesforce/schema/Movie__c';
import CATEGORY_FIELD from '@salesforce/schema/Movie__c.Category__c';

export default class AddMovie extends LightningElement {

    categories;
    movieName;
    releaseDate;
    category;
    actors;

    selectedActorControls = [{index: 0, value: ''}];

    @wire(getObjectInfo, { objectApiName: MOVIE_OBJECT })
    objectInfo;

    @wire(
        getPicklistValues,
        {
            recordTypeId: '$objectInfo.data.defaultRecordTypeId',
            fieldApiName: CATEGORY_FIELD
        }
    )
    wiredCategories({error, data}) {
        if (data) {
            this.categories = data.values.map(({value, label}) => ({value, label}));
            this.category = this.categories[0].value;
        }
    }
    
    @wire(getAllActors)
    wiredActors({ error, data}) {
        if (data) {
            this.actors = data;
        }
    }

    handleActorSelect({detail}) {
        const control = this.selectedActorControls.find((control) => control.index === detail.index);
        if (control) {
            control.value = detail.value;
        }
    }

    handleActorAdd() {
        this.selectedActorControls = [
            ...this.selectedActorControls, 
            {
                index: this.selectedActorControls[this.selectedActorControls.length-1].index + 1, 
                value: ''
            }
        ];
    }

    handleActorDelete({detail}) {
        this.selectedActorControls = this.selectedActorControls.filter((control) => control.index !== detail);
    }

    showSuccessToast() {
        const event = new ShowToastEvent({
            title: 'Success',
            message: 'Sucess',
            variant: 'success'
        });
        this.dispatchEvent(event);
    }

    resetFormFields() {
        this.movieName = '';
        this.releaseDate = '';
        this.selectedActorControls = [{index: 0, value: ''}];
    }

    handleCategoryChange(e) {
        this.category = e.detail.value;
    }

    handleNameChange(e) {
        this.movieName = e.detail.value;
    }

    handleDateChange(e) {
        this.releaseDate = e.detail.value;
    }

    handleSubmit() {
        const actors = this.selectedActorControls.filter((a) => a !== '').map(({value}) => value);
        saveMovie({
            movieName: this.movieName, 
            releaseDate: this.releaseDate, 
            category: this.category,
            actors
        })
        .then((recordId) => {
            this.showSuccessToast();
            this.resetFormFields();
            this.dispatchEvent(new CustomEvent('moviesave'));
        });
    }

}