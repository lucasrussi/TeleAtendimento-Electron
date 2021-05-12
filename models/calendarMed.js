const { ipcRenderer, ipcMain } = require("electron");
const fs = require('fs');


document.addEventListener('DOMContentLoaded', function () {
    ipcRenderer.send('get-task');
    ipcRenderer.on('get-task', (e, args) => {
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
            /* eventClick: function (arg) {
                 if (confirm('Are you sure you want to delete this event?')) {
                     arg.event.remove()
                 }
             },*/
            eventClick: function (args,info) {
                console.log('esse é o description', args)
                $('#DetalhesPaciente #nomePaciente').text(args.event._def.title)
                $('#DetalhesPaciente #motivoConsulta').text(args.event._def.extendedProps.description)
                localStorage.setItem('tipoConsulta',args.event._def.extendedProps.tipoConsulta)
                localStorage.setItem('telefone',args.event._def.extendedProps.telefone)
                $('#DetalhesPaciente').modal('show')

            },

            editable: true,
            dayMaxEvents: true, // allow "more" link when too many events
            events: '../events.json'
        });

        calendar.render();
    });
})
