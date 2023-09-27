// Selecting the card container from the DOM
let cardContainer = document.getElementById('container');

// this function will return the HTML element card container.
const displayCard = (character) => {
     return  `
     <div class="flex-col card">
          <img src="${character.squareImage}" alt="">
          <span class="name">${character.name}</span>
          <span class="id">Id : ${character.id}</span>
          <span class="comics">Comics : ${character.comics}</span>
          <span class="series">Series : ${character.series}</span>
          <span class="stories">Stories : ${character.stories}</span>
          <a class="character-info" href="./more-info.html">
               <button class="btn">More Info</button>
          </a>
          <div style="display:none;">
               <span>${character.id}</span>
               <span>${character.name}</span>
               <span>${character.comics}</span>
               <span>${character.series}</span>
               <span>${character.stories}</span>
               <span>${character.description}</span>
               <span>${character.landscapeImage}</span>
               <span>${character.portraitImage}</span>
               <span>${character.squareImage}</span>
          </div>
          <button class="btn remove-btn"> Remove from Favourites</button>
     </div>
`
}

// This will execute when the page loads.
window.addEventListener("load", function () {
     // this will return favouriteCharacters from the local storage.
     let fav = localStorage.getItem("favouriteCharacters");

     if (fav == null) {
          cardContainer.innerHTML = "<p class=\"no-characters\">No characters present in Favourites</p>"
          return;
     }

     else {
          fav = JSON.parse(this.localStorage.getItem("favouriteCharacters"));
     }

     if (fav.length == 0) {
          cardContainer.innerHTML = "<p class=\"no-characters\">No characters present in Favourites</p>";
          return;
     }

     cardContainer.innerHTML = "";
     fav.forEach(character => {
          cardContainer.innerHTML += displayCard(character);
     })
     clickEvent();
})

// This function is called when we click on the remove favourite button.
function clickEvent() {
     let removeBtn = document.querySelectorAll(".remove-btn");
     removeBtn.forEach((btn) => btn.addEventListener("click", removeFavouriteCharacters))

     let characterInfo = document.querySelectorAll(".character-info");
     characterInfo.forEach((character) => character.addEventListener("click", addInfoIntoLocalStorage));
}


// This function will remove the the favorite characters from the Favourites.
function removeFavouriteCharacters() {
     
     const id = this.parentElement.children[2].innerHTML.substring(5);
     const fav = JSON.parse(localStorage.getItem("favouriteCharacters"));
     const favCharacterIDs = new Map(JSON.parse(localStorage.getItem("favouritesCharacterIDs")));

     favCharacterIDs.delete(`${id}`);

     fav.forEach(function (favourite, index) {
          if (favourite.id == id) {
               fav.splice(index, 1);
          }
     });
     if (fav.length == 0) {
          cardContainer.innerHTML = "<p class=\"no-characters\">No characters present in Favourites</p>";
     }
     localStorage.setItem("favouriteCharacters", JSON.stringify(fav));
     localStorage.setItem("favouritesCharacterIDs", JSON.stringify([...favCharacterIDs]));

     this.parentElement.remove();

     document.querySelector(".remove-toast").setAttribute("data-visiblity", "show");

     setTimeout(function () {
          document.querySelector(".remove-toast").setAttribute("data-visiblity", "hide");
     }, 1000);
}


// This function stores the hero into the localStorage.
function addInfoIntoLocalStorage() {
     let heroInfo = {
          name: this.parentElement.children[7].children[1].innerHTML,
          description: this.parentElement.children[7].children[5].innerHTML,
          comics: this.parentElement.children[7].children[2].innerHTML,
          series: this.parentElement.children[7].children[3].innerHTML,
          stories: this.parentElement.children[7].children[4].innerHTML,
          portraitImage: this.parentElement.children[7].children[7].innerHTML,
          id: this.parentElement.children[7].children[0].innerHTML,
          landscapeImage: this.parentElement.children[7].children[6].innerHTML
     }

     localStorage.setItem("heroInfo", JSON.stringify(heroInfo));
}
