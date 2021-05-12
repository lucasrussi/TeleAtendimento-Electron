

function prontuario() {
    const nomePaciente = document.getElementById('nomePaciente').innerHTML
    localStorage.setItem('nomePaciente',nomePaciente)
    console.log('esse é o nome do paciente:', nomePaciente)
    ipcRenderer.send('get-historico-paciente',nomePaciente)
    ipcRenderer.on('get-historico-paciente',(e,args)=>{
        const historico = JSON.parse(args)
        localStorage.setItem('historicoPaciente',args)
    })
    window.location.href='../views/prontuario.html';
}
function telemedicina(){
    const nomePaciente = document.getElementById('nomePaciente').innerHTML
    localStorage.setItem('nomePaciente',nomePaciente)
    console.log('esse é o nome do paciente:', nomePaciente)
    ipcRenderer.send('get-historico-paciente',nomePaciente)
    ipcRenderer.on('get-historico-paciente',(e,args)=>{
        const historico = JSON.parse(args)
        localStorage.setItem('historicoPaciente',args)
    })
    window.location.href='../views/telemed.html';
}
