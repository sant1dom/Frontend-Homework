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
		this[this.#controller]();
	}

	async create(){
		console.log("Hai chiamato la funzione: Create")
	}

	async update(){
		console.log("Hai chiamato la funzione: Update")
	}

	async read(){
		console.log("Hai chiamato la funzione: Read")
	}

	async delete(){
		console.log("Hai chiamato la funzione: Delete")
	}

	async search(){
		console.log("Hai chiamato la funzione: Search")
		let movies = await this.getJson("movies/search")
		for (let movie of movies) {
			prova.innerHTML += `<div><h3>${movie.title}</h3></div>`
		}
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
}

console.log("Starting");
let manager = new Manager();
manager.readCurrent()

