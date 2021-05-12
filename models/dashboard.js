const { ipcRenderer } = require("electron")

ipcRenderer.send('get_value_consultas')
ipcRenderer.on('get_value_consultas', (e, args) => {
    const json_file = JSON.parse(args)
    const mappedToArray = json_file.map(d => Array.from(Object.values(d)))
    const array = mappedToArray.filter(x => x != 0)
    console.log(array)
    localStorage.setItem('valor_sus', array[0][2])
    localStorage.setItem('valor_convenio', array[0][1])
    localStorage.setItem('valor_privado', array[0][0])
})
ipcRenderer.send('get_dates_dashboard')
ipcRenderer.on('get_dates_dashboard', (e, args) => {
    //quantidade diária
    let privado = 0
    let sus = 0
    let convenio = 0

    //quantidade mensal
    let total = 0
    let privado_mensal = 0
    let sus_mensal = 0
    let convenio_mensal = 0
    let total_monetario = 0

    //Valores do localStorage
    let valor_sus = localStorage.getItem('valor_sus')
    let valor_convenio = localStorage.getItem('valor_convenio')
    let valor_privado = localStorage.getItem('valor_privado')

    //valores monetários diários
    let money_sus = 0
    let money_privado = 0
    let money_convenio = 0

    const json_parse = JSON.parse(args)
    const mappedToArray = json_parse.map(d => Array.from(Object.values(d)))
    const array = mappedToArray.filter(x => x != 0)


    const arrayTeste = []
    const arrayobj = []
    const arrayobjMoney = []
    array.map(e => {
        if (!arrayTeste.find(element => element == e[1])) {
            arrayTeste.push(e[1])
        }
    })

    for (let index = 0; index < arrayTeste.length; index++) {
        sus = 0
        convenio = 0
        privado = 0
        for (let index1 = 0; index1 < array.length; index1++) {

            if (array[index1][0] == 'sus' && array[index1][1] == arrayTeste[index]) {
                console.log()
                sus++
                total++
                sus_mensal++
            } else if (array[index1][0] == 'convenio' && array[index1][1] == arrayTeste[index]) {
                convenio++
                total++
                convenio_mensal++
            } else if (array[index1][0] == 'privado' && array[index1][1] == arrayTeste[index]) {
                privado++
                total++
                privado_mensal++
            }
        }
        //array quantidade de consultas
        arrayobj.push([arrayTeste[index], sus, convenio, privado])

        //array valores monetários
        money_sus = sus*valor_sus
        money_privado = privado*valor_privado
        money_convenio = convenio*valor_convenio

        arrayobjMoney.push([arrayTeste[index],money_sus,money_convenio,money_privado])



    }
    total_monetario = (privado_mensal * valor_privado) + (sus_mensal * valor_sus) + (convenio_mensal * valor_convenio)

    //valor quantidade de atendimento
    const qtaAtendimento = document.querySelector('#qta_atendimento')
    qtaAtendimento.innerHTML += ` ${total} pessoas`

    //Valor quantidade monetária mensal
    const qtaMonetaria = document.querySelector('#total_monetario')
    qtaMonetaria.innerHTML += ` R$ ${total_monetario}`


    google.charts.load('current', { 'packages': ['corechart'] });
    google.charts.setOnLoadCallback(graficoConsultas);
    google.charts.setOnLoadCallback(graficoLucro);
    function graficoConsultas() {
        const data = new google.visualization.DataTable()
        data.addColumn('string', 'Dia')
        data.addColumn('number', 'privado')
        data.addColumn('number', 'convenio')
        data.addColumn('number', 'sus')
        for (let index = 0; index < arrayobj.length; index++) {
            data.addRow([arrayobj[index][0], arrayobj[index][1], arrayobj[index][2], arrayobj[index][3]])
        }
        var options = {
            hAxis: { title: 'Dia', titleTextStyle: { color: '#333' } },
            vAxis: { minValue: 0 },
            'width': '100%',
            'chartArea': { 'width': '80%' }

        };

        var chart = new google.visualization.ColumnChart(document.getElementById('graficoConsultas'));
        chart.draw(data, options);
    }
    function graficoLucro(){
        const data = new google.visualization.DataTable()
        data.addColumn('string', 'Dia')
        data.addColumn('number', 'privado')
        data.addColumn('number', 'convenio')
        data.addColumn('number', 'sus')
        for (let index = 0; index < arrayobjMoney.length; index++) {
            data.addRow([arrayobjMoney[index][0], arrayobjMoney[index][1], arrayobjMoney[index][2], arrayobjMoney[index][3]])
        }

        var options = {
            hAxis: { title: 'Dia', titleTextStyle: { color: '#333' } },
            vAxis: { minValue: 0 },
            'width': '100%',
            'chartArea': { 'width': '80%' }

        };

        var chart = new google.visualization.ColumnChart(document.getElementById('graficoFaturamento'));
        chart.draw(data, options);
    }
})
     


function salvarValores() {
    const convenio = document.getElementById('convenio').value
    const privado = document.getElementById('privado').value
    const sus = document.getElementById('sus').value

    const salvar = {
        valor_convenio: convenio,
        valor_particular: privado,
        valor_SUS: sus,
    }

    console.log('esse é o valor do salvar dos valores: ', salvar)

    ipcRenderer.send('save-valores-consultas', salvar)
}





