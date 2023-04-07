/**
 * Stores data from JSON-file.
 */
let pizzaMenus = [];


/**
 * Empty arrays for basket items (shopping Cart with added items).
 */
let basketPizza = [];
let basketPrice = [];
let basketAmount = [];


/**
 * Fetching data from JSON-File (pizzaMenus)
 */
async function init() {
    let response = await fetch('./js/pizzaMenu.json');
    pizzaMenus = await response.json();
    renderContent();
    renderEmptyBasketHTML();
}


/**
* LEFT CONTAINER ('CONTENT'):
* Rendering the content (pizzas, ingredients, prices).
*/
function renderContent() {
    let content = document.getElementById('content');
    for (let i = 0; i < pizzaMenus.length; i++) {
        const pizza = pizzaMenus[i].pizzas;
        const ingredient = pizzaMenus[i].ingredients;
        const price = pizzaMenus[i].prices;
        const formatPrice = formatNumber(price);
        content.innerHTML += renderContentHTML (pizza, ingredient, formatPrice, i);
    }
}


function renderContentHTML(pizza, ingredient, formatPrice, i) { 
    return `
        <div title="Pizza zum Warenkorb" class="pizzas" onclick="addToBasket(${i})">
            <div>
                <h3>${pizza}</h3>
                <div><i>${ingredient}</i></div>
                <div>${formatPrice} €</div>
            </div>
            <img src="img/icons/plus@2x.png" class="icon">
        </div>
        `;
}


/**
* RIGHT CONTAINER ('BASKET'):
* Rendering a friendly reminder (when basket is empty).
*/
function renderEmptyBasketHTML() {
    let basket = document.getElementById('basket');
    basket.innerHTML += `
        <div>
            <img src="img/icons/bag@2x.png" class="icon">
            <div><h4>Fülle deinen Warenkorb</h4></div>
            <p>Füge einige leckere Pizzas aus der Speisekarte hinzu und bestelle dein Essen.</p>
        </div>
        <img title="Warenkorb schliessen" src="img/icons/xmark@2x.png" onclick="closeBasket()" class="close-icon">
        `;
}


/**
 * Rendering when 'addToBasket()' is clicked!
 */
function renderBasket() {
    let basket = document.getElementById('basket');
    basket.innerHTML = '';
    for (let i = 0; i < basketPizza.length; i++) {
        const addPizza = basketPizza[i];
        const addPrice = basketPrice[i];
        const addAmount = basketAmount[i];
        let subTotal = addAmount*addPrice;
        let formatSubTotal = formatNumber(subTotal);
        basket.innerHTML += renderBasketHTML(addPizza, addAmount, formatSubTotal, i); 
    }
    totalPayment();
}


/**
 * Puts numbers into a fixed format (two decimal places after a decimal point).
 * @param {*} number 
 * @returns 
 */
function formatNumber(number) {
    return number.toFixed(2).replace('.', ',');
}


function renderBasketHTML(addPizza, addAmount, formatSubTotal, i) {
    return `
        <div>
            <p>${addAmount} x ${addPizza}: ${formatSubTotal} €</p>
            <div class="icons-container">
                <div title="Menge reduzieren" onclick="substractPizza(${i})"><img src="img/icons/cart.badge.minus@2x.png" class="icon"></div>
                <div title="Menge erhöhen" onclick="addPizza(${i})"><img src="img/icons/cart.badge.plus@2x.png" class="icon"></div>
                <div title="Auswahl löschen" onclick="deleteOrder(${i})"><img src="img/icons/trash@2x.png" class="icon"></div>
            </div>
        </div>
    `;
}


/**
 * Selected pizza is moved to the shopping basket.
 * @param {*} i 
 */
function addToBasket(i) { 
    let addedPizza = pizzaMenus[i].pizzas; // Link Content-Array 'pizzas' (see 'render-content') to new variable.
    let addedPrice = pizzaMenus[i].prices;
    let index = basketPizza.indexOf(addedPizza); // IndexOf to find out if there's already pizza in the basket.
    if (index == -1) { // If no element added so far,...
        basketPizza.push(addedPizza)// ...element is moved to array 'basket_pizza'.
        basketPrice.push(addedPrice)
        basketAmount.push(1) // Array is always increased by one unit.
    } else {
        basketAmount[index]++ // Element is already in basked, amount is increased.
    }
    renderBasket();
}


/**
 * + 1 pizza (see shopping basket).
 * @param {*} i 
 */
