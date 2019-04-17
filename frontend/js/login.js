let is_pressed = false;
document.getElementById("sign-in").onclick = function () {
    let log_message = document.getElementById("login").value;
    let pw = document.getElementById("password").value;
    let log_message_text = "Ok", pw_message_text = "Ok";

    if (!log_message.length) {
        log_message_text = "Fill in the field";
    }
    else{
        log_message_text = "Ok";
    }
    if (!pw.length){
        pw_message_text = "Fill in the field";
    }
    else{
        pw_message_text = "Ok";
    }

    if (log_message_text === "Ok" && pw_message_text === "Ok"){
        document.getElementById("login-message").setAttribute("hidden", "");
        document.getElementById("pw-message").setAttribute("hidden", "");

        let xhr_login = new XMLHttpRequest();

        xhr_login.open("POST", "Login");
        xhr_login.send(JSON.stringify({
            login: log_message,
            password: pw
        }));

        xhr_login.onreadystatechange = function () {
            if (xhr_login.status !== 200){
                console.log(`status ;( ${xhr_login.status}  ${xhr_login.statusText} ${xhr_login} end`)
            }
            else if (xhr_login.readyState === XMLHttpRequest.DONE){
                console.log(xhr_login.responseText);
                let answer = JSON.parse(xhr_login.responseText);
                if (!answer["errors"]){
                    // window.localStorage.setItem("user-data", answer["user"]);
                    window.sessionStorage.setItem("user-data", answer["user"]);
                    window.location.href = "main";
                }
                else if (answer["error"] === "error"){
                    let message = document.getElementById("main-message");
                    message.removeAttribute("hidden");
                    message.innerText = "Wrong login or password";
                }
            }
        };
    }
    else{
        let log_message = document.getElementById("login-message");
        let pw_message = document.getElementById("pw-message");

        log_message.innerHTML = log_message_text;
        pw_message.innerHTML = pw_message_text;

        if (log_message_text !== "Ok"){
            log_message.removeAttribute("hidden")
        }
        else{
            log_message.setAttribute("hidden", "");
            pw_message.removeAttribute("hidden");
        }
    }
};

document.addEventListener("keydown", function (event) {
    if (event.which === 13) {
        is_pressed = true;
        document.getElementById("sign-in").click()
    }
});
document.addEventListener("keyup", function (event) {
    if (event.which === 13){
        is_pressed = false;
    }
});