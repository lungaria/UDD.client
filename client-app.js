var imtheClient=1;var imtheServer=0;var is_first_click="0";

const OSC = require('osc-js')
var osc = new OSC({ plugin:  new OSC.WebsocketClientPlugin() })
window.$ = window.jQuery = require('jquery');

//CLIENT_IPC _file_
const replyHandlers = new Map()
let messageQueue = []


var ip= "";
var port;
require('electron').ipcRenderer.on('ip', (event, message) => {
      console.log("ip!")
      console.log(message)
      ip = message
})
require('electron').ipcRenderer.on('port', (event, message) => {
      console.log("port!")
      console.log(message)
      port = message
      startOSC()
})
function startOSC(){
  var auxPort = Number.parseFloat(port)
  osc.open({
    host: ip,    // @param {string} Hostname of WebSocket server
    port: auxPort            // @param {number} Port of WebSocket server
  }) // connect by default to ws://localhost:8080
}
function send(name, args) {nada=1;
}
//----------SEND OSC MESSAGE--------
function sendOSCMessageToServer(tag, value){
  var message = new OSC.Message(tag, value)
  if(osc_logs()) {
	  console.log(message)
	  osc.send(message)
	  }
}
function osc_logs(){
  if (osc.status() === OSC.STATUS.IS_OPEN) {
    console.log("OSC.STATUS.IS_OPEN")
	return true
  } 

  if (osc.status() === OSC.STATUS.IS_NOT_INITIALIZED) {
    console.log("OSC.STATUS.IS_NOT_INITIALIZED")
	return false
  } 

  if(osc.status() === OSC.STATUS.IS_CONNECTING){
    console.log("OSC.STATUS.IS_CONNECTING")
	return false
  }

  if(osc.status() === OSC.STATUS.IS_CLOSING){
    console.log("OSC.STATUS.IS_CLOSING")
	return false
  } 

  if(osc.status() === OSC.STATUS.IS_CLOSED){
    console.log("OSC.STATUS.IS_CLOSED")
	return false
  }
}

//vars_options _file_
mapboxgl.accessToken = 'pk.eyJ1IjoiYml0aGFiaXRhdCIsImEiOiJja2JobmZmMWcwNXY3MnNzN2xoeHo5NXBwIn0.xNzj37RiLXLc8UbHSdlunA';//'pk.eyJ1IjoiYml0aGFiaXRhdCIsImEiOiJja2JobmZmMWcwNXY3MnNzN2xoeHo5NXBwIn0.xNzj37RiLXLc8UbHSdlunA';//'pk.eyJ1IjoiY29yb2xhcmkiLCJhIjoiY2tkN2l2dHltMDNmcjJ4cGNtamI1ano1aSJ9.TDO_vejWTmNAc2gnc3f7Dw';
var path_base_ini='https://carercities.com/bcn/';//CAMBIOS-UDD: en web dejar vacío
var path_base_get_api=path_base_ini+'get_api.php?';
var url_base_opendata_bcn='url=https://opendata-ajuntament.barcelona.cat/data/api/action/datastore_search';
var url_base_in='url=resources/custom_layers/';
var url_base_in_users='url=resources/custom_layers/users/';
var color_where = "#3887be";//color for ISOCHRONE
var ini_lon = 2.2021;
var ini_lat = 41.4112;
var ini_bearing = -45;
var ini_pitch = 0;
var ini_zoom = 12;
//ISOCHRONE
var urlBase_iso = 'https://api.mapbox.com/isochrone/v1/mapbox/';
var ini_profile = 'walking';
var ini_minutes = 15;
var ini_minutes_1 = 10;
var ini_minutes_2 = 5;
var text_clic_iso = "<i class='fa fa-minus'></i> Fes clic a un punt del mapa per veure la teva ciutat pròxima";
var text_resum_iso = "Calcula totes les rutes";

var style_watercolor_raster={
'version': 8,
'sources': {
'raster-tiles': {
'type': 'raster',
'tiles': ['https://stamen-tiles.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.jpg'],
'tileSize': 256,
'attribution':''
}
},
'layers': [
{
'id': 'simple-tiles',
'type': 'raster',
'source': 'raster-tiles',
'minzoom': 0,
'maxzoom': 22
}
]
};
var stys_raster = {"style_watercolor_raster":style_watercolor_raster};

var styles_map=[
	{id:'style_dark', sty:'mapbox://styles/bithabitat/ckgjms92x3esr19pbva2dj9xx', tresd:"1", custom:"1", raster:"0"},
	//{id:'style_light', sty:'mapbox://styles/mapbox/streets-v11', tresd:"1", custom:"1", raster:"0"},
	{id:'style_light', sty:'mapbox://styles/bithabitat/ckhjgs8ad4cpk19o5ezndmxhe', tresd:"1", custom:"1", raster:"0"},
	//{id:'style_dark', sty:'mapbox://styles/bithabitat/ckgjms92x3esr19pbva2dj9xx', tresd:"1", custom:"1", raster:"0"},
	{id:'style_sat', sty:'mapbox://styles/mapbox/satellite-v9', tresd:"0", custom:"0", raster:"0"}//,
	//{id:'style_watercolor', sty:"style_watercolor_raster", tresd:"0", custom:"0", raster:"1"}
	];

//vars _file_
var actual_style="";
var arr_layers_all=[];
var arr_atlas=[];
var arr_projects=[];
var obj_layers_ini={};
var obj_layers_plus={};
var y_apis=[];
var y_apisT=[];
var theImF;
var start = [];
var start_address = "";
var is_started = 0;
var is_started_clicks = 0;
var i_clicks = 0;
var i_feas = 0;
var features_rendered_directions = {};
var totals_destination=0;
var i_destinations=0;
var i_destinations_done=0;
var f_min_route=-1;
var change_min_route=-1;
var i_apis=0;
var i_apis_total=0;
var myCircle;
var icircles=0;
var mode_circle=0;
var mode_bretxa=0;
var circleradius=1000;
var allthefeas_i=0;
var i_apis2=0;
var positionX=0;var positionY=0;
var y_apis_html="";
var is_tomapbox_draw=0;
var is_tomapbox_search=0;
//ISOCHRONE
var y_apis_desti_min_id={};	  
var f_destination_ll=[];
var f_destination_tt=[];
var f_duration=[];
var features_iso;
var filtered = [];
var onC_ini_desti="set_destination_tot();";
var html_para_proximitat_sub_0=text_clic_iso;
var html_para_proximitat_sub_1='<a id="tot_desti" class="disp100 para_a_desti onc_tot_desti onc" href="#" >'+text_resum_iso+' <span id="a_tot_desti" class="input_layers_desti tot active"></span></a>';
//
var obj_layers_x={"title":"","is_active":1,"feature_color":"", "totals_destination":totals_destination, "i_destinations":i_destinations, "i_destinations_done":i_destinations_done, "f_min_route":f_min_route, "change_min_route":change_min_route, "f_destination_ll": f_destination_ll, "f_destination_tt": f_destination_tt, "feature_icon":"./resources/img/marketsFeature.png","api_base":path_base_get_api,"api_url":url_base_opendata_bcn,"api_id":"","api_limit":"100","sty":[],"api_data":[],"api_filter":[],"api_fields":[],"api_multi":0,"api_rule_color":"","api_is_geojson":0,"api_geo_type":"Point","api_geo_type_plus":""};
//AUXI VARS	
var nada=0; var cl="";var out_apis_layers="";var out_apis="";var sty_to="<style>";var tT="";var is_act="";var is_disp="";
var i=0;var j=0;var k=0;var ijz=0;var nx=0;var iia=0;var cc="";var cc_max=0;var is_geojson=0;var out="";var c="";var str="";var suffix="";var suffix2="";
var onCsw="";var onCapi="";var onCel="";var out_data="";var out_plus_cont="";
var xi="";var y0="";var y1="";var y2="";var sep="";var sepsep="";var el_name="";var el_descri="";var el_lon="";var el_lat="";
var re="";var c_r="";var c_g="";var c_b="";var onC="";


