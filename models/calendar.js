const { ipcRenderer, ipcMain } = require("electron");
const fs = require('fs')


document.addEventListener('DOMContentLoaded', function () {
    ipcRenderer.send('get-task');
    ipcRenderer.on('get-task', (e,args)=>{
        var calendarEl = document.getElementById('calendar');
        var calendar = new FullCalendar.Calendar(calendarEl, {
            locale: 'pt-br',
            headerToolbar: {
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay'
            },
    
            navLinks: true, // can click day/week names to navigate views
            selectable: true,
            selectMirror: true,
            select: function (info) {
                $('#cadastrar').modal('show');
                $('#cadastrar #start').text(info.start.toLocaleString());
                $('#cadastrar #end').text(info.end.toLocaleString());
                
            },
            eventClick: function (info) {
                console.log(info.event._def.title)
                if (confirm('Você gostaria de deletar essa consulta?')) {
                    ipcRenderer.send('delete',info.event._def.title)
                    location.reload()
                }
    
            },
    
            editable: true,
            dayMaxEvents: true, // allow "more" link when too many events
            events: '../events.json'
        });
        
        calendar.render();
    })
    
});



