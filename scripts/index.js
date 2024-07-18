const searchInput = document.getElementById("search-bar")
const placeholder = document.getElementById("placeholder")
export const mainBody = document.getElementById("page-body")
const form = document.getElementById("search-form")
const loadingModal = document.getElementById("loading-modal")


export function showMore(e){
    e.target.classList.toggle("hidden")
    e.target.nextElementSibling.classList.toggle("hidden");
}


export function updateMainBody(data, icon = "+", label = "Watchlist") {
    let posterAlt = "Poster ";

    if (data.Poster === "N/A") {
        posterAlt += data.Poster;
        data.Poster = "";
    }

    const plotText = formatLongText(data.Plot, data.imdbID);

    // Create the container for the movie
    const movieContainer = document.createElement("div");
    movieContainer.classList.add("movie-container");
    movieContainer.id = data.imdbID;

    // Set the inner HTML for the movie container
    movieContainer.innerHTML = `
        <img src="${data.Poster}" class="poster" alt="${posterAlt}">
        <div class="movie-content">
            <div class="movie-header">
                <h3>${data.Title}</h3>
                <div class="rating">
                    <img class="star-icon" src="images/star.svg"></img>
                    <span>${data.imdbRating}</span>
                </div>
            </div>
            <div class="movie-details">
                <span>${data.Runtime}</span>
                <span class="genre">${data.Genre}</span>
                <div class="watchlist-btn-container">
                    <button id="watchlist-btn-${data.imdbID}" class="watchlist-btn" data-imdbId="${data.imdbID}">${icon}</button>
                    <label class="watchlist-label" for="watchlist-btn-${data.imdbID}">${label}</label>
                </div>
            </div>
            <p class="plot">${plotText}</p>
        </div>
    `;

    // Append the movie container to the main body
    mainBody.appendChild(movieContainer);

    // Add the event listener to the watchlist button
    const watchlistBtn = movieContainer.querySelector(`#watchlist-btn-${data.imdbID}`);
    watchlistBtn.addEventListener("click", (e) => {
        localStorage.setItem(data.imdbID, JSON.stringify(data));

        if (localStorage.getItem("movieArray")) {
            let array = JSON.parse(localStorage.getItem("movieArray"));

            if (!array.includes(data.imdbID)) {
                array.push(data.imdbID);
                localStorage.setItem("movieArray", JSON.stringify(array));
            }
        } else {
            localStorage.setItem("movieArray", JSON.stringify([data.imdbID]));
        }

        const confirmDiv = document.createElement("div");
        confirmDiv.innerHTML = `<span class="confirm-message">Added to Watchlist</span>`;
        confirmDiv.classList.add("message-container");

        document.body.appendChild(confirmDiv);

        setTimeout(() => document.body.removeChild(confirmDiv), 1450);
    });

    const showMoreBtn = movieContainer.querySelector(`#readmore-btn-${data.imdbID}`)
    
    if(showMoreBtn)
        showMoreBtn.addEventListener("click", (e)=>{
            e.target.classList.toggle("hidden")
            e.target.nextElementSibling.classList.toggle("hidden");
        })
}

function toggleModal(){
    loadingModal.classList.toggle("hidden")
    loadingModal.classList.toggle("flex")
}



if(form)
    form.addEventListener("submit", getMovies)

// searchInput.addEventListener("click", function() { this.value = ""})

async function getMovies(e){
    e.preventDefault()    


    const movieData = searchInput.value

    if(mainBody.classList.contains("empty")){ 
        mainBody.classList.toggle("empty")
        mainBody.classList.toggle("full")
    }

    mainBody.innerHTML = ""


    toggleModal()
    try{
        const response = await fetch(`https://www.omdbapi.com/?apikey=81ea48ce&s=${movieData}`)
        const data = await response.json()

        let movieArray= [] 

        for (const movie of data.Search) {
            

            const response = await fetch(`https://www.omdbapi.com/?apikey=81ea48ce&i=${movie.imdbID}`);
            const data = await response.json();
            
            movieArray.push(data)

            updateMainBody(data)
        }

        // document.querySelectorAll(".readmore-btn").forEach(btn => {
        //     btn.addEventListener("click", showMore);
        // });

        toggleModal()
    }catch(e){
        toggleModal()

        mainBody.classList.toggle("empty")
        mainBody.classList.toggle("full")

        mainBody.innerHTML = `
        <div id="placeholder" class="placeholder">
            <p>Unable to find what you're looking for. Please try another search</p>
        </div>`
    }
}


function formatLongText(text, id){
    let words = text.split(" ");
    if (words.length <= 25) return text;

    let firstPart = words.slice(0, 25).join(" ");
    let remainingPart = words.slice(25).join(" ");

    return `${firstPart} <button id="readmore-btn-${id}" class="readmore-btn">... Read more</button><span class="hidden">${remainingPart}</span>`;
}