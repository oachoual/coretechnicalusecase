public with sharing class ActorController {

    @AuraEnabled(cacheable=true)
    public static List<Actor__c> getAllActors() {
        return [
            SELECT Id, Name
            FROM Actor__c
        ];
    }
}