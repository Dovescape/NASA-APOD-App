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

function updateDOM() {
    resultsArray.forEach((result) => {
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
        addFavorites.textContent = 'Add to Favorites';
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

// get 10 images from NASA
async function getNasaPictures() {
    try {
        const response = await fetch(apiUrl);
        resultsArray = await response.json();
        console.log(resultsArray);
        updateDOM();
    } catch (error) {
        //catch error here
    }
}


// on load
getNasaPictures();