import { LightningElement, wire } from 'lwc';
import getCars from '@salesforce/apex/carCont1.getCars'

//message channel
import SEARCH_DATA from "@salesforce/messageChannel/searchData__c"
//lms
import { publish,MessageContext, subscribe, unsubscribe } from 'lightning/messageService';

export default class CarTileView extends LightningElement {

    carData=[]
    error
    carFilterSubscription
    search={}
    //load context for lms
    @wire(MessageContext)
    msgContext

    @wire(getCars,{values:'$search'})
    carObjData({data,error}){
        if(data){
            console.log(data)
            this.carData=data
        }
        if(error){
            this.error=error
            console.error(error)
        }

    }
    connectedCallback(){
        this.subscribeLms()
    }
    subscribeLms(){
        this.carFilterSubscription=subscribe(this.msgContext,SEARCH_DATA,(message)=>this.handleFilterChanges(message))
    }
    disconnectedCallback(){
        unsubscribe(this.carFilterSubscription)
        this.carFilterSubscription=null
    }

    handleFilterChanges(message){
        console.table(message.lmsData)
        this.search={...message.lmsData}
    }
    handleImgClicked(evt){
        console.log('selected car id',evt.detail)

        publish(this.msgContext,SEARCH_DATA,{
            carId:evt.detail
        })
    }

}