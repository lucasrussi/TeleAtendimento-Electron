const { ipcRenderer } = require("electron")

const fornecedoresList = document.querySelector("#tableFornecedores")
const historicoList = document.querySelector("#historicoRender")
ipcRenderer.send('get-fornecedores')


let fornecedores = {}
function modalDetalhes(key) {
    const filter_fornecedor = fornecedores.filter(index => index.cnpj == key)
    filter_fornecedor.map(t => {
        $("#DetalhesFornecedor #nomeFornecedor").text(t.nomeFornecedor)
        $("#DetalhesFornecedor #nome_fantasia").text(t.nome_fantasia)
        $("#DetalhesFornecedor #cnpj").text(t.cnpj)
        $("#DetalhesFornecedor #telefone_fornecedor").text(t.telefone_fornecedor)
        $("#DetalhesFornecedor #rua_fornecedor").text(t.rua_fornecedor)
        $("#DetalhesFornecedor #bairro_fornecedor").text(t.bairro_fornecedor)
        $("#DetalhesFornecedor #cidade_fornecedor").text(t.cidade_fornecedor)
        $('#DetalhesFornecedor').modal('show');
    })

}

function renderForncedores(fornecedores) {
    fornecedores.map(t => {
        if (t.nomeFornecedor != undefined && t.cnpj != undefined) {
            fornecedoresList.innerHTML += `
            <tr>
                <th scope="row">${t.nomeFornecedor}</th>
                <td>${t.nome_fantasia}</td>
                <td>${t.cnpj}</td>
                <td>${t.telefone_fornecedor}</td>
                <td>
                    <button class="fas fa-eye" onClick="modalDetalhes('${t.cnpj}')" style="border:none; background-color:white;"></button>
                </td>
            </tr>`
        }
    })

}

ipcRenderer.on('get-fornecedores', (e, args) => {
    fornecedores = JSON.parse(args)
    console.log(fornecedores)
    renderForncedores(fornecedores)
})

function cadastro() {
    $('#cadastrarFornecedor').modal('show')
}

function cadastro_fornecedor() {
    const nome = document.getElementById('nome').value
    const nome_fantasia = document.getElementById('nomeFantasia').value
    const cnpj = document.getElementById('cnpj').value
    const telefone = document.getElementById('telefone').value
    const endereco = document.getElementById('endereco').value
    const bairro = document.getElementById('bairro').value
    const cidade = document.getElementById('cidade').value

    const fichaFornecedor = {
        nomeFornecedor: nome,
        nome_fantasia: nome_fantasia,
        cnpj: cnpj,
        telefone_fornecedor: telefone,
        rua_fornecedor: endereco,
        bairro_fornecedor: bairro,
        cidade_fornecedor: cidade
    }
    ipcRenderer.send('fichaFornecedor', fichaFornecedor)
    setTimeout(() => {
        location.reload()
    }, 500);
}


//Botões utilitários do modal de detalhes do fornecedor


//Botões de mostrar modais
function abrirmodal_adicionar() {
    $('#HistoricoPedidos #nomeFornecedor').text($('#DetalhesFornecedor #nomeFornecedor').text())
    $('#DetalhesFornecedor').modal('hide')
    setTimeout(() => {
        $('#HistoricoPedidos').modal('show')
    }, 500);
}
function abrirmotal_historico() {
    const key = $('#DetalhesFornecedor #nomeFornecedor').text()
    ipcRenderer.send('GetHistorico',key)
    ipcRenderer.on('GetHistorico',(e,args)=>{
        console.log('esse é o args do abrirmodal', args)
        const filter_historico = JSON.parse(args)
        filter_historico.map(t => {
            if (t.historico_descricao != undefined && t.historico_data != undefined) {
                historicoList.innerHTML += `
                    <h5 type="text">${t.historico_descricao}</h5>
                    <h6 type="text">${t.historico_data}</h6>
                    <hr></hr>   
                `
            }
        })

    })
    

    $('#DetalhesFornecedor').modal('hide')
    setTimeout(() => {
        $('#HistoricoAmostra').modal('show')
    }, 500);
}
//funções dos botões
function excluir() {
    const nome_fornecedor = document.getElementById('nomeFornecedor').innerText
    ipcRenderer.send('Excluirfornecedor', nome_fornecedor)
    ipcRenderer.on('Excluirfornecedor', (e) => {
        setTimeout(() => {
            location.reload()
        }, 500);
    })
}

function adicionar_pedidos() {
    const fornecedor = document.getElementById('nomeFornecedor').innerText
    const descricao = document.getElementById('descricaoPedido').value
    const data = document.getElementById('dataFaturamento').value

    const lista_historico = {
        nomeFornecedor: fornecedor,
        historico_descricao: descricao,
        historico_data: data
    }

    ipcRenderer.send('AdicionarHistorico', lista_historico)
    ipcRenderer.on('AdicionarHistorico', () => {
        $('#HistoricoPedidos').modal('hide')
    })
}

