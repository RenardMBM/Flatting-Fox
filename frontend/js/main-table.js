let xhr = new XMLHttpRequest();
xhr.open("POST", "Leaders");
xhr.send();

xhr.onreadystatechange = function () {
    if (xhr.status !== 200){
        console.log(`status ;( ${xhr.status}  ${xhr.statusText} ${xhr} end`)
    }
    else if (xhr.readyState === XMLHttpRequest.DONE){
        let answer = JSON.parse(xhr.responseText);
        if (!answer["errors"]){
            console.log(answer["leaders"]);
            let leaders = answer["leaders"];
            let table = document.getElementById("leader-table");
            for (let _ = 0; _ < leaders.length; _++){
                let leader = leaders[_];
                let tr = document.createElement("tr");
                let td1 = document.createElement("td");
                td1.setAttribute("valign", "top");
                td1.setAttribute("align", "center");
                td1.innerText = leader[0];
                let td2 = document.createElement("td");
                td2.innerText = leader[1];
                td2.setAttribute("valign", "top");
                td2.setAttribute("align", "center");
                tr.appendChild(td1);
                tr.appendChild(td2);
                table.appendChild(tr)
            }
        }
    }
};