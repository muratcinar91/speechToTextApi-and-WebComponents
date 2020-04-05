const microphoneTemp = document.createElement("template");
microphoneTemp.innerHTML =
    `
<style>
    @import url('http://${location.host}/components/microphone/microphone.css')
</style>
<div class="speech_container">
    <i class="fa fa-microphone fa-3x"></i>
</div>
`;

class MicrophoneCard extends HTMLElement {
    constructor() {
        super();
        this.recognition = null;
        this.isListening = false;
        this.speechToText = null;
        this.notes = [];
        this.attachShadow({
            mode: "open"
        });
        this.shadowRoot.appendChild(microphoneTemp.content.cloneNode(true));
    }
    connectedCallback() {
        this.shadowRoot.querySelector("i").addEventListener("click", () => {
            this.isListening = true;
            if (this.isListening) {
                this.shadowRoot.querySelector("i").classList.add("isListening");
            }
            this.recognition = new webkitSpeechRecognition();

            this.recognition.lang = "tr";
            this.recognition.start();
            var element = this;
            var notes = this.notes;
            this.recognition.onresult = function (event) {
                const parseRegex = /(?<id>(\d*))\s(?=nolu).*(?<command>(sil))$/giu;
                const voiceMatch = parseRegex.exec(event.results[0][0].transcript);

                const allNoteRemoveRegex = /tüm notları sil/giu;
                const allNotesRemoveMatch = allNoteRemoveRegex.test(event.results[0][0].transcript);
                setTimeout(() => {
                    if (voiceMatch && voiceMatch.groups.id && voiceMatch.groups.command) {
                        element.deleteNote(voiceMatch.groups.id);
                    } else if (allNotesRemoveMatch) {
                        element.removeAllNotes();
                    } else {
                        element.record(event.results[0][0].transcript, notes);
                    }

                }, 1000);

            }

        });
    }
    deleteNote(id) {
        this.notes.splice(
            this.notes.findIndex(n => n.id == id), 1
        );
        this.prepareNotes(this.notes);
    }
    removeAllNotes() {
        this.notes = [];
        this.prepareNotes(this.notes)
    }
    record(event, notes) {
        if (event) {
            this.isListening = false;
            this.shadowRoot.querySelector("i").classList.remove("isListening");
            notes.push({
                id: notes.length + 1,
                note: event,
                date : new Date()
            });

            this.prepareNotes(notes);
        }
    }
    prepareNotes(notes) {

        document.querySelector("#speechToText").innerHTML = "";

        notes.sort(function(a,b){
            // Turn your strings into dates, and then subtract them
            // to get a value that is either negative, positive, or zero.
            return new Date(b.date) - new Date(a.date);
          });

        notes.forEach(note => {
            let notesCard = document.createElement("speech-card");
            notesCard.setAttribute("id", note.id);
            notesCard.setAttribute("note", note.note);
            notesCard.setAttribute("date", note.date);

            document.querySelector("#speechToText").append(notesCard);
        });
    }
}

window.customElements.define("microphone-card", MicrophoneCard);