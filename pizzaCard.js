const template = document.createElement('template');
template.innerHTML = `
    <div class="pizza">
        <h1 class="pizza-name"></h1>
        <img class="pizza-img" alt="Sorry, this pizza has no image." src=""/>
        <div class="pizza-details">
            <p class="price" ></p>
            <div class= "heat"></div>
            <p class="toppings"></p>
        </div>
        <div class="delete-button">
            <button>Delete</button>
        </div>
    </div>

    <style>

    .delete-button{
        margin-left: auto;
        margin-right: auto;
        width: 50%;
        text-align: center;
    }

    .delete-button button{
        
    }

    .pizza-img {
        min-width: 400px;
        min-height: 270px;
        max-width: 400px;
        max-height: 270px;
        font-size: 36px;
    }

    .pizza{
        border: solid black 2px;
        padding: 10px;
        min-height: 540px;
        min-width: 424px
    }

    .price{
        font-weight: bold;
        font-size: 32px;
        margin: 0px
    }

    .heat{
        font-weight: bold;
        padding-top: 10px;
        padding-bottom: 10px;
    }

    .toppings{
        margin-top: unset;
        max-width: 400px;
    }

    .pizza-name{
        text-align: center;
        word-break: break-word;
        width: 424px;
    }

    .heat img{
        width: 24px;
        height: 24px;
    }
    </style>
`;

class PizzaCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open'});
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }
}

window.customElements.define('pizza-card', PizzaCard);