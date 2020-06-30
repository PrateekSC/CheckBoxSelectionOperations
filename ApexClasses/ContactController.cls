public with sharing class ContactController {
    public ContactController() {

    }
    @AuraEnabled(cacheable=true)
    public static List<Contact> getContactList() {
        return [
            SELECT Id, Name, Title, Phone, Email
            FROM Contact
            WITH SECURITY_ENFORCED
            LIMIT 10
        ];
    }

    @AuraEnabled(cacheable=true)
    public static List<Contact> findContacts(String searchKey) {
        String key = '%' + searchKey + '%';
        return [
            SELECT Id, Name, Title, Phone, Email
            FROM Contact
            WHERE Name LIKE :key
            WITH SECURITY_ENFORCED
            LIMIT 10
        ];
    }

    @AuraEnabled(cacheable=false)
    public static List<MasterColors__c> findColors(String strInput) {
        String key = '%' + strInput + '%';
        return [
            SELECT value__c, label__c
            FROM MasterColors__c
            WHERE label__c LIKE :key
            WITH SECURITY_ENFORCED
            LIMIT 10
        ];
    }

}
