const loading = document.querySelector(".header-loading");
const paragraf = document.querySelector(".header__paragraf");
const country = document.querySelector(".header__para");
const flagImg = document.querySelector(".header__img");
const imgWrapper = document.querySelector(".header__wrapper--img");
const noresult = document.querySelector(".no-result");
const flag = document.querySelector(".flag");
const continentName = document.getElementsByClassName("continent");
const continentCountry = document.querySelector(".continent__countries");
const back= document.querySelector(".go-back");
const guessWrapper= document.querySelector(".guess__wrapper");
const guessFlag = document.querySelector(" .guess__flag");
const guessCapital = document.querySelector(" .capital__name");
const guessHint = document.querySelector(" .guess__hint");
const search = document.querySelector(" .guess__search");
var hintCount = 0;
var score = 0;
var allFlags = [];

function searchValue(event) {
    const value = event.target.value;
    if (value == "") {
        country.innerHTML = "Type In =D";
        country.style.display = "block";
        imgWrapper.style.display = "none";
        noresult.style.display = "none";
    }
    else {
        imgWrapper.style.display = "block";
        FetchData(value);
    }
}

async function FetchData(val) {
    flag.style.display = "none";
    paragraf.style.display = "none";
    noresult.style.display = "none";
    loading.style.display = "block";
    await fetch("https://countriesnow.space/api/v0.1/countries/capital")
        .then(res => res.json())
        .then(item => {
            const CountryName = item.data.map(item => item).filter(item => item.capital.toLowerCase() == val.toLowerCase());
            const CapitalName = item.data.map(item => item).filter(item => item.name.toLowerCase() == val.toLowerCase());
            if (CountryName.length == 0 && CapitalName.length == 0) {
                imgWrapper.style.display = "none";
                loading.style.display = "none";
                country.style.display = "none";
                noresult.style.display = "block";
            }
            else if (CountryName.length == 1 && CapitalName.length == 0) {
                noresult.style.display = "none";
                CountryName.map(item => flagFinder(item.name))
                country.innerHTML = CountryName.map(item => item.name).join("");
            }
            else {
                imgWrapper.style.display = "none";
                loading.style.display = "none";
                country.innerHTML = CapitalName.map(item => item.capital).join("");
                country.style.display = "block";
            }
            paragraf.style.display = "flex";
        }
        )
}

async function flagFinder(name) {
    countryFlagLoader(false);
    const data = await fetch("https://countriesnow.space/api/v0.1/countries/flag/images")
    const Flag = await data.json();
    Flag.data.map(item => item.name.toLowerCase() == name.toLowerCase() && flagImg.setAttribute("src", item.flag));
    countryFlagLoader(true);
}

function countryFlagLoader(countryLoader) {
    if (!countryLoader) {
        country.style.display = "none";
        imgWrapper.style.display = "none";
    }
    else {
        loading.style.display = "none";
        country.style.display = "block";
        imgWrapper.style.display = "block";
    }
}

function openSearch() {
    document.querySelector(".btn1").classList += " btn-primary";
    document.querySelector(".btn2").classList.remove("btn-primary");
    document.querySelector(".btn3").classList.remove("btn-primary");
    document.querySelector(".search__section").style.display = "flex";
    document.querySelector(".Countries__wrapper").style.display = "none";
    continentCountry.style.display = "none";
    back.style.display = "none";
    guessWrapper.style.display = "none";
}

function openCountries() {
    document.querySelector(".btn2").classList += " btn-primary";
    document.querySelector(".btn1").classList.remove("btn-primary");
    document.querySelector(".btn3").classList.remove("btn-primary");
    document.querySelector(".search__section").style.display = "none";
    document.querySelector(".Countries__wrapper").style.display = "flex";
    back.style.display = "none";
    continentCountry.style.display = "none";
    guessWrapper.style.display = "none";
}

function openGuess() {
    document.querySelector(".btn3").classList += " btn-primary";
    document.querySelector(".btn1").classList.remove("btn-primary");
    document.querySelector(".btn2").classList.remove("btn-primary");
    document.querySelector(".search__section").style.display = "none";
    document.querySelector(".Countries__wrapper").style.display = "none";
    back.style.display = "none";
    continentCountry.style.display = "none";
    guessWrapper.style.display = "flex";
}

for (var i = 0; i < continentName.length; i++) {
    continentName[i].addEventListener('click', async function () {
        document.querySelector(".loading__bg").style.display = "flex";
        await fetch(`https://restcountries.com/v2/region/${this.innerText}`)
            .then(res => res.json())
            .then(item => {
                document.querySelector(".Countries__wrapper").style.display = "none";
                continentCountry.innerHTML = item.map(item => renderContinentCountries(item)).join("")
                back.style.display = "flex";
                continentCountry.style.display = "flex";
                document.querySelector(".loading__bg").style.display = "none";
            })
    }, false);
}

function renderContinentCountries(country) {
    return `<div class="continent__country">
             <figure class="continent__country--flag">
               <img class="country--flag" src="${country.flag}" alt="">
             </figure>
             <div class="continent__country--name">
               <p>${country.name}</p>
               <p>population: ${country.population}</p>
             </div>
            </div>`
}

function backToCountries(){
    back.style.display = "none";
    continentCountry.style.display = "none";
    document.querySelector(".Countries__wrapper").style.display = "flex";
}


async function getAllFlags(){
    document.querySelector(".loading__bg").style.display = "flex";
    await fetch("https://restcountries.com/v3.1/all")
        .then(res => res.json())
        .then(item => item.map(item => allFlags.push(item)))
        
        var random = Math.floor(Math.random() * allFlags.length)
        guessFlag.setAttribute("Src", `${allFlags[random].flags.svg}`)
        guessCapital.innerText = `${allFlags[random].name.common}`
        if(allFlags[random].capital == undefined){
            random = Math.floor(Math.random() * allFlags.length);
        }
        capital = (allFlags[random].capital).join("");
        document.querySelector(".loading__bg").style.display = "none";
}

function checkCapital(event){
    const value = event.target.value;
    if(value.toLowerCase() == capital.toLowerCase()){
        document.querySelector(" .guess__score--wrapper").style.display = "flex";
        document.querySelector(" .guess__score--bg").style.display = "flex";
        score++;
        document.querySelector(".guess__score").innerText = `Your score is ${score}`
    }
    else{
        hintCount += 1;
        search.classList += " wrong__value";
         setTimeout(function () {search.classList.remove("wrong__value")}, 1000);
    }
    if(hintCount >= 3){
        guessHint.style.display = "flex";
        document.querySelector(".hint__para").innerText = `Hint: First letter is ${capital.charAt(0)}`
    }

    search.value = '';
}

function nextFlag(){
    getAllFlags()
    document.querySelector(" .guess__score--wrapper").style.display = "none";
    document.querySelector(" .guess__score--bg").style.display = "none";
    guessHint.style.display = "none";
    hintCount = 0;
}
 
function refreshFlag(){ 
    getAllFlags()
    guessHint.style.display = "none";
    hintCount = 0;
}

function onSearchKeyPress(key){
    key == 'Enter' && checkCapital(), FetchData();
}