const ws = new WebSocket ('ws://10.1.13.17:8002')

ws.onopen = () => {
  loadHistory()
}

ws.onmessage = (response) => {
  console.log(response.data)
  console.log('---------------')
  
  let unPars = JSON.parse(response.data)

  if ("cmd" in unPars){
    if (unPars.cmd === "auth_resp"){
      tokenKey = unPars.token
      loadHistory('70B5D54B1C00112C')
    } else if (unPars.cmd === "rx") {

    }
  }

  console.log(tokenKey)
}