const WebSocket = require('ws')
const mysql = require('mysql')

const ws = new WebSocket ('ws://10.1.13.17:8002')

var dataFromDB
var dataFromServ
var devices = []

var connection = mysql.createConnection({
  host     : '10.221.10.102',
  user     : 'innopolis',
  password : '!a$utp_inn0',
  port     : '9001',
  database : 'innopolis'
});

function loadDevices() {
  ws.send(JSON.stringify({token: tokenKey, cmd:"get_device_appdata_req"}));
}

function loadHistory(devEui) {
  ws.send(  JSON.stringify( {token: tokenKey, cmd:"get_data_req", devEui, "select": {"limit":50}} )  );
}

function loadHistoryFromDB(devEui) {
    let query = `SELECT * FROM innopolis.tn_skli_base_shadow WHERE DATE_FORMAT(value_date, '%Y-%m-%d') = '${formateDate()}' AND device_eui = '${devEui}'`
    let result = connection.query(query, function(err, result) {
    // console.log(err);
    return query;
  });
}

var tokenKey

ws.onopen = function() {
  ws.send(JSON.stringify({ cmd: "auth_req", login:"en_lora", password: "L0r@EN"}))
}

ws.onmessage = (response) => {
  console.log(response.data)
  console.log('---------------')
  
  let unPars = JSON.parse(response.data)

  if ("cmd" in unPars){
    if (unPars.cmd === "auth_resp"){
      tokenKey = unPars.token
      loadDevices()
      
    } else if (unPars.cmd === "rx") {
      
    } else if (unPars.cmd === "get_device_appdata_resp") {
      devices = unPars.devices_list

      for (let i = 0; i < devices.length; i++) {
        let device = devices[i].devEui
        console.log(loadHistoryFromDB(device))
      }
    } else if (unPars.cmd === "get_device_appdata_req") {}
  }

}

function addZero(n) {
  return (n < 10) ? `0${n}` : n
}

function formateDate () {
  let date = new Date()
  return [date.getFullYear(), addZero(date.getMonth() + 1), addZero(date.getDate())].join("-")
}