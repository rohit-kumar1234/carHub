import { LightningElement, wire } from 'lwc';

import MAKE_FLD from '@salesforce/schema/Car__c.Make__c'
import NAME_FLD from '@salesforce/schema/Car__c.Name'
import CATEGORY_FLD from '@salesforce/schema/Car__c.Category__c'
import SEATS_FLD from '@salesforce/schema/Car__c.Seats__c'
import CONTROL_FLD from '@salesforce/schema/Car__c.Control__c'
import FUEL_TYPE_FLD from '@salesforce/schema/Car__c.Fuel_Type__c'
import MSRP_FLD from '@salesforce/schema/Car__c.MSRP__c'
import PICTURE_URL_FLD from '@salesforce/schema/Car__c.Picture_URL__c'

import CAR_OBJ from '@salesforce/schema/Car__c'

import { getFieldValue } from 'lightning/uiRecordApi';

import SEARCH_DATA from '@salesforce/messageChannel/searchData__c'
import { MessageContext,subscribe, unsubscribe } from 'lightning/messageService';

import {NavigationMixin} from 'lightning/navigation'
 
export default class CarDetailed extends NavigationMixin(LightningElement) {
    makeField=MAKE_FLD
    nameField=NAME_FLD
    categoryField=CATEGORY_FLD
    seatField=SEATS_FLD
    controlField=CONTROL_FLD
    fueltypeField=FUEL_TYPE_FLD
    msrpField=MSRP_FLD
    pictureField=PICTURE_URL_FLD

    carName
    pictureUrl 
    recordId
    carSelectionSubscription

    @wire(MessageContext)
    msgContext

    handleLoad(evt){
       // console.log('1',evt)
        const {records} =evt.detail
       // console.log('2',evt.detail.records)
        const recordData=records[this.recordId]
       // console.log('3',recordData)
        this.carName=getFieldValue(recordData,NAME_FLD)
        this.pictureUrl=getFieldValue(recordData,PICTURE_URL_FLD)

    }
    connectedCallback(){
        this.subscribeForCarId()
    }
         subscribeForCarId(){
        this.carSelectionSubscription=subscribe(this.msgContext,SEARCH_DATA,(msg)=>this.handleCarSelected(msg))

         }
          handleCarSelected(msg){
            console.log(msg)
        this.recordId=msg.carId 
         }

    disconnectedCallback(){
        unsubscribe(this.carSelectionSubscription)
        this.carSelectionSubscription=null
    }

    handleIconClick(){
        this[NavigationMixin.navigate]({
            type:'standard__recordPage',
            attributes:{
                recordId:this.recordId,
                objectApiName:CAR_OBJ.objectApiName,
                actionName:'view'
            }
        })
    }
}