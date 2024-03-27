let {ipcRenderer} = require('electron');
let ganador = document.getElementById('ganador');

ipcRenderer.on('canal_respuesta3',(event,arg)=>{
    ganador.innerHTML=arg;
})
