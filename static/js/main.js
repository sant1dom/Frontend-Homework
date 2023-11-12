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