function addPizza(i) {
    basketAmount[i]++;
    renderBasket();
}


/**
 * - 1 Pizza (see shopping basket)
 * If basket is empty, alert will be displayed.
 * @param {*} i 
 */
function substractPizza(i) {
    if (basketAmount[i] > 1) {
        basketAmount[i]--;
    } else if (basketAmount[i] === 1) {
        basketPizza.splice(i, 1);
        basketPrice.splice(i, 1);
        basketAmount.splice(i, 1);
    }
    renderBasket();
    checkIfEmptyBasket(basketAmount);
}


/**
 * Delete selected pizza (see trashcan, shopping basket).
 * Splice() method changes the content of an array; here the last element in the array will be removed. 
 * If basket is empty, alert will be displayed.
 * @param {*} i 
 */
function deleteOrder(i) {
    basketAmount.splice(i, 1);
    basketPizza.splice(i, 1);
    basketPrice.splice(i, 1);
    renderBasket();
    checkIfEmptyBasket(basketAmount);
}


/**
 * If the basket is empty, an alert message will be opened.
 * The sum on the mobile button will be updated. 
 * @param {*} basketAmount 
 */
function checkIfEmptyBasket(basketAmount){
    if (basketAmount==0) {
        renderEmptyBasketHTML();
        let mobileSum = document.getElementById('mobileSum');
        mobileSum.innerHTML = '';
    }
}


/**
 * Sums up all orders (see shopping basket).
 * Total is set to zero at the beginning.
 */
function totalPayment() {
    document.getElementById('sum').innerHTML = '';
    let total = 0;
    for (let i = 0; i < basketAmount.length; i++) {
        total += basketPrice[i] * basketAmount[i];
        sum.innerHTML = showTotalPrice(total);
    }
}


/**
 * Lists the total sum to pay (including delivery costs).
 * formatNumber() sets numbers into the correct format (e.g. 10.00).
 * @param {*} total 
 * @returns 
 */
function showTotalPrice(total) {
    const formatTotal = formatNumber(total);
    const deliveryCost = 2; // Set fixed delivery costs. 
    const formatDeliveryCost = formatNumber(deliveryCost);
    const totalAndDelivery = total + deliveryCost;
    formatTotalAndDelivery = formatNumber(totalAndDelivery);
    mobilePaymentAlert(formatTotalAndDelivery);
    return generateTotalPriceHTML(formatTotal, formatDeliveryCost, formatTotalAndDelivery);
}


function generateTotalPriceHTML(formatTotal, formatDeliveryCost, formatTotalAndDelivery) {
    return `
    <div class="pay-box"><div>Zwischensumme:</div><div>${formatTotal} €</div></div>
    <div class="pay-box"><div>Lieferkosten:</div><div>${formatDeliveryCost} €</div></div>
    <div class="pay-box"><div><b>Gesamtsumme:</b></div><div><b>${formatTotalAndDelivery} €</b></div></div>
    <button title="Weiter zum Bezahlen" onclick="showPaymentMessage()"><b>Bezahlen (${formatTotalAndDelivery} €)</b></button>
    <img title="Warenkorb schliessen" src="img/icons/xmark@2x.png" onclick="closeBasket()" class="close-icon">
    `;
}


/**
 * Shows total price on "Warenkorb öffnen"-button. 
 * @param {*} formatTotalAndDelivery 
 */
function mobilePaymentAlert(formatTotalAndDelivery) {
    let mobileSum = document.getElementById('mobileSum');
    mobileSum.innerHTML = '';
    mobileSum.innerHTML += `
    <div>(${formatTotalAndDelivery} €)</div>
    `;
}


/**
 * Shows Payment Alert which will disappear again after three seconds.
 */
function showPaymentMessage() {
    document.getElementById('payment').classList.remove('display-none');
    let text = 'Vielen Dank für Ihre Bestellung. Sie werden nun auf die Bezahlseite weitergeleitet.';
    document.getElementById('successfull').innerHTML = text;
    setTimeout(function() {
        document.getElementById('payment').classList.add('display-none');
    }, 3000);
}


/**
 * Shows/closes overlay basket on mobile version when button is pushed. 
 */
function showBasket() {
    const overlayBasket = document.getElementById('overlay-basket');
    overlayBasket.classList.replace('basket-container', 'basket-container-mobile');
}


function closeBasket(){
    const overlayBasket = document.getElementById('overlay-basket');
    overlayBasket.classList.replace('basket-container-mobile', 'basket-container');
}