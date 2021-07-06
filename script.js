let form;
let pizzaMenu;
let filterByValue = "name";

document.addEventListener('DOMContentLoaded', function(){

    form = document.querySelector(".pizzeriaForm");
    const addPizzaButton = form.querySelector('input[type="submit"]');
    pizzaMenu = document.querySelector(".pizza-menu");
    let filter = document.getElementById('filter');
    
    //Events
    addPizzaButton.addEventListener('click', handlePizzaSubmit, false);
    filter.addEventListener('change', function(){
        setFilter(this.value);
    });

    //Input field validations
    setInputFilter(document.getElementById("integer-1to3"), function(value) {
        return /^\d*$/.test(value) && (value === "" || (parseInt(value) <= 3 && parseInt(value) >=1)); 
    });

    setInputFilter(document.getElementById("currency"), function(value) {
        return /^\d*[.,]?\d{0,2}$/.test(value) && (value === "" || parseFloat(value) <= 99999.99);
    });



    displayPizzas(pizzaMenu);

}, false);

function setFilter(filter)
{
    filterByValue = filter;
    displayPizzas(pizzaMenu);
}

function filterPizzaList(filter, list)
{
    let pizzaList = list;

    if (filter === "price(l-h)"){
        pizzaList.sort((a, b) => {
            console.log(typeof a.price);
            return parseFloat(a.price) - parseFloat(b.price);
        });
    }
    else if(filter === "price(h-l)"){
        pizzaList.sort((a, b) =>{
            return ( parseFloat(a.price) - parseFloat(b.price)) * -1 ;
        });
    }
    else if (filter === "heat(l-h)"){
        pizzaList.sort((a, b) => {
            return a.heat - b.heat;
        });
    }
    else if (filter === "heat(h-l)"){
        pizzaList.sort((a, b) => {
            return (a.heat - b.heat) * -1;
        });
    }
    else if (filter === "name(z-a)"){
        pizzaList.sort((a, b) => {
            let aName, bName;
            aName = a.name.toLowerCase();
            bName = b.name.toLowerCase();
            if( aName < bName) return 1;
            else if(aName > bName) return -1
            else return 0;
        });
    }
    else{
        pizzaList.sort((a, b) => {
            let aName, bName;
            aName = a.name.toLowerCase();
            bName = b.name.toLowerCase();
            if( aName < bName) return -1;
            else if(aName > bName) return 1
            else return 0;
        });
    }

    return pizzaList;
}

function deletePizza(pizzaID)
{

    let confirmation = confirm("do you really want to delete " + pizzaID + "?");
    if (confirmation) {

        let pizzaList = getStoredData();
        
        for(let i = 0; i < pizzaList.length; i++){
            if(pizzaList[i].name === pizzaID){
            pizzaList.splice(i,1);
            break;
            } 
        }

        sessionStorage.setItem('pizzaList', JSON.stringify(pizzaList));
        displayPizzas(pizzaMenu);
    }
}

function displayPizzas(attachElement)
{
    attachElement.innerHTML = "";

    let pizzaList = filterPizzaList(filterByValue,getStoredData());
    
    let i = 0;
    let n = pizzaList.length;

    if(n === 0) attachElement.innerHTML = "At the current moment menu is empty";

    for(let i = 0; i < pizzaList.length; i++){
        let pizzaCard = document.createElement('pizza-card');

        pizzaCard.id=pizzaList[i].name;

        pizzaCard.shadowRoot.querySelector('h1').innerHTML=pizzaList[i].name;
        pizzaCard.shadowRoot.querySelector('img').src=pizzaList[i].imgBase64;
        pizzaCard.shadowRoot.querySelector('.price').innerHTML="Price: " + pizzaList[i].price + "€";
        pizzaCard.shadowRoot.querySelector('.heat').innerHTML="Heat: ";
        pizzaCard.shadowRoot.querySelector('button').addEventListener('click', function(){
            deletePizza(pizzaList[i].name);
        }, false);

        let pepperIcon = document.createElement('img');
        pepperIcon.src = './pepper.png';

        for(let j = 0; j < pizzaList[i].heat; j++){
            let pepperIcon = document.createElement('img');
            pepperIcon.src = './pepper.png';
            pizzaCard.shadowRoot.querySelector('.heat').append(pepperIcon);
        }

        let toppings = pizzaList[i].toppings;
        let toppingsString = "Toppings: ";
        for(let j = 0; j < toppings.length; j++)
        {
            if(j !== toppings.length - 1) toppingsString += toppings[j] + ", ";
            else toppingsString += toppings[j];
        }

        pizzaCard.shadowRoot.querySelector('.toppings').innerHTML = toppingsString;

        attachElement.append(pizzaCard);
    }
}

function handlePizzaSubmit(e){
    e.preventDefault();

    let formData = new FormData(form);

    let price = formData.get('price');
    price = parseFloat(price).toFixed(2);

    let pizza = new Pizza(formData.get('name')
                         ,price
                         ,formData.get('heat')
                         ,formData.getAll('topping')
                         ,formData.get('picture'));

    let pizzaList = getStoredData();

    if(isPizzaValid(pizza,pizzaList)){
         addPizza(pizza, pizzaList);

         displayPizzas(pizzaMenu);
         form.reset();
    };                    
   
}

function isPizzaValid(pizza, pizzaList)
{
    if(pizza.toppings.length < 2){
        alert("More than one topping must be selected");
        return false;
    }
    if(!isPizzaNameValid(pizza.name, pizzaList))
    {
        alert("Pizza with this name already exists");
        return false;
    }
    if(pizza.name === ""){
        alert("cant leave name field empty");
        return false;
    }
    if(pizza.price === "" || pizza.price === "NaN")
    {
        alert("cant leave price field empty");
        return false;   
    }
    return true;
}

function getStoredData()
{
    let storedData = sessionStorage.getItem('pizzaList');
    let pizzaList;

    if(storedData === null){
        pizzaList = [];
    } else {
        pizzaList = JSON.parse(storedData);
    }

    return pizzaList;
}

function addPizza(pizza, pizzaList)
{
    pizzaList.push(pizza);

    sessionStorage.setItem('pizzaList', JSON.stringify(pizzaList));
    alert("Pizza added successfully");
}

function isPizzaNameValid(name, pizzaList)
{
    if(pizzaList.length === 0) return true;

    let valid = true;

    pizzaList.forEach(pizza => {
        let tempName = pizza.name.replace(/\s+/g, '');
        name = name.replace(/\s+/g, '');
        if (name.toLowerCase() === tempName.toLowerCase()) valid = false;
    });

    return valid;
}

//Input validations
function setInputFilter(textbox, inputFilter) {
    ["input", "keydown", "keyup", "mousedown", "mouseup", "select", "contextmenu", "drop"].forEach(function(event) {
        textbox.addEventListener(event, function(){
            if (inputFilter(this.value)) {
                this.oldValue = this.value;
                this.oldSelectionStart = this.selectionStart;
                this.oldSelectionEnd = this.selectionEnd;
            }
            else if (this.hasOwnProperty("oldValue")){
                this.value = this.oldValue;
                this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
            }
            else{
                this.value = "";
            }
        });
    });
}