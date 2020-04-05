const headerTemp = document.createElement("template");
headerTemp.innerHTML = 
`
<style>
    @import url('http://${location.host}/components/appHeader/appHeader.css')
</style>
<header>
    Sesli Not Uygulaması
</header>
`;

class AppHeader extends HTMLElement{
    constructor(){
        super();

        this.attachShadow({mode : "open"});
        this.shadowRoot.appendChild(headerTemp.content.cloneNode(true));
    }
}

window.customElements.define("app-header",AppHeader);