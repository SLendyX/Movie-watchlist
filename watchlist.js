import { updateMainBody, mainBody } from "./index.js"


let movieArray = JSON.parse(localStorage.getItem("movieArray"))

genearteWatchlist(movieArray)

function genearteWatchlist(movieArray){
    if(movieArray.length > 0){
        toggleBody()

        for(const movie of movieArray){
            updateMainBody(JSON.parse(localStorage.getItem(movie)), "⎯", "Remove")
        }
    
        document.querySelectorAll(".watchlist-btn").forEach(btn => {
            btn.addEventListener("click", removeFromWatchList)
        })
    }



}


function removeFromWatchList(e){
    const id = e.target.dataset.imdbid;

    movieArray = movieArray.filter(movieID => movieID !== id)

    localStorage.setItem("movieArray", JSON.stringify(movieArray))
    localStorage.removeItem(id)
    mainBody.removeChild(document.getElementById(id))
    isBodyEmpty(movieArray)
}


function toggleBody(isHidden = false){
    mainBody.classList.toggle('empty')
    mainBody.classList.toggle('full')    
    mainBody.innerHTML = 
    `
        <div id="placeholder" class="placeholder">
            <p>Your watchlist is looking a little empty...</p>
            <div>
                    <button class="watchlist-btn"><a href="index.html">+</a></button>
                    <span class="empty-message">Let's add some movies</span>
                </div>  
        </div>
    `
    if(!isHidden)
        document.getElementById("placeholder").classList.toggle("hidden")

}

function isBodyEmpty(array){
    if(array.length === 0){
        console.log(array)
        toggleBody(true)
    }
}