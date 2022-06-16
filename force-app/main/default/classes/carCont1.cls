
public with sharing class carCont1 {
    //wrapper class
    public class ValuesObj {
        @AuraEnabled
        public String searchValue {get;set;}
        @AuraEnabled
        public Decimal sliderValue {get;set;}     
        @AuraEnabled
        public String[] categories {get;set;}
        @AuraEnabled
        public String[] makeType {get;set;}
    }
    @AuraEnabled(Cacheable=true)
    public static List<Car__c> getCars(ValuesObj values){
        String search, whereClause ='';
        Decimal sliderValue;
        String[] categories, makeType, criteria = new List<String>{};
        if(values !=null){
            sliderValue = values.sliderValue;
            categories = values.categories;
            makeType = values.makeType;
            if(!String.isEmpty(values.searchValue)){
                search = '%'+values.searchValue + '%';
                criteria.add('Name LIKE: search');
            }
            if(values.sliderValue >= 0){
                criteria.add('MSRP__c <= :sliderValue');
            }
            if(values.categories != null){
                criteria.add('Category__c IN :categories');
            }
            if(values.makeType != null){
                criteria.add('Make__c IN :makeType');
            }
            if(criteria.size()>0){
                whereClause =  ' WHERE ' + String.join(criteria, ' AND ');
            }
        }
        String query = 'SELECT Id, Name, MSRP__c, Description__c,Category__c, Picture_URL__c FROM Car__c  ' + whereClause + ' WITH SECURITY_ENFORCED' + ' ORDER BY Name';
        return Database.query(query);
    }
    @AuraEnabled(cacheable=true)
    public static list<Car__c> fetchSimilar(Id carId,string[] makeType){
        return [select Id,name,Make__c,Fuel_Type__c,MSRP__c,category__c,Picture_URL__c from Car__c where Make__c IN:makeType  and Id !=:carId ];
    }
}
