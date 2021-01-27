arr_layers_all=[
{"title":"farmàcies","feature_color":"#f5874c","api_url":url_base_opendata_bcn,"api_id":"7d02a5a0-5339-4289-bc6b-7260484ff435","api_limit":"2000","api_fields":["EQUIPAMENT"],"api_rule_color":"","api_geo_type":"Point"},
{"title":"mercats","feature_color":"#c729e3","api_url":url_base_opendata_bcn,"api_id":"98b893c2-ac83-4f34-b40a-19a4911a066b","api_limit":"100","api_fields":["EQUIPAMENT"],"api_rule_color":"","api_geo_type":"Point"},
{"title":"hospitals","feature_color":"#a88c27","api_url":url_base_opendata_bcn,"api_id":"3cde43cd-d53a-4048-be38-4e0f8a384eea","api_limit":"500","api_fields":["EQUIPAMENT","3ER_NIVELL"],"api_rule_color":"","api_geo_type":"Point"},
{"title":"cultura","feature_color":"#f507b5","api_url":url_base_opendata_bcn,"api_id":"8ee5c1dc-9f91-437e-9d3f-89e7a4fa1ac0","api_limit":"400","api_fields":["Equipament","TipusEquipament"],"api_rule_color":"","api_geo_type":"Point"},
{"title":"escoles","feature_color":"#ffff66","api_url":url_base_in+"centres_educatius.json","api_id":"","api_limit":"","api_fields":["EQUIPAMENT"],"api_rule_color":"","api_geo_type":"Point"},
{"title":"alimentació","feature_color":"#b38d79","api_url":url_base_in+"activitats_alimentacio.json","api_id":"","api_limit":"","sty":[],"api_data":[],"api_filter":["Nom_Grup_Activitat:Quotidià alimentari"],"api_fields":["Nom_Local","Nom_Activitat"],"api_rule_color":"","api_geo_type":"Point"},
{"title":"barris","feature_color":"#53f2b5","api_url":url_base_in+"barris.geojson","api_id":"","api_limit":"","api_fields":["N_Barri","N_Distri","Dones"],"api_rule_color":"Dones,30000,10,<","api_geo_type":"Polygon"}
];

//Codi_Grup_Activitat:1;https://opendata-ajuntament.barcelona.cat/data/api/action/datastore_search?id=c897c912-0f3c-4463-bdf2-a67ee97786ac&limit=12000&q={%22Nom_Grup_Activitat%22:%22Quotidi%C3%A0%20alimentari%22}
//equipamientos culturales: 8ee5c1dc-9f91-437e-9d3f-89e7a4fa1ac0&limit=400
//ejemplo de query entera: https://opendata-ajuntament.barcelona.cat/data/api/action/datastore_search_sql?sql=SELECT%20*%20from%20%2221f7a4df-2e73-45f8-8c6d-0b3db8c21527%22%20WHERE%20%22INVENTARI_CARRER%22%20LIKE%20%27%MALLORCA%%27



