console.log("Подключен");
document.getElementById("exit").onclick = function () {
  let exit_xml = new XMLHttpRequest();
  console.log("e");
  exit_xml.open("POST", "Exit");
  exit_xml.send();
  exit_xml.onreadystatechange = function () {
      if (exit_xml.status !== 200){
          alert("error")
      }
      else if (exit_xml.readyState === XMLHttpRequest.DONE){
          let answer = JSON.parse(exit_xml.responseText);

          if (answer === "success"){
              window.sessionStorage.removeItem("user-data");
              window.location.href = "/main"
          }
          else {
              window.location.href = "/main";
          }
      }
  }
};
