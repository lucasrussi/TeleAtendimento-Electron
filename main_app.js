const { BrowserWindow, Notification, ipcMain, app } = require('electron')
const fs = require('fs');
const task = require('./models/taks');


let mainWindow
let filter
function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1000, height: 800,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true
        },
        icon:__dirname + "/icon.png"
    })
    mainWindow.loadURL(`file://${__dirname}/views/login.html`);
    mainWindow.webContents.openDevTools();

    mainWindow.setMenuBarVisibility(false)
    mainWindow.on('close', async () => {

        const update = {
            statusLogin: '0'
        }
        await task.findOneAndUpdate(filter, update)
    })

}

//Calendario Nível 1 - auxiliar
ipcMain.on('fichaCadastral', (e, args) => {
    try {
        const cadastro = new task(args)
        const cadastroSave = cadastro.save()
    } catch (error) {
        console.log(error)
    }

})

ipcMain.on('get-task', async (e, args) => {
    try {
        const get_task = await task.find({}, 'title start end description tipoConsulta telefone -_id')
        const json_str = JSON.stringify(get_task)
        fs.writeFileSync('events.json', json_str, (err) => {
            if (err) throw err;
        })
        e.reply('get-task', (e, json_str))
    } catch (error) {
        console.log(error)
    }
})
//Calendário Nível 2 - operacional

// Fornecedores
ipcMain.on('get-fornecedores', async (e, args) => {
    try {
        const get_fornecedores = await task.find({}, 'nomeFornecedor nome_fantasia cnpj rua_fornecedor bairro_fornecedor cidade_fornecedor telefone_fornecedor -_id')
        const json_str = JSON.stringify(get_fornecedores)
        e.reply('get-fornecedores', json_str)
    } catch (error) {
        console.log('ola to desconectado')
    }
})
ipcMain.on('fichaFornecedor', (e, args) => {
    try {
        const cadastroFornecedor = new task(args)
        const cadastroSave = cadastroFornecedor.save()
    } catch (error) {
        console.log(error)
    }
})

ipcMain.on('AdicionarHistorico', (e, args) => {
    const cadastroHistorico = new task(args)
    const saveHistorico = cadastroHistorico.save()
    e.reply('AdicionarHistorico')

})
ipcMain.on('Excluirfornecedor', async (e, args) => {
    try {
        console.log('esse e o args do exluir', args)
        await task.deleteMany({ nomeFornecedor: args })
    } catch (error) {
        console.log(error)
    }
})
ipcMain.on('GetHistorico', async (e, args) => {
    try {
        const GetHistorico = await task.find({nomeFornecedor:{$in:args}},'historico_descricao historico_data -_id')
        const json_str = JSON.stringify(GetHistorico)
        e.reply('GetHistorico',json_str)
    } catch (error) {
        console.log(error)
    }
   
})

//função do prontuario
ipcMain.on('get-historico-paciente', async (e, args) => {
    try {

        const get_historico_paciente = await task.find({ historico_nome: { $in: args } })
        const json_str = JSON.stringify(get_historico_paciente)
        e.reply('get-historico-paciente', json_str)
    } catch (error) {
        console.log(error)
    }
})
ipcMain.on('salveHistorico', async (e, args) => {
    try {
        const cadastroHistoricoPaciente = new task(args)
        const saveHistoricoPaciente = cadastroHistoricoPaciente.save()

    } catch (error) {
        console.log(error)
    }
})

//função de deletar pessoas do calendário

ipcMain.on('delete', async (e, args) => {
    try {
        await task.deleteOne({ title: { $in: args } })
    } catch (error) {
        console.log(error)

    }
})

//salvando historico de atendimento realizado
ipcMain.on('save-historico-atendimento', async (e, args) => {
    try {
        const cadastroHistoricoPaciente = new task(args)
        const saveHistoricoPaciente = cadastroHistoricoPaciente.save()
    } catch (error) {
        console.log(error)
    }

})

//function principais do dashboard

