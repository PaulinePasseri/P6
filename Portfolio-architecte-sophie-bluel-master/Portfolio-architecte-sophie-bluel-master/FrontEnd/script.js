let gallery = document.querySelector(".gallery")
let works = []

// Récupération de l'API
fetch("http://localhost:5678/api/works").then(response => {
    response.json().then(data => {
        works = data
        generateGallery(works)
    })
})

// Galerie générée 
function generateGallery(images) {
    gallery.innerHTML = ""
    images.forEach(image => {
        gallery.innerHTML += 
        `<figure>
            <img src="${image.imageUrl}" alt="galerie"><br>
            <figcaption>${image.title}</figcaption>
        </figure>`
    })
}


// Gestion des filtres 
const btnTous = document.getElementById("btn-tous")
btnTous.addEventListener("click", function() {
    const galerieTous = works
    generateGallery(galerieTous)
    btnActive(btnTous)
})

const btnObjets = document.getElementById("btn-objets")

btnObjets.addEventListener("click", function () {
    const galerieObjets = works.filter(function(item) {
        return item.category.name === "Objets"
        })
        generateGallery(galerieObjets)
        btnActive(btnObjets)
})

const btnAppartements = document.getElementById("btn-appartements")

btnAppartements.addEventListener("click", function () {
    const galerieAppartements = works.filter(function(item) {
        return item.category.name === "Appartements"
        })
        generateGallery(galerieAppartements)
        btnActive(btnAppartements)
})

const btnHotels = document.getElementById("btn-hotels")

btnHotels.addEventListener("click", function () {
    const galerieHotels = works.filter(function(item) {
        return item.category.name === "Hotels & restaurants"
        })
        generateGallery(galerieHotels)
        btnActive(btnHotels)
})

function btnActive(e) {
    document.querySelector(".filters__btn--clicked").classList.remove("filters__btn--clicked")    
    e.classList.add("filters__btn--clicked")
}

// Gestion de la modale
let modal = null
const focusableSelector = "button, a, input, textarea"
let focusables = []

// Ouverture de la modale
const openModal = function(e) {
    e.preventDefault()
    modal = document.querySelector(e.target.getAttribute("href"))
    focusables = Array.from(modal.querySelectorAll(focusableSelector))
    modal.style.display = null
    modal.removeAttribute("aria-hidden")
    modal.setAttribute("aria-modal", "true")
    modal.addEventListener("click", closeModal)
    modal.querySelector(".js-modal-close").addEventListener("click", closeModal)
    modal.querySelector(".js-modal-stop").addEventListener("click", stopPropagation)
}

const a = document.querySelector(".js-modal")
a.addEventListener("click", openModal)

// Fermeture de la modale
const closeModal = function(e) {
    if (modal === null) return
    e.preventDefault()
    window.setTimeout(function() {
        modal.style.display = "none"
        modal = null
    }, 500)
    modal.setAttribute("aria-hidden", "true")
    modal.removeAttribute("aria-modal")
    modal.removeEventListener("click", closeModal)
    modal.querySelector(".js-modal-close").removeEventListener("click", closeModal)
    modal.querySelector(".js-modal-stop").removeEventListener("click", stopPropagation)
}

// Permet de bloquer la propagation de l'événement e 
const stopPropagation = function(e) {
    e.stopPropagation()
}


// Parcours de la modale au clavier
const focusInModal = function(e) {
    e.preventDefault()
    let index = focusables.findIndex(f => f === modal.querySelector(":focus"))
    index++
    if (index >= focusables.length) {
        index = 0
    }
    focusables[index].focus()
}

window.addEventListener("keydown", function(e) {
    if (e.key === "Escape" || e.key === "Esc") {
        closeModal(e)
    }
    if (e.key === "Tab" && modal !== null) {
        focusInModal(e)
    }
})