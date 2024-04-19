// setup

const resorts = [
    {
        name: 'keystone',
        city: 'dillon',
        state: 'colorado',
        pass: 'epic',
        img: 'keystone.jpg',
        placeId: 'ChIJW_aKIwJaaocRr6sP37eZJ_M'
    },
    {
        name: 'copper',
        city: 'frisco',
        state: 'colorado',
        pass: 'ikon',
        img: 'copper.jpg',
        placeId: 'ChIJje2Mxv5faocRGxb87e3-W8o'
    },
    {
        name: 'steamboat',
        city: 'steamboat springs',
        state: 'colorado',
        pass: 'ikon',
        img: 'steamboat.jpg',
        placeId: 'ChIJXXSu2LhuQocRI58fmBc30yI'
    },
    {
        name: 'araphoe basin',
        city: 'dillon',
        state: 'colorado',
        pass: 'ikon',
        img: 'arapahoebasin.jpg',
        placeId: 'ChIJWd2U7rRQaocRllxVIFIp5Ts'
    },
    {
        name: 'winter park',
        city: 'winter park',
        state: 'colorado',
        pass: 'ikon',
        img: 'winterpark.jpg',
        placeId: 'ChIJI0qcWKXKa4cRFu-NV44W0Zo'
    },
    {
        name: 'telluride',
        city: 'telluride',
        state: 'colorado',
        pass: 'epic',
        img: 'telluride.jpg',
        placeId: 'ChIJn0u5JP3XPocRazD8zAjmAp0'
    },
    {
        name: 'crested butte',
        city: 'crested butte',
        state: 'colorado',
        pass: 'epic',
        img: 'crestedbutte.jpg',
        placeId: 'ChIJO4oGmYZtQIcR-qDfkW5kg6Y'
    },
    {
        name: 'breckenridge',
        city: 'breckenridge',
        state: 'colorado',
        pass: 'epic',
        img: 'breckenridge.jpg',
        placeId: 'ChIJ5SL_Vd71aocRHD59U1wlA8s'
    },
    {
        name: 'aspen',
        city: 'aspen',
        state: 'colorado',
        pass: 'ikon',
        img: 'aspen.png',
        placeId: 'ChIJjxt7zM1HQIcRYFVYkLuaAco'
    },
    {
        name: 'beaver creek',
        city: 'avon',
        state: 'colorado',
        pass: 'epic',
        img: 'beavercreek.png',
        placeId: 'ChIJLUeXah54aocRLCubAYD6EBI'
    },
    {
        name: 'eldora',
        city: 'nederland',
        state: 'colorado',
        pass: 'ikon',
        img: 'eldora.png',
        placeId: 'ChIJ0x3kl8_Ga4cRYLmEslbP94Q'
    },
    {
        name: 'vail',
        city: 'vail',
        state: 'colorado',
        pass: 'epic',
        img: 'vail.png',
        placeId: 'ChIJ29swxmBwaocRoq1FSy3Pwqc'
    },
]

let autocomplete;
let trafficDivs;
let resortDivs;
let marker = 0;

