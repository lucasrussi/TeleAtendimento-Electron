document.querySelector('#calendario').addEventListener('click',function(e){
    e.preventDefault();
    window.location.href='../views/app.html';
})




document.querySelector("#fornecedores").addEventListener('click', function(e){
    e.preventDefault();
    window.location.href='../views/agenda.html';
})

document.querySelector("#sair").addEventListener('click', function(e){
    e.preventDefault();
    $('#exitprocess').modal('show')
   
})
document.querySelector('#config').addEventListener('click',function(e){
    e.preventDefault()
    window.location.href="../views/configuracao.html"
})

//exit process
function exit(){

    ipcRenderer.send('exitProcess', login)
}
