// parte del codice che gestisce la voce
//init speechSynth API
const synth = window.speechSynthesis;
//DOM elements
const textForm = document.querySelector('form');
const textInput = document.querySelector('#text-input');
let voiceSelect;
//const voiceSelect = document.querySelector('#voice-select');
const rate = 1;
const pitch = 1;

//Browser identifier
// Firefox 1.0+
var isFirefox = typeof InstallTrigger !== 'undefined';

// Chrome 1+
var isChrome = !!window.chrome && !!window.chrome.webstore;
//init voice array
let voices = [];
const getVoices = () => {
    voices = synth.getVoices();
    setTimeout(() => {
        //console.log(voices);
    }, 1000);
    //loop voices and fill the select
    voices.forEach(voice => {
        console.log(voice.lang);
        if(voice.lang === "it-IT"){
            voiceSelect = voice;
        }
    })
};

//Speak
const speak = (id) => {
    const button = document.getElementById(`${id}_btnCall`);
    //check if speaking
    if(synth.speaking){
        console.error("Sta gia parlando...");
        return;
    }
    if(id !== ''){
        button.innerHTML = "<i class=\"material-icons\" data-toggle=\"tooltip\" title=\"Chiama cliente\">&#xe050;</i>";
        const text = `numero ${id}, fine corsa, tornare in cassa`
        //get speaktext
        const speakText = new SpeechSynthesisUtterance(text);
        // Speak end
        speakText.onend = e => {
            console.log('Finito di parlare');
            button.innerHTML = "<i class=\"material-icons\" data-toggle=\"tooltip\" title=\"Chiama cliente\">&#xe04e;</i>";
        }
        //Speak error
        speakText.onerror = e => {
            console.error('Qualche errore!');
        }
        // Selected voice
        //const selectedVoice = voiceSelect.selectedOptions[0].getAttribute('data-name');
        //loop through voices
        voices.forEach(voice => {
            if(voice.name === voiceSelect){
                speakText.voice = voice;
            }
        });

        //Set pitch and rate
        speakText.rate = rate;
        speakText.pitch = pitch;
        // Speak
        synth.speak(speakText);
    }
};
//event listener
function renderButtonVoices(){
    $(document).ready( function () {
        const buttonsVoice = Array.from(document.getElementsByClassName("btnVoice"));
        console.log(buttonsVoice);
        buttonsVoice.map(btn => {
            const id = btn.id.split("_")[0];
            btn.addEventListener('click', e => {
                e.preventDefault();
                speak(id);
            });
        })
    })
}
/*buttonsVoice.addEventListener('click', e => {
    e.preventDefault();
    speak();
});*/
// FINE PARTE CODICE RIFERITO ALLA VOCE
function activateSelectAll() {
    $(document).ready(function () {
        // Activate tooltip
        $('[data-toggle="tooltip"]').tooltip();

        // Select/Deselect checkboxes
        var checkbox = $('table tbody input[type="checkbox"]');
        $("#selectAll").click(function () {
            if (this.checked) {
                checkbox.each(function () {
                    this.checked = true;
                });
            } else {
                checkbox.each(function () {
                    this.checked = false;
                });
            }
        });
        checkbox.click(function () {
            if (!this.checked) {
                $("#selectAll").prop("checked", false);
            }
        });
    })
}


function allStorage() {
    var values = [],
        keys = Object.keys(localStorage),
        i = keys.length;

    while ( i-- ) {
        values.push(JSON.parse(localStorage.getItem(keys[i])));
    }

    return values;
}

function showData(){
    allStorage().map(user => addrow(user));
}

// listener al submit del form deleteItem
document.getElementById('deleteForm').addEventListener("submit", function(e) {
    e.preventDefault();
    console.log("entrato dentro");
    var checkbox = $('table tbody input[type="checkbox"]');
    checkbox.each(function(){
        if(this.checked){
            window.localStorage.removeItem(this.id);
            console.log(this.id, "è stato eliminato");
        }
    });
    var myModal = document.querySelector("#deleteEmployeeModal");
    myModal.style.display = "none";
    //riaggiorno la pagina
    location.reload();
});

function makeTime(){
    return new Date();
}

function formatTime(currentdate){
    currentdate = new Date(currentdate);
    var datetime = currentdate.getDate() + "/"
        + (currentdate.getMonth()+1)  + "/"
        + currentdate.getFullYear() + " "
        + currentdate.getHours() + ":"
        + currentdate.getMinutes() ;
    return datetime;
}

