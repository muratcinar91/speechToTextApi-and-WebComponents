const speechTemp = document.createElement("template");
speechTemp.innerHTML =
    `
<style>
    @import url('http://${location.host}/components/speechToText/speechToText.css')
</style>
<div class="note_item">
    <div class="id_content">
        <span></span>
    </div>
    <div class="note_content">
        
    </div>
    <div id="date"></div>
</div>

`;

class SpeechCard extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({
            mode: "open"
        });
        this.shadowRoot.appendChild(speechTemp.content.cloneNode(true));

        setTimeout(() => {
            this.shadowRoot.querySelector("span").innerHTML = "#" + this.getAttribute("id");
            this.shadowRoot.querySelector(".note_content").innerHTML = this.getAttribute("note");
            var date = new Date(this.getAttribute("date"));
            this.shadowRoot.querySelector("#date").innerHTML = "Tarih : " + date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear();

        }, 1000);
    }
}

window.customElements.define("speech-card", SpeechCard);