//vars_options_layers _file_
arr_layers_all=[
{"title":"farmàcies","feature_color":"#f5874c","api_url":url_base_in+"farmcies.json","api_id":"","api_limit":"","api_fields":["EQUIPAMENT"],"api_rule_color":"","api_geo_type":"Point","api_geo_type_plus":""},
{"title":"mercats","feature_color":"#c729e3","api_url":url_base_in+"mercats.json","api_id":"","api_limit":"","api_fields":["EQUIPAMENT"],"api_rule_color":"","api_geo_type":"Point","api_geo_type_plus":"heatmap"},
{"title":"hospitals","feature_color":"#a88c27","api_url":url_base_in+"hospitals.json","api_id":"","api_limit":"","api_fields":["EQUIPAMENT","3ER_NIVELL"],"api_rule_color":"","api_geo_type":"Point","api_geo_type_plus":"heatmap"},
{"title":"centres culturals","feature_color":"#f507b5","api_url":url_base_in+"cultura.json","api_id":"","api_limit":"","api_fields":["Equipament","TipusEquipament"],"api_rule_color":"","api_geo_type":"Point","api_geo_type_plus":""},
{"title":"escoles","feature_color":"#ffff66","api_url":url_base_in+"centres_educatius.json","api_id":"","api_limit":"","api_fields":["EQUIPAMENT"],"api_rule_color":"","api_geo_type":"Point","api_geo_type_plus":"heatmap"},
{"title":"comerç quotidià alimentari","feature_color":"#aac272","api_url":url_base_in+"activitats_alimentacio.json","api_id":"","api_limit":"","sty":[],"api_data":[],"api_fields":["Nom_Local","Nom_Activitat"],"api_rule_color":"","api_geo_type":"Point","api_geo_type_plus":""},
{"title":"comerç quotidià no alimentari","feature_color":"#aa9272","api_url":url_base_in+"activitats_no_alimentari.json","api_id":"","api_limit":"","sty":[],"api_data":[],"api_fields":["Nom_Local","Nom_Activitat"],"api_rule_color":"","api_geo_type":"Point","api_geo_type_plus":""},
{"title":"comerç parament de la llar","feature_color":"#ffcc86","api_url":url_base_in+"activitats_parament_llar.json","api_id":"","api_limit":"","sty":[],"api_data":[],"api_fields":["Nom_Local","Nom_Activitat"],"api_rule_color":"","api_geo_type":"Point","api_geo_type_plus":""},
{"title":"activitats ensenyament","feature_color":"#ccaaf6","api_url":url_base_in+"activitats_ensenyament.json","api_id":"","api_limit":"","sty":[],"api_data":[],"api_fields":["Nom_Local","Nom_Activitat"],"api_rule_color":"","api_geo_type":"Point","api_geo_type_plus":""},
{"title":"comerç equipament personal","feature_color":"#3366a6","api_url":url_base_in+"activitats_equipament_personal.json","api_id":"","api_limit":"","sty":[],"api_data":[],"api_fields":["Nom_Local","Nom_Activitat"],"api_rule_color":"","api_geo_type":"Point","api_geo_type_plus":""},
{"title":"comerç oci i cultura","feature_color":"#aa33f6","api_url":url_base_in+"activitats_oci_i_cultura.json","api_id":"","api_limit":"","sty":[],"api_data":[],"api_fields":["Nom_Local","Nom_Activitat"],"api_rule_color":"","api_geo_type":"Point","api_geo_type_plus":""},
{"title":"restaurants bars i hotels","feature_color":"#33fff6","api_url":url_base_in+"activitats_restaurants_bars_i_hotels.json","api_id":"","api_limit":"","sty":[],"api_data":[],"api_fields":["Nom_Local","Nom_Activitat"],"api_rule_color":"","api_geo_type":"Point","api_geo_type_plus":""},
{"title":"serveis reparacions","feature_color":"#aaff36","api_url":url_base_in+"activitats_reparacions.json","api_id":"","api_limit":"","sty":[],"api_data":[],"api_fields":["Nom_Local","Nom_Activitat"],"api_rule_color":"","api_geo_type":"Point","api_geo_type_plus":""},
{"title":"serveis automoció","feature_color":"#3344f6","api_url":url_base_in+"activitats_automocio.json","api_id":"","api_limit":"","sty":[],"api_data":[],"api_fields":["Nom_Local","Nom_Activitat"],"api_rule_color":"","api_geo_type":"Point","api_geo_type_plus":""},
{"title":"serveis inmobiliaris","feature_color":"#6666dd","api_url":url_base_in+"activitats_inmobiliaries.json","api_id":"","api_limit":"","sty":[],"api_data":[],"api_fields":["Nom_Local","Nom_Activitat"],"api_rule_color":"","api_geo_type":"Point","api_geo_type_plus":""},
{"title":"serveis manteniment neteja i producció","feature_color":"#ccaaf6","api_url":url_base_in+"activitats_manteniment_neteja_i_produccio.json","api_id":"","api_limit":"","sty":[],"api_data":[],"api_fields":["Nom_Local","Nom_Activitat"],"api_rule_color":"","api_geo_type":"Point","api_geo_type_plus":""},
{"title":"serveis finances i assegurances","feature_color":"#ccaa36","api_url":url_base_in+"activitats_finances_i_assegurances.json","api_id":"","api_limit":"","sty":[],"api_data":[],"api_fields":["Nom_Local","Nom_Activitat"],"api_rule_color":"","api_geo_type":"Point","api_geo_type_plus":""},
{"title":"serveis sanitat i assistència","feature_color":"#ccaa86","api_url":url_base_in+"activitats_sanitat_i_assistencia.json","api_id":"","api_limit":"","sty":[],"api_data":[],"api_fields":["Nom_Local","Nom_Activitat"],"api_rule_color":"","api_geo_type":"Point","api_geo_type_plus":""},
{"title":"comerç altres","feature_color":"#cc7777","api_url":url_base_in+"activitats_altres.json","api_id":"","api_limit":"","sty":[],"api_data":[],"api_fields":["Nom_Local","Nom_Activitat"],"api_rule_color":"","api_geo_type":"Point","api_geo_type_plus":""},
{"title":"comerç grup no definit","feature_color":"#996666","api_url":url_base_in+"activitats_grup_no_definit.json","api_id":"","api_limit":"","sty":[],"api_data":[],"api_fields":["Nom_Local","Nom_Activitat"],"api_rule_color":"","api_geo_type":"Point","api_geo_type_plus":""},
{"title":"equipaments culturals i recreatius","feature_color":"#cc33a6","api_url":url_base_in+"activitats_equipaments_culturals_i_recreatius.json","api_id":"","api_limit":"","sty":[],"api_data":[],"api_fields":["Nom_Local","Nom_Activitat"],"api_rule_color":"","api_geo_type":"Point","api_geo_type_plus":""},
{"title":"transports ferroviaris","feature_color":"#bd6a77","api_url":url_base_in+"transports.json","api_id":"","api_limit":"","api_fields":["EQUIPAMENT","NOM_CAPA"],"api_rule_color":"","api_geo_type":"Point","api_geo_type_plus":""},
{"title":"autobusos diürns","feature_color":"#f598b5","api_url":url_base_in+"autobusos_dirns.json","api_id":"","api_limit":"","api_fields":["EQUIPAMENT","NOM_CAPA"],"api_rule_color":"","api_geo_type":"Point","api_geo_type_plus":""},
{"title":"autobusos nocturns","feature_color":"#993322","api_url":url_base_in+"autobusos_nocturns.json","api_id":"","api_limit":"","api_fields":["EQUIPAMENT","NOM_CAPA"],"api_rule_color":"","api_geo_type":"Point","api_geo_type_plus":""},
{"title":"carrers pacificats","feature_color":"#93f2b5","api_url":url_base_in+"carrers_pacificats.geojson","api_id":"","api_limit":"","api_fields":["TOOLTIP"],"api_rule_color":"","api_geo_type":"LineString","api_geo_type_plus":""},
{"title":"corredors bici","feature_color":"#5302b5","api_url":url_base_in+"corredors_bici.geojson","api_id":"","api_limit":"","api_fields":["TOOLTIP"],"api_rule_color":"","api_geo_type":"LineString","api_geo_type_plus":""},
{"title":"ampliació voreres","feature_color":"#53f225","api_url":url_base_in+"ampliacio_voreres.geojson","api_id":"","api_limit":"","api_fields":["TOOLTIP"],"api_rule_color":"","api_geo_type":"LineString","api_geo_type_plus":""},
{"title":"vies ciclables","feature_color":"#23f2f5","api_url":url_base_in+"vies_ciclables.geojson","api_id":"","api_limit":"","api_fields":["TOOLTIP"],"api_rule_color":"","api_geo_type":"LineString","api_geo_type_plus":""},
{"title":"carril bici","feature_color":"#63a2f5","api_url":url_base_in+"carril_bici.geojson","api_id":"","api_limit":"","api_fields":["TOOLTIP"],"api_rule_color":"","api_geo_type":"LineString","api_geo_type_plus":""},
{"title":"estacions bicing","feature_color":"#b3edf5","api_url":url_base_in+"estacions_bicing.json","api_id":"","api_limit":"","api_fields":["name","capacity"],"api_rule_color":"","api_geo_type":"Point","api_geo_type_plus":""},
{"title":"llocs de culte","feature_color":"#3362a5","api_url":url_base_in+"culte.json","api_id":"","api_limit":"","api_fields":["EQUIPAMENT","CAPA_GENERICA"],"api_rule_color":"","api_geo_type":"Point","api_geo_type_plus":""},
{"title":"centres de serveis socials","feature_color":"#729396","api_url":url_base_in+"centres_serveis_socials.json","api_id":"","api_limit":"","api_fields":["EQUIPAMENT","3ER_NIVELL"],"api_rule_color":"","api_geo_type":"Point","api_geo_type_plus":""},
{"title":"centres de dia gent gran","feature_color":"#72c3d6","api_url":url_base_in+"centres_dia_gent_gran.json","api_id":"","api_limit":"","api_fields":["EQUIPAMENT","3ER_NIVELL"],"api_rule_color":"","api_geo_type":"Point","api_geo_type_plus":""},
{"title":"residències gent gran","feature_color":"#6644dd","api_url":url_base_in+"residencies_gent_gran.json","api_id":"","api_limit":"","api_fields":["EQUIPAMENT","3ER_NIVELL"],"api_rule_color":"","api_geo_type":"Point","api_geo_type_plus":""},
{"title":"parcs i jardins","feature_color":"#53f2b5","api_url":url_base_in+"parcs_i_jardins.json","api_id":"","api_limit":"","api_fields":["EQUIPAMENT","3ER_NIVELL"],"api_rule_color":"","api_geo_type":"Point","api_geo_type_plus":"heatmap"},
{"title":"punts wifi","feature_color":"#2e4263","api_url":url_base_in+"punts_wifi.json","api_id":"","api_limit":"","api_fields":["EQUIPAMENT","NOM_CAPA"],"api_rule_color":"","api_geo_type":"Point","api_geo_type_plus":"heatmap"},
{"title":"espais infantils","feature_color":"#a5d6cd","api_url":url_base_in+"espais_infantils.json","api_id":"","api_limit":"","api_fields":["EQUIPAMENT","3ER_NIVELL"],"api_rule_color":"","api_geo_type":"Point","api_geo_type_plus":"heatmap"},
{"title":"accessibilitat via pública no","feature_color":"#857869","api_url":url_base_in+"accessibilitat_via_publica_no.json","api_id":"","api_limit":"","api_fields":["Tipus","Incidència"],"api_rule_color":"","api_geo_type":"Point","api_geo_type_plus":""},
{"title":"barris","feature_color":"#e3b2af","api_url":url_base_in+"barris.geojson","api_id":"","api_limit":"","api_fields":["N_Barri","N_Distri","Dones","Homes"],"api_rule_color":"","api_geo_type":"LineString","api_geo_type_plus":""},
{"title":"barris número dones","feature_color":"#e3b2af","api_url":url_base_in+"barris.geojson","api_id":"","api_limit":"","api_fields":["N_Barri","N_Distri","Dones"],"api_rule_color":"Dones,30000,5,<","api_geo_type":"Polygon","api_geo_type_plus":"LineString"},
{"title":"barris número homes","feature_color":"#e3b2af","api_url":url_base_in+"barris.geojson","api_id":"","api_limit":"","api_fields":["N_Barri","N_Distri","Dones"],"api_rule_color":"Homes,30000,5,<","api_geo_type":"Polygon","api_geo_type_plus":"LineString"},
{"title":"internet a la llar - sí","feature_color":"#119478","api_url":url_base_in+"2020_bretxadigital/p1__1__si.geojson","api_id":"","api_limit":"","api_fields":["value","nom"],"api_rule_color":"value,96;87,5,<,%","api_geo_type":"Polygon","api_geo_type_plus":"LineString"},
{"title":"internet a la llar - no","feature_color":"#119478","api_url":url_base_in+"2020_bretxadigital/p1__2__no.geojson","api_id":"","api_limit":"","api_fields":["value","nom"],"api_rule_color":"value,13;4,5,<,%","api_geo_type":"Polygon","api_geo_type_plus":"LineString"},
{"title":"amb smartphone - sí","feature_color":"#f993d2","api_url":url_base_in+"2020_bretxadigital/p2__1__si.geojson","api_id":"","api_limit":"","api_fields":["value","nom"],"api_rule_color":"value,96;87,5,<,%","api_geo_type":"Polygon","api_geo_type_plus":"LineString"},
{"title":"amb smartphone - no","feature_color":"#f993d2","api_url":url_base_in+"2020_bretxadigital/p2__2__no.geojson","api_id":"","api_limit":"","api_fields":["value","nom"],"api_rule_color":"value,12;4,5,<,%","api_geo_type":"Polygon","api_geo_type_plus":"LineString"},
{"title":"amb correu - no","feature_color":"#cc9933","api_url":url_base_in+"2020_bretxadigital/p3_0__0__no en te.geojson","api_id":"","api_limit":"","api_fields":["value","nom"],"api_rule_color":"value,13;4,5,<,%","api_geo_type":"Polygon","api_geo_type_plus":"LineString"},
{"title":"teletreball confinament - sí","feature_color":"#f0e73c","api_url":url_base_in+"2020_bretxadigital/p9__3__si_ teletreballo des del confinament pero en el futur tornare al treball presencial.geojson","api_id":"","api_limit":"","api_fields":["value","nom"],"api_rule_color":"value,10;3,5,<,%","api_geo_type":"Polygon","api_geo_type_plus":"LineString"},
{"title":"tipus usuaris","feature_color":"#a4237a","api_url":url_base_in+"2020_bretxadigital/user_level_centroids.geojson","api_id":"","api_limit":"","api_fields":["value","nom"],"api_rule_color":"value,50;30,5,<,%","api_geo_type":"Point","api_geo_type_plus":"heatmap"}
];

arr_atles=[
{"i":0,"title":"EDUCACIÓ","layers":["escoles","activitats-ensenyament"]},
{"i":7,"title":"MEDI AMBIENT I ACCESSIBILITAT","layers":["parcs-i-jardins","espais-infantils","punts-wifi","accessibilitat-via-pblica-no"]},
{"i":4,"title":"MOBILITAT","layers":["transports-ferroviaris","autobusos-dirns","autobusos-nocturns","vies-ciclables","carril-bici","carrers-pacificats","corredors-bici","ampliaci-voreres","estacions-bicing"]},
{"i":2,"title":"SALUT","layers":["hospitals","farmcies","serveis-sanitat-i-assistncia"]},
{"i":5,"title":"CULTURA","layers":["centres-culturals","llocs-de-culte","equipaments-culturals-i-recreatius"]},
{"i":6,"title":"SERVEIS SOCIALS I BENESTAR","layers":["centres-de-serveis-socials","centres-de-dia-gent-gran","residncies-gent-gran"]},
{"i":1,"title":"ACTIVITATS COMERCIALS","layers":["mercats","comer-quotidi-alimentari","comer-quotidi-no-alimentari","comer-parament-de-la-llar","comer-oci-i-cultura","comer-equipament-personal","serveis-finances-i-assegurances","restaurants-bars-i-hotels","serveis-manteniment-neteja-i-producci","serveis-reparacions","serveis-automoci","serveis-inmobiliaris","comer-grup-no-definit","comer-altres"]},
{"i":3,"title":"DEMOGRAFIA","layers":["barris","barris-nmero-dones","barris-nmero-homes"]},
{"i":8,"title":"BRETXA DIGITAL","layers":["internet-a-la-llar-s","internet-a-la-llar-no","amb-smartphone-s","amb-smartphone-no","amb-correu-no","teletreball-confinament-s","tipus-usuaris"]}
];

arr_projects=[
{"id":0,"title":"Ciutat pròxima 1.0","qq":0,"atles":[4,0,1,2,5,6,7,3],"layers":[]},
{"id":1,"title":"Bretxa digital 2020","qq":1,"atles":[],"layers":["internet-a-la-llar-s","amb-smartphone-s","amb-correu-no","teletreball-confinament-s","tipus-usuaris"]}
];


//CLIENT_APP  _file_
var map = new mapboxgl.Map({
container: 'map',
style: styles_map[0]["sty"]+"?optimize=true",
center: [ini_lon, ini_lat],
pitch: [ini_pitch],
bearing: [ini_bearing],
zoom: ini_zoom,
preserveDrawingBuffer: true
});
actual_style=styles_map[0]["sty"];

var canvas = map.getCanvasContainer();

var geocoder = new MapboxGeocoder({
	accessToken: mapboxgl.accessToken,
	mapboxgl: mapboxgl
});
map.addControl(geocoder, 'top-left');

var geolocate = new mapboxgl.GeolocateControl({
	positionOptions: {
	enableHighAccuracy: true
	},
	trackUserLocation: true
});
map.addControl(geolocate, 'top-left');

map.addControl(new mapboxgl.NavigationControl(), 'top-left');

var draw = new MapboxDraw();
map.addControl(draw, 'top-left');

var directions = new MapboxDirections({
accessToken: mapboxgl.accessToken,
unit: 'metric',
profile: 'mapbox/'+ini_profile
});

