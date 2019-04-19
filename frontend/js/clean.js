document.getElementById("clean").onclick = function () {
    let usr_id =  window.sessionStorage.getItem("user-data").split(",")[0]
    let clean_xml = new XMLHttpRequest();
    clean_xml.open("POST", "Clean");
    clean_xml.send(JSON.stringify({
        "user-id": usr_id
    }));
    clean_xml.onreadystatechange = function () {
        if (clean_xml.status !== 200){

        }
        else if (clean_xml.readyState === XMLHttpRequest.DONE){
            let answer = JSON.parse(clean_xml.responseText);

            if (answer === "success"){
                window.location.reload();
            }
        }
    }
};
