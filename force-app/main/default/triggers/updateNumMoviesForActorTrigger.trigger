trigger updateNumMoviesForActorTrigger on MovieActor__c (after insert) {
    Map<ID, Integer> actorMovies = new Map<ID, Integer>();

    for (AggregateResult result: [SELECT Actor__c actor, COUNT(Id) numMovies
                                    FROM MovieActor__c
                                    WHERE Id IN :Trigger.new
                                    GROUP BY Actor__c]
    ) {
        actorMovies.put((ID)result.get('actor'), (Integer)result.get('numMovies'));
    }
    
    List<Actor__c> updateActors = [
        SELECT Id, 
               Number_of_Movies__c 
        FROM Actor__c
        WHERE Id IN :actorMovies.keySet()
    ];

    for (Actor__c actor: updateActors) {
        actor.Number_of_Movies__c += actorMovies.get(actor.Id);
    }

    update updateActors;
}