$( document ).ready(function() {
    console.log( "ready!" );console.log(y_apis);
	$('#map').click(function() {
		if(imtheClient === 1 && is_first_click == "0") {//alert("RE");
			sendOSCMessageToServer('not_show_id_screensaver', '');
			is_first_click="1";
		}		
	});
	$('#screensaver').click(function() {not_show_id_screensaver();});
	$('#screensaver_show').click(function() {show_id_screensaver();});
	initialize_layers();
	do_html_apis();
	document.getElementById("tAU").value=url_base_in;
	$('#features_info_but').click(function() {features_info_but();});
	$('#features_adm_but').click(function() {features_adm_but();});
	$('#mode_bretxa').click(function() {mode_bretxa_done();});
	$('#go_proximitat').click(function() {mode_circle_done2();});
	
	//$('#mode_circle').click(function() {mode_circle_done();});
	$('#mode_circle').click(function() {mode_circle_ini();});
	$('#activa_prox').click(function() {mode_circle_done();});
	$('#desactiva_prox').click(function() {mode_circle_done2();});
	$('#reset_iso2').click(function() {reset_iso();});
	$('#activa_prox2').click(function() {mode_circle_done();});
	$('#desactiva_prox2').click(function() {mode_circle_done2();});
	$('#reset_iso20').click(function() {reset_iso();});

	$('#tagcloud_but').click(function() {tagcloud_but();});
	$('#select_capes').click(function() {select_capes();});
	$('#mode_circle_val').change(function() {mode_circle_val();});
	$('#mode_circle_val_1').change(function() {mode_circle_val_1();});
	$('#mode_circle_val_2').change(function() {mode_circle_val_2();});
	$('#make_foto').click(function() {DownloadAsImage();});
	$('#reset_iso').click(function() {reset_iso();});
	$('#menu_layers_plus').click(function() {carregarcapes_proj0_not();add_new_layer_html();});
	$('#go_inside').click(function() {go_inside();});
	$('.case_style').click(function() {switchStyle_to(this.id);});
	$('.qq').click(function() {qq(this.id);});
	$('#tomapbox_draw').click(function() {tomapbox_draw();});
	$('#tomapbox_search').click(function() {tomapbox_search();});
	$('#setUndo').click(function() {setUndo();});
	$('#setDefaults').click(function() {setDefaults();});
	$('#mode_projectes').click(function() {show_id('tots_projectes');});
	$('#downMOMENTO').click(function() {downMOMENTO();});
	$('#not_show_id_waiting_results').click(function() {not_show_id('waiting_results');});
	$('#afegir_capa').click(function() {add_new_layer_plus();});
	$('#deli_area_blah_area').click(function() {deli_area('blah_area');});
	$('#id_upd_geo').click(function() {upd_geo();});
	$('#para_layers_0').click(function() {do_para_layers(0);});
	$('#para_layers_1').click(function() {do_para_layers(1);});
	$('#para_layers_2').click(function() {do_para_layers(2);});
	$('#show_id_select_plus_type').click(function() {show_id('select_plus_type');});
	$('#show_id_grid_for_plus_cont_actives').click(function() {show_id('grid_for_plus_cont_actives');});
	$('#show_id_grid_for_plus_cont').click(function() {show_id('grid_for_plus_cont');});
	$('#show_id_grid_for_plus').click(function() {show_id_grid_for_plus();});
	$('#show_id_grid_for_plus2').click(function() {show_id_grid_for_plus();});
	$('#show_id_grid_for_foto').click(function() {show_id('grid_for_foto');});
	$('#show_grid_waiting_for_foto').click(function() {show_id('grid_waiting_for_foto');});
	$('#downMOMENTO').click(function() {downMOMENTO();});
	$('#icon_from_map_put').click(function() {set_custom_base_light();});
	$('#icon_from_map_put_reset').click(function() {set_custom_base_dark();});
	$('#grid_for_plus_head').click(function() {show_id('grid_for_plus');});
	$('#mesinfo_proj0').click(function() {yes_show_id_including_server('popup_proj0');});
	$('#not_show_id_popup_proj0').click(function() {not_show_id_including_server('popup_proj0');});
	$('#not_show_id_popup_proj0_tit').click(function() {not_show_id_including_server('popup_proj0');});
	$('#carregarcapes_proj0').click(function() {carregarcapes_proj0();});

	$('#spinner_descarregant_foto').click(function() {show("grid_waiting_for_foto");});
	$('#downmomento').click(function() {downMOMENTO();});
	$('#cancelmomento').click(function() {show_id('grid_for_foto');});
	$('#capes_en_us').click(function() {show_id('grid_for_plus_cont_actives');});
	$('#capes_disponibles').click(function() {show_id('grid_for_plus_cont');});
	$('#nova_capa').click(function() {show_id('select_plus_type');});
	$('#para_layers_1').click(function() {do_para_layers(1);});
	$('#para_layers_2').click(function() {do_para_layers(2);});
	$('#para_layers_0').click(function() {do_para_layers(0);});
	$('#upd_geo_cli').click(function() {upd_geo()});
	$('#upd_geo_cancel').click(function() {deli_area('blah_area')});
	$('#afegir_capa').click(function() {add_new_layer_plus();});
	$('#not_show_waiting_results').click(function() {not_show_id('waiting_results')});
	
	cl=document.getElementsByClassName("mapboxgl-ctrl-logo");
	for(i=0; i<cl.length; i++) {cl[i].href="";}
	
	map.on('load', function () {loadmap_ini();});

	map.on('click', function (e) {clickmap_ini(e);});	
	map.on('touchstart', function (e) {clickmap_ini(e)});	

	//show features
	map.on('mousemove', function (e) {show_feas_log(e);});
	map.on('mousemove', function (e) {show_feas(e);});
	map.on('click', function (e) {show_feas(e);});
	map.on('touchstart', function (e) {show_feas(e);});

	if(imtheClient === 1) {
	map.on('move', () => {sendOSCMapView00();});
	function sendOSCMapZoom00(){//alert(map.getZoom().toFixed(2));
		sendOSCMessageToServer('zoommap00', map.getZoom().toFixed(2));
	}
	function sendOSCMapCenter00(){
	  var message = new OSC.Message('movemap00', map.getCenter().lng, map.getCenter().lat )
	  if(osc_logs()) {
		  console.log(message)
		  osc.send(message)
		  }
	}
	function sendOSCMapBearing00(){
		sendOSCMessageToServer('bearingmap00', map.getBearing().toFixed(0));
	}
	function sendOSCMapPitch00(){
		sendOSCMessageToServer('pitchmap00', map.getPitch().toFixed(0));
	}
	function sendOSCMapView00(){
		sendOSCMapCenter00();
		setTimeout(function() {sendOSCMapZoom00();setTimeout(function() {sendOSCMapBearing00();setTimeout(function() {sendOSCMapPitch00();},1);},1);},1);
	}	
	map.on('draw.create', drawcreate);
	function drawcreate() {
		sendOSCMessageToServer('draw_create_server', JSON.stringify(draw.getAll()));
		}
	map.on('draw.delete', drawdelete);
	function drawdelete() {
		sendOSCMessageToServer('draw_create_server', '');
		}
	map.on('draw.update', drawupdate);
	function drawupdate() {
		sendOSCMessageToServer('draw_create_server', JSON.stringify(draw.getAll()));
		}
	} //FIN imtheClient
});


//FUNCTIONS _file_
function yes_show_id_including_server(el) {
	yes_show_id(el);
	if(imtheClient === 1) {
		sendOSCMessageToServer('yes_show_id', el);
	}		
	}
function not_show_id_including_server(el) {
	not_show_id(el);
	if(imtheClient === 1) {
		sendOSCMessageToServer('not_show_id', el);
	}		
	}
function show_id_including_server(el) {
	show_id(el);
	if(imtheClient === 1) {
		sendOSCMessageToServer('show_id', el);
	}		
	}
function not_show_id_screensaver() {
	not_show_id('screensaver');
	if(imtheClient === 1) {
		sendOSCMessageToServer('not_show_id_screensaver', '');
	}		
	}
function show_id_screensaver() {
	show_id('screensaver');
	if(imtheClient === 1) {
		sendOSCMessageToServer('show_id_screensaver', '');
	}		
	}

function initInteraction(){
   console.log("initint");
}

function movemap00 (x,y){ 
  var mapcCenter = [x,y];
  map.setCenter(mapcCenter);
}	
function viewmap00 (x,y,z){
  var mapcCenter = [x,y];
  map.setCenter(mapcCenter);
  map.setZoom(z);
}
function zoommap00 (x){
  map.setZoom(x);
}
function centermap00(x,y) {console.log("move");
  var mapcCenter = [x, y];
  map.setCenter(mapcCenter);
}
function bearingmap00(x){
  map.setBearing(x);
}
function pitchmap00 (x){
  map.setPitch(x);
}

function draw_create_server(data) {
	draw.deleteAll();
	data.features.forEach(function(feature) {draw.add(feature);});
	}

function features_info_but() {
	show_id('features_info');
	if(document.getElementById('features_info').style.display=="none") {$('#features_info_but').html("+");document.getElementById('features_info_but').style.fontSize="30px";}
	else {$('#features_info_but').html("x");document.getElementById('features_info_but').style.fontSize="22px";}
}
function features_adm_but () {
	show_id('features_adm');
	if(document.getElementById('features_adm').style.display=="none") {$('#features_adm_but').html("+");}
	else {$('#features_adm_but').html("x");}
}
	
function tagcloud_but() {
	show_id('tagcloud');//show_id('tittit');
	if(imtheClient === 1) {
		sendOSCMessageToServer('tagcloud_but', '')
		}
}
function select_capes() {
	show_id('menu');
	if(imtheClient === 1) {
		sendOSCMessageToServer('select_capes','');
		}
}
function mode_circle_val() {
	ini_minutes=this.value;
	if(imtheClient === 1) {
		sendOSCMessageToServer('mode_circle_val','');
		}
}
function mode_circle_val_1() {
	ini_minutes_1=this.value;
	if(imtheClient === 1) {
		sendOSCMessageToServer('mode_circle_val_1','');
		}
}
function mode_circle_val_2() {
	ini_minutes_2=this.value;
	if(imtheClient === 1) {
		sendOSCMessageToServer('mode_circle_val_2','');
		}
}

function setUndo() {
	map.flyTo({center: [ini_lon, ini_lat]});
	map.setBearing(ini_bearing);map.setPitch(ini_pitch);map.setZoom(ini_zoom);
}

function setDefaults() {
	switchStyleReset_to(styles_map[0]["id"]);
	setUndo();
}

function switchStyleReset_to(el) {
	var el_id="";var el_sty="";var el_tresd="";var el_custom="";var el_raster="";
	styles_map.forEach(function(el2) {if(el2.id==el){el_sty=el2.sty;el_tresd=el2.tresd;el_custom=el2.custom;el_raster=el2.raster;}});
	switchStyleReset(el,el_sty,el_tresd,el_custom,el_raster);
	}

function switchStyleReset(el,sty,tresd,custom,raster) {
	console.log(y_apis);console.log(obj_layers_ini);console.log(obj_layers_plus);
	if(raster=="1") {map.setStyle(stys_raster[sty]);}
	else {map.setStyle(sty+"?optimize=true");}
	setTimeout(function() {
		obj_layers_ini={};obj_layers_plus={};y_apis=[];y_apisT=[];i_apis=0;i_apis_total=0;initialize_layers();do_html_apis();
		}, 1000);
	if(tresd=="0") {nada=1;} else {
		if(map.getLayer('3d-buildings')) {map.removeLayer('3d-buildings');setTimeout(function() {set_edi_3d();}, 300);}
		else {setTimeout(function() {
			set_edi_3d();}, 300);
			}
	}
	if(custom=="0") {not_show_id('icon_from_map_cont');not_show_id('icon_from_map_put');not_show_id('icon_from_map_put_reset');}
	removeByClass("case_style","active");
	document.getElementById(el).classList.add("active");
	reset_iso();
	if(imtheClient === 1) {
		  var message = new OSC.Message('switchStyleReset_to', el )
		  if(osc_logs()) {
			  console.log(message)
			  osc.send(message)
			  }
		}
}

function qq(x) {console.log(actual_style);
	removeByClass("qq","active");
	document.getElementById(x).classList.add("active");
	setDefaults();var yt=x.split("proj1_qq");console.log(yt);console.log(arr_projects[1]);console.log(arr_projects[1]["layers"][parseInt(yt[1])]);
	setTimeout(function() {
		add_new_layer_html();not_show_id("grid_for_plus");
		setTimeout(function() {add_new_layer_to_map(arr_projects[1]["layers"][parseInt(yt[1])]);yes_show_id("menu");}, 900);
	}, 300);
	if(imtheClient === 1) {
		  var message = new OSC.Message('qq', x )
		  if(osc_logs()) {
			  console.log(message)
			  osc.send(message)
			  }
	}
}
	
