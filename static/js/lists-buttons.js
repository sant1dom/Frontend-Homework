
//Favourites page
export function buttonsFavourites(){
    const iconBtns = document.querySelectorAll('.btn');
  iconBtns.forEach((btn) => {
    var par = btn;
    for (let j = 0; j < 5; j++) {
        par = par.parentNode;
    }
    if(btn.id == 'clock1'){
        const watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
        var el = btn.firstChild;
        
        if (watchlist.includes(par.id)) {
            el.classList.add('clk-full');
        } else {
            el.classList.add('clk');
        }
    }
    btn.addEventListener('click', function () {
        
        handleListsFavourites(par.id, btn);
    });
  });
}

function handleListsFavourites(id, btn){
    if(btn.id == 'clock1'){

        watchlistIcon(id, btn.firstChild);        
    }else if(btn.id == 'cuore1'){

        const favourites = JSON.parse(localStorage.getItem('favourites')) || [];
 
        if (favourites.includes(id)) {
               var element = document.getElementById(id);
               element.remove();

            const index = favourites.indexOf(id);
            if (index > -1) {
               favourites.splice(index, 1);
            }
        }         
        localStorage.setItem('favourites', JSON.stringify(favourites));
        console.log(`Element ${favourites.includes(id) ? 'removed from' : 'added to'} favourites: ${id}`);
    }
}

//Watchlist page
export function buttonsWatchlist(){
  const iconBtns = document.querySelectorAll('.btn');
  iconBtns.forEach((btn) => {
    var par = btn;
    for (let j = 0; j < 5; j++) {
        par = par.parentNode;
    }
    if(btn.id == 'cuore1'){
        const watchlist = JSON.parse(localStorage.getItem('favourites')) || [];
        var el = btn.firstChild;
        if (watchlist.includes(par.id)) {
            el.classList.add('heart-full');
        } else {
            el.classList.add('heart');
        }
    }
    btn.addEventListener('click', function () {
        handleListsWatchlist(par.id, btn);
    });
  });
}

function handleListsWatchlist(id, btn){
    if(btn.id == 'cuore1'){
        favouritesIcon(id, btn.firstChild);
    }else if(btn.id == 'clock1'){
        
        const watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
 
        if (watchlist.includes(id)) {
            var element = document.getElementById(id);
            element.remove();
            
            const index = watchlist.indexOf(id);
            if (index > -1) {
               watchlist.splice(index, 1);
            }
        }         
        
        localStorage.setItem('watchlist', JSON.stringify(watchlist));
        console.log(`Element ${watchlist.includes(id) ? 'removed from' : 'added to'} watchlist: ${id}`);
    }
}


//Index page and previous methods
export function favouritesIcon(id, el){
    const favourites = JSON.parse(localStorage.getItem('favourites')) || [];
        // var el = btn.firstChild;
        if (favourites.includes(id)) {
            el.classList.remove('heart-full');
            el.classList.add('heart');

            const index = favourites.indexOf(id);
            if (index > -1) {
                favourites.splice(index, 1);
            }
        } else {
            el.classList.remove('heart');
            el.classList.add('heart-full');
            favourites.push(id);
        }

        localStorage.setItem('favourites', JSON.stringify(favourites));
        console.log(`Film ${favourites.includes(id) ? 'added to' : 'removed from'} favourites: ${id}`);
}

export function watchlistIcon(id, el){
    const watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
        // var el = btn.firstChild;
        if (watchlist.includes(id)) {
            el.classList.remove('clk-full');
            el.classList.add('clk');

            const index = watchlist.indexOf(id);
            if (index > -1) {
                watchlist.splice(index, 1);
            }
        } else {
            el.classList.remove('clk');
            el.classList.add('clk-full');
            watchlist.push(id);
        }

        localStorage.setItem('watchlist', JSON.stringify(watchlist));
        console.log(`Film ${watchlist.includes(id) ? 'added to' : 'removed from'} watchlist: ${id}`);
}
