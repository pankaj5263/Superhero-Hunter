

// Selecting the element from DOM.
let searchBar = document.getElementById("search-bar");
let searchResults = document.getElementById("search-results");

// Adding eventListener to search bar
searchBar.addEventListener("input", () => search(searchBar.value));

// Api call for search Heros.
async function search(textSearched) {

     const PUBLIC_KEY = "693988a1818a7db3ecf613f199d1a7cd";
     const PRIVATE_KEY = "4204195e194e802ff6adc3203537ac5ab75e497f";

     const ts = new Date().getTime();
     const hash = CryptoJS.MD5(ts + PRIVATE_KEY + PUBLIC_KEY).toString();

     
     // if there is no text written in the search bar then nothing is displayed 
     if (textSearched.length == 0) {
          searchResults.innerHTML = ``;
          return;
     }

     const fetchData = await fetch(`https://gateway.marvel.com/v1/public/characters?ts=${ts}&nameStartsWith=${textSearched}&apikey=${PUBLIC_KEY}&hash=${hash}`)
     const  finalData = await fetchData.json();
     showSearchedResults(finalData.data.results)
}

// this function will return Card.
const displayeData = (hero, favouritesCharacterIDs) =>{
     return ` 
     <li class="flex-row single-search-result">
          <div class="flex-row img-info">
               <img src="${hero.thumbnail.path+'/portrait_medium.' + hero.thumbnail.extension}" alt="">
               <div class="hero-info">
                    <a class="character-info" href="./more-info.html">
                         <span class="hero-name">${hero.name}</span>
                    </a>
               </div>
          </div>
          <div class="flex-col buttons">
               <!-- <button class="btn"><i class="fa-solid fa-circle-info"></i> &nbsp; More Info</button> -->
               <button class="btn add-to-fav-btn">${favouritesCharacterIDs.has(`${hero.id}`) ? "<i class=\"fa-solid fa-heart-circle-minus\"></i> &nbsp; Remove from Favourites" :"<i class=\"fa-solid fa-heart fav-icon\"></i> &nbsp; Add to Favourites</button>"}
          </div>
          <div style="display:none;">
               <span>${hero.name}</span>
               <span>${hero.description}</span>
               <span>${hero.comics.available}</span>
               <span>${hero.series.avletailable}</span>
               <span>${hero.stories.available}</span>
               <span>${hero.thumbnail.path+'/portrait_uncanny.' + hero.thumbnail.extension}</span>
               <span>${hero.id}</span>
               <span>${hero.thumbnail.path+'/landscape_incredible.' + hero.thumbnail.extension}</span>
               <span>${hero.thumbnail.path+'/standard_fantastic.' + hero.thumbnail.extension}</span>
          </div>
     </li>`
}

// This function will display the results in the DOM.
function showSearchedResults(searchedHero) {
 
     let favouritesCharacterIDs = localStorage.getItem("favouritesCharacterIDs");
     if(favouritesCharacterIDs == null){
          favouritesCharacterIDs = new Map();
     }
     else if(favouritesCharacterIDs != null){
          favouritesCharacterIDs = new Map(JSON.parse(localStorage.getItem("favouritesCharacterIDs")));
     }

     console.log("favouritesCharacterIDs", favouritesCharacterIDs, searchedHero);

     searchResults.innerHTML = ``;
     let count = 1;

     // iterating the searchedHero array using for loop
     for (const key in searchedHero) {
          if (count <= 5) {
               let hero = searchedHero[key];
               // Appending the element into DOM
               searchResults.innerHTML += displayeData(hero, favouritesCharacterIDs);
          }
          count++;
     }
     // calling events.
     clickEvents();
}

// This function will add the event Listeners to the button.
function clickEvents() {
     let favouriteButton = document.querySelectorAll(".add-to-fav-btn");
     favouriteButton.forEach((btn) => btn.addEventListener("click", addAndRemoveFavourites));

     let characterInfo = document.querySelectorAll(".character-info");
     characterInfo.forEach((character) => character.addEventListener("click", addInfoInLocalStorage))
}


