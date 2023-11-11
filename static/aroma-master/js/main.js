search.addEventListener("click", toAdvancedSearch);

searchFormBar.addEventListener("submit", (e) => {
    e.preventDefault()
    toAdvancedSearch(e)
});

const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func(...args);
        }, delay);
    };
};

const debouncedFetch = debounce(async (value) => {
    try {
        const response = await fetch("/movies/search?title=" + value);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();

        searchResultsContainer.innerHTML = "";
        searchResultsContainer.style.maxWidth = searchFormBar.offsetWidth;
        // Append new search results
        data.forEach((result) => {
            const resultDiv = document.createElement("div");
            resultDiv.classList.add("overflow-auto", "shadow-sm", "d-inline-block");
            resultDiv.innerHTML = `<a href="/films/${result.id}"><img src="${result.imdb_image}" alt="" width="50" height="50"> ${result.title}</a>`;
            searchResultsContainer.innerHTML += resultDiv.outerHTML;
        });

    } catch (error) {
        console.log(error);
    }
}, 500);

searchInput.addEventListener("input", async (e) => {
    if (searchInput.value !== "") {
        debouncedFetch(searchInput.value);
    } else {
        searchResultsContainer.innerHTML = "";
    }
});

function toAdvancedSearch(e) {
    e.preventDefault()
    console.log(searchInput.value)
    location.href = "/search?title=" + searchInput.value
}

$(function () {
    "use strict";

    //------- Parallax -------//
    skrollr.init({
        forceHeight: false
    });

    //------- Active Nice Select --------//
    $('select').niceSelect();

    //------- hero carousel -------//
    $(".hero-carousel").owlCarousel({
        items: 3,
        margin: 10,
        autoplay: false,
        autoplayTimeout: 5000,
        loop: true,
        nav: false,
        dots: false,
        responsive: {
            0: {
                items: 1
            },
            600: {
                items: 2
            },
            810: {
                items: 3
            }
        }
    });

    //------- Best Seller Carousel -------//
    if ($('.owl-carousel').length > 0) {
        $('#bestSellerCarousel').owlCarousel({
            loop: true,
            margin: 30,
            nav: true,
            navText: ["<i class='ti-arrow-left'></i>", "<i class='ti-arrow-right'></i>"],
            dots: false,
            responsive: {
                0: {
                    items: 1
                },
                600: {
                    items: 2
                },
                900: {
                    items: 3
                },
                1130: {
                    items: 4
                }
            }
        })
    }

    //------- single product area carousel -------//
    $(".s_Product_carousel").owlCarousel({
        items: 1,
        autoplay: false,
        autoplayTimeout: 5000,
        loop: true,
        nav: false,
        dots: false
    });

    //------- mailchimp --------//
    function mailChimp() {
        $('#mc_embed_signup').find('form').ajaxChimp();
    }

    mailChimp();

    //------- fixed navbar --------//
    $(window).scroll(function () {
        var sticky = $('.header_area'),
            scroll = $(window).scrollTop();

        if (scroll >= 100) sticky.addClass('fixed');
        else sticky.removeClass('fixed');
    });


});


