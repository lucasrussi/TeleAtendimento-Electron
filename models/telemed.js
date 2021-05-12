const firebase = require('firebase');
require('@firebase/firestore')
const venom = require('venom-bot')
const firebaseConfig = {
    apiKey: "xx",
    authDomain: "xx",
    projectId: "xx",
    storageBucket: "xx",
    messagingSenderId: "xx",
    appId: "xx",
    measurementId: "xx"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const firestore = firebase.firestore();


const servers = {
    iceServers: [
        {
            urls: ['xx', 'xx'],
        },
    ],
    iceCandidatePoolSize: 10,
};

// Global State
const pc = new RTCPeerConnection(servers);
let localStream = null;
let remoteStream = null;

const webcamButton = document.getElementById('webButton')
const webcamVideo = document.getElementById('local-video')
const remoteVideo = document.getElementById('remote-video')
const callButton = document.getElementById('callButton');
const telefone = localStorage.getItem('telefone')
const imagem = document.querySelector('#imagem')

//********************************************************************* */
//Send mensagen using Whatsapp

function sendMensagen(callId) {
    venom
        .create(
            'sessionName',
            (statusSession)=>{
                if(statusSession == 'notLogged'){
                    $('#celularNaoCadastrado').modal('show')
                }
            },
            undefined,
            { logQR: false }
        ).then((client) => {
            start(client);
        })
        .catch((erro) => {
            console.log(erro);
        });

    const start = (client) => {
        client
            .sendText(telefone + '@c.us', 'Olá!! aqui é a assistênte virtual do consultório, o(a) médico(a) já está te esperando na consulta\nClique no link abaixo para acessar\n https://www.coderpro.com.br/telemedicina.html?yourid='+callId+'\nApós acessar o site clique no botão verde "Ligar".')
            .then((result) => {
                $('#ligacaoSucesso').modal('show')

            })
            .catch((erro) => {
                $('#ligacaoErro').modal('show')
            });
    }
}






//***************************************************************************************************** */

// 1. Setup media sources

webcamButton.onclick = async () => {
    localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    remoteStream = new MediaStream();

    // Push tracks from local stream to peer connection
    localStream.getTracks().forEach((track) => {
        pc.addTrack(track, localStream);
    });

    // Pull tracks from remote stream, add to video stream
    pc.ontrack = (event) => {
        event.streams[0].getTracks().forEach((track) => {
            remoteStream.addTrack(track);
        });
    };

    webcamVideo.srcObject = localStream;
    webcamVideo.muted = true
    remoteVideo.srcObject = remoteStream;
};


//2. Create an offer
callButton.onclick = async () => {
    // Reference Firestore collections for signaling
    const callDoc = firestore.collection('calls').doc();
    const offerCandidates = callDoc.collection('offerCandidates');
    const answerCandidates = callDoc.collection('answerCandidates');

    console.log(callDoc.id)
    sendMensagen(callDoc.id)
    // Get candidates for caller, save to db
    pc.onicecandidate = (event) => {
        event.candidate && offerCandidates.add(event.candidate.toJSON());
    };

    // Create offer
    const offerDescription = await pc.createOffer();
    await pc.setLocalDescription(offerDescription);

    const offer = {
        sdp: offerDescription.sdp,
        type: offerDescription.type,
    };

    await callDoc.set({ offer });

    // Listen for remote answer
    callDoc.onSnapshot((snapshot) => {
        const data = snapshot.data();
        if (!pc.currentRemoteDescription && data?.answer) {
            const answerDescription = new RTCSessionDescription(data.answer);
            pc.setRemoteDescription(answerDescription);
        }
    });

    // When answered, add candidate to peer connection
    answerCandidates.onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
            if (change.type === 'added') {
                const candidate = new RTCIceCandidate(change.doc.data());
                pc.addIceCandidate(candidate);
            }
        });
    });

};
