import { LightningElement, api } from 'lwc';

export default class ActorSelect extends LightningElement {

    _actorFormattedList;

    pristine = true;

    @api
    selectVal;

    @api
    isnew;

    @api
    index;

    @api
    get actorlist() {
        return this._actorFormattedList;
    }

    set actorlist(value) {
        this._actorFormattedList = [{label: '--None--', value: ''}].concat(value.map(({Id, Name}) => ({label: Name, value: Id})))
    }

    handleChange(event) {
        this.pristine = false;
        this.selectVal = event.detail.value;

        this.dispatchEvent(new CustomEvent('actorselect', {
            detail: { index: this.index, value: event.detail.value }
        }));
    }

    handleAdd() {
        this.dispatchEvent(new CustomEvent('actoradd'));
    }

    handleDelete() {
        this.dispatchEvent(new CustomEvent('actordelete', {
            detail: this.index
        }));
    }

}