ipcMain.on('save-valores-consultas', async (e, args) => {
    try {
        const salvandoValoresConsultas = new task(args)
        const saveHistoricoPaciente = salvandoValoresConsultas.save()
    } catch (error) {
        console.log(error)
    }
})
ipcMain.on('get_dates_dashboard', async (e, args) => {
    try {
        const get_dates_dashboard = await task.find({}, "atendimento_tipo atendimento_data -_id")
        const json_str = JSON.stringify(get_dates_dashboard)
        e.reply('get_dates_dashboard', json_str)
    } catch (error) {
        console.log(error)
    }
})
ipcMain.on('get_value_consultas', async (e, args) => {
    try {
        const get_value_consultas = await task.find({}, "valor_convenio valor_SUS valor_particular despesas -_id")
        const json_str = JSON.stringify(get_value_consultas)
        e.reply('get_value_consultas', json_str)
    } catch (error) {
        console.log(error)
    }
})
//funções de login

ipcMain.on('findKey', async (e, args) => {
    try {
        const findKey = await task.findOne({ key: { $in: args } })
        const json_str = JSON.stringify(findKey)
        e.reply('findKey', json_str)
    } catch (error) {
        console.log(error)
    }
})

//verificação do login
ipcMain.on('verifyAcc', async (e, args) => {
    try {
        const findacc = await task.findOne({ account: { $in: args.account }, pass: { $in: args.pass } }, 'nomeCadastro tipoAcc -_id')
        const json_str = JSON.stringify(findacc)
        e.reply('verifyAcc', json_str)
    } catch (error) {
        console.log(error)
    }
})

//update do login para logado ou deslogado
ipcMain.on('updateAcc', async (e, args) => {
    try {
        filter = args
        const update = {
            statusLogin: '1'
        }
        const updateAcc = await task.findOneAndUpdate(filter, update)
        e.reply('updateAcc', updateAcc)
    } catch (error) {
        console.log(error)
    }
})
//novo cadastro
ipcMain.on('newCadastro', async (e, args) => {
    try {
        const cadastro = new task(args)
        const cadastroSave = cadastro.save()
        e.reply('newCadastro')
    } catch (error) {
        console.log(error)
    }
})
//delete key
ipcMain.on('deleteKey', async (e, args) => {
    try {
        const deleteKey = await task.deleteOne({ key: { $in: args } })
        e.reply('deleteKey')
    } catch (error) {
        console.log(error)
    }
})


//Textos da assistente virtual

//mensagem de confirmação de atendimento
ipcMain.on('SaveConfigAgenda', async (e, args) => {
    try {
        const filter = {
            loginDoTexto: args.loginDoTexto,
        }
        const update = {
            textoAgendamento: args.textoAgendamento
        }
        const updateAgenda = await task.findOne({ loginDoTexto: { $in: args.loginDoTexto } }, 'loginDoTexto textoAgendamento -_id')
        if (updateAgenda == null) {
            const cadastro = new task(args)
            const cadastroSave = cadastro.save()
        } else {
            await task.findOneAndUpdate(filter, update)
        }
        e.reply('SaveConfigAgenda')
        console.log('esse e o updateAgenda:', updateAgenda)
    } catch (error) {
        console.log(error)
    }
})

ipcMain.on('SaveConfigLembrete', async (e, args) => {
    try {
        const filter = {
            loginDoLembrete: args.loginDoLembrete
        }
        const update = {
            textoLembrete: args.textoLembrete
        }
        const updateAgenda = await task.findOne({ loginDoLembrete: { $in: args.loginDoLembrete } }, 'loginDoLembrete textoLembrete -_id')
        if (updateAgenda == null) {
            const cadastro = new task(args)
            const cadastroSave = cadastro.save()
        } else {
            await task.findOneAndUpdate(filter, update)
        }
        e.reply('SaveConfigLembrete')
        console.log('esse e o updateAgenda:', updateAgenda)
    } catch (error) {
        console.log(error)
    }
})



//processo de saida

ipcMain.on('exitProcess', async (e, args) => {

        process.exit()
   
})
module.exports = {
    createWindow,
}
