// Get information from localStorage
document.addEventListener('DOMContentLoaded', async function() {
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        prefe.innerHTML = '<div class="spinner"></div>'
        let item = await (await fetch('http://127.0.0.1:8000/movies/' + key)).json();
        prefe.innerHTML = '';
        //const item = JSON.parse(localStorage.getItem(key));



        //const container = document.querySelector('#prefe');
        if (item) {

            const html = `
            <div class="col-md-6 col-lg-4">
                <div class="card text-center card-product">
                  <div class="card-product__img">
                  <img class="card-img" src="${item.imdb_image}" alt="">
                    <ul class="card-product__imgOverlay">
                      <li><button><i class="ti-search"></i></button></li>
                      <li><button><i class="ti-shopping-cart"></i></button></li>
                      <li><button id="cuore${i+1}"><i class="heart-full"></i></button></li>
                    </ul>
                  </div>
                  <div class="card-body">
                    <p>${item.release_year}</p>
                    <h4 class="card-product__title"><a href="#">${item.title}</a></h4>
                    <p class="card-product__price">${item.genre}</p>
                  </div>
                </div>
              </div>
            `
            
            prefe.insertAdjacentHTML('beforeend', html);
        }
    }
});

// Store information in localStorage
document.addEventListener('DOMContentLoaded', function() {
    const array = [];

    const elements = document.querySelectorAll('[id^="cuore"]');
    for (let i = 0; i < elements.length; i++) {
        array[i] = elements[i];

            array[i].addEventListener('click', function() {
                var element = array[i].querySelector('i');
                const key = `pref${i + 1}`;
                const item = localStorage.getItem(key);
                // Code for localStorage/sessionStorage
                if (item) {
                    // Remove the main parent of the <i> element
                    for (let j = 0; j < 6; j++) {
                        element = element.parentNode;
                    }
                    element.remove();

                    localStorage.removeItem(key);
                    console.log(`Element removed from local storage: ${key}`);
                }           
            });
    }
});