function deli_area(x) {
	document.getElementById('fileToUploadG').value="";
	$('#blah_area').html("");
	document.getElementById('blah_area_sec').style.display="none";
}
function readURL_area(input) {
	    str=document.getElementById('fileToUploadG').value.toLowerCase();
        if(str.indexOf("'") == -1){nada=1;} else {
        alert("Cambia el nombre de tu archivo para que no aparezca el símbolo: ' -apóstrofe-");
            document.getElementById('fileToUploadG').value='';
        }
        suffix=".geojson";suffix2=".GEOJSON";//suffix3=".png";suffix4=".gif";
        if(str.indexOf(suffix, str.length - suffix.length) == -1 && str.indexOf(suffix2, str.length - suffix2.length) == -1){
        alert("Format de archivo no permitido,\nFormatos permitidos: .geojson");
            document.getElementById('fileToUploadG').value='';
        }

			i=0;$("#blah_area").html("");
            if (input.files && input.files[0]) {
				$(input.files).each(function () {
				console.log(input.files[i].name);
				$('#blah_area').append(input.files[i].name+"<br>");
				i++;
				});
				document.getElementById('blah_area').style.display="inline-block";
				document.getElementById('blah_area_sec').style.display="inline-block";
			}
}
function upd_geo() {
        var fd = new FormData();var out_data="";
   // Read selected files
	   var totalfiles = document.getElementById('fileToUploadG').files.length;
	   for (var index = 0; index < totalfiles; index++) {
		  fd.append("fileToUploadG[]", document.getElementById('fileToUploadG').files[index]);
	   }
    $.ajax({
	  //async: false,	
      url: 'uploadG.php',
	  type: 'POST',
      data: fd,
            cache:false,
            contentType: false,
            processData: false,
			enctype: 'multipart/form-data',
      success: function(data)
      { j=0;out_data=data;console.log("FROM"+data);
	  },
	  complete: function() {
		  console.log("FIN00");
		  $("#results_upd_geo").html(out_data);
	  }
	});
}


function initialize_layers() {
	arr_layers_all.forEach(function(x) {
	var obj_aux=obj_layers_x;
	for (var [key, value] of Object.entries(obj_layers_x)) {
		if(x[key]) {nada=1;} else {x[key]=value;}
	}
	obj_layers_plus[slugify(x["title"])]=x;
	console.log(x);
}); 
	console.log(obj_layers_plus);
}
	
function loadmap_ini() {
	var y=y_apis;
	i_apis_total=y.length;//alert(x);
	if(i_apis_total>0) {var x=y[0];get_api_opendatabcn(x);}
	set_edi_3d();	
}


function fit(geojson_data) {
	var theBea=map.getBearing();var thePit=map.getPitch();
    try {
		map.fitBounds(geojsonExtent( geojson_data ),{bearing: theBea, pitch: thePit});
		}
    catch (err) {console.log(err);}
}

// Create a function that sets up the Isochrone API query then makes an Ajax call
function getIso(urlBase, lon, lat, profile, minutes) {
	//minutes='5,10,15';contours_colors='ff0000,00ff00,0000ff';
  var query = urlBase + profile + '/' + lon + ',' + lat + '?contours_minutes=' + minutes + '&polygons=true&access_token=' + mapboxgl.accessToken;
  $.ajax({
	method: 'GET',
	url: query
  }).done(function(data) {
	// Set the 'iso' source's data to what's returned by the API query
	map.getSource('iso'+is_started_clicks).setData(data);
	var feature = data.features[0];
	features_iso = feature;console.log("features_iso");console.log(features_iso);
	// Filter features based on the isochrone polygon
	y_apis.forEach(function(t) {
		if(map.getLayer(t)) {map.setFilter(t, ['within', feature]);}
		if(map.getLayer(t+"-heat")) {map.setFilter(t+"-heat", ['within', feature]);}
		console.log("GETISO");
		});
	console.log(turf.polygon(data));
	console.log(turf.area(data));
	yes_show_id("para_proximitat_opt");
	//$('#para_proximitat_sub').html(html_para_proximitat_sub_1);
	not_show_id("para_proximitat_sub");
	setTimeout(function() {$('.onc_tot_desti').click(function() {set_destination_tot()});}, 100);
	
	fit(data);carregarcapes_proj0_not();
	checkOutThisLoad();
	setTimeout(function() {set_destination_tot();}, 3000);
  });
}
function do_iso(urlBase, lon, lat, profile, minutes, color) {
	var color=color_where;
  map.addSource('iso'+is_started_clicks, {
	type: 'geojson',
	data: {
	  "type": 'FeatureCollection',
	  "features": []
	}
  });
  map.addLayer({
	'id': 'isoLayer'+is_started_clicks,
	'type': 'fill',
	// Use "iso" as the data source for this layer
	'source': 'iso'+is_started_clicks,
	'layout': {},
	'paint': {
	  // The fill color for the layer is set to a light purple
	  //'fill-region': 'outside',
	  'fill-color': color,
	  'fill-opacity': 0.2
	}
  }, "poi-label");
  getIso(urlBase, lon, lat, profile, minutes);
}

function add_new_layer_to_map(t) {
	document.getElementById("carregarcapes_proj0").classList.remove("active");
	if(mode_circle==1) {reset_iso();}
	y_apis.push(t);//alert(obj_layers_plus[t]["title"].toLowerCase());
	y_apisT.push(obj_layers_plus[t]["title"].toLowerCase());
	i_apis_total++;
	obj_layers_ini[t]=obj_layers_plus[t];
	do_html_apis();console.log("add_new_layer_to_map");console.log(t);console.log(obj_layers_plus[t]);
	get_api_opendatabcn(t);
	if(document.getElementById("grid_for_plus").classList.contains("lateral")) {
		carregarcapes_proj0_not();setTimeout(function(){carregarcapes_proj0_yes("1");},2000);//add_new_layer_html();
		}
	else {not_show_id("grid_for_plus");}
	if(obj_layers_plus[t]) {delete obj_layers_plus[t];}
	if(imtheClient === 1) {
		sendOSCMessageToServer('add_new_layer_to_map',t);
		}
}

function add_new_layer_plus() {
	var tT=document.getElementById('tT').value; 
	if(tT=="") {tT="NoName";} 
	y_apis.sort().forEach(function(x) {
		if(slugify(tT)==x) {
			subu=tT.substring(1);
			if(subu=="0" || subu=="1" || subu=="2" || subu=="3" || subu=="4" || subu=="5" || subu=="6" || subu=="7" || subu=="8" || subu=="9") {xxyy=parseInt(subu)+1;}
			else {xxyy=1;}
			tT+="-"+xxyy;}
		});
	var t=slugify(tT);
	var tC=document.getElementById('tC').value;if(tC=="" || tC=="#" || tC.length!=7 || tC.substring(0,1)!="#") {tC="#aa8866";}
	var tAR=document.getElementById('tAR').value;
	var tAi=document.getElementById('tAi').value;
	var tAl=document.getElementById('tAl').value;
	var tAf=document.getElementById('tAf').value;
	var tG=document.getElementById('tG').value;
	var tAU=document.getElementById('tAU').value;
	var tAx0=document.getElementById('tAx').value.split(",");
	var tAx=[];
	tAx0.forEach(function(el) {tAx.push(el);});
	var tAJ=document.getElementById('tAJ').value;
	var obj_aux=obj_layers_x;
	obj_aux["api_url"]=tAU;obj_aux["title"]=tT;obj_aux["feature_color"]=tC;obj_aux["api_rule_color"]=tAR;obj_aux["api_id"]=tAi;obj_aux["api_limit"]=tAl;obj_aux["api_geo_type_plus"]=tAf;obj_aux["api_fields"]=tAx;obj_aux["api_geo_type"]=tG;
	obj_layers_plus[t]=obj_aux;
	if(tAi=="") {if(tAJ=="") {nada=1;} else {is_geojson=1;
		obj_aux["api_base"]="";
		var Va=[];console.log(tAJ);
		  ob=JSON.parse(tAJ);console.log(ob);
			if(ob["result"]) {if(ob["result"]["records"]) {ob["result"]["records"].forEach(function(el) {is_geojson=0;Va.push(el);});}}
			else if(ob["features"]) {ob["features"].forEach(function(el) {console.log("API_geojson");is_geojson=1;console.log(el);
				if(el["geometry"]["coordinates"]) {Va.push({"type":"Feature","properties": el["properties"],"geometry": el["geometry"]});}
				});
				}		  
		  obj_layers_plus[t]["api_data"]=Va;
		  obj_layers_plus[t]["api_is_geojson"]=is_geojson;
		}
	}
	add_new_layer_to_map(t);
	if(imtheClient === 1) {
		sendOSCMessageToServer('add_new_layer_plus', '');
		}
}
function add_new_layer_html() {
	var out_plus_cont="";var sty_to="<style>";
	arr_atles.forEach(function(atl) {
		out_plus_cont+="<div id='atles_i_"+atl["i"]+"' class='para_atles_tit'><h5 id='para_atles_i_"+atl["i"]+"' class='tit_atles'>"+atl["title"]+"</h5><div id='para_atles_i_"+atl["i"]+"_div' class='tit_atles_div active'>";console.log(atl["title"]);
		atl["layers"].forEach(function(key0) {
			var is_notin="0";
			for (var [key, value] of Object.entries(obj_layers_plus)) {
				if(key0==key) {
					is_notin="1";
					onC="add_new_layer_to_map('"+key+"')";is_act="active";console.log(key);
					out_plus_cont+='<a id="PLUS_IN_'+key+'" class="onc onc_PLUS_IN_ para_a '+is_act+'" href="#" ><span id="PLUS_IN_a_'+key+'" class="input_layers input_layers'+obj_layers_plus[key]["api_geo_type"]+' '+key+' '+is_act+'"></span> '+obj_layers_plus[key]["title"]+'<span id="PLUS_IN_colors-'+key+'" class="para_colors00"></span></a>';
					sty_to+="."+key+".active, .input_layers_desti."+key+" {background:"+obj_layers_plus[key]["feature_color"]+"}";
			}
			}
			if(is_notin=="0") {out_plus_cont+='<span class="aux_layer"><span class="input_layers input_layers'+obj_layers_ini[key0]["api_geo_type"]+' '+key0+' '+is_act+'"></span> '+obj_layers_ini[key0]["title"]+'</span>';}
	});
	out_plus_cont+="</div></div>";
	});
	sty_to+="</style>";
	$("#custom_style_plus").html(sty_to);
	$("#grid_for_plus_cont").html(out_plus_cont);
	yes_show_id("grid_for_plus");
	setTimeout(function() {
		$('.onc_PLUS_IN_').click(function() {
		add_new_layer_to_map(this.id.replaceAll('PLUS_IN_',''));
		show_id(this.id+"_div");
		});
		$('.tit_atles').click(function() {show_id(this.id+"_div")});		
		}, 100);
	if(imtheClient === 1) {
		sendOSCMessageToServer('add_new_layer_html','');
		//send('add_new_layer_html', { });
		}
}

function carregarcapes_proj0() {
	if(document.getElementById("grid_for_plus").style.display=="none") {carregarcapes_proj0_yes("1");}
	else {carregarcapes_proj0_not();}
}
function carregarcapes_proj0_yes(disp) {
	document.getElementById("carregarcapes_proj0").classList.add("active");
	add_new_layer_html();yes_show_id("menu");
	document.getElementById("grid_for_plus").classList.add("lateral");
	$("#show_id_grid_for_plus").html("");$("#show_id_grid_for_plus_cont").html("");
	arr_projects[0]["atles"].forEach(function(atl) {yes_show_id("atles_i_"+atl);});
	if(disp=="1") {showByClass('tit_atles_div','none');}
}
function carregarcapes_proj0_not() {
	document.getElementById("carregarcapes_proj0").classList.remove("active");
	document.getElementById("grid_for_plus").classList.remove("lateral");
	$("#show_id_grid_for_plus").html("CONTROL DE CAPES");$("#show_id_grid_for_plus_cont").html("ATLES UDD");
	not_show_id("grid_for_plus");
	showByClass('tit_atles_div','inline-block');
}
function show_id_grid_for_plus() {
	carregarcapes_proj0_not();
}

function do_html_apis() {
	out_apis_layers="";
	sty_to="<style>";k=0;
    y_apis.forEach(function(t) {
		if(obj_layers_ini[t]["api_vals_colors_html"]) {nada=1;} else {obj_layers_ini[t]["api_vals_colors_html"]="";}
		tT=y_apisT[k];
	    onCsw="switchLayer('"+t+"');";
		if(obj_layers_ini[t]["is_active"]==1) {is_act="active";} else {is_act="";}
	    out_apis_layers+='<a id="'+t+'" class="onc_API_ disp100 para_a '+is_act+'" href="#" ><span id="a_'+t+'" class="input_layers input_layers'+obj_layers_ini[t]["api_geo_type"]+' '+t+' '+is_act+'"></span> '+tT+'<span id="colors-'+t+'" class="para_colors00">'+obj_layers_ini[t]["api_vals_colors_html"]+'</span></a><br>';
		k++;
		sty_to+="."+t+".active, .input_layers_desti."+t+" {background:"+obj_layers_ini[t]["feature_color"]+"}";
	});
	sty_to+="</style>";
	$("#custom_style").html(sty_to);
	$('#menu_layers').html(out_apis_layers);
	setTimeout(function() {$('.onc_API_').click(function() {switchLayer(this.id)});}, 100);
	do_html_apis_desti();
	do_html_apis_plus();
}

