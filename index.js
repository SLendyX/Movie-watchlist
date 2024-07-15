const searchInput = document.getElementById("search-bar")
const placeholder = document.getElementById("placeholder")
const mainBody = document.getElementById("page-body")

document.getElementById("search-form").addEventListener("submit", getMovies)

// searchInput.addEventListener("click", function() { this.value = ""})

async function getMovies(e){
    e.preventDefault()    
    const movieData = searchInput.value

    if(mainBody.classList.contains("empty")){ 
        mainBody.classList.toggle("empty")
        mainBody.classList.toggle("full")
    }

    mainBody.innerHTML = ""

    const response = await fetch(`http://www.omdbapi.com/?apikey=81ea48ce&s=${movieData}`)
    const data = await response.json()
    console.log(data)

    data.Search.forEach(async movie => {
        const response = await fetch(`http://www.omdbapi.com/?apikey=81ea48ce&t=${movie.Title}`)
        const data = await response.json()

        console.log(movie)
        console.log(movie.Error)
        if(movie){
            

            mainBody.innerHTML +=
                `
            <div class="movie-container">
                <img src="${data.Poster}" class="poster">
                
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
                        <div>
                            <button id="watchlist-btn" class="watchlist-btn">+</button>
                            <label for="watchlist-btn">Watchlist</label>
                        </div>
                    </div>
                    <p>${data.Plot}</p>
                </div>
            </div>
            `
        }
    })
    
}






// `
// <div>
//     <img src="${poster}">
    
//     <div>
//         <div>
//             <h3>${Title}</h3>
//             <img>star icon</img>
//         </div>
//         <div>
//             <span>${Runtime}</span>
//             <span>${Genre}</span>
//             <button id="watchlist-btn">+</buton>
//             <label for="watchlist-btn">Watchlist</label>
//         </div>
//         <p>${Plot}</p>
//     </div>
// </div>
// `
