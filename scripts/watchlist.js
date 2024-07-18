import { updateMainBody, mainBody, showMore } from "./index.js"


let movieArray = JSON.parse(localStorage.getItem("movieArray"))

genearteWatchlist(movieArray)

function genearteWatchlist(movieArray){
    if(movieArray.length > 0){
        toggleBody()

        for(const movie of movieArray){
            updateMainBody(JSON.parse(localStorage.getItem(movie)), "/images/remove-icon.svg", "Remove")
        }

        // document.querySelectorAll(".readmore-btn").forEach(btn => {
        //     btn.addEventListener("click", showMore);
        // });
    
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

    const confirmDiv = document.createElement("div")
    confirmDiv.innerHTML = `<span class="confirm-message">Removed from Watchlist</span>`
    confirmDiv.classList.add("message-container")

    document.body.appendChild(confirmDiv)

    setTimeout(() => document.body.removeChild(confirmDiv), 1499)
}


function toggleBody(isHidden = false){
    mainBody.classList.toggle('empty')
    mainBody.classList.toggle('full')    
    mainBody.innerHTML = 
    `
        <div id="placeholder" class="placeholder">
            <p>Your watchlist is looking a little empty...</p>
            <div>
                    <button class="watchlist-btn"><a href="index.html"><img src="/images/add-icon.svg"></a></button>
                    <span class="empty-message">Let's add some movies</span>
                </div>  
        </div>
    `
    if(!isHidden)
        document.getElementById("placeholder").classList.toggle("hidden")

}

function isBodyEmpty(array){
    if(array.length === 0)
        toggleBody(true)  
}