function do_html_apis_plus() {
	out_apis_layers="";
	k=0;
    y_apis.forEach(function(t) {
		tT=y_apisT[k];
	    onCsw="propLayer('"+t+"','0');";
		is_act="active";
	    out_apis_layers+='<a id="PLUS_'+t+'" class="onc_PLUS_ para_a '+is_act+'" href="#" ><span id="PLUS_a_'+t+'" class="input_layers input_layers'+obj_layers_ini[t]["api_geo_type"]+' '+t+' '+is_act+'"></span> '+tT+'<span id="PLUS_colors-'+t+'" class="para_colors00"></span></a>';
		k++;
	});
	$('#grid_for_plus_cont_actives').html(out_apis_layers);
	setTimeout(function() {$('.onc_PLUS_').click(function() {propLayer('PLUS_'+this.id,'0')});}, 100);
}

function do_html_apis_desti() {
	out_apis="";k=0;
    y_apis.forEach(function(t) {
		tT=y_apisT[k];
		if(obj_layers_ini[t]["is_active"]==1) {is_disp="";} else {is_disp="display:none;";}
		onCapi="set_destination('"+t+"')";
		out_apis+='<a id="'+t+'_desti" class="onc_DESTI_ disp100 para_a_desti " href="#" style='+is_disp+'><span id="a_'+t+'_desti" class="input_layers_desti input_layers'+obj_layers_ini[t]["api_geo_type"]+' '+t+'"></span> '+tT+'<span id="'+t+'_desti_result" class="resulting" style="display:none;"></span></a>';
		k++;
	});
	y_apis_html=out_apis;
	$('#y_apis').html(y_apis_html);
	setTimeout(function() {$('.onc_DESTI_').click(function() {set_destination(this.id.substr(0,this.id.length-6))});}, 1000);
}

function propLayer(t,who) {
	if(who) {if(who=="PLUS") {var obj_aux=obj_layers_plus[t];} else {var obj_aux=obj_layers_ini[t];}} else {var obj_aux=obj_layers_ini[t];}
	if(obj_aux["api_url"]==url_base_opendata_bcn) {do_para_layers(2);} else {do_para_layers(1);}
	document.getElementById('tT').value=obj_aux["title"];
	document.getElementById('tC').value=obj_aux["feature_color"];
	document.getElementById('tAR').value=obj_aux["api_rule_color"];
	document.getElementById('tAi').value=obj_aux["api_id"];
	document.getElementById('tAl').value=obj_aux["api_limit"];
	document.getElementById('tAf').value=obj_aux["api_geo_type_plus"];
	document.getElementById('tG').value=obj_aux["api_geo_type"];
	document.getElementById('tAx').value=obj_aux["api_fields"];
	document.getElementById('tAU').value=obj_aux["api_url"];
}

function do_para_layers(x) {
		document.getElementById("para_layers_0").classList.remove("active");document.getElementById("para_layers_1").classList.remove("active");document.getElementById("para_layers_2").classList.remove("active");
		document.getElementById("para_layers_"+x).classList.add("active");
		yes_show_id('select_plus_type');not_show_id('grid_for_plus_upd_self');not_show_id('grid_for_plus_upd_open_data_bcn');not_show_id('grid_for_plus_upd_in');
		if(x==1) {yes_show_id('grid_for_plus_upd_self');put_value('tAU_base',url_base_in);}
		if(x==2) {yes_show_id('grid_for_plus_upd_open_data_bcn');put_value('tAU_base',url_base_opendata_bcn);}
		if(x==0) {yes_show_id('grid_for_plus_upd_in');put_value('tAU_base','');}
}

function switchLayer(clickedLayer) {
	console.log(clickedLayer);
	var visibility = map.getLayoutProperty(clickedLayer, 'visibility');
	if (visibility === 'none') {
		map.setLayoutProperty(clickedLayer, 'visibility', 'visible');
		if(map.getLayer(clickedLayer+'-heat')) {map.setLayoutProperty(clickedLayer+'-heat', 'visibility', 'visible');}
		if(map.getLayer(clickedLayer+'-line')) {map.setLayoutProperty(clickedLayer+'-line', 'visibility', 'visible');}
		document.getElementById(clickedLayer).classList.add('active');
		document.getElementById("a_"+clickedLayer).classList.add('active');
		obj_layers_ini[clickedLayer]["is_active"]=1;
		yes_show_id(clickedLayer+"_desti");
		yes_show_id("colors-"+clickedLayer);
		map.moveLayer(clickedLayer);
	} else {
		map.setLayoutProperty(clickedLayer, 'visibility', 'none');
		if(map.getLayer(clickedLayer+'-heat')) {map.setLayoutProperty(clickedLayer+'-heat', 'visibility', 'none');}
		if(map.getLayer(clickedLayer+'-line')) {map.setLayoutProperty(clickedLayer+'-line', 'visibility', 'none');}
		document.getElementById(clickedLayer).classList.remove('active');
		document.getElementById("a_"+clickedLayer).classList.remove('active');
		obj_layers_ini[clickedLayer]["is_active"]=0;
		not_show_id(clickedLayer+"_desti");
		not_show_id("colors-"+clickedLayer);
	}
	if(imtheClient === 1) {
		sendOSCMessageToServer('switchLayer',clickedLayer);
		}
}

function switchStyle_to(el) {
	var el_id="";var el_sty="";var el_tresd="";var el_custom="";var el_raster="";
	styles_map.forEach(function(el2) {if(el2.id==el){el_sty=el2.sty;el_tresd=el2.tresd;el_custom=el2.custom;el_raster=el2.raster;}});
	switchStyle(el,el_sty,el_tresd,el_custom,el_raster);
	}

function switchStyle(el,sty,tresd,custom,raster) {
	if(raster=="1") {map.setStyle(stys_raster[sty]);}
	else {map.setStyle(sty);}
	setTimeout(function() {
		y_apis.forEach(function(t){
			if(map.getLayer(t)) {map.removeLayer(t);} 
			if(map.getLayer(t+"-heat")) {map.removeLayer(t+"-heat");} 
			if(map.getLayer(t+"-line")) {map.removeLayer(t+"-line");} 
			if(map.getSource(t)) {map.removeSource(t);} 
			if(obj_layers_ini[t]["api_base"]==path_base_get_api) {convert_geo(t);}
			else {
				convert_geo(t);
				}
			document.getElementById(t).classList.add("active");document.getElementById("a_"+t).classList.add("active");
			});
		}, 1000);
	if(tresd=="0") {nada=1;} else {
		if(map.getLayer('3d-buildings')) {map.removeLayer('3d-buildings');setTimeout(function() {set_edi_3d();}, 300);}
		else {setTimeout(function() {
			set_edi_3d();}, 300);
			}
	}
	if(custom=="1999999999999999NONO") {
		if(el=="style_light") {
			show_id("icon_from_map_cont");not_show_id('icon_from_map_put');not_show_id('icon_from_map_put_reset');
			setTimeout(function() {set_custom_base_light();},600);
			}
		else if(el=="style_dark") {
			not_show_id('icon_from_map_cont');setTimeout(function() {yes_show_id('icon_from_map_put');}, 600);
			}
	}
	else if(custom=="0") {not_show_id('icon_from_map_cont');not_show_id('icon_from_map_put');not_show_id('icon_from_map_put_reset');}
	removeByClass("case_style","active");
	document.getElementById(el).classList.add("active");
	reset_iso();
	if(imtheClient === 1) {
		  var message = new OSC.Message('switchStyle', el, sty, tresd, custom, raster )
		  if(osc_logs()) {
			  console.log(message)
			  osc.send(message)
			  }
		}
}

function layers_desti(t) {
	map.addSource('iso'+is_started_clicks);map.addLayer('isoLayer'+is_started_clicks);
	map.addSource('point'+is_started_clicks);map.addLayer('point'+is_started_clicks);
	map.addSource('point-border'+is_started_clicks);map.addLayer('point-border'+is_started_clicks);
        y_apis.forEach(function(t) {
			map.setFilter(t, ['within', features_iso]);
			map.setFilter(t+"-heat", ['within', features_iso]);
			for(k=0;k<obj_layers_ini[t]["i_destinations"];k++) {
				map.addSource('route_'+t+"_"+k);map.addLayer('route_'+t+"_"+k);//
				map.addSource('end_'+t+"_"+k);map.addLayer('end_'+t+"_"+k);//
				}
			});
}

function tomapbox_draw() {
	is_tomapbox_draw=1-is_tomapbox_draw;
	if(is_tomapbox_draw==1) {document.getElementById("tomapbox_draw").classList.add("active");}
	else {document.getElementById("tomapbox_draw").classList.remove("active");}
	var arraux=["mapbox-gl-draw_line", "mapbox-gl-draw_polygon", "mapbox-gl-draw_point", "mapbox-gl-draw_trash"];
	arraux.forEach(function(z) {document.getElementsByClassName(z)[0].id=z;console.log(document.getElementsByClassName(z)[0]);
		if(is_tomapbox_draw==1) {document.getElementById(z).classList.add("active2");}
		else {document.getElementById(z).classList.remove("active2");}
		});
}

function tomapbox_search() {
	is_tomapbox_search=1-is_tomapbox_search;
	var z="mapboxgl-ctrl-geocoder";
	document.getElementsByClassName(z)[0].id=z;
	if(is_tomapbox_search==1) {document.getElementById("tomapbox_search").classList.add("active");document.getElementById(z).classList.add("active");}
	else {document.getElementById("tomapbox_search").classList.remove("active");document.getElementById(z).classList.remove("active");}
}



function mode_circle_done2() {if(mode_circle==1) {reset_iso();setTimeout(function() {mode_circle_done();}, 1000);} else {mode_circle_done();}}
function mode_circle_ini() {
	if(mode_circle==1) {mode_circle_done2();} 
	else if(document.getElementById("para_proximitat").style.display=="inline-block") {mode_circle=1;mode_circle_done();} 
	else {
		yes_show_id('tagcloud');carregarcapes_proj0();
		document.getElementById("para_proximitat").style.display="inline-block";document.getElementById("mode_circle").classList.add("active");document.getElementById("go_proximitat").classList.add("active");		
	}
}
function mode_circle_done() {
	mode_circle=1-mode_circle;
	if(mode_circle==1) {yes_show_id('first_fes_clic');/*yes_show_id('desactiva_prox');*/document.getElementById("activa_prox").classList.add("active");yes_show_id('first_fes_clic2');yes_show_id('desactiva_prox2');document.getElementById("activa_prox2").classList.add("active");carregarcapes_proj0();
		if(mode_bretxa==1) {
			mode_bretxa=0;document.getElementById("para_bretxa").style.display="none";document.getElementById("mode_bretxa").classList.remove("active");
		}
		//document.getElementById("menu").style.display="none";
		yes_show_id('tagcloud');
		document.getElementById("para_proximitat").style.display="inline-block";document.getElementById("mode_circle").classList.add("active");document.getElementById("go_proximitat").classList.add("active");
		} 
	else {not_show_id('first_fes_clic');not_show_id('desactiva_prox');document.getElementById("activa_prox").classList.remove("active");not_show_id('first_fes_clic2');not_show_id('desactiva_prox2');document.getElementById("activa_prox2").classList.remove("active");carregarcapes_proj0_not();document.getElementById("para_proximitat").style.display="none";document.getElementById("mode_circle").classList.remove("active");document.getElementById("go_proximitat").classList.remove("active");}	
	if(imtheClient === 1) {
		sendOSCMessageToServer('mode_circle_done','');
		}
}

function mode_bretxa_done() {
	mode_bretxa=1-mode_bretxa;
	if(mode_bretxa==1) {
		if(mode_circle==1) {
			reset_iso();
			mode_circle=0;document.getElementById("para_proximitat").style.display="none";document.getElementById("mode_circle").classList.remove("active");document.getElementById("go_proximitat").classList.remove("active");
		}
		document.getElementById("para_bretxa").style.display="inline-block";document.getElementById("mode_bretxa").classList.add("active");
		} 
	else {document.getElementById("para_bretxa").style.display="none";document.getElementById("mode_bretxa").classList.remove("active");}	
	if(imtheClient === 1) {
		sendOSCMessageToServer('mode_bretxa_done','');
		}
}



function go_inside() {
	console.log(map.getBearing(),map.getPitch(),map.getZoom());
	map.setBearing(-45);map.setPitch(60);map.setZoom(17);
}
	
