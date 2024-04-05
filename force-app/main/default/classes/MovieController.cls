public with sharing class MovieController {

    @AuraEnabled(cacheable=true)
    public static List<Movie__c> getMovies(String filter){
        String formattedFilter = '%' + filter + '%';
        return [
            SELECT Id,
                   Name,
                   Category__c,
                   Release_date__c
            FROM   Movie__c
            WHERE  Name LIKE :formattedFilter
        ];
    }

    @AuraEnabled(cacheable=true)
    public static Movie__c getMovieDetail(ID movieId){
        return [
            SELECT Name,
                   Release_Date__c,
                   Category__c,
                   (SELECT Actor__r.Name FROM MovieActors__r)
            FROM Movie__c
            WHERE Id = :movieId
            LIMIT 1
        ];
    }
    
    @AuraEnabled
    public static void saveMovie(
        String movieName,
        Date releaseDate,
        String category,
        List<ID> actors
    ) {
        Movie__c movie = new Movie__c(
            Name=movieName,
            Release_date__c=releaseDate,
            Category__c=category
        );

        insert movie;

        List<MovieActor__c> movieActors = new List<MovieActor__c>();

        for(ID actorId: actors) {
            MovieActor__c movieActor = new MovieActor__c(Name='Movie Actor Junc',Actor__c=actorId, Movie__c=movie.Id);
            movieActors.add(movieActor);
        }

        insert movieActors;
    }
}