const resortsContainer = document.querySelector('.resorts-container');
let urls = []
resorts.forEach((resort) => {
    urls.push(fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${resort.city}%2C%20${resort.state}?unitGroup=metric&include=days&key=VGSVU45QFY7FQ3T557YS85XR6&contentType=json`))
})

// set up maps

function initAutocomplete() {
    autocomplete = new google.maps.places.Autocomplete(
        document.getElementById('autocomplete'),
        {
            componentRestrictions: { 'country': ['US'] },
            fields: ['place_id', 'name']
        }
    );
    autocomplete.addListener('place_changed', onPlaceChanged);
};

function onPlaceChanged() {
    if (marker == 0) {
        document.querySelector('.home-page').style.height = '20vh'
        document.querySelector('.resorts-container').style.display = 'flex'
        document.querySelector('.filter-buttons').style.display = 'flex'
        document.querySelector('.footer').style.display = 'flex'
        document.querySelector('.title').style.display = 'none'
        document.querySelector('.input-buttons').style.margin = '0'
        for (let i = 0; i < trafficDivs.length; i++) {
            trafficDivs[i].innerHTML = `<iframe loading="lazy" zoom='7' allowfullscreen src="https://www.google.com/maps/embed/v1/directions?origin=place_id:${autocomplete.getPlace().place_id}&destination=place_id:${resorts[i].placeId}&key=AIzaSyDKXvBmIXu6Rx45ioDEyZDPJ6FS6ghFu9k"></iframe>`
        }
        marker = 1;
    } else {
        for (let i = 0; i < trafficDivs.length; i++) {
            trafficDivs[i].innerHTML = '';
            trafficDivs[i].innerHTML = `<iframe loading="lazy" zoom='7' allowfullscreen src="https://www.google.com/maps/embed/v1/directions?origin=place_id:${autocomplete.getPlace().place_id}&destination=place_id:${resorts[i].placeId}&key=AIzaSyDKXvBmIXu6Rx45ioDEyZDPJ6FS6ghFu9k"></iframe>`
        }
    }
}

// fetch requests

async function fetchWeatherData() {
    const response = await Promise.all(urls);
    const data = await Promise.all(response.map((item) => {
        return item.json()
    }))
    return data;
}

// update resorts object with current weather data

async function saveWeatherData() {
    const data = await fetchWeatherData();
    for (let i = 0; i < data.length; i++) {
        resorts[i].high = Math.floor((data[i].days[0].tempmax * 1.8) + 32);
        resorts[i].low = Math.floor((data[i].days[0].tempmin * 1.8) + 32);
        resorts[i].report = data[i].days[0].description
        resorts[i].icon = data[i].days[0].icon
    }
}

// create resort cards on page

async function buildAllCards() {
    await saveWeatherData();
    resorts.forEach((resort) => {
        buildEachCard(resort);
    })
    trafficDivs = document.querySelectorAll('.resort-traffic');
    resortDivs = document.querySelectorAll('.resort');
}

function buildEachCard(resort) {
    const resortDiv = document.createElement('div');
    resortDiv.classList.add('resort');
    resortDiv.classList.add(resort.pass)
    resortsContainer.appendChild(resortDiv);
    const resortImg = document.createElement('img');
    resortImg.src = '/images/' + resort.img;
    resortImg.classList.add('resort-img');
    resortDiv.appendChild(resortImg);
    const resortContentDiv = document.createElement('div');
    resortContentDiv.classList.add('resort-content');
    resortDiv.appendChild(resortContentDiv);
    const resortNameDiv = document.createElement('div');
    resortNameDiv.classList.add('resort-name');
    resortContentDiv.appendChild(resortNameDiv);
    const nameH3 = document.createElement('h3');
    resortNameDiv.appendChild(nameH3);
    nameH3.textContent = resort.name;
    const locationH5 = document.createElement('h5');
    resortNameDiv.appendChild(locationH5);
    locationH5.textContent = `${resort.city}, ${resort.state}`;
    const resortWeatherDiv = document.createElement('div');
    resortWeatherDiv.classList.add('resort-weather');
    resortContentDiv.appendChild(resortWeatherDiv);
    const highDiv = document.createElement('div');
    highDiv.classList.add('high');
    resortWeatherDiv.appendChild(highDiv);
    const highH6 = document.createElement('h6');
    highDiv.appendChild(highH6);
    highH6.textContent = 'high'
    const highH2 = document.createElement('h2');
    highDiv.appendChild(highH2);
    highH2.textContent = resort.high + '°';
    const lowDiv = document.createElement('div');
    lowDiv.classList.add('low');
    resortWeatherDiv.appendChild(lowDiv);
    const lowH6 = document.createElement('h6');
    lowDiv.appendChild(lowH6);
    lowH6.textContent = 'low'
    const lowH2 = document.createElement('h2');
    lowDiv.appendChild(lowH2);
    lowH2.textContent = resort.low + '°';
    const iconDiv = document.createElement('div');
    iconDiv.classList.add('icon');
    resortWeatherDiv.appendChild(iconDiv);
    const iconImg = document.createElement('img');
    iconImg.src = '/images/' + resort.icon + '.png';
    iconImg.classList.add('weather-icon');
    iconDiv.appendChild(iconImg);
    const resortReportDiv = document.createElement('div');
    resortReportDiv.classList.add('resort-report');
    resortContentDiv.appendChild(resortReportDiv);
    const resortReportP = document.createElement('p');
    resortReportDiv.appendChild(resortReportP);
    resortReportP.textContent = resort.report;
    const resortTrafficDiv = document.createElement('div');
    resortTrafficDiv.classList.add('resort-traffic');
    resortContentDiv.appendChild(resortTrafficDiv);
}

// set up filter buttons

async function setUpFilters() {
    await buildAllCards();
    const epicBtn = document.querySelector('#epic-button');
    const ikonBtn = document.querySelector('#ikon-button');
    const allBtn = document.querySelector('#all-button');
    epicBtn.addEventListener('click', makeFilterButtons('epic'))
    ikonBtn.addEventListener('click', makeFilterButtons('ikon'))
    allBtn.addEventListener('click', makeFilterButtons('resort'))
}

function makeFilterButtons(pass) {
    return function () {
        resortDivs.forEach((div) => {
            if (div.classList.contains(pass)) {
                div.style.display = 'flex'
            } else {
                div.style.display = 'none'
            }
        })
    }
}

setUpFilters();