function set_custom_base_light() {
	map.setPaintProperty('landuse', 'fill-color', '#5fc7af');//#ffc7af
	//map.setPaintProperty('landuse', 'fill-color', '#4cad76');
	map.setPaintProperty('road-pedestrian', 'line-color', '#ffc7af');
	map.setPaintProperty('road-pedestrian-case', 'line-color', '#ffc7af');//CAMBIOS BASE
	map.setPaintProperty('road-pedestrian-polygon-fill', 'fill-color', '#ffc7af');//CAMBIOS BASE
	map.setPaintProperty('road-motorway-trunk', 'line-color', '#aaaaaa');
	map.setPaintProperty('bridge-motorway-trunk', 'line-color', '#bbbbbb');
	map.setPaintProperty('tunnel-motorway-trunk', 'line-color', '#ccbbbb');
	map.setPaintProperty('bridge-motorway-trunk-2', 'line-color', '#ddbbbb');
	map.setPaintProperty('bridge-motorway-trunk-2-case', 'line-color', '#eebbbb');
	map.setLayoutProperty('poi-label', 'visibility', 'none');
	//map.setPaintProperty('landuse', 'fill-color', ['match', ['get', 'type'], 'school', '#ffff66' , '#ffc7af']);
	map.setPaintProperty('landuse', 'fill-color', ['match', ['get', 'class'], 'school', '#ffff66' , '#33c771']);
	map.setPaintProperty('landuse', 'fill-opacity', ['match', ['get', 'class'], 'school', 0.5 , 1]);
	yes_show_id('icon_from_map_cont');not_show_id('icon_from_map_put');yes_show_id('icon_from_map_put_reset');
	if(imtheClient === 1) {
		sendOSCMessageToServer('set_custom_base_light','');
		}
}

function set_custom_base_dark() {
	map.setPaintProperty('landuse', 'fill-color', '#000');//#ffc7af
	//map.setPaintProperty('landuse', 'fill-color', '#4cad76');
	map.setPaintProperty('road-pedestrian', 'line-color', '#333333');
	map.setPaintProperty('road-pedestrian-case', 'line-color', '#333333');//CAMBIOS BASE
	map.setPaintProperty('road-pedestrian-polygon-fill', 'fill-color', '#333333');//CAMBIOS BASE
	map.setPaintProperty('road-motorway-trunk', 'line-color', '#000000');
	map.setPaintProperty('bridge-motorway-trunk', 'line-color', '#000000');
	map.setPaintProperty('tunnel-motorway-trunk', 'line-color', '#000000');
	map.setPaintProperty('bridge-motorway-trunk-2', 'line-color', '#000000');
	map.setPaintProperty('bridge-motorway-trunk-2-case', 'line-color', '#000000');
	//map.setLayoutProperty('poi-label', 'visibility', 'none');
	////map.setPaintProperty('landuse', 'fill-color', ['match', ['get', 'type'], 'school', '#ffff66' , '#ffc7af']);
	//map.setPaintProperty('landuse', 'fill-color', ['match', ['get', 'class'], 'school', '#ffff66' , '#33c771']);
	//map.setPaintProperty('landuse', 'fill-opacity', ['match', ['get', 'class'], 'school', 0.5 , 1]);
	not_show_id('icon_from_map_cont');not_show_id('icon_from_map_put_reset');yes_show_id('icon_from_map_put');
	if(imtheClient === 1) {
		sendOSCMessageToServer('set_custom_base_dark','');
		}
}

function set_edi_3d() {
	var layers = map.getStyle().layers; 
	var labelLayerId;
	for (var i = 0; i < layers.length; i++) {
		if (layers[i].type === 'symbol' && layers[i].layout['text-field']) {
		labelLayerId = layers[i].id;
		break;
		}
	}
	map.addLayer(
	{
	'id': '3d-buildings',
	'source': 'composite',
	'source-layer': 'building',
	'filter': ['==', 'extrude', 'true'],
	'type': 'fill-extrusion',
	'minzoom': 15,
	'paint': {
	'fill-extrusion-color': '#aaa',
	'fill-extrusion-height': [
	'interpolate',
	['linear'],
	['zoom'],
	15,
	0,
	15.05,
	['get', 'height']
	],
	'fill-extrusion-base': [
	'interpolate',
	['linear'],
	['zoom'],
	15,
	0,
	15.05,
	['get', 'min_height']
	],
	'fill-extrusion-opacity': 0.6
	}
	},
	labelLayerId
	);
	if(map.getLayer('3d-buildings')) {console.log("NO-ERROR-3D");} else {console.log("YES-ERROR-3D");}
}

	  
function clickmap_ini(e) {map.fire('closeAllPopups');$('.mapboxgl-popup').remove();var eini=e;
			if(mode_circle==1) {
				console.log(e.lngLat);
				if(is_started==0) {
					start = [e.lngLat.lng, e.lngLat.lat];
					console.log("START POINT: "+start);
					map.flyTo({center: start});
					var minutes=ini_minutes_2 + "," + ini_minutes_1 + "," + ini_minutes;
					do_iso(urlBase_iso, e.lngLat.lng, e.lngLat.lat, ini_profile, minutes);
					getReverseGeocode(e.lngLat.lng, e.lngLat.lat);
					setTimeout(function() {start_route();},600);
					}
					is_started=1;
				i_clicks++;
			}	
			if(imtheClient === 1) {
			  var message = new OSC.Message('clickmap_ini', eini.lngLat.lng, eini.lngLat.lat )
			  if(osc_logs()) {
				  console.log(message)
				  osc.send(message)
				  }
				}
}	
function clickmap_ini_server(e_lng, e_lat) {map.fire('closeAllPopups');$('.mapboxgl-popup').remove();
			if(mode_circle==1) {
				if(is_started==0) {
					start = [e_lng, e_lat];
					console.log("START POINT: "+start);
					map.flyTo({center: start});
					var minutes=ini_minutes_2 + "," + ini_minutes_1 + "," + ini_minutes;
					do_iso(urlBase_iso, e_lng, e_lat, ini_profile, minutes);
					getReverseGeocode(e_lng, e_lat);
					setTimeout(function() {start_route();},600);
					}
					is_started=1;
				i_clicks++;
			}	
}	
	
	
function clickmap_t(t,e) {var eini=e;
				console.log(e.lngLat);
				if(e.features[0].geometry.type=="Point") {var coordinates = e.features[0].geometry.coordinates.slice();console.log(e.features[0].geometry.coordinates);}
				else if(e.features[0].geometry.type=="Polygon" || e.features[0].geometry.type=="MultiPolygon") {console.log(e.features[0].geometry.coordinates[0][0]);
					var coordinates = e.lngLat;
					} 
				else {var coordinates = e.features[0].geometry.coordinates[e.features[0].geometry.coordinates.length-1].slice();}
				var name = e.features[0].properties.name;
				// Ensure that if the map is zoomed out such that multiple copies of the feature are visible, the popup appears over the copy being pointed to.
				while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
				coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
				}
				var popup = new mapboxgl.Popup()
				.setLngLat(coordinates)
				.setHTML(name)
				.addTo(map);				
				setTimeout(function() {
					$('.onc_DESCRI_FEAS_').click(function() {
						show_id(this.id.replaceAll('DESCRI_FEAS_',''))
						if(imtheClient === 1) {sendOSCMessageToServer('show_id',this.id.replaceAll('DESCRI_FEAS_',''));}
						})
					}, 100);
				// Add a custom event listener to the map
				map.on('closeAllPopups', () => {
				  popup.remove();
				});
				if(imtheClient === 1) {var encodedName = unescape(encodeURIComponent(name))
				  var message = new OSC.Message('clickmap_t', t, encodedName, e.lngLat.lng, e.lngLat.lat )
				  if(osc_logs()) {
					  console.log(message)
					  osc.send(message)
					  }
					}
}	
function clickmap_t_server(t, name, e_lng, e_lat) {console.log(e_lng+","+ e_lat);
				new mapboxgl.Popup()
				.setLngLat([e_lng, e_lat])
				.setHTML(name)
				.addTo(map);				
}	
	
	
function show_feas(e) {
	var features = map.queryRenderedFeatures(e.point);
	var displayFeat="";var dd="";var ddty="";var ddmaki="";var ijk=0;
	features.map(function (feat) {
		if(feat["properties"]["name"]) {
			if(dd==feat["properties"]["name"]) {nada=1;}
			else {displayFeat+=feat["properties"]["name"]+"<br>";ijk=ijk+20;}
			dd=feat["properties"]["name"];
			}
		if(feat["properties"]["type"]) {
			if(ddty==feat["properties"]["type"]) {nada=1;}
			else {displayFeat+=feat["properties"]["type"]+"<br>";ijk=ijk+20;}
			ddty=feat["properties"]["type"];
		}
		if(feat["properties"]["maki"]) {
			if(ddmaki==feat["properties"]["maki"]) {nada=1;}
			else {displayFeat+=feat["properties"]["maki"]+"<br>";ijk=ijk+20;}
			ddmaki=feat["properties"]["maki"];
		}
	});
	if(ijk>0) {ijk=ijk+30;}
	document.getElementById('features_info').innerHTML = displayFeat;
	if(displayFeat=="") {document.getElementById('features_info').style.opacity="0";}
	else {document.getElementById('features_info').style.height=ijk+"px";document.getElementById('features_info').style.opacity="0.9";}
	var theMo=mouse_position();
}
function go_with_mouse(el) {
	var offW=document.getElementById(el).offsetWidth;var offH=document.getElementById(el).offsetHeight;
	if(positionX>window.innerWidth-offW-10) {positionX=positionX - offW - 10;}
	if(positionY>window.innerHeight-offW-10) {positionY=positionY - offH - 10;}
	document.getElementById(el).style.left=positionX+"px";
	document.getElementById(el).style.top=positionY+"px";
}
function mouse_position()
{
	var ev = window.event;
    positionX = ev.clientX+10;
    positionY = ev.clientY+10;
	go_with_mouse('features_info');
}

function show_feas_log(e) {
	var features = map.queryRenderedFeatures(e.point);
	var displayProperties = [
		'type',
		'properties',
		'id',
		'layer',
		'source',
		'sourceLayer',
		'state'
	];
	var displayFeatures = features.map(function (feat) {
		var displayFeat = {};
		displayProperties.forEach(function (prop) {
		displayFeat[prop] = feat[prop];
		});
		return displayFeat;
	});
	document.getElementById('features_adm').innerHTML = JSON.stringify(
		displayFeatures,
		null,
		2
	);
}

function reset_iso() {
	if(is_started==1) {
	is_started=0;mode_circle=1;
	//$('#para_proximitat_sub').html(html_para_proximitat_sub_0);
	yes_show_id("para_proximitat_sub");
	do_html_apis_desti();
	$('#start_addres').html("");
	not_show_id('para_proximitat_opt');
	map.removeLayer('isoLayer'+is_started_clicks);map.removeSource('iso'+is_started_clicks);
	map.removeLayer('point'+is_started_clicks);	map.removeSource('point'+is_started_clicks);
	map.removeLayer('point-border'+is_started_clicks);map.removeSource('point-border'+is_started_clicks);
        y_apis.forEach(function(t) {
			map.setFilter(t, ['all']);
			if(map.getLayer(t+"-heat")) {map.setFilter(t+"-heat", ['all']);}
			for(k=0;k<obj_layers_ini[t]["i_destinations"];k++) {
				if(map.getSource('route_'+t+"_"+k)) { map.removeLayer('route_'+t+"_"+k);map.removeSource('route_'+t+"_"+k);}
				if(map.getSource('end_'+t+"_"+k)) {map.removeLayer('end_'+t+"_"+k);map.removeSource('end_'+t+"_"+k);}
				}
			obj_layers_ini[t]["totals_destination"]=0;
			obj_layers_ini[t]["i_destinations"]=0;
			obj_layers_ini[t]["i_destinations_done"]=0;
			obj_layers_ini[t]["f_min_route"]=-1;
			obj_layers_ini[t]["change_min_route"]=-1;
			obj_layers_ini[t]["f_destination_ll"]=[];
			obj_layers_ini[t]["f_destination_tt"]=[];
			});
	}
	if(imtheClient === 1) {
		sendOSCMessageToServer('reset_iso', '');
		}
}

function set_destination_tot() {
		y_apis.forEach(function(t) {
			if(obj_layers_ini[t]["is_active"]==1) {set_destination(t);}
			});
		//document.getElementById("tot_desti").classList.add('active');
}

function set_destination(t) {
	obj_layers_ini[t]["f_destination_ll"]=[];obj_layers_ini[t]["f_destination_tt"]=[];
	var feas = map.queryRenderedFeatures({ layers: [t] });//['within', feature]
					feas.forEach(function(ff) {
					i_feas++;
					console.log(ff.toJSON().geometry.coordinates);
					if(obj_layers_ini[t]["api_geo_type"]=="Point") {var ll = new mapboxgl.LngLat(ff.toJSON().geometry.coordinates[0], ff.toJSON().geometry.coordinates[1]);}
					else {var ll = new mapboxgl.LngLat(ff.toJSON().geometry.coordinates[0][0], ff.toJSON().geometry.coordinates[0][1]);}
					console.log(ll);console.log("LL-E");
					var tt = ff.toJSON().properties.name;
					obj_layers_ini[t]["f_destination_ll"].push(ll);
					obj_layers_ini[t]["f_destination_tt"].push(tt);
					});
					obj_layers_ini[t]["totals_destination"]=feas.length;
					if(feas.length>0) {put_destination(t);
					document.getElementById(t+"_desti").classList.add('active');document.getElementById("a_"+t+"_desti").classList.add('active');
					}
	if(imtheClient === 1) {
		sendOSCMessageToServer('set_destination', t);
		}
}

