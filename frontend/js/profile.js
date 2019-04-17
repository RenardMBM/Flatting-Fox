let username = document.getElementById("username");
let user_data = window.sessionStorage.getItem("user-data").split(",");
// console.log(user_data);

let xhr_max = new XMLHttpRequest();
xhr_max.open("POST", "Max");
xhr_max.send(JSON.stringify({
    "user-id": user_data[0]
}));

xhr_max.onreadystatechange = function (){
    if (xhr_max.status !== 200){
        console.log(`status ;( ${xhr_max.status}  ${xhr_max.statusText} ${xhr_max} end`)
    }
    else if (xhr_max.readyState === XMLHttpRequest.DONE){
        let answer = JSON.parse(xhr_max.responseText);
        // console.log(answer["errors"]);
        if (!answer["errors"]){
            // console.log(answer["max"]);
            username.innerText = `${user_data[2]}\nMaximum points: ${answer["max"]}`
        }
    }
};

let xhr_story = new XMLHttpRequest();
xhr_story.open("POST", "Story");
xhr_story.send(JSON.stringify({
    "user-id": user_data[0]
}));

xhr_story.onreadystatechange = function () {
    if (xhr_story.status !== 200){
        console.log(`status ;( ${xhr_story.status}  ${xhr_story.statusText} ${xhr_story} end`)
    }
    else if (xhr_story.readyState === XMLHttpRequest.DONE){
        let answer = JSON.parse(xhr_story.responseText);
        if (!answer["errors"]){
            let games = answer["games"];
            let tabl = document.getElementById("story-table");
            for (let _ = 0; _ < games.length; _++){
                let game = games[_];
                let tr = document.createElement("tr");
                let td1 = document.createElement("td");
                td1.setAttribute("valign", "top");
                td1.setAttribute("align", "center");
                let date = new Date();
                date.setTime(game[0]);
                td1.innerText = `${date.getDay()}.${date.getMonth()}.${date.getFullYear()}`;
                let td2 = document.createElement("td");
                td2.innerText = game[1];
                td2.setAttribute("valign", "top");
                td2.setAttribute("align", "center");
                tr.appendChild(td1);
                tr.appendChild(td2);
                tabl.appendChild(tr)
            }
        }
    }
};