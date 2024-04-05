trigger updateMaleFemalePercentageTrigger on MovieActor__c (after insert) {
    List<MovieActor__c> movieActors = [SELECT Actor__r.Gender__c, 
                                              Movie__c 
                                        FROM MovieActor__c 
                                        WHERE Id IN :Trigger.new];

    Map<ID, Integer> countActors = new Map<ID, Integer>();
    Map<ID, Integer> countMales = new Map<ID, Integer>();
    Map<ID, Integer> countFemales = new Map<ID, Integer>();

    for (MovieActor__c movieActor: movieActors) {

        ID movieId = movieActor.Movie__c;
        String gender = movieActor.Actor__r.Gender__c;

        countActors.put(movieId, countActors.containsKey(movieId) ? countActors.get(movieId) + 1 : 1);

        switch on gender {
                when 'Male' {
                    countMales.put(movieId, countMales.containsKey(movieId) ? countMales.get(movieId) + 1 : 1);
                }
                when 'Female' {
                    countFemales.put(movieId, countFemales.containsKey(movieId) ? countFemales.get(movieId) + 1 : 1);
                }
                when else {
                }
        }
    }

    List<Movie__c> updateMovies = [SELECT MaleActorsPercentage__c,
                                          FemaleActorsPercentage__c
                                    FROM Movie__c
                                    WHERE Id IN (SELECT Movie__c FROM MovieActor__c WHERE Id IN :Trigger.new)];

    for (Movie__c movie: updateMovies) {
        movie.MaleActorsPercentage__c = ((countMales.containsKey(movie.Id) ? countMales.get(movie.Id) : 0) / (Decimal)countActors.get(movie.Id)) * 100;
        movie.FemaleActorsPercentage__c = ((countFemales.containsKey(movie.Id) ? countFemales.get(movie.Id) : 0) / (Decimal)countActors.get(movie.Id)) * 100;
    }

    update updateMovies;
}