function get_api_opendatabcn(t) {
	yes_show_id("waiting_results");
	xi=obj_layers_ini[t]["api_base"];y0=obj_layers_ini[t]["api_url"];y1='&id='+obj_layers_ini[t]["api_id"];y2='&limit='+obj_layers_ini[t]["api_limit"];
	var Va=[]; var ob={};is_geojson=0;
	if(xi==path_base_get_api) {
    $.ajax({
      url: xi,
      data: y0+y1+y2,
	  type: 'GET',
      dataType: 'text',
      success: function(data)
      {console.log(data);
	  ob=JSON.parse(data);console.log(ob);
			if(ob["result"]) {if(ob["result"]["records"]) {ob["result"]["records"].forEach(function(el) {Va.push(el);});}}
			else if(ob["features"]) {ob["features"].forEach(function(el) {console.log("API_geojson");is_geojson=1;console.log(el);
				if(el["geometry"]["coordinates"]) {Va.push({"type":"Feature","properties": el["properties"],"geometry": el["geometry"]});}
				});
				}
	  },
      error: function(data)
      { console.log("ERROR");console.log(data);
	  },
	complete: function () {
		console.log(Va);
		obj_layers_ini[t]["api_data"]=Va;
		obj_layers_ini[t]["api_is_geojson"]=is_geojson;
		convert_geo(t);
		i_apis++;
		if(i_apis<i_apis_total) {get_api_opendatabcn(y_apis[i_apis]);} else {console.log("TOTAL APIs:"+i_apis+"/"+i_apis_total);}
	}
	});
	}
	else {
		convert_geo(t);
		i_apis++;
		if(i_apis<i_apis_total) {get_api_opendatabcn(y_apis[i_apis]);} else {console.log("TOTAL APIs:"+i_apis+"/"+i_apis_total);}
	}
}

function get_fea_name(t) {
	is_geojson=obj_layers_ini[t]["api_is_geojson"];
	var a=obj_layers_ini[t]["api_data"];
	var api_fields=obj_layers_ini[t]["api_fields"];
	var tTy0=obj_layers_ini[t]["api_geo_type"];
	var theImF=obj_layers_ini[t]['feature_icon'];
	var b=[];i=0;
	a.forEach(function(el0) {
		if(is_geojson==0) {var el=el0;} else {var el=el0["properties"];}
		el_name="";el_descri="";
		var c={};
		c["type"]="Feature";ijz=0;
		api_fields.forEach(function(elel){if(ijz==0) {sepsep="";} else {sepsep=" / ";} if(el[elel]) {el_name+=sepsep+el[elel];ijz++;}}); 
		if(el_name=="") {
			if(el["EQUIPAMENT"]) {el_name+=" "+el["EQUIPAMENT"];}
			else if(el["Equipament"]) {el_name+=" "+el["Equipament"];}
			else if(el["equipament"]) {el_name+=" "+el["equipament"];}
			if(el["Nom_Local"]) {el_name+=" "+el["Nom_Local"];}
			if(el["Nom_Activitat"]) {el_name+=" - "+el["Nom_Activitat"];}
		}
		for (var [keyX, valueX] of Object.entries(el)) {el_descri+=keyX+": "+valueX+"<br>";}
		if(el_name=="") {el_name=el_descri;}
		else {
			if(el_descri=="") {nada=1;}
			else {
				onCel="show_id('feas_descri"+allthefeas_i+"')";
				el_name="<span id='DESCRI_FEAS_feas_descri"+allthefeas_i+"' class='onc onc_DESCRI_FEAS_' style='cursor:pointer;' >"+el_name+"<br><i class='fa fa-plus'></i></span><span id='feas_descri"+allthefeas_i+"' style='display:none;'><br>"+el_descri+"</span>";
				}
			}
		c["properties"]={"name":el_name, "descri":el_descri};var keyY=""
		for (var [keyX, valueX] of Object.entries(el)) {if(keyX=="name" || keyX=="descri") {keyY="_ori__"+keyX;} else {keyY=keyX;} c["properties"][keyY]=valueX;}
		if(tTy0=="Point" && is_geojson==0) {
			if(el["LONGITUD"]) {el_lon=el["LONGITUD"];el_lat=el["LATITUD"];}
			else if(el["Longitud"]) {el_lon=el["Longitud"];el_lat=el["Latitud"];}
			else if(el["longitud"]) {el_lon=el["longitud"];el_lat=el["latitud"];}
			else if(el["LONGITUDE"]) {el_lon=el["LONGITUDE"];el_lat=el["LATITUDE"];}
			else if(el["Longitude"]) {el_lon=el["Longitude"];el_lat=el["Latitude"];}
			else if(el["longitude"]) {el_lon=el["longitude"];el_lat=el["latitude"];}
			else if(el["long"]) {el_lon=el["long"];el_lat=el["lat"];}
			else if(el["lon"]) {el_lon=el["lon"];el_lat=el["lat"];}
			else if(el["lng"]) {el_lon=el["lng"];el_lat=el["lat"];}
			c["geometry"]={"type": "Point","coordinates": [el_lon, el_lat]};
		}
		else {console.log("AHORA-POLY:",el);
			if(el0["geometry"]["coordinates"]) {
				c["geometry"]=el0["geometry"];
				}			
		}
		b.push(c);
		i++;
		allthefeas_i++;
	});	
	return b;
}

function convert_geo(t) {
	var color=obj_layers_ini[t]["feature_color"];var auxi=[];var nfield="";
	var tTy0=obj_layers_ini[t]["api_geo_type"];
	var tRule=obj_layers_ini[t]["api_rule_color"];
	if(tRule) {if(tRule=="" || tRule=="0") {var color2=color;} else {var opa=0.85;
		if(tRule=="1") {
			var nn=20;nfield="renta_id";
			var color2=["match"];
			color2.push(["get",nfield]);
			var iia=0;
			rule5col.forEach(function(ax) {
				color2.push(ax);
				auxi.push(nn*(iia+1)+"|"+ax);
				iia++;
			});
			} 
		else {
		var tRu=tRule.split(",");
		nfield=tRu[0]; 
		if(tRu[1]) {var nn_max_aux=tRu[1].split(";");var nn_max=parseInt(nn_max_aux[0]);if(nn_max_aux[1]) {var nn_min=parseInt(nn_max_aux[1]);} else {var nn_min=0;}} 
		else {var nn_max=100;} 
		if(tRu[2]) {var nnt=parseInt(tRu[2]);} else {var nnt=10;} 
		if(tRu[3]) {var nn_oper=tRu[3];} else {var nn_oper="<";}
		var nto="to-number";
		var norm_field=nn_max/(nn_max-nn_min);
		var nn=Math.round((nn_max-nn_min)/nnt);
		var a0=gradient_color(color,nnt);var a=a0.split(",");
		var color2=["case"];var iia=0;
		var color0="#ffffff";
		if(nn_max>1000) {auxi.push("x1000|NO");}
		if(tRu[4]) {auxi.push(tRu[4]+"|T");}
		a.forEach(function(ax) {
			if(nn_min==0) {var nnx=nn*(iia+1);} 
			else {var nnx=nn_min+nn*iia;}
			color2.push([nn_oper,[nto,["get",nfield]],nnx]);
			color2.push(ax);
			auxi.push(nnx+"|"+ax);				
			iia++;
			}); 
		color2.push(color);
	}}}
	else {var color2=color;var opa=0.5;}
	if(tTy0=="Point") {var tTy="circle";var tPaint={'circle-radius': {'base':7.5, 'stops': [[8, 1], [11, 4], [14, 7.5], [16, 12]]},'circle-color': color2};}
	else if(tTy0=="Polygon") {var tTy="fill";var tPaint={'fill-opacity': opa,'fill-color': color2,'fill-outline-color':color2};} 
	else if(tTy0=="LineString") {var tTy="line";var tPaint={'line-width': 3,'line-color': color2};} 
	obj_layers_ini[t]["api_vals_colors"]=auxi;
	var auxi_out="";
	var i_au=0;
	auxi.forEach(function(aux){
		var au=aux.split("|");
		if(au[1]=="NO") {
			auxi_out+=" <span class='para_colors para_colors_x'>"+numberWithPoints2(au[0])+"</span>";
			}
		else if(au[1]=="T") {
			auxi_out+=" <span class='para_colors para_colors_x2'>"+au[0]+"</span>";
			}
		else {
			auxi_out+=" <span class='para_colors'> "+numberWithPoints(au[0])+" <span class='input_layers input_layers"+tTy0+"' style='background:"+au[1]+"'></span></span>";
			}
		i_au++;
		});
	if(nfield=="") {obj_layers_ini[t]["api_vals_colors_html"]="";} 
	else {
		$("#colors-"+t).html("<br>"+auxi_out);
		obj_layers_ini[t]["api_vals_colors_html"]="<br>"+auxi_out;
		}
	var b=get_fea_name(t);
	console.log(b);
		map.addSource(t, {
		type: 'geojson',
		data: {
		"type": "FeatureCollection",
		"features": b
		}//,
		});
		map.addLayer({
		'id': t,
		'type': tTy,
		'source': t,
		'paint': tPaint //{
		});	
			map.on('click', t, function (e) {clickmap_t(t,e);});
			map.on('touchstart', t, function (e) {clickmap_t(t,e);});
			if(tTy0=="Point" && obj_layers_ini[t]["api_geo_type_plus"]=="heatmap") {add_heatmap(t);}
			if(obj_layers_ini[t]["api_geo_type_plus"]=="" || obj_layers_ini[t]["api_geo_type_plus"]=="heatmap") {nada=1;}
			else {
				add_linemap(t,{'line-width': 3,'line-color': color2});
				}
			var data_geo={"type": "FeatureCollection", "features": b}
			obj_layers_ini[t]["api_geojson"]=data_geo;
			fit(data_geo);
			map.moveLayer(t);
			checkOutThisLoad();
}

function add_linemap(t,tPaint) {
		map.addLayer({
		'id': t+'-line',
		'type': 'line',
		'source': t,
		'paint': tPaint //{
		});		
}

function checkOutThisLoad(){
    if (map.loaded() == true && map.areTilesLoaded() == true) {
         not_show_id("waiting_results");console.log("load is complete");
    } else {
       yes_show_id("waiting_results");console.log("load is incomplete");
       setTimeout(function() {checkOutThisLoad();},1000);
    }
}


function start_route() {
	var color=color_where;
		getRoute(start,"PUNT D'ORIGEN",-1,"",1,"origin");
        map.addLayer({
          'id': 'point'+is_started_clicks,
          'type': 'circle',
          'source': {
            'type': 'geojson',
            'data': {
              'type': 'FeatureCollection',
              'features': [
                {
                  'type': 'Feature',
                  'properties': {'name':'PUNT ORIGEN: '+start_address.replaceAll(", Spain","")},
                  'geometry': {
                    'type': 'Point',
                    'coordinates': start
                  }
                }
              ]
            }
          },
          'paint': {
            'circle-radius': 10,
            'circle-color': color
          }
        });
        map.addLayer({
          'id': 'point-border'+is_started_clicks,
          'type': 'circle',
          'source': {
            'type': 'geojson',
            'data': {
              'type': 'FeatureCollection',
              'features': [
                {
                  'type': 'Feature',
                  'properties': {},
                  'geometry': {
                    'type': 'Point',
                    'coordinates': start
                  }
                }
              ]
            }
          },
          'paint': {
			'circle-radius': 15,
			//'circle-stroke-color': 'white',
			'circle-stroke-width': 3,
			'circle-stroke-color': color,
			'circle-opacity': 0,
			'circle-color': color
          }
        });
			map.on('click', 'point'+is_started_clicks, function (e) {clickmap_t('point',e);});
			map.on('touchstart', 'point'+is_started_clicks, function (e) {clickmap_t('point',e);});
}


function put_destination(t) {
	var t0=t;
	  var coordsObj = obj_layers_ini[t0]["f_destination_ll"][0];
	  canvas.style.cursor = '';
	  var coords = Object.keys(coordsObj).map(function(key) {
		return coordsObj[key];
	  });
	getRoute(coords,obj_layers_ini[t0]["f_destination_tt"][0],0, obj_layers_ini[t0]["f_destination_ll"][0],0,t0);
}

