const { ipcRenderer } = require('electron');
const venom = require('venom-bot')

function habilitarcell() {
    $('#aguarde').modal('show')
    venom
        .create(
            'sessionName',
            (base64Qr, asciiQR) => {
                console.log(asciiQR); // Optional to log the QR in the terminal
                
                var matches = base64Qr.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
                    response = {};

                if (matches.length !== 3) {
                    return new Error('Invalid input string');
                }
                response.type = matches[1];
                response.data = new Buffer.from(matches[2], 'base64');

                var imageBuffer = response;
                require('fs').writeFileSync(
                    'out.png',
                    imageBuffer['data'],
                    'binary',
                    function (err) {
                        if (err != null) {
                            console.log(err);
                        }
                    }
                );
                imagem.innerHTML = `
                <img src='../out.png'>
                `
                $('#aguarde').modal('hide')
                $('#faltaValidacao').modal('show')
            },
            (statusSession)=>{
                if(statusSession == 'isLogged'){
                    $('#aguarde').modal('hide')
                    $('#celularReady').modal('show')
                }
                if(statusSession == 'qrReadSuccess'){
                    $('#faltaValidacao').modal('hide')
                }
            },
            undefined,
           
            { logQR: false }
        )
}
function salvaConfigAgenda() {
    const textoAgenda = document.getElementById('confirmacaoAgenda').value
    const login = localStorage.getItem('login')

    const dados ={
        loginDoTexto:login,
        textoAgendamento:textoAgenda
    }

    ipcRenderer.send('SaveConfigAgenda',dados)
    ipcRenderer.on('SaveConfigAgenda',()=>{
        $('#configAgenda').modal('hide')
        $('#altSalvas').modal('show')
    })

}

function salvaConfigLembrete(){
    const textoLembrete = document.getElementById('lembreteAgenda').value
    const login = localStorage.getItem('login')

    const dados = {
        loginDoLembrete:login,
        textoLembrete:textoLembrete
    }
    ipcRenderer.send('SaveConfigLembrete',dados)
    ipcRenderer.on('SaveConfigLembrete',()=>{
        $('#configLembrete').modal('hide')
        $('#altSalvas').modal('show')
    })

}