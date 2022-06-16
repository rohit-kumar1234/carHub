import { LightningElement,api } from 'lwc';

export default class CarTileChild extends LightningElement {
    @api carRecord={}

    handleImgClick(){
        console.log('1,')
        this.dispatchEvent(new CustomEvent('imgclick',{
            detail:this.carRecord.Id
        }))

    }
}