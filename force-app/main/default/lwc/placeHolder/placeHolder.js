import { LightningElement,api } from 'lwc';

import PLACEHOLDERURL from '@salesforce/resourceUrl/fortest1'
export default class PlaceHolder extends LightningElement {   

    @api displayText
    placeHolderUrl=PLACEHOLDERURL
}