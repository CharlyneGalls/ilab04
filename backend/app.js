window.addEventListener('load', function() {
    FastClick.attach(document.body);
}, false);

bouncefix.add('page');

var data;

function loadJSON() {
  request = new XMLHttpRequest();
  request.open('GET', 'js/data.json', true);

  request.onload = function() {
    if (request.status >= 200 && request.status < 400){
      data = JSON.parse( request.responseText );
      init();
    }
  }
  request.send()
}

loadJSON();

function slidePageFrom(page, from) {
  page.className = "page view " + from;
  page.className ="page view center";
  currentPage.className = "page view " + (from === "left" ? "right" : "left");
  currentPage = page;
}

function hasClass(elem, className) {
  return new RegExp(' ' + className + ' ').test(' ' + elem.className + ' ');
}

function addClass(elem, className) {
  if (!hasClass(elem, className)) {
      elem.className += ' ' + className;
  }
}

function removeClass(elem, className) {
  var newClass = ' ' + elem.className.replace( /[\t\r\n]/g, ' ') + ' ';
  if (hasClass(elem, className)) {
    while (newClass.indexOf(' ' + className + ' ') >= 0 ) {
      newClass = newClass.replace(' ' + className + ' ', ' ');
    }
    elem.className = newClass.replace(/^\s+|\s+$/g, '');
  }
}

var home = document.querySelector("#home"),
    liste = document.querySelector("#liste"),
    recipe = document.querySelector("#recipe"),
    proposition = document.querySelector("#proposition"),
    envoyer = document.querySelector("#envoyer"),
    currentPage = home,
    idRandom = ['the_lavande', 'the_camomille', 'the_gingembre', 'the_menthe', 'the_framboise', 'the_amande', 'the_rose', 'the_coco', 'the_cacao', 'the_citron', 'the_jasmin', 'the_pamplemousse', 'the_verveine', 'the_kiwi', 'the_houblon'],
    homeLi = home.querySelectorAll(".container li"),
    listeLi = liste.querySelectorAll(".container li"),
    listeImg = liste.querySelectorAll(".container li img"),
    listeFigcaption = liste.querySelectorAll(".container li figcaption"),
    proposerInput = document.querySelectorAll("#proposition .propose input"),
    proposerIcone = document.querySelectorAll("#proposition .propose span"),
    ulRecipe = recipe.querySelectorAll(".recipes ul ul"),
    quantiteRecipe = recipe.querySelectorAll(".recipes .quantite"),
    ingredientRecipe = recipe.querySelectorAll(".recipes .ingredient"),
    spanRecipe = recipe.querySelectorAll(".recipes span");


function init() {
  
  document.querySelector("#liste header li").addEventListener('click',function(e) { slidePageFrom(home, 'left'); });
  document.querySelector("#envoyer header li").addEventListener('click',function(e) { slidePageFrom(proposition, 'left'); });
  document.querySelector("#proposition header li").addEventListener('click',function(e) { slidePageFrom(home, 'left'); });
  document.querySelector("#recipe header li").addEventListener('click',function(e) {
    if((this.dataset.slide) == "vers-liste") {
      slidePageFrom(liste, 'left');
    } else if ((this.dataset.slide) == "vers-home"){
      slidePageFrom(home, 'left');
    }
      
  });
  document.querySelector("#proposition button").addEventListener('click',function(e) { slidePageFrom(envoyer, 'right'); });

    
  for (var i = 0, c = homeLi.length; i < c; i++) {
    homeLi[i].addEventListener('click',function(e) {
        var element = this.className;
        var recettes = data.liste[element];

          if (element == "proposer") {
              for (var j = 0, d = proposerInput.length; j < d; j++) {
                proposerInput[j].addEventListener('focus',function(e) {
                  this.parentNode.parentNode.getElementsByTagName("span")[0].className = "icon icon-moins";
                });
                proposerInput[j].addEventListener('blur',function(e) {
                  if (this.value == "") {
                    this.parentNode.parentNode.getElementsByTagName("span")[0].className = "icon icon-plus";
                  }
                });
              }
            
              for (var j = 0, d = proposerIcone.length; j < d; j++) {
                proposerIcone[j].addEventListener('click',function(e) {
                  if ((this.parentNode.parentNode.getElementsByTagName("input")[0].value) != "") {
                    this.parentNode.parentNode.getElementsByTagName("input")[0].value = "";
                  }
                });
              }
            var proposerMenu = document.querySelectorAll("#proposition .menu li");
              for (var j = 0, d = proposerMenu.length; j < d; j++) {
                proposerMenu[j].addEventListener('click',function(e) {
                  for (var k = 0, l = proposerMenu.length; k < l; k++) {
                    proposerMenu[k].className = "";
                  }
                  this.className = "active";
                });
            }
            slidePageFrom(proposition, 'right');
          } 

          else if (element == "aleatoire"){
            this.setAttribute("data-id", idRandom[Math.floor(Math.random() * idRandom.length)]);
            var element = this.dataset.id;
            var recette = data.recette[element];

            recipe.querySelector("header .header-title").innerHTML = recette.titre;
            recipe.querySelector(".container img").setAttribute("src", recette.image);
            recipe.querySelector(".container p").innerHTML = recette.vertue;
            recipe.querySelector(".container p").innerHTML = recette.vertue;
            
            for (var j = 0, d = quantiteRecipe.length; j < d; j++) { quantiteRecipe[j].innerHTML = recette.quantites["quantite"+(j+1)]; }
            for (var j = 0, d = ingredientRecipe.length; j < d; j++) { ingredientRecipe[j].innerHTML = recette.ingredients["ingredient"+(j+1)]; }
            for (var j = 0, d = spanRecipe.length; j < d; j++) { addClass(spanRecipe[j], recette.icones["icone"+(j+1)]); }
            
            document.querySelector("#recipe header li").setAttribute("data-slide", "vers-home");
            slidePageFrom(recipe, 'right');
          } 

          else {
            for (var j = 0, d = listeImg.length; j < d; j++) {
              listeLi[j].dataset.id = recettes.id["id"+(j+1)];
              listeImg[j].setAttribute('src', recettes.source["image"+(j+1)]);
              listeImg[j].setAttribute('alt', recettes.source["image"+(j+1)]);
              listeFigcaption[j].innerHTML = recettes.texte["texte"+(j+1)];
              listeImg[j].id = recettes.id["id"+(j+1)];
              listeLi[j].className = element;
            }
            slidePageFrom(liste, 'right');
            document.querySelector("#recipe header li").setAttribute("data-slide", "vers-liste");
          }
      });
  }

  for (var i = 0, c = listeLi.length; i < c; i++) {
    listeLi[i].addEventListener('click',function(e) {
      var element = this.dataset.id;
      var recette = data.recette[element];

      recipe.querySelector("header .header-title").innerHTML = recette.titre;
      recipe.querySelector(".container img").setAttribute("src", recette.image);
      recipe.querySelector(".container p").innerHTML = recette.vertue;
      recipe.querySelector(".container p").innerHTML = recette.vertue;
      
      for (var j = 0, d = quantiteRecipe.length; j < d; j++) { quantiteRecipe[j].innerHTML = recette.quantites["quantite"+(j+1)]; }
      for (var j = 0, d = ingredientRecipe.length; j < d; j++) { ingredientRecipe[j].innerHTML = recette.ingredients["ingredient"+(j+1)]; }
      for (var j = 0, d = spanRecipe.length; j < d; j++) { spanRecipe[j].className = 'icon ' + recette.icones["icone"+(j+1)]; }
      
      slidePageFrom(recipe, 'right');
    });
  }
}





