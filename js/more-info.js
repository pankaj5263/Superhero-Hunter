// Select the elements from the DOM
let info = document.getElementById('info-container');
let title = document.getElementById('page-title');

// heroInfo is the object which we are getting from localstorage.
let heroInfo = JSON.parse(localStorage.getItem("heroInfo"));


// This will set the tiitle accordingly the heroInfo object.
title.innerHTML = heroInfo.name;


const displayCard  = (favCharacterIDs) => {
     return  info.innerHTML =  `
     <div class="flex-row hero-name">${heroInfo.name}</div>
     <div class="flex-row hero-img-and-more-info">
          <img id="portraitImage" class="hero-img" src="${heroInfo.portraitImage}" alt="">
          <img style="display:none;" id="landscapeImage" src="${heroInfo.landscapeImage}" alt="">
          <div class="flex-col more-info">
               <div class="flex-row id">
                    <b>ID:</b><span>${heroInfo.id}</span>
               </div>
               <div class="flex-row comics">
                    <b>Comics:</b><span>${heroInfo.comics}</span>
               </div>
               <div class="flex-row series">
                    <b>Series:</b><span>${heroInfo.series}</span>
               </div>
               <div class="flex-row stories">
                    <b>Stories:</b><span>${heroInfo.stories}</span>
               </div>
          </div>
     </div>
     <div class="flex-col hero-discription">
          <b>Discription:</b>
          <p>${heroInfo.description != "" ? heroInfo.description : "No Description Available"}</p>
     </div>
     <div style="display:none;">
          <span>${heroInfo.name}</span>
          <span>${heroInfo.portraitImage}</span>
          <span>${heroInfo.landscapeImage}</span>
          <span>${heroInfo.id}</span>
          <span>${heroInfo.comics}</span>
          <span>${heroInfo.series}</span>
          <span>${heroInfo.stories}</span>
          <span>${heroInfo.squareImage}</span>
          <span>${heroInfo.description}</span>
     </div>
     <button class="btn add-to-fav-btn">${favCharacterIDs.has(`${heroInfo.id}`) ? "Remove from Favourites" :"Add to Favourites</button>"}
  `
}

// This function will call once the page is load.
window.addEventListener("load", function () {
     let favCharacterIDs = localStorage.getItem("favouritesCharacterIDs");
     if (favCharacterIDs == null) {
          favCharacterIDs = new Map();
     } else if (favCharacterIDs != null) {
          favCharacterIDs = new Map(JSON.parse(localStorage.getItem("favouritesCharacterIDs")));
     }

     // this function will add the information into the DOM.
     displayCard(favCharacterIDs);
         
     // favourite button event called.
     favButtonClickEvent();
})


// this function would run after content of the page is loaded
function favButtonClickEvent() {
     let favouriteButton = document.querySelector('.add-to-fav-btn');
     favouriteButton.addEventListener("click", addAndRemoveFavourites);
}

// This function will add and remove favourite characters from the list of favourite.
function addAndRemoveFavourites() {

     // If add to favourites button is cliked then
     if (this.innerHTML == 'Add to Favourites') {

          let heroInfo = {
               name: this.parentElement.children[3].children[0].innerHTML,
               description: this.parentElement.children[3].children[8].innerHTML,
               comics: this.parentElement.children[3].children[4].innerHTML,
               series: this.parentElement.children[3].children[5].innerHTML,
               stories: this.parentElement.children[3].children[6].innerHTML,
               portraitImage: this.parentElement.children[3].children[1].innerHTML,
               id: this.parentElement.children[3].children[3].innerHTML,
               landscapeImage: this.parentElement.children[3].children[2].innerHTML,
               squareImage: this.parentElement.children[3].children[7].innerHTML
          }

          let favArray = localStorage.getItem("favouriteCharacters");

          if (favArray == null) {
               favArray = [];
          } else {
               favArray = JSON.parse(localStorage.getItem("favouriteCharacters"));
          }
          let favCharacterIDs = localStorage.getItem("favouritesCharacterIDs");

          
          if (favCharacterIDs == null) {
               favCharacterIDs = new Map();
          } else {
               favCharacterIDs = new Map(JSON.parse(localStorage.getItem("favouritesCharacterIDs")));
          }

          favCharacterIDs.set(heroInfo.id, true);

          favArray.push(heroInfo);

          localStorage.setItem("favouritesCharacterIDs", JSON.stringify([...favCharacterIDs]));
          localStorage.setItem("favouriteCharacters", JSON.stringify(favArray));

          this.innerHTML = '<i class="fa-solid fa-heart-circle-minus"></i> &nbsp; Remove from Favourites';

          document.querySelector(".fav-toast").setAttribute("data-visiblity","show");
          setTimeout(function(){
               document.querySelector(".fav-toast").setAttribute("data-visiblity","hide");
          },1000);
     }
     // For removing the character form favourites array
     else{
          
          let removeFavouritesId = this.parentElement.children[3].children[3].innerHTML;
          
          let favArray = JSON.parse(localStorage.getItem("favouriteCharacters"));
          
          let favCharacterIDs = new Map(JSON.parse(localStorage.getItem("favouritesCharacterIDs")));
          
          let newFavArray = [];
          favCharacterIDs.delete(`${removeFavouritesId}`);
          favArray.forEach((favourite) => {
          if(removeFavouritesId != favourite.id){
               newFavArray.push(favourite);
               }
          });
           
          localStorage.setItem("favouriteCharacters",JSON.stringify(newFavArray));
          localStorage.setItem("favouritesCharacterIDs", JSON.stringify([...favCharacterIDs]));
         
          this.innerHTML = 'Add to Favourites';
          
          document.querySelector(".remove-toast").setAttribute("data-visiblity","show");
       
          setTimeout(function(){
               document.querySelector(".remove-toast").setAttribute("data-visiblity","hide");
          },1000);
     }     
}
