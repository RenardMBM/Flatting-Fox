let is_pressed = false;
document.getElementById("sign-up").onclick = function () {
    let log = document.getElementById("login").value;
    let name = document.getElementById("username").value;
    let pw1 = document.getElementById("password").value;
    let pw2 = document.getElementById("repeat-password").value;
    let reg_log = /[^0-9a-zA-Z_]/;
    let reg_pw = /[^0-9a-zA-z]/;
    let log_message_text = "Ok";
    let usr_message_text = "Ok";
    let pw_message_text = "Ok";
    let rep_pw_message_text = "Ok";

    if (!log.length){
        log_message_text = "Fill in the field";

    }else if (log.length < 6){
        log_message_text = "Login too short";
    }
    else if(log.length > 16){
        log_message_text = "Login too long";
    }
    else if (reg_log.test(log)){
        log_message_text = "Incorrect symbols";
    }
    else {
        log_message_text = "Ok";
    }

    if (!name.length){
        usr_message_text = "Fill in the field"
    }else if (name.length < 2){
        usr_message_text = "Username too short"
    }else if (name.length > 25){
        usr_message_text = "Username too long"
    }
    else if (reg_log.test(name)){
        usr_message_text = "Incorrect symbols"
    }
    else {
        usr_message_text = "Ok"
    }

    if (!pw1.length){
        pw_message_text = "Fill in the field"
    }
    else if (pw1.length < 6){
        pw_message_text = "Password too short"
    }
    else if (pw1.length > 16){
        pw_message_text = "Password too long"
    }
    if (!pw2.length){
        rep_pw_message_text = "Fill in the field"
    }
    else if (pw1 !== pw2){
        rep_pw_message_text = "Passwords do not match";
    }
    else if (reg_pw.test(pw1)){
        rep_pw_message_text = "Incorrect symbols"
    }
    else if (!/[0-9]/.test(pw1) || !/[a-zA-Z]/.test(pw1)){
        rep_pw_message_text = "Password too simple"
    }
    else{
        rep_pw_message_text = "Ok";
        pw_message_text = "Ok"
    }

    if (usr_message_text === "Ok" && log_message_text === "Ok" && rep_pw_message_text === "Ok"){
        document.getElementById("usr-message").setAttribute("hidden", "");
        document.getElementById("login-message").setAttribute("hidden", "");
        document.getElementById("pw-message").setAttribute("hidden", "");
        document.getElementById("rep-pw-message").setAttribute("hidden", "");


        let xhr = new XMLHttpRequest();

        xhr.open("POST", "Register");

        xhr.onreadystatechange = function () {
            if (xhr.status !== 200){
                alert("Sorry, registration failed.\nPlease try again.");
            }
            else if (xhr.readyState === XMLHttpRequest.DONE){
                console.log('answer');
                console.log(xhr.responseText);
                let answer = JSON.parse(xhr.responseText);
                if (answer === "success"){
                    window.location.href = "login";
                    // alert("Registration was successful\nNow sign in");
                }
                else if (answer === "Login Error"){
                    console.log(xhr.statusText);
                    log_message_text = "Such login already exists";
                    let log_message = document.getElementById("login-message");
                    log_message.removeAttribute("hidden");
                    log_message.innerText = log_message_text;
                }
            }
        };
        xhr.send(JSON.stringify({
            login: log,
            user_name: name,
            password: pw1
        }));
    }
    else {
        let usr_message = document.getElementById("usr-message");
        let log_message = document.getElementById("login-message");
        let pw_message = document.getElementById("pw-message");
        let rep_pw_message = document.getElementById("rep-pw-message");

        usr_message.innerText = usr_message_text;
        log_message.innerText = log_message_text;
        pw_message.innerText = pw_message_text;
        rep_pw_message.innerText = rep_pw_message_text;

        if (usr_message_text !== "Ok"){
            usr_message.removeAttribute("hidden")
        }
        else {
            usr_message.setAttribute("hidden", "");
            if (log_message_text !== "Ok"){
                log_message.removeAttribute("hidden")
            }
            else {
                log_message.setAttribute("hidden", "");
                if (pw_message_text !== "Ok"){
                    pw_message.removeAttribute("hidden")
                }
                else {
                    pw_message.setAttribute("hidden", "");
                    if (rep_pw_message_text !== "Ok"){
                        rep_pw_message.removeAttribute("hidden")
                    }
                    else {
                        rep_pw_message.setAttribute("hidden", "")
                    }
                }
            }
        }
    }
};
document.addEventListener("keydown", function (event) {
   if (event.which === 13) {
       is_pressed = true;
        document.getElementById("sign-up").click()
   }
});
document.addEventListener("keyup", function (event) {
    if (event.which === 13){
        is_pressed = false;
    }
});