// this Function will call when "Add to Favourites" button or "Remvove from favourites" button is clicked.
function addAndRemoveFavourites() {

     if (this.innerHTML == '<i class="fa-solid fa-heart fav-icon"></i> &nbsp; Add to Favourites') {

          let heroInfo = {
               name: this.parentElement.parentElement.children[2].children[0].innerHTML,
               description: this.parentElement.parentElement.children[2].children[1].innerHTML,
               comics: this.parentElement.parentElement.children[2].children[2].innerHTML,
               series: this.parentElement.parentElement.children[2].children[3].innerHTML,
               stories: this.parentElement.parentElement.children[2].children[4].innerHTML,
               portraitImage: this.parentElement.parentElement.children[2].children[5].innerHTML,
               id: this.parentElement.parentElement.children[2].children[6].innerHTML,
               landscapeImage: this.parentElement.parentElement.children[2].children[7].innerHTML,
               squareImage: this.parentElement.parentElement.children[2].children[8].innerHTML
          }

          let favouritesArray = localStorage.getItem("favouriteCharacters");

          if (favouritesArray == null) {
               favouritesArray = [];
          } else {
               favouritesArray = JSON.parse(localStorage.getItem("favouriteCharacters"));
          }

          let favouritesCharacterIDs = localStorage.getItem("favouritesCharacterIDs");

          
          if (favouritesCharacterIDs == null) {
               favouritesCharacterIDs = new Map();
          } else {
               favouritesCharacterIDs = new Map(JSON.parse(localStorage.getItem("favouritesCharacterIDs")));
          }

          favouritesCharacterIDs.set(heroInfo.id, true);

          favouritesArray.push(heroInfo);

          localStorage.setItem("favouritesCharacterIDs", JSON.stringify([...favouritesCharacterIDs]));
          localStorage.setItem("favouriteCharacters", JSON.stringify(favouritesArray));

          this.innerHTML = '<i class="fa-solid fa-heart-circle-minus"></i> &nbsp; Remove from Favourites';
          
          document.querySelector(".fav-toast").setAttribute("data-visiblity","show");
          setTimeout(function(){
               document.querySelector(".fav-toast").setAttribute("data-visiblity","hide");
          },1000);
     }
     else{
          
          let idOfCharacterToBeRemoveFromFavourites = this.parentElement.parentElement.children[2].children[6].innerHTML;
          let favouritesArray = JSON.parse(localStorage.getItem("favouriteCharacters"));
          
          let favouritesCharacterIDs = new Map(JSON.parse(localStorage.getItem("favouritesCharacterIDs")));
          
          let newFavouritesArray = [];

          favouritesCharacterIDs.delete(`${idOfCharacterToBeRemoveFromFavourites}`);
          
          favouritesArray.forEach((favourite) => {
               if(idOfCharacterToBeRemoveFromFavourites != favourite.id){
                    newFavouritesArray.push(favourite);
               }
          });
                    
          localStorage.setItem("favouriteCharacters",JSON.stringify(newFavouritesArray));
          localStorage.setItem("favouritesCharacterIDs", JSON.stringify([...favouritesCharacterIDs]));
          
          this.innerHTML = '<i class="fa-solid fa-heart fav-icon"></i> &nbsp; Add to Favourites';
          
          document.querySelector(".remove-toast").setAttribute("data-visiblity","show");
          setTimeout(function(){
               document.querySelector(".remove-toast").setAttribute("data-visiblity","hide");
          },1000);
     }     
}

// Function which stores the info object of character for which user want to see the info 
function addInfoInLocalStorage() {
 
     let heroInfo = {
          name: this.parentElement.parentElement.parentElement.children[2].children[0].innerHTML,
          description: this.parentElement.parentElement.parentElement.children[2].children[1].innerHTML,
          comics: this.parentElement.parentElement.parentElement.children[2].children[2].innerHTML,
          series: this.parentElement.parentElement.parentElement.children[2].children[3].innerHTML,
          stories: this.parentElement.parentElement.parentElement.children[2].children[4].innerHTML,
          portraitImage: this.parentElement.parentElement.parentElement.children[2].children[5].innerHTML,
          id: this.parentElement.parentElement.parentElement.children[2].children[6].innerHTML,
          landscapeImage: this.parentElement.parentElement.parentElement.children[2].children[7].innerHTML,
          squareImage: this.parentElement.parentElement.parentElement.children[2].children[8].innerHTML
     }

     localStorage.setItem("heroInfo", JSON.stringify(heroInfo));
}
