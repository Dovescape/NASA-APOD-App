const resultsNav = document.getElementById('resultsNav');
const favoritesNav = document.getElementById('favoritesNav');
const imagesContainer = document.querySelector('.images-container'); //selects by class
const saveConfirmed = document.querySelector('.save-confirmed');
const loader = document.querySelector('.loader');

// NASA API
const count = 10;
const apiKey = 'DEMO_KEY';
const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=${count}`;

let resultsArray = [];
let favorites = {};

function showContent(page) {
    window.scrollTo({ top: 0, behavior: 'instant'});
    if (page === 'results') {
        resultsNav.classList.remove('hidden');
        favoritesNav.classList.add('hidden');
    } else if (page === 'favorites') {
        resultsNav.classList.add('hidden');
        favoritesNav.classList.remove('hidden');
    }
    loader.classList.add('hidden');
}

function createDOMNodes(page) {
    const currentArray = page === 'results' ? resultsArray : Object.values(favorites);
    currentArray.forEach((result) => {
        // card container
        const card = document.createElement('div');
        card.classList.add('card');
        // link
        const link = document.createElement('a');
        link.href = result.hdurl;
        link.title = 'View Full Image';
        link.target = '_blank';
        // image
        const image = document.createElement('img');
        image.src = result.url;
        image.alt = 'NASA Picture of the Day';
        image.loading = 'lazy';
        image.classList.add('card-img-top');
        // card body
        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');
        // card title
        const cardTitle = document.createElement('h5');
        cardTitle.classList.add('card-title');
        cardTitle.textContent = result.title;
        // add favorites
        const addFavorites = document.createElement('p');
        addFavorites.classList.add('clickable');
        if (page === 'results') {
            addFavorites.textContent = 'Add to Favorites';
            addFavorites.setAttribute('onclick', `saveFavorite('${result.url}')`);
        } else {
            addFavorites.textContent = 'Remove Favorite';
            addFavorites.setAttribute('onclick', `removeFavorite('${result.url}')`);
        }
        // card text
        const cardText = document.createElement('p');
        cardText.classList.add('card-text');
        cardText.textContent = result.explanation;
        // footer 
        const bottomText = document.createElement('small');
        bottomText.classList.add('text-muted');
        // date of pic
        const pictureDate = document.createElement('strong');
        pictureDate.textContent = result.date;
        // copyright info
        const copyrightResult = result.copyright === undefined ? '' : result.copyright;
        const copyrightPic = document.createElement('span');
        copyrightPic.textContent = ` ${copyrightResult}`;

        // append
        bottomText.append(pictureDate, copyrightPic);
        cardBody.append(cardTitle, addFavorites, cardText, bottomText);
        link.appendChild(image);
        card.append(link, cardBody);
        imagesContainer.appendChild(card);

    });
}

function updateDOM(page) {
    // get favs from local storage
    if (localStorage.getItem('nasaFavorites')) {
        favorites = JSON.parse(localStorage.getItem('nasaFavorites'));
    }
    imagesContainer.textContent = ''; //resets imagesContainer so if you remove a favorite it reloads properly
    createDOMNodes(page);
    showContent(page);
}

// get 10 images from NASA
async function getNasaPictures() {
    //show loader
    loader.classList.remove('hidden');
    try {
        const response = await fetch(apiUrl);
        resultsArray = await response.json();
        updateDOM('results');
    } catch (error) {
        //catch error here
    }
}

//add result to favs
function saveFavorite(itemUrl) {
    // loop through results array to select favorite
    resultsArray.forEach((item) => {
        if (item.url.includes(itemUrl) && !favorites[itemUrl]) {
            favorites[itemUrl] = item;
            // show save confirmation for 2 seconds
            saveConfirmed.hidden = false;
            setTimeout(() => {
                saveConfirmed.hidden = true;
            }, 2000);
            // set favs in local storage
            localStorage.setItem('nasaFavorites', JSON.stringify(favorites));
        }
    });
}

//remove item from favs
function removeFavorite(itemUrl) {
    if (favorites[itemUrl]) {
        delete favorites[itemUrl];
        // set favs in local storage
        localStorage.setItem('nasaFavorites', JSON.stringify(favorites));
        updateDOM('favorites');
    }
}


// on load
getNasaPictures();