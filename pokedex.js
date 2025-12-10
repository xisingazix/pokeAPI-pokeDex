const apiKey = API_KEY ;
const listPoke = document.querySelector("#listPoke");
const paginationPoke = document.querySelector("#pagination-poke");


function addPokemon(results) {
    const pokeSection = document.createElement("div");
    pokeSection.className = "pokeSection col-sm-4";
    listPoke.append(pokeSection);

    const pokeCard = document.createElement("div");
    pokeCard.className = "pokeCard card mb-4";
    pokeSection.append(pokeCard);

    const pokeImg = document.createElement("img")
    pokeImg.className = "pokeImg card-img-top img-fluid object-fit-fill";
    pokeImg.style = ""
    pokeImg.alt = "No image record for this pokemon"
    pokeImg.src = `https://img.pokemondb.net/artwork/${results.name}.jpg`
    pokeCard.append(pokeImg);

    const pokeCardBody= document.createElement("div");
    pokeCardBody.className = "pokeCardBody card-body";
    pokeCard.append(pokeCardBody);

    const pokeCardTitle = document.createElement("h3");
    pokeCardTitle.className = "card-title d-flex justify-content-center text-capitalize";
    pokeCardTitle.innerText = results.name;
    pokeCardBody.append(pokeCardTitle);
}

async function displayPagination(pageNum = 1, totalPages = 1) {
    paginationPoke.innerHTML = "";

    for (let page = 1; page <= totalPages; page++) {
        const pageBtn = document.createElement("a");
        pageBtn.className = `btn mx-1 my-1 ${page === pageNum ? "btn-primary" : "btn-outline-primary"
            }`;
        pageBtn.addEventListener("click", (event) => {
            event.preventDefault();
            fetchPokemonList(page);  // need replacement for page
        });
        pageBtn.textContent = page;
        paginationPoke.append(pageBtn);
    }
}

async function fetchPokemonList(pageNum = 1) {
    try {
        const spinnerDiv = document.createElement("div");
        spinnerDiv.className = "d-block spinner-border mx-auto my-4";
        spinnerDiv.setAttribute("role", "status");
        listPoke.appendChild(spinnerDiv);

        const url =
            pageNum === 1
                ? 'https://pokeapi.co/api/v2/pokemon?'
                : `https://pokeapi.co/api/v2/pokemon?offset=${(pageNum - 1) * 20}&limit=20`;

        const response = await fetch(url, {
            headers: { "x-api-key": apiKey },
        });
        const resp = await response.json();
        console.log(resp);

        if (!resp.results) throw new Error("There was an Error.");

        const allPoke = resp.results;
        const page = pageNum;   // ned a replacement for page 
        const totalPages = Math.ceil(resp.count / 20);

        displayPagination(page, totalPages)

        listPoke.innerHTML = "";

        allPoke.forEach((pokemon) => {
            addPokemon(pokemon);
        });

    } catch (error) {                      //  handle errors
        const errHeader = document.createElement("div");
        errHeader.className = "d-flex justify-content-center text-danger py-2";
        errHeader.textContent = error.message;
        listPoke.append(errHeader);

    }
}

document.addEventListener("DOMContentLoaded", () => {
    const loadpoke = window.localStorage.getItem("listpoke");

    return fetchPokemonList();
});





