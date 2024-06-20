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
            // If the response status is not OK, throw an error
            throw new Error("Les identifiants sont mauvais");
        }
        return response.json();
    })
    .then(data => {
        // Handle the data from the response
        localStorage.setItem("token", data.token)
        window.location.href = "indexedit.html";
    })
    .catch(err => {
        // Handle errors both from fetch and the response
        document.querySelector("#error").innerHTML = err.message
    });
}

