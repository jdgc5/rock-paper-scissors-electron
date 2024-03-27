const {ipcRenderer} = require('electron');
const boton = document.getElementById('button1');

let opcion = ['piedra','papel','tijera'];
let wishedOption = Math.floor(Math.random()*3);
boton.addEventListener('click', ()=>{
    ipcRenderer.send('elcanalasincrono', opcion[wishedOption]);
})
ipcRenderer.on('canal_respuesta',(event,arg)=>{
    console.log(arg);
})

ipcRenderer.on('elcanal',(event,arg)=>{
    console.log(arg);
})

setInterval(()=>{
    let numero = Math.floor(Math.random()*36);
    document.getElementById("numero").innerHTML = numero;
},1000)