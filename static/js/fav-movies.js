import {filters} from './filters.js'; 
import {buttonsFavourites} from './lists-buttons.js'; 

document.addEventListener('DOMContentLoaded', async function() {

  const favourites = JSON.parse(localStorage.getItem('favourites')) || [];
  
  prefe.innerHTML = '<div class="spinner"></div>';

  const fetchFavourites = favourites.map(key => 
    fetch('/movies/' + key)
      .then(response => response.json())
  );
  
  const items = await Promise.all(fetchFavourites);

  items.forEach((item) => {
      console.log(item.id)
      if (item.id) {
          const html = `
          <div class="col-md-6 col-lg-4 col-xl-3" id="${item.id}">
              <div class="card text-center card-product">
               <div class="card-product__img">
               <a href="/films/${item.id}">
               <img class="card-img" src="${item.imdb_image}" alt="">
               </a>
                 <ul class="card-product__imgOverlay">
                   <li><button id="clock1" class="btn"><i></i></button></li>
                   <li><button id="cuore1" class="btn"><i class="heart-full"></i></button></li>
                 </ul>
               </div>
               <div class="card-body">
                 <p>${item.release_year}</p>
                 <h4 class="card-product__title"><a href="/films/${item.id}">${item.title}</a></h4>
                 <p class="card-product__price">${item.genre}</p>
               </div>
              </div>
            </div>
          `
          
          prefe.insertAdjacentHTML('beforeend', html);
      }
  });

  // Remove the spinner once the favourites have been loaded
  prefe.innerHTML = prefe.innerHTML.replace('<div class="spinner"></div>', '');

  filters(items);

  buttonsFavourites();
    
});