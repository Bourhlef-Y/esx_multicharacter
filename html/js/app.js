// Masquer immédiatement au chargement (évite l’affichage au redémarrage ressource)
(function () {
  if (document.body) document.body.style.display = "none";
  else {
    document.addEventListener("DOMContentLoaded", function () {
      document.body.style.display = "none";
    });
  }
})();

(() => {
  Kashacter = {};

  Kashacter.ShowUI = function (data) {
    $("body").fadeIn();

    $("[data-charid=1]")
      .html(
        '<div class="character-info">' +
          '<p id="character-info-name" class="character-info-name">' +
          data.firstname +
          " " +
          data.lastname +
          "</p>" +
          '<p id="character-info-dateofbirth" class="character-info-dateofbirth">' +
          data.dateofbirth +
          "</p>" +
          '<p id="info-text" class="character-info-gender">' +
          data.sex +
          "</p>" +
          '<p id="info-text" class="character-info-job">' +
          (data.job || "") +
          "</p>" +
          "</div>"
      )
      .attr("data-ischar", "true");
  };

  Kashacter.CloseUI = function () {
    $("body").fadeOut();
    $("[data-charid=1]").html(
      '<h3 class="character-fullname"></h3><div class="character-info"><p class="character-info-new"></p></div>'
    );
  };

  window.onload = function () {
    document.body.style.display = "none";
    window.addEventListener("message", function (event) {
      switch (event.data.action) {
        case "openui":
          Kashacter.ShowUI(event.data.character);
          break;
        case "closeui":
          Kashacter.CloseUI();
          break;
      }

      let data = event.data;
      if (data.type == "resetdata") {
        $("#option").remove();
        $("#option").remove();
        $("#option").remove();
        $("#option").remove();
        $("#option").remove();
      }
      if (data.type == "createcharacters") {
        let ui = `
        <button id="option" onclick="selectoption(${data.value})" >
            <p id="optionname"><span class="material-symbols-outlined">person</span>${data.label}</p>
            <p id="playerjob">${data.job}</p>
        </button>`;
        document.getElementById("characters").insertAdjacentHTML("beforeend", ui);
        ui = null;
      }
      if (data.type == "_createcharacters") {
        let ui = `
        <button id="option" onclick="selectoption(${data.value})" >
            <p id="optionname"><span class="material-symbols-outlined">person</span>${data.label}</p>
        </button>`;
        document.getElementById("_characters").insertAdjacentHTML("beforeend", ui);
        ui = null;
      }
    });
  };
})();

function selectoption(value) {
  $.post(
    `https://${GetParentResourceName()}/previewcharacter`,
    JSON.stringify(value)
  );

  const element = document.getElementById("select");
  const element1 = document.getElementById("delete");

  if (element) element.remove();
  if (element1) element1.remove();

  let data = value;
  let ui = `
  <button id="select" class="multichar-btn multichar-btn-play" title="Jouer" onclick="selectcharacter(${data})"><span class="material-symbols-outlined">play_arrow</span></button>
  <button id="delete" class="multichar-btn multichar-btn-delete" title="Supprimer" onclick="deletecharacter(${data})"><span class="material-symbols-outlined">delete</span></button>
  `;
  document.getElementById("select-button").insertAdjacentHTML("beforeend", ui);
  $("#select-button").fadeIn();
  ui = null;
}

function deletecharacter(value) {
  $.post(
    `https://${GetParentResourceName()}/deletecharacter`,
    JSON.stringify(value)
  );
}

function selectcharacter(value) {
  $.post(
    `https://${GetParentResourceName()}/selectcharacter`,
    JSON.stringify(value)
  );
}
