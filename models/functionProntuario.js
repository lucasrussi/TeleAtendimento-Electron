const { ipcRenderer } = require("electron")
const fs = require('fs')
const historicoListagem = document.querySelector('#HistoricoPaciente')

//variaveis globais
let prontuarioHistorico = ''
let receituarioHistorico = ''
let tipoDaReceita = ''



//Escolha e mostragem de receituário
function escolhaReceita() {
    prontuarioHistorico = document.getElementById('relatorioProntuarioMedico').value
    console.log('esse é o prontuarioHistorico: ', prontuarioHistorico)
    $('#tipoReceita').modal('show')
}

function receitaPadrao() {
    $('#tipoReceita').modal('hide')
    tipoDaReceita = 'Padrao'
    setTimeout(() => {
        $('#receituarioPadrao').modal('show')
    }, 500);
}
function receitaEspecial() {
    $('#tipoReceita').modal('hide')
    tipoDaReceita = 'Controle'
    setTimeout(() => {
        $('#receituarioEspecial').modal('show')
    }, 500);
}

function escolhaFeita() {
    const escolha = document.querySelector('input[name=flexRadioDefault]:checked').value
    if (escolha == 'padrao') {
        receitaPadrao()
    }
    if (escolha == 'controlEspecial') {
        receitaEspecial()
    }
}

//deletar consultas realizadas e somando quantidade

function deletarEsomar(nomePaciente,data){
    let tipoConsulta = localStorage.getItem('tipoConsulta')
    const save = {
        atendimento_tipo:tipoConsulta,
        atendimento_data:data
    }
    ipcRenderer.send('delete',nomePaciente)
    ipcRenderer.send('save-historico-atendimento',save)
}


//imprimir e gravar o receituário

function imprimiReceituario() {
    receituarioHistorico = document.getElementById('receituarioPaciente').value
    //data
    const dataAtual = new Date()
    const dia = dataAtual.getDate()
    const mes = (dataAtual.getMonth() + 1)
    const ano = dataAtual.getFullYear()
    const data = dia + '/' + mes + '/' + ano
    const nometeste = localStorage.getItem('nomePaciente')

    const salveHistorico = {
        historico_nome: nometeste,
        historico_prontuario: prontuarioHistorico,
        historico_receituario: receituarioHistorico,
        historico_tipoConsulta: tipoDaReceita,
        historico_data: data
    }

    deletarEsomar(nometeste,data)
    ipcRenderer.send('salveHistorico', salveHistorico)
    window.print()

}

function imprimiReceituarioControlado() {
    receituarioHistorico = document.getElementById('receituarioPaciente').value
    //data
    const dataAtual = new Date()
    const dia = dataAtual.getDate()
    const mes = (dataAtual.getMonth() + 1)
    const ano = dataAtual.getFullYear()
    const data = dia + '/' + mes + '/' + ano
    const nometeste = localStorage.getItem('nomePaciente')

    const salveHistorico = {
        historico_nome: nometeste,
        historico_prontuario: prontuarioHistorico,
        historico_receituario: receituarioHistorico,
        historico_tipoConsulta: tipoDaReceita,
        historico_data: data
    }
    deletarEsomar(nometeste,data)
    ipcRenderer.send('salveHistorico', salveHistorico)
    window.print()

}


//vizualização do historico do paciente

const historico = localStorage.getItem('historicoPaciente')
const json_file = JSON.parse(historico)
json_file.map(t => {
    historicoListagem.innerHTML += `
        <p>Data: ${t.historico_data}</p><br>
        <p>Prontuário: ${t.historico_prontuario}</p><br>
        <p>Receituário: ${t.historico_receituario}</p><br>
        <p>Tipo do recentiário:${t.historico_tipoConsulta}</p>
        <hr>
    
    `
})


//encerramento da consulta


//modal de confirmação pra encerramento
function confirmacaoEncerramento(){
    $('#confirmacaoEncerramento').modal('show')
}

function encerrarConsulta() {
    receituarioHistorico = document.getElementById('receituarioPaciente').value
    const dataAtual = new Date()
    const dia = dataAtual.getDate()
    const mes = (dataAtual.getMonth() + 1)
    const ano = dataAtual.getFullYear()
    const data = dia + '/' + mes + '/' + ano
    const nometeste = localStorage.getItem('nomePaciente')

    const salveHistorico ={
        historico_nome: nometeste,
        historico_prontuario: prontuarioHistorico,
        historico_receituario:'Consulta encerrada sem a\nemissão de receituário',
        historico_data: data,
    }

    console.log('salve historico do encerramentoConsulta, ', salveHistorico)
    deletarEsomar(nometeste,data)
    ipcRenderer.send('salveHistorico', salveHistorico)
    window.location.href='../views/medIndex.html'

}