let submit = document.querySelector("#btn-submit")

submit.addEventListener("click", () => {
    login()
})

function login() {
    let bodystr = {
        "email": document.querySelector("#email").value,
        "password": document.querySelector("#password").value,
    };

    fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(bodystr)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Erreur dans l’identifiant ou le mot de passe");
        }
        return response.json();
    })
    .then(data => {
        localStorage.setItem("token", data.token)
        window.location.href = "../indexedit.html";
    })
    .catch(err => {
        document.querySelector("#error").innerHTML = err.message
    });
}

