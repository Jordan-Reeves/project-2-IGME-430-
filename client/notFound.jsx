const init = async () => {
    const loginButton = document.getElementById('loginButton');
    const signupButton = document.getElementById('signupButton');

    loginButton.addEventListener('click', (e) => {
        e.preventDefault();
        window.location = "/";

        return false;
    });

    signupButton.addEventListener('click', (e) => {
        e.preventDefault();
        window.location = "/";
        return false;
    });

};

window.onload = init;