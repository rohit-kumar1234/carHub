//message channel
import SEARCH_DATA from '@salesforce/messageChannel/searchData__c';
import CAR_OBJ from '@salesforce/schema/Car__c';
import CATEGORY_FIELD from '@salesforce/schema/Car__c.Category__c';
import MAKE_FIELD from '@salesforce/schema/Car__c.Make__c'
//lms
import { MessageContext, publish } from 'lightning/messageService';
import { getObjectInfo, getPicklistValues, getPicklistValuesByRecordType } from 'lightning/uiObjectInfoApi';
import { LightningElement, wire } from 'lwc';


const ERROR_TEXT ={
                        categoryError:'Error loading Categories',
                        makeError:'Error loading make type'
                    }

export default class CarFilter extends LightningElement {

    errorText=ERROR_TEXT
    makeArray
    categoryArray
    timer

    valueSet={
        searchValue:'',
        sliderValue:500000,
    }
    //load context for LMS
    @wire(MessageContext)
    msgContext

    @wire(getObjectInfo,{objectApiName:CAR_OBJ})
    carInfo
    
    @wire(getPicklistValues,{recordTypeId:'$carInfo.data.defaultRecordTypeId',fieldApiName:CATEGORY_FIELD})
    categoryPickVals

    @wire(getPicklistValues, {
        recordTypeId:'$carInfo.data.defaultRecordTypeId',
        fieldApiName:MAKE_FIELD
    })makePickVals

    @wire(getPicklistValuesByRecordType,{objectApiName:CAR_OBJ,recordTypeId:'$carInfo.data.defaultRecordTypeId'})
    carpicklists({data,error}){
        if(data){
            console.log('1')
            console.log(data)
           this.makeArray=data.picklistFieldValues.Make__c.values
           this.categoryArray=data.picklistFieldValues.Category__c.values
            
            
        }
        if(error){
            console.error(error)
        }
    } 
    
    
   /* catArray=
    makeArray=this.carpicklists.data.picklistFieldValues.Make__c.values*/

    

    handleSearch(evt){
        this.valueSet={...this.valueSet,'searchValue':evt.target.value}
        console.log(evt.target.value)
       /* console.log(this.makeArray)
        console.table(this.catArray)
        */
       
        this.publishLms()
    }
    handleSlider(evt){
        this.valueSet={...this.valueSet,'sliderValue':evt.target.value}
        console.log(evt.target.value)
       console.log(this.carpicklists.data)
        this.publishLms()
    }
    
    handleCheckbox(event){
        console.log('yet to enter if')
        console.log(event.target.dataset)
        if(!this.valueSet.makeType){
            console.log(this.valueSet)
            console.log('entered if')
            const makeType = this.makeArray.map(item=>item.value)
            const categories = this.categoryArray.map(item=>item.value)
            this.valueSet = {...this.valueSet, categories, makeType}
         }
        console.log('end of 1st if')
        console.log(this.valueSet)
        const {name, value} = event.target.dataset
       
        console.log("name", name)
        console.log("value", value)
       
        if(event.target.checked){
            console.log('enter 2nd if')
            if(!this.valueSet[name].includes(value)){
                console.log('enter 3rd if')
                this.valueSet[name] = [...this.valueSet[name], value]
            }
        } 
        else {
            console.log('enter 4th if')
            this.valueSet[name]=  this.valueSet[name].filter(item=>item !==value)
        }
        console.log(this.valueSet)
        this.publishLms()
    }

    publishLms(){
        window.clearTimeout(this.timer)
        this.timer=window.setTimeout(()=>{
            publish(this.msgContext,SEARCH_DATA,{lmsData:this.valueSet})
        },400)
    }
}