### gradle 
- grl bootRun / build / 

### curl 
- curl -v -i -X POST -H "Content-Type: application/json" -H "Application/json" -d  '{"name":"Jeff Miller","email":"jeff@bikes.com","phone":"328-443-5555","model":"Globo MTB 29 Full Suspension","purchasePrice":1100.00,"purchaseDate":"2013-05-31T22:00:00.000+0000","contact":true}' http://localhost:8080/api/bikes/  | json_pp
- curl -v -X GET http://localhost:8080/api/bikes | json_pp

###
