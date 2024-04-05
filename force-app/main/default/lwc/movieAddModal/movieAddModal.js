import LightningModal from 'lightning/modal';

export default class MovieAddModal extends LightningModal {
    
    handleMovieSave() {
        this.close();
    }
}