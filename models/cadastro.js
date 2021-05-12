const venom = require('venom-bot')




//Send mensagen using wpp 
function sendMensagen(telefone, nome, timeStart) {
    $('#agendandoPross').modal('show')
    venom
        .create(
            'sessionName',
            (statusSession)=>{
                if(statusSession == 'notLogged'){
                    $('#agendandoPross').modal('hide')
                    $('#celularNaoCadastrado').modal('show')
                }
            },
            undefined,        
        ).then((client) => {
            start(client);
        })
        .catch((erro) => {
            console.log(erro);
        });

    const start = (client) => {
        client
            .sendText(telefone + '@c.us', 'Olá ' + nome + '!! aqui é a assistênte virtual do consultório, sua consulta para o dia ' + timeStart + ' foi marcada com sucesso!! Não se preocupe iremos te lembrar quando estiver mais próximo a data. Agradeçemos a sua preferencia!!')
            .then((result) => {              
                window.location.reload() 
            })
            .catch((erro) => {
                $('#erroEnvioConsult').modal('show')
                 
            });
    }
}


function cadastro_evento() {
    const re = new RegExp("/\d{13}/g")
    const nome = document.getElementById('title').value
    const cpf = document.getElementById('cpfPaciente').value
    const endpaciente = document.getElementById('endPaciente').value
    const bairro = document.getElementById('bairroPaciente').value
    const cidade = document.getElementById('cidPaciente').value
    const tel = document.getElementById('telPaciente').value
    const especialidade = document.getElementById('especialidade').value
    const nomeMed = document.getElementById('nomeMedico').value
    const motivo = document.getElementById('description').value
    const start = document.getElementById('start').innerText
    const end = document.getElementById('end').innerText
    const tipoConsulta = document.querySelector('input[name=flexRadioDefault]:checked').value
    if (nome != '' && cpf != '' && endpaciente != '' && bairro != '' && cidade != '' && tel != '' && especialidade != '' && nomeMed != '' && motivo != '' && tipoConsulta != '') {
        if (true) { //regex test 
            function strToDate(dtStr) {
                let dateParts = dtStr.split("/");
                let timeParts = dateParts[2].split(" ")[1].split(":");
                dateParts[2] = dateParts[2].split(" ")[0];
                return dateObject = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0], timeParts[0], timeParts[1], timeParts[2]);
            }
            const convert_start = strToDate(start)
            const convert_end = strToDate(end)



            const fichaCadastral = {
                title: nome,
                cpf: cpf,
                endereco: endpaciente,
                bairro: bairro,
                cidade: cidade,
                telefone: tel,
                especialidade: especialidade,
                nomeMedico: nomeMed,
                description: motivo,
                start: convert_start,
                end: convert_end,
                tipoConsulta: tipoConsulta
            }
            ipcRenderer.send('fichaCadastral', fichaCadastral)
            $('#cadastrar').modal('hide')
            sendMensagen(tel, nome, start)

        } else {
            $('#telefoneErrado').modal('show')
        }
    }else{
        $('#preencheIncompleto').modal('show')
    }

}

