const searchInput = document.getElementById("search-bar")
const placeholder = document.getElementById("placeholder")
export const mainBody = document.getElementById("page-body")
const form = document.getElementById("search-form")
const loadingModal = document.getElementById("loading-modal")


export function updateMainBody(data, icon="+", label="Watchlist"){
    let posterAlt = "Poster ";

            if (data.Poster === "N/A") {
                posterAlt += data.Poster;
                data.Poster = "";
            }

            const plotText = formatLongText(data.Plot);

            mainBody.innerHTML += `
                <div class="movie-container" id="${data.imdbID}">
                    <img src="${data.Poster}" class="poster" alt="${posterAlt}">
                    <div>
                        <div class="movie-header">
                            <h3>${data.Title}</h3>
                            <div>
                                <img class="star-icon" src="images/star.svg"></img>
                                <span>${data.imdbRating}</span>
                            </div>
                        </div>
                        <div class="movie-details">
                            <span>${data.Runtime}</span>
                            <span>${data.Genre}</span>
                            <div class="watchlist-btn-container">
                                <button id="watchlist-btn-${data.imdbID}" class="watchlist-btn" data-imdbId="${data.imdbID}">${icon}</button>
                                <label class="watchlist-label for="watchlist-btn">${label}</label>
                            </div>
                        </div>
                        <p class="plot">${plotText}</p>
                    </div>
                </div>
            `
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
        const response = await fetch(`http://www.omdbapi.com/?apikey=81ea48ce&s=${movieData}`)
        const data = await response.json()

        let movieArray= [] 

        for (const movie of data.Search) {
            

            const response = await fetch(`http://www.omdbapi.com/?apikey=81ea48ce&i=${movie.imdbID}&plot=short`);
            const data = await response.json();
            
            movieArray.push(data)

            updateMainBody(data)
        }

        document.querySelectorAll(".readmore-btn").forEach(btn => {
            btn.addEventListener("click", showMore);
        });

        document.querySelectorAll(".watchlist-btn").forEach((btn, index) =>{
            btn.addEventListener("click", e=>{
                localStorage.setItem(movieArray[index].imdbID, JSON.stringify(movieArray[index]))
                
                if(localStorage.getItem("movieArray")){
                    let array = JSON.parse(localStorage.getItem("movieArray"))
                    
                    
                    if(!array.includes(movieArray[index].imdbID)){
                        array.push(movieArray[index].imdbID)
                        // console.log(array)
                        localStorage.setItem("movieArray", JSON.stringify(array))
                    }
                }
                else
                localStorage.setItem("movieArray", JSON.stringify([movieArray[index].imdbID]))
                
                const confirmDiv = document.createElement("div")
                confirmDiv.innerHTML = `<span class="confirm-message">Added to Watchlist</span>`
                confirmDiv.classList.add("message-container")

                document.body.appendChild(confirmDiv)

                setTimeout(() => document.body.removeChild(confirmDiv), 1499)


            })
        })
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

export function showMore(e){
    e.target.classList.toggle("hidden")
    e.target.nextElementSibling.classList.toggle("hidden");
}


function formatLongText(text){
    let words = text.split(" ");
    if (words.length <= 25) return text;

    let firstPart = words.slice(0, 25).join(" ");
    let remainingPart = words.slice(25).join(" ");

    return `${firstPart} <button class="readmore-btn">... Read more</button><span class="hidden">${remainingPart}</span>`;
}