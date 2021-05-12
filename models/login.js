const { ipcRenderer } = require("electron")


function signIn() {
    const login = document.getElementById('login').value
    const pass = document.getElementById('pass').value
    if ((login == '' && pass == '') || (login == '' && pass != '') || (login != '' && pass == '')) {
        alert('Por favor insira o login ou a senha')
    } else {
        const dates = {
            account: login,
            pass: pass
        }
        ipcRenderer.send('verifyAcc', dates)
        ipcRenderer.on('verifyAcc', (e, args) => {
            console.log(args)
            if (args != null) {
                const json_parse = JSON.parse(args)
                updateAcc = {
                    account: login,
                    pass: pass
                }
                ipcRenderer.send('updateAcc', updateAcc)
                ipcRenderer.on('updateAcc', (e, args) => {
                    if (json_parse.tipoAcc == 'doctor') {
                        //link para a page doctor
                        localStorage.setItem('login', login)
                        window.location.href = '../views/medIndex.html'

                    } else {
                        //link para a page office
                        localStorage.setItem('login', login)
                        window.location.href = '../views/app.html'

                    }
                })
            } else {
                alert('Nome ou senha incorretos')
            }
        })

    }

}

function missAccount() {

}

function createAccount() {

    const newLogin = document.getElementById('newLogin').value
    const newPass = document.getElementById('newPass').value
    const newName = document.getElementById('newNome').value
    const newemail = document.getElementById('email').value
    const key = document.getElementById('key').value

    //verificação de conteudo

    //preenchimento de todos os conteudos
    if (newLogin != '' || newPass != '' || newName != '' || newemail != '' || key != '') {
        ipcRenderer.send('findKey', key)
        ipcRenderer.on('findKey', (e, args) => {
            const json_parse = JSON.parse(args)
            try {
                if (json_parse.tipo == 'doctor' || json_parse.tipo == 'office') {
                    const conta = {
                        account: newLogin,
                        pass: newPass,
                        nomeCadastro: newName,
                        statusLogin: '0',
                        emailConta: newemail,
                        tipoAcc: json_parse.tipo
                    }
                    ipcRenderer.send('newCadastro', conta)
                    ipcRenderer.on('newCadastro', () => {
                        ipcRenderer.send('deleteKey', key)
                        ipcRenderer.on('deleteKey', () => {
                            window.location.href = '../views/login.html'
                        })
                    })

                }
            } catch (error) {
                alert('chave de autenticação incorreta ou já utilizada')
            }



        })


    } else {
        alert('Preencha todos os campos')
    }




}