// create a function to make a directions request
function getRoute(end,tt,i,ll,is_start,t) {
	// make directions request using cycling profile
	var url =
	  'https://api.mapbox.com/directions/v5/mapbox/'+ini_profile+'/' +
	  start[0] +
	  ',' +
	  start[1] +
	  ';' +
	  end[0] +
	  ',' +
	  end[1] +
	  '?steps=true&geometries=geojson&access_token=' +
	  mapboxgl.accessToken;

	// make an XHR request https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest
	var req = new XMLHttpRequest();
	req.open('GET', url, true);
	req.onload = function () {
	  var json = JSON.parse(req.response);
	  var data = json.routes[0];
	  var route = data.geometry.coordinates;console.log("route_"+t+"_"+i);console.log(route);
	  var ttT=tt+"<br>DURACIÓ (min): " + Math.floor(data.duration / 60) + "<br>DISTÀNCIA (m): " + data.distance;
	  var ttDur=Math.floor(data.duration / 60);
	  var ttDis=data.distance;
	  var geojson = {
		'type': 'Feature',
		'properties': {'name': ttT, 'dur': ttDur, 'dis': ttDis},
		'geometry': {
		  'type': 'LineString',
		  'coordinates': route
		}
	  };

	if(is_start==0) {console.log(obj_layers_ini[t]["totals_destination"]);
		if(obj_layers_ini[t]["f_min_route"]==-1) {
			obj_layers_ini[t]["f_min_route"]=Math.floor(data.duration / 60);
			obj_layers_ini[t]["change_min_route"]=i;
			}
		else {
			if(obj_layers_ini[t]["f_min_route"]>Math.floor(data.duration / 60)) {
				obj_layers_ini[t]["change_min_route"]=i;
				}
			obj_layers_ini[t]["f_min_route"]=Math.min(Math.floor(data.duration / 60),obj_layers_ini[t]["f_min_route"]);
			}
		if(Math.floor(data.duration / 60)>ini_minutes) {nada=1;} 
		else {
			obj_layers_ini[t]["i_destinations_done"]++;
			put_destination_points(end,ttT,ttDur,obj_layers_ini[t]["i_destinations"],ll,t,route);
			}
		obj_layers_ini[t]["i_destinations"]++;
		if(obj_layers_ini[t]["i_destinations"]<obj_layers_ini[t]["totals_destination"]) {console.log("TOTDESTS:"+obj_layers_ini[t]["i_destinations"]);
			  var coordsObj = obj_layers_ini[t]["f_destination_ll"][obj_layers_ini[t]["i_destinations"]];
			  canvas.style.cursor = '';
			  var coords = Object.keys(coordsObj).map(function(key) {
				return coordsObj[key];
			  });
				getRoute(coords,obj_layers_ini[t]["f_destination_tt"][obj_layers_ini[t]["i_destinations"]],obj_layers_ini[t]["i_destinations"],obj_layers_ini[t]["f_destination_ll"][obj_layers_ini[t]["i_destinations"]],0,t);
			} else {
				i_apis2++;console.log("MIN ROUTE: ",obj_layers_ini[t]["f_min_route"]);
				console.log(obj_layers_ini[t]["i_destinations"],"/",obj_layers_ini[t]["i_destinations_done"]);
				setActiveRoute(t);
				}
		}
	};
	req.send();
}

function setActiveRoute(el_t) {
	var color="#ef3333";
	var jj=0;
	var i_t=obj_layers_ini[el_t]["change_min_route"];
	$("#"+el_t+"_desti_result").html("<span class='para_desti_result_ini'> ("+obj_layers_ini[el_t]["f_destination_tt"].filter(onlyUnique).length + ") - <span style='color:"+color+"'>" + obj_layers_ini[el_t]["f_min_route"] + " minuts</span><span class='para_desti_result'>"+obj_layers_ini[el_t]["f_destination_tt"][i_t])+"</span></span>";
	yes_show_id(el_t+"_desti_result");
		var lay_id='route_'+el_t+"_"+i_t;
		var lay_id_end='end_'+el_t+"_"+i_t;
		if(map.getLayer(lay_id_end)) {
		map.setPaintProperty(lay_id_end, 'circle-stroke-color', color);
		map.moveLayer(lay_id_end);
		}
		if(map.getLayer(lay_id)) {
		map.setPaintProperty(lay_id, 'line-color', color);
		map.setPaintProperty(lay_id, 'line-opacity', 0.9);
		map.moveLayer(lay_id);
		}
		y_apis_desti_min_id[el_t]=i_t;
	for (var [key, value] of Object.entries(y_apis_desti_min_id)) {
		var lay_id='route_'+key+"_"+value;
		if(map.getLayer(lay_id)) {map.moveLayer(lay_id);}
		}
}
function put_destination_route(end,ttT,ttDur,i0,ll,t,route0) {console.log("DESTINATIONS: ",route0);//alert('route_'+t+"_"+i);
		var color=obj_layers_ini[t]["feature_color"];
          var geojson0 = {
            'type': 'Feature',
            'properties': {'name': ttT, 'dur':ttDur},
            'geometry': {
              'type': 'LineString',
              'coordinates': route0
            }
          };
          // if the route already exists on the map, we'll reset it using setData
          if (map.getSource('route_'+t+"_"+i0)) {console.log(i0);
            map.getSource('route_'+t+"_"+i0).setData(geojson0);
          }
          // otherwise, we'll make a new request
          else {console.log("N"+i0);console.log("DESTINATIONS geo: ",geojson0);
		map.addLayer({
              'id': 'route_'+t+"_"+i0,
              'type': 'line',
              'source': {
                'type': 'geojson',
                'data': {
                  'type': 'Feature',
                  'properties': {'name': ttT},
                  'geometry': {
                    'type': 'LineString',
                    'coordinates': route0
                  }
                }
              },
              'layout': {
                'line-join': 'round',
                'line-cap': 'round'
              },
              'paint': {
                //'line-color': '#3887be',
                'line-color': color,
                'line-width': 3,
                'line-opacity': 0.3
              }
			});
			map.on('click', 'route_'+t+"_"+i0, function (e) {clickmap_t(t,e);});
			map.on('touchstart', 'route_'+t+"_"+i0, function (e) {clickmap_t(t,e);});
          }
}

function put_destination_points(end,ttT,ttDur,i0,ll,t,route0) {
	var color=obj_layers_ini[t]["feature_color"];
  var end_to = {
    type: 'FeatureCollection',
    features: [{
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Point',
        coordinates: end
      }
    }
    ]
  };
  if (map.getLayer('end_'+t+"_"+i0)) {
    map.getSource('end_'+t+"_"+i0).setData(end_to);
  } else {
    map.addLayer({
      id: 'end_'+t+"_"+i0,
      type: 'circle',
      source: {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {'name':ttT, 'dur':ttDur, 'end_desti':'0'},
            geometry: {
              type: 'Point',
              coordinates: end
            }
          }]
        }
      },
      paint: {
        'circle-radius': 15,
		//'circle-stroke-color': 'white',
		'circle-stroke-width': 3,
		'circle-stroke-color': color,
		'circle-opacity': 0,
		'circle-color': color
      }
    });
  }
			map.on('click', 'end_'+t+"_"+i0, function (e) {clickmap_t(t,e);});
			map.on('touchstart', 'end_'+t+"_"+i0, function (e) {clickmap_t(t,e);});
	put_destination_route(end,ttT,ttDur,i0,ll,t,route0);  
}
	
function add_heatmap(t) {
	var color=obj_layers_ini[t]["feature_color"];
	map.addLayer(
	{
	'id': t+'-heat',
	'type': 'heatmap',
	'source': t,
	'maxzoom': 16,
	'paint': {
	'heatmap-weight': [
	'interpolate',
	['linear'],
	['get', 'name'],
	0,
	0,
	16,
	1
	],
	'heatmap-intensity': [
	'interpolate',
	['linear'],
	['zoom'],
	0,
	1,
	18,
	6
	],
	'heatmap-color': [
	'interpolate',
	['linear'],
	['heatmap-density'],
		  0, 'rgba('+hexToRgb(color).r+','+hexToRgb(color).g+','+hexToRgb(color).b+',0)',
		  0.2, 'rgba('+hexToRgb(color).r+','+hexToRgb(color).g+','+hexToRgb(color).b+',0.9)',
		  0.4, 'rgba('+hexToRgb(color).r+','+hexToRgb(color).g+','+hexToRgb(color).b+',0.8)',
		  0.6, 'rgba('+hexToRgb(color).r+','+hexToRgb(color).g+','+hexToRgb(color).b+',0.7)',
		  0.8, 'rgba('+hexToRgb(color).r+','+hexToRgb(color).g+','+hexToRgb(color).b+',0.6)'
	],
	// Adjust the heatmap radius by zoom level
	'heatmap-radius': [
	'interpolate',
	['linear'],
	['zoom'],
	0,
	2,
	9,
	20
	],
	// Transition from heatmap to circle layer by zoom level
	'heatmap-opacity': [
	'interpolate',
	['linear'],
	['zoom'],
	7,
	1,
	16,
	0
	]
	}
	}
	);	
}


function getReverseGeocode(lat, lng) {
    var url = "https://api.mapbox.com/geocoding/v5/mapbox.places/" + lat + "," + lng + ".json?access_token=" + mapboxgl.accessToken;
    $.get(url, function(data){
        var myData = data;
        doAThing(data);
    });
    function doAThing(data){
		console.log(data);
		start_address=data.features[0].place_name;console.log(start_address);
		$('#start_address').html(start_address.replaceAll(", Spain",""));
    }
}


function getReverseGeocode_fea(feature) {
    var lat = feature.geometry.coordinates[0];
    var lng = feature.geometry.coordinates[1];
    var url = "https://api.mapbox.com/geocoding/v5/mapbox.places/" + lat + "," + lng + ".json?access_token=" + mapboxgl.accessToken;
    $.get(url, function(data){
        var myData = data;
        doAThing(data);
    });
    function doAThing(data){
        // Populate the popup and set its coordinates based on the feature found.
        var popup = new mapboxgl.Popup()
            .setLngLat(feature.geometry.coordinates)
            .setHTML(makeHtml(data))
            .addTo(map);
    }

    function makeHtml(data) {
        var feature = data.features[0];
        var name = feature.text;
        var type = feature.type;

        var formattedHtml = "<strong>" + name + "</strong><br>" + type;
        return formattedHtml;
    }
}

String.prototype.replaceAll = function(search, replacement) {
var target = this;
return target.replace(new RegExp(search, 'g'), replacement);
};

function put_value(el,val) {
	document.getElementById(el).value=val;
}

function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

function componentToHex(c) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function gradient_color(c,n) {
	var cc=hexToRgb(c);
	var cc_max=Math.max(cc.r,cc.g,cc.b);
	if(cc_max<=10) {c="#777777";cc=hexToRgb(c);cc_max=Math.max(cc.r,cc.g,cc.b);}
	var nx=Math.round(cc_max/n);var re="";
	for(i=n-1; i>=0; i--) {
		j=i;
		var c_r=cc.r;var c_g=cc.g;var c_b=cc.b;
		if(cc_max-c_r<10) {c_r=c_r-nx*j;} if(cc_max-c_g<10) {c_g=c_g-nx*j;} if(cc_max-c_b<10) {c_b=c_b-nx*j;}
		var ccc=rgbToHex(c_r,c_g,c_b);
		if(i==n-1) {sep="";} else {sep=",";} re+=sep+ccc;
	}
	console.log(re);
	return re;
}

function calc_fw(x,ma) {
	var out=Math.round(100*Math.min(1,x/ma));
	return out;
}
function PadLeft(value, length) {
    return (value.toString().length < length) ? PadLeft("0" + value, length) : 
    value;
}
function numberWithPoints2(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}
function numberWithPoints(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".").split(".")[0];
}

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}


	function show_id(id) {
		if(document.getElementById(id)) {
			if(document.getElementById(id).style.display=="none") {document.getElementById(id).style.display="inline-block";}
			else {document.getElementById(id).style.display="none";}
		}
		else {console.log(id+" NOT EXISTS");}
		}
	function yes_show_id(id) {
		if(document.getElementById(id)) {
			document.getElementById(id).style.display="inline-block";
		}
		else {console.log(id+" NOT EXISTS");}
		}
	function not_show_id(id) {
		if(document.getElementById(id)) {
			document.getElementById(id).style.display="none";
		}
		else {console.log(id+" NOT EXISTS");}
		}
	function showByClass(cl,dis) {
		var x = document.getElementsByClassName(cl);
		var i;
		for (i = 0; i < x.length; i++) {
		  x[i].style.display = dis;
		}	
	}
	function removeByClass(cl,z) {
		var x = document.getElementsByClassName(cl);
		var i;
		for (i = 0; i < x.length; i++) {
		  x[i].classList.remove(z);
		}	
	}
	function addByClass(cl,z) {
		var x = document.getElementsByClassName(cl);
		var i;
		for (i = 0; i < x.length; i++) {
		  x[i].classList.add(z);
		}	
	}

function downloadURI(uri, name) {
    var link = document.createElement("a");
    link.download = name;
    link.href = uri;
    document.body.appendChild(link);
    link.click();
	show_id("grid_waiting_for_foto");
}
function DownloadAsImage() {show_id("grid_waiting_for_foto");
	var mapCanvas = map.getCanvas(document.querySelector('.mapboxgl-canvas'));
		var image = new Image();
		image.src = mapCanvas.toDataURL('image/png');
		document.getElementById("theImgCaptCanvas").src=image.src;
		show_id("grid_waiting_for_foto");
		show_id('grid_for_foto');
}

function downMOMENTO() {
	forceDownload(document.getElementById("theImgCaptCanvas").src, "ciutat-proxima.png")
}
function forceDownload(url, fileName){
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.responseType = "blob";
    xhr.onload = function(){
        var urlCreator = window.URL || window.webkitURL;
        var imageUrl = urlCreator.createObjectURL(this.response);
        var tag = document.createElement('a');
        tag.href = imageUrl;
        tag.download = fileName;
        document.body.appendChild(tag);
        tag.click();
        document.body.removeChild(tag);
    }
    xhr.send();
}

var dpi = 300;
Object.defineProperty(window, 'devicePixelRatio', {
    get: function() {return dpi / 96}
});

function slugify(text)
{
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
}
