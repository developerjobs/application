Help : 

I - Databases

3 configuration de databases

// test local
1) db local avec mamp ou xamp ou wamp (classique)


// test sur db distant
2) db distant (SqlCloud sur Gcloud) test (instance_namedev);


// db de prod (attention a bien l'activé cette configuration avant de deploy!)
3) db distance (production) (instance_name) => sans dev a la fin


// Utiliser les DBS 

1. classique juste ouvrir mamp ou wamp 

2. 1) lancer le proxy (racine du projet la command) : (DB test distant + PRODUCTION)

  ./cloud_sql_proxy -instances=<FULL_INSTANCE_NAME_WITH_ZONE_AND_ID>=tcp:3306   // si erreur de port on peut le changer ici
   
   
   Une fois le proxy ouvert, se connecter a mysql : $ mysql -u <user_created_in_sqlcloud> -h 127.0.0.1 -p
   
   (Sur windows si on a wamp => E:\wamp64\bin\mysql\mysql5.7.19\bin> ./mysql -u sylvain -h 127.0.0.1 -p)
   
   
   
   
// Deploiement + base de données de dev / production CLOUD SIDE

1) Set le projet : gcloud config set project PROJECT_ID (unset =>gcloud config unset project)

Gcloud configurer via app.yaml (node.js) va automatiquement lire la command dans le package.json npm run start

Cependant, nous utilisons TYPESCRIPT il faut donc au préalable build le projet, pour eviter des erreurs (en effet, les commands tsc ou bien ts-node ne sont pas dispo sur l'instance cloud)

2 méthodes : 
Build à la fin 
Avant de build bien vérifier que la bonne configuration est choisi pour la connection à la db /config/db.ts
(en effet une chaine de connection ne fonctionnera pas avec instance sql cloud, bien chargé la deuxieme manière et choisir db dev ou de prod)
=> npm run build 
=> gcloud app deploy 

OU directement on peut faire 

npm run prod (juste : npm run build && gcloud app deploy)


la commande npm run start lance simplement le server node compilé (node ./dist/server.js, .dist étant le dossier de compilation out par defaut de tsc)

  




