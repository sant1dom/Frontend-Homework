document.addEventListener('DOMContentLoaded', async function() {

    const watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
    wlist.innerHTML = '<div class="spinner"></div>';
  
    // Create an array of promises
    const fetchWatchlist = watchlist.map(key => 
      fetch('http://127.0.0.1:8000/movies/' + key)
        .then(response => response.json())
    );
  
    console.log(fetchWatchlist)
    
    const items = await Promise.all(fetchWatchlist);
  
    items.forEach((item) => {
        if (item) {
            const html = `
            <div class="col-md-6 col-lg-4 col-xl-3" id="${item.id}">
                <div class="card text-center card-product">
                 <div class="card-product__img">
                 <a href="/films/${item.id}">
                 <img class="card-img" src="${item.imdb_image}" alt="">
                 </a>
                   <ul class="card-product__imgOverlay">
                     <li><button id="clock1"><i class="clk-full"></i></button></li>
                     <li><button id="cuore1"><i></i></button></li>
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
            
            wlist.insertAdjacentHTML('beforeend', html);
        }
    });
    // Remove the spinner once the watchlist have been loaded
    wlist.innerHTML = wlist.innerHTML.replace('<div class="spinner"></div>', '');
  
    const array = [];
    const elements = document.querySelectorAll('[id^="clock"]');
    console.log(elements.length)
    for (let i = 0; i < elements.length; i++) {
        array[i] = elements[i];
        array[i].addEventListener('click', function() {
            var element = array[i].querySelector('i');
            var par = element;
            for (let j = 0; j < 6; j++) {
                par = par.parentNode;
            }
            const key = par.id;
   
            // Get the "watchlist" array from localStorage
            const watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
   
            // Check if the movie is in the "watchlist" array
            if (watchlist.includes(key)) {
                // Remove the main parent of the <i> element
                for (let j = 0; j < 6; j++) {
                   element = element.parentNode;
                }
                element.remove();
   
                // Remove the movie from the "favourites" array
                const index = watchlist.indexOf(key);
                if (index > -1) {
                   watchlist.splice(index, 1);
                }
            }         
   
            // Save the updated "watchlist" array to localStorage
            localStorage.setItem('watchlist', JSON.stringify(watchlist));
            console.log(`Element ${watchlist.includes(key) ? 'removed from' : 'added to'} local storage: ${key}`);
        });
    }

    const arr = [];
    const els = document.querySelectorAll('[id^="cuore"]');
    for (let i = 0; i < els.length; i++) {
        arr[i] = els[i];
        var el = arr[i].querySelector('i');

        var par = el;
        for (let j = 0; j < 6; j++) {
            par = par.parentNode;
        }
        const key = par.id;
        
        const favourites = JSON.parse(localStorage.getItem('favourites')) || [];

        if (favourites.includes(key)) {
            el.classList.add('heart-full');
        } else {
            el.classList.add('heart');
        }

        arr[i].addEventListener('click', function () {
            var el = arr[i].querySelector('i');

            var par = el;
            for (let j = 0; j < 6; j++) {
                par = par.parentNode;
            }
            const key = par.id;

            const favourites = JSON.parse(localStorage.getItem('favourites')) || [];

            if (favourites.includes(key)) {
                el.classList.remove('heart-full');
                el.classList.add('heart');

                const index = favourites.indexOf(key);
                if (index > -1) {
                    favourites.splice(index, 1);
                }
            } else {
                el.classList.remove('heart');
                el.classList.add('heart-full');
                favourites.push(key);
            }

            localStorage.setItem('favourites', JSON.stringify(favourites));
            console.log(`Film ${favourites.includes(key) ? 'added to' : 'removed from'} favourites: ${key}`);
        });
    }
   });
   
  