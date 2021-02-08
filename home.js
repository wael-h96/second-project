var URL_list = 'https://api.coingecko.com/api/v3/coins/list'
var URL_coin = 'https://api.coingecko.com/api/v3/coins/'
var currencySavingList = []
var currenciesCards = []
var lastCurrencyDeleted;

function startHomePage() {
    $("#single-card-container").html('')
    if (currencySavingList.length !== 0) {
        $(`input[name='${lastCurrencyDeleted}']`)[0].checked = false
        currenciesCards.forEach(element => {
            if (isInSavingList(element.id)) {
                $(`div#cards-container input[name='${element.id}']`)[0].checked = true
            }
        });
    }
    else {
        currenciesCards = []
        getCurrenciesList()
    }
    $("#single-card-container").css("display", "none")
    $("#cards-container").css("display", 'flex')
}

function currencyInputSearch() {
    let input = $("#currency-input").val()
    $("#currency-input").val('')
    getCurrenciesList(input)
}

function getCurrenciesList(input) {
    let ifChecked;
    if (input === undefined) {
        $.ajax({
            type: "GET",
            url: URL_list,
            success: (res) => handleCurrencies(res),
            error: (err) => console.log(err)
        });
    } else {
        currenciesCards.forEach(function (element) {//searching for the element in the client side and show it
            if (input === element.id) {
                if (isInSavingList(element.id)) {
                    ifChecked = 'checked'
                } else {
                    ifChecked = 'unchecked'
                }
                $("#single-card-container").html('')
                $("#single-card-container").append(appendCurrencyToCard(element, ifChecked))
                $("#cards-container").css("display", 'none')
                $("#single-card-container").css("display", "flex")
            }
        });
    }
}

function isInSavingList(id) {//this function checks if the coin that we are searching for in the input filed is saved or not
    for (let i = 0; i < currencySavingList.length; i++) {
        if (currencySavingList[i] === id)
            return true
    }
    return false
}

function handleCurrencies(currencies) {//takes each of the object and sends it to appendCurrencyToCard
    $("#cards-container").html("")
    for (let i = 0; i < currencies.length; i++) {
        const cardObject = {
            id: currencies[i].id,
            symbol: currencies[i].symbol,
            name: currencies[i].name,
        };
        currenciesCards.push(cardObject)
        $("#cards-container").append(appendCurrencyToCard(currencies[i]))
    }
    $("#bar-container").css('display', 'none')
}

//*********************************************//
// this function creats all the fields of the card and appends it to the card
function appendCurrencyToCard(currency, status) {
    let ifChecked;// this variable handles the toggle (checked or unchecked)
    if (status === undefined) {
        ifChecked = 'unchecked'
    } else {
        ifChecked = status
    }

    let card = $(`<div id="${currency.id}" class='card' style='width:20rem; margin:15px;left:30px;'></div>`)
    let cardBody = $(`<div class='card-body'></div>`)
    let toggle = $(`<label class="switch">
                        <input id="${currency.id}" type="checkbox" ${ifChecked}  name="${currency.id}" onchange="updatingSavingList(this)">
                        <span id='${currency.id}' class="slider round"></span>
                    </label>`)
    let upperDiv = $(`<div style='display:flex;justify-content: space-between;'></div>`)
    upperDiv.append(`<h2 class='card-title'>${currency.symbol}</h2>`, toggle)
    cardBody.append(upperDiv)
    cardBody.append(`<h5>${currency.name}</h5>`)
    cardBody.append(`<button class="btn btn-primary" id="${currency.id}" onclick="getMoreInfo(this)" >More info</button>`)
    card.append(cardBody)
    return card;
}

async function getMoreInfo(element) {//when clicking on a More info btn , this function calls the api to get more info

    let id = element.id
    var parent = $(`div#${id}`)
    var child = parent.children()[0]
    $(`div#${id}`).append(`
                <div class="progress">
                    <div class="progress-bar" role="progressbar" aria-valuenow="70" 
                        aria-valuemin="0" aria-valuemax="100" style="width:70%">
                        70%
                    </div>
                </div>`
    );
    try {
        const response = await getData(id)
        const moreInfo = await response.json()
        handleMoreInfo(moreInfo, parent[0], child, id)
    } catch (err) {
        console.log("Error:", err)
    }

}

function handleMoreInfo(info, parent, child, id) {
    //creating the more info card and appending it to the card after removing the old display
    $('div.progress').css('display', 'none')
    $(child).css('display', 'none')
    let img = $(`<img class="${id}" src="${info.image['large']}">`)
    let cardBody = $(`<div class='card-body' id='card-body${id}'></div>`)
    let title = $(`<h5 class='card-title'>${info.name} compared to :</h5>`)
    let p = $(`<p class='card-text'>USD: ${info.market_data.current_price.usd}$<br>Euro: ${info.market_data.current_price.eur}€<br>
    Shekel: ${info.market_data.current_price.ils}₪</p>`)
    let xBtn = $(`<button id="${id}" onclick="goBackBtn(event)" class="btn btn-danger">Go Back</button>`)
    cardBody.append(title, p, xBtn)
    $(parent).append(img, cardBody)
}

function goBackBtn(event) {//this function removes the moreinfodata that has displayed and returns the first version of the card

    let id = event.srcElement.id
    let parent = $(`div#${id}`)[0]
    let child1 = $(parent).children()[0]//targeting specific element to remove it
    let child2 = $(parent).children()[2]//targeting specific element to remove it
    let img = $(`img.${id}`)[0]
    $(child1).removeAttr('style')
    $(child2).css('display', 'none')//removing it from the display
    $(`div#card-body${id}`).css('display', 'none')
    $(img).remove()
}


//*********************************************//
//function that handles the checkboxes for adding or removing from the saving list 

function updatingSavingList(checkbox) {
    let id = checkbox.id
    if (checkbox.checked === true) {
        if (currencySavingList.length < 5)
            currencySavingList.push(id)
        else if (currencySavingList.length === 5) {
            popOutSaveList()
            currencySavingList.push(id)
        }
    } else {
        removeFromSavingList(id)
    }
}

//*********************************************//
// PopOut Model code (functions that controls the popOut window)

function popOutSaveList() {
    fillPopOut('checked')
    var modal = $("#myModal")
    modal.css('display', 'block')
}

function fillPopOut(ifChecked) {
    let container = $("#modal-body-cards")
    container.html("")
    currencySavingList.forEach(savedElement => {
        for (let i = 0; i < currenciesCards.length; i++) {
            if (currenciesCards[i].id === savedElement)
                container.append(appendCurrencyToCard(currenciesCards[i], ifChecked))
        }
    });
}

function removeFromSavingList(id) {
    for (let i = currencySavingList.length - 1; i >= 0; i--) {
        if (currencySavingList[i] === id) {
            currencySavingList.splice(i, 1);
        }
    }
    lastCurrencyDeleted = id
    $(`input[name='${id}']`)[0].checked = false
    fillPopOut('checked')
    popOutDisappear()
}

function popOutDisappear() {//undisplay the popout window
    if (currencySavingList.length === 6) {
        $(`input[name='${currencySavingList[currencySavingList.length - 1]}']`)[0].checked = false
        currencySavingList.pop()
        fillPopOut('checked')
    }
    $("#myModal").css('display', 'none')
}
