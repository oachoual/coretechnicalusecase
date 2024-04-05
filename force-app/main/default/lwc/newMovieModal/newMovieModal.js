import { LightningElement, wire } from 'lwc';
import { createRecord } from 'lightning/uiRecordApi';
import getAllActors from '@salesforce/apex/ActorController.getAllActors';

export default class NewMovieModal extends LightningElement {
    
    actors;

    selectedActorControls = [{index: 0, value: ''}];
    
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
}