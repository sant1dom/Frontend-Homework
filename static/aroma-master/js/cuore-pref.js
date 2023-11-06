// Get information from localStorage
document.addEventListener('DOMContentLoaded', function() {
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const item = JSON.parse(localStorage.getItem(key));



        const container = document.querySelector('#prefe');
        if (item) {

            const html = `
            <div class="col-md-6 col-lg-4">
                <div class="card text-center card-product">
                  <div class="card-product__img">
                  <img class="card-img" src="https://posters.movieposterdb.com/20_09/2020/6723592/l_6723592_46561c38.jpg" alt="">
                    <ul class="card-product__imgOverlay">
                      <li><button><i class="ti-search"></i></button></li>
                      <li><button><i class="ti-shopping-cart"></i></button></li>
                      <li><button id="cuore${i+1}"><i class="heart-full"></i></button></li>
                    </ul>
                  </div>
                  <div class="card-body">
                    <p>Accessories</p>
                    <h4 class="card-product__title"><a href="#">${item.title}</a></h4>
                    <p class="card-product__price">$150.00</p>
                  </div>
                </div>
              </div>
            `
            
            container.insertAdjacentHTML('beforeend', html);
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