class Manager {
    //Prima del deploy, modificare il pathName in base alla configurazione del server
    #pathName = "http://localhost:8000/";

    //Prima del deploy, modificare il apiUrl in base alla configurazione del server API
    #apiUrl = "http://localhost:8000/"

    #validControllers = ["create", "update", "read", "delete", "search"]
    #defaultController = "search";

    #controller = null;
    #paramether = null;
    #query = null;
    #anchor = null;
    #id = null;

    async readCurrent() {
        let urlComponents = window.location.href.split(this.#pathName);
        console.log(urlComponents);

        if (urlComponents[1] != null) {
            let [request, queryString] = urlComponents[1].split("?")

            if (request != null) {
                [this.#controller, this.#paramether] = request.split("/")
            }

            if (queryString != null) {
                [queryString, this.#anchor] = queryString.split("#")
                this.#query = new URLSearchParams(queryString);
                this.#id = this.#query.get("id");
            }
        }

        if (!this.#validControllers.includes(this.#controller)) {
            console.log("Non c'è " + this.#controller)
            this.#controller = this.#defaultController;
        }

        if (isNaN(this.#paramether)) {
            this.#paramether = null;
        }

        console.log(`Controller: ${this.#controller}, Paramether: ${this.#paramether}, Query: ${this.#query}, Anchor: ${this.#anchor}`);
        this[this.#controller](this.#id);
    }

    updateUrl(page) {
        let url = "/" + page;
        window.history.replaceState({}, document.title, url);
    }

    goSearch(title = "", release_year = ""){
        this.updateUrl("advancedSearch?title=" + title + "&release_year=" + release_year)
        manager.search()
        return false;
    }

    async search() {
        console.log("Hai chiamato la funzione: Search")

        this.hideContainers();
        container_search.style.display = "block";

        //Svuoto se contiene precedente ricerca
        container_search_main.innerHTML = "";

        let url = "movies/advancedSearch?";
        if (this.#query != null) {
            for (let field of ["title", "release_year"]) {
                let value = this.#query.get(field);
                if (value != "") {
                    url += field + "=" + value + "&";
                    let input = document.getElementById("input_" + field);
                    input.value = value;
                }
            }
        }

        container_search_main.innerHTML = "";

        let movies = await this.getJson(url);
        for (let movie of movies) {
            container_search_main.innerHTML += `
                <a onclick="return manager.goRead(${movie.id})" href="/read?id=${movie.id}">${movie.title}</a>
                <br>
            `;
        }
    }

    goRead(id){
        this.updateUrl("read?id=" + id)
        manager.read(id)
        return false;
    }

    async read(id) {
        console.log("Hai chiamato la funzione: Read");

        this.hideContainers();
        container_read.style.display = "block";

        let movie = await this.getJson("movies/" + id);

        container_read_main.innerHTML = `
			ID: ${movie.id}
			<br>
			Titolo: ${movie.title}
			<br>
			Anno: ${movie.release_year}
			<br>
			Durata: ${movie.movie_length}
			<br>
			Genere: ${movie.genre}
			<br>
			Lingua: ${movie.language}
			<br>
			IMDB: <a href="${movie.imdb_url}" target="_blank">Vedi su IMDB</a>
			<br>
			<a onclick="return manager.goUpdate(${movie.id})" href="/update?id=${movie.id}">Modifica</a>
			<br>
			<a onclick="return manager.goDelete(${movie.id})" href="/delete?id=${movie.id}">Cancella</a>
		`;
    }

    goCreate(id){
        this.updateUrl("create")
        manager.create()
        return false;
    }

    async create() {
        console.log("Hai chiamato la funzione: Create");

        this.hideContainers();
        container_create.style.display = "block";
    }

    goUpdate(id){
        this.updateUrl("update?id=" + id)
        manager.update(id)
        return false;
    }

    async update(id) {
        console.log("Hai chiamato la funzione: Update");

        this.hideContainers();
        container_update.style.display = "block";

        let movie = await this.getJson("movies/" + id);
        container_update_main.innerHTML = `
			ID: ${movie.id}
			<br>
			Titolo: ${movie.title}
			<br>
			Anno: ${movie.release_year}
			<br>
			Durata: ${movie.movie_length}
			<br>
			Genere: ${movie.genre}
			<br>
			Lingua: ${movie.language}
			<br>
			IMDB: <a href="${movie.imdb_url}" target="_blank"></a>
			<br>
			<a onclick="alert('TODO')">Salve le modifiche</a>
			<br>
			<a onclick="return manager.goDelete(${movie.id})" href="/delete?id=${movie.id}">Cancella</a>
		`;
    }

    goDelete(id){
        this.updateUrl("delete?id=" + id)
        manager.delete()
        return false;
    }

    async delete(id) {
        console.log("Hai chiamato la funzione: Delete")

        this.hideContainers();
        container_delete.style.display = "block";

        let movie = await this.getJson("movies/" + id);
        container_delete_main.innerHTML = `
			ID: ${movie.id}
			<br>
			Titolo: ${movie.title}
			<br>
			Anno: ${movie.release_year}
			<br>
			Durata: ${movie.movie_length}
			<br>
			Genere: ${movie.genre}
			<br>
			Lingua: ${movie.language}
			<br>
			IMDB: <a href="${movie.imdb_url}" target="_blank"></a>
			<br>
			<a onclick="return manager.goUpdate(${movie.id})" onclick="return manager.goUpdate(${movie.id})" href="/update?id=${movie.id}">Modifica</a>
			<br>
			<a onclick="alert('TODO')">Conferma cancellazione</a>
		`;
    }


    async getJson(url) {
        let response = await fetch(this.#apiUrl + url)

        let json = await response.json()
            .then(json => {
                console.log(json);
                return json;
            })

        return json;
    };

    hideContainers(){
        const containers = document.querySelectorAll(".container");
        containers.forEach((container) => {
          container.style.display = "none";
        });
    }
}

console.log("Starting");
let manager = new Manager();
manager.readCurrent()

