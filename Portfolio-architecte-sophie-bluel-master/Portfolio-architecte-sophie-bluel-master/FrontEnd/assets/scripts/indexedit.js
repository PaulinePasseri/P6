window.addEventListener("DOMContentLoaded", () => {
    if (!localStorage.getItem("token")) {
        window.location.href = "../login.html";
    }
})

// Gestion de la modale
let modal = null
const focusableSelector = "button, a, input, textarea"
let focusables = []

// Ouverture de la modale
const openModal = function(e) {
    modal = document.querySelector(e.target.getAttribute("href"))
    focusables = Array.from(modal.querySelectorAll(focusableSelector))
    modal.style.display = null
    modal.removeAttribute("aria-hidden")
    modal.setAttribute("aria-modal", "true")
    modal.addEventListener("click", closeModal)
    modal.querySelector(".js-modal-close").addEventListener("click", closeModal)
    modal.querySelector(".js-modal-stop").addEventListener("click", stopPropagation)

    fetch("http://localhost:5678/api/works").then(response => {
        response.json().then(data => {
            document.querySelector("#galleryEdit").innerHTML = ""

            data.forEach(work => {
                let container = document.createElement("div")
                container.classList.add("image-container")

                let images = document.createElement("img")
                images.src = work.imageUrl
                images.setAttribute("id", work.id)
                container.appendChild(images)

                // Suppression d'un travail 
                let icons = document.createElement("span")
                icons.innerHTML = `<i class="fa-solid fa-trash-can"></i>`
                container.appendChild(icons)
                icons.addEventListener("click", () => {
                    fetch(`http://localhost:5678/api/works/${work.id}`, {
                        method: 'DELETE',
                        headers: {
                            "Authorization": "Bearer " + localStorage.getItem("token")
                        },
                    }).then(response => {
                        if (response.ok) {
                            container.remove()
                            let mainImage = document.querySelector(`.gallery img[id='${work.id}']`).closest("figure")
                            if (mainImage) {
                                mainImage.remove()
                            }
                        } else {
                            console.error('Erreur lors de la suppression de l\'image')
                        }
                    }).catch(error => {
                        console.error('Erreur lors de la requête de suppression', error)
                    })
                })

                document.querySelector("#galleryEdit").appendChild(container)
            })
        })
    })
}

const firstModal = document.querySelector(".js-modal")
firstModal.addEventListener("click", openModal)

// Poster un nouveau travail
function postWork() {
    // Vérification que tous les champs sont remplis
    const title = document.querySelector('#image-title').value.trim();
    const image = document.querySelector('#image-upload').files[0];
    const category = document.querySelector('#image-category').value.trim();
    const errorElement = document.querySelector('#error');
    errorElement.innerHTML = '';
    if (!title || !image || !category) {
        errorElement.innerHTML = 'Tous les champs doivent être remplis.';
        return;
    } 
    // Récupération des données du formulaire
    const formData = new FormData()
    formData.append("title", document.querySelector('#image-title').value);
    formData.append("image", document.querySelector("#image-upload").files[0]);
    formData.append("category", document.querySelector('#image-category').value);
      

        fetch("http://localhost:5678/api/works", {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            },
            body: formData
        }).then(response => {
            if (!response.ok) {
                throw new Error("Erreur dans la réponse");
            }
             response.json()
             .then(data => {
                getWorks();
                closeModal();
            })
        })
        .catch(err => {
            console.log(err);
            document.querySelector("#error").innerHTML = err.message;
        });
 
}

// Mettre l'image sélectionnée en preview
document.querySelector("#image-upload").addEventListener("change", function() {
    const imageFile = this.files[0];
    if (imageFile) {
        const reader = new FileReader();
        reader.onload = function(event) {
            const imagePreview = document.querySelector("#image-preview");
            imagePreview.src = event.target.result;
            imagePreview.style.display = "block";

            // Masquer le texte, le label et l'icône
            document.querySelector("#image-icon").style.display = "none";
            document.querySelector("#image-label-container").style.display = "none";
            document.querySelector("#image-requirements").style.display = "none";
        };
        reader.readAsDataURL(imageFile);
    }
});

// Changement de la couleur du bouton valider
document.querySelector('#image-title').addEventListener('input', submitForm);
document.querySelector('#image-upload').addEventListener('change', submitForm);
document.querySelector('#image-category').addEventListener('change', submitForm);
function submitForm() {
    const title = document.querySelector('#image-title').value.trim();
    const image = document.querySelector('#image-upload').files[0];
    const category = document.querySelector('#image-category').value.trim();
    const submitButton = document.querySelector('#secondModal-submit');
    
    if (title && image && category) {
        submitButton.style.backgroundColor = '#1D6154';
    } else {
        submitButton.style.backgroundColor = ''; 
    }
}

document.addEventListener('DOMContentLoaded', submitForm);

// Fermeture de la modale
const closeModal = function(e) {
    if (modal === null) return
    window.setTimeout(function() {
        modal.style.display = "none"
        modal = null
    }, 200)
    modal.setAttribute("aria-hidden", "true")
    modal.removeAttribute("aria-modal")
    modal.removeEventListener("click", closeModal)
    modal.querySelector(".js-modal-close").removeEventListener("click", closeModal)
    modal.querySelector(".js-modal-stop").removeEventListener("click", stopPropagation)
    setTimeout(() => {
        document.querySelector("#galleryEdit").innerHTML = ""
    }, 200)
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

// Changement de fenêtre modale 
const secondModal = document.querySelector(".js-modal-add")
secondModal.addEventListener("click", (e) => {
    closeModal(e)
    setTimeout(() => {
        modal = document.querySelector("#modalAdd")
        openModal({target: {getAttribute: () => "#modalAdd"}})
    }, 200)
})

const previousModal = document.querySelector(".js-modal-previous")
previousModal.addEventListener("click", (e) => {
    closeModal(e)
    setTimeout(() => {
        modal = document.querySelector("#modal")
        openModal({target: {getAttribute: () => "#modal"}})
    }, 200)
})