//parte di codice che aggiunge un cliente
document.getElementById('addUserForm').addEventListener("submit", function(e) {
    e.preventDefault();
    const form = document.querySelector('#addUserForm');
    const data = Object.fromEntries(new FormData(form).entries());
    //aggiungo orario in tempo reale
    data.dataInizio = makeTime();
    var twentyMinutesLater = new Date();
    twentyMinutesLater.setMinutes(twentyMinutesLater.getMinutes() + 1);
    data.timerFine = twentyMinutesLater;
    //inserisco nello storage i dati
    window.localStorage.setItem(`${data.ncliente}`, JSON.stringify(data));
    //countTimer(data.ncliente, data.timerFine);
    //aumento il numero clienti
    console.log(data);
    //chiudere il modal
    var myModal = document.querySelector("#addEmployeeModal");
    myModal.style.display = "none";
    //riaggiorno la pagina
    location.reload();
});

// parte di codice che intercetta il realod page e carica tutti gli items in tabella
window.onload = (event) => {
    showData();
    activateSelectAll();
    renderTimers();
    renderButtonVoices();
};

//tips prendere data di inizio convertirlo in millisecondi aggiungere 30 minuti e fare il confronto
//con la data ordierna

//come risolvere: 30 minuti in millisecondi e fare 30mls - mls di subctract date

function subtractDate(date1, date2, fine){
    date1 = new Date(date1);
    date2 = new Date(date2);
    var milliseconds = Math.abs(date1 - date2);
    var minutes = Math.floor((milliseconds / 1000) / 60);
    var seconds = Math.floor((milliseconds / 1000) % 60);
    if(minutes >= fine){
        console.log("tempo raggiunto");
        return 0;
    }
    //convert fine in milliseconds
    const fineMls = fine * 60 * 1000;
    const interval = fineMls - milliseconds;
    minutes = Math.floor((interval / 1000) / 60);
    seconds = Math.floor((interval / 1000) % 60);
    const time = `${minutes} minuti e ${seconds} secondi`
    return time;
}


function addrow(user){
    var table = document.getElementById("myTable");
    var row = table.insertRow(0);
    //this adds row in 0 index i.e. first place
    row.innerHTML = `<tr>
                    <td>
                    <span class="custom-checkbox">
                        <input type="checkbox" id="${user.ncliente}" name="options[]" value="1">
                        <label for="${user.ncliente}"></label>
                        </span>
                    </td>
                    <td>${user.nome}</td>
                    <td>${user.ncliente}</td>
                    <td>${user.nscarpa}</td>
                    <td>${user.tipoCorsa}</td>
                    <td>${formatTime(user.dataInizio)}</td>
                    <td><button id="${user.ncliente}_btn" class="btn timer">Calcolo timer...</button></td>
                    <td>
<!--
                        <a href="#editEmployeeModal"  class="edit" data-toggle="modal"><i class="material-icons" data-toggle="tooltip" title="Modifica">&#xE254;</i></a>
-->
                        <!--icona xe04e per megafono chiuso e xe050 per megafono con voce-->
                        <button class="btn btn-outline-primary btnVoice" id="${user.ncliente}_btnCall" disabled><i class="material-icons" data-toggle="tooltip" title="Chiama cliente">&#xe04e;</i></button>
                    </td>
                    </tr>`;
}

function abilitaBtnVoice(id){
    const button = document.getElementById(id);
    button.disabled = false;
}

function renderTimers(){
    $(document).ready( function () {
        const timers = Array.from(document.getElementsByClassName("btn timer"));
        timers.map(timer => {
            const id = timer.id.split("_");
            console.log(id[0]);
            //check timerfine se concluso
            const user = JSON.parse(localStorage.getItem(id[0]));
            timerfine = user.timerFine;
            console.log(timerfine);
            if(timerfine!=="concluso") {
                // se non concluso
                countTimer(id[0]);
            }else{
                timer.innerHTML = "concluso";
                abilitaBtnVoice(`${user.ncliente}_btnCall`);
            }
        })
    })
}


/*timers.map(timer => {
        //window.localStorage.removeItem(this.id);
        //console.log(this.id, "è stato eliminato");
        console.log(timer)
});*/

function countTimer(key){
    //prenditi l'oggetto dallo storage
    const user = JSON.parse(localStorage.getItem(key));
    console.log(user.timerFine);
    //calcolati la differenza
    let time = subtractDate(new Date(), user.dataInizio, 1);
    console.log(time)
    var downloadTimer = setInterval(function(){
        time = subtractDate(new Date(), user.dataInizio, 1);
        let button = document.getElementById(`${key}_btn`);
        // se la differenza arrival a 0 finisci l'intervallo
        if(time === 0){
            console.log("sono entrato nell'if e il time è zero");
            user.timerFine = "concluso";
            button.innerHTML = user.timerFine;
            window.localStorage.setItem(`${user.ncliente}`, JSON.stringify(user));
            abilitaBtnVoice(`${user.ncliente}_btnCall`);
            speak(user.ncliente);
            clearInterval(downloadTimer);
        }else{
            //cambia il contenuto dell'elemento
            button.innerHTML = time;
        }
}, 1000)}
