

document.querySelector('#calendario').addEventListener('click',function(e){
    e.preventDefault();
    window.location.href='../views/medIndex.html';
})


document.querySelector("#fornecedores").addEventListener('click', function(e){
    e.preventDefault();
    window.location.href='../views/agendaMed.html';
})

document.querySelector("#sair").addEventListener('click', function(e){
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

//online process

const setStatus = status =>{
    if(status){
        console.log('status if')
    }else{
        console.log('status elese')
        $('#appOffline').modal('show')
    }
    
    
}
setStatus(navigator.onLine)
window.addEventListener('online', e=>{
    console.log('to aki event online')
    setStatus(false)
})
window.addEventListener('offline', e=>{
    console.log('to aki event offline ')
    setStatus(true)
})


