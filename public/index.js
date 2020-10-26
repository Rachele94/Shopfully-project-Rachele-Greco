let container = document.getElementById('container');
let previousPage = document.getElementById('previousPage');
let nextPage = document.getElementById('nextPage');
let pagination = document.getElementById('pagination');

function codeAddress(page) {
  var Npage = page || 1; 
  container.innerHTML = '';

  const api = `http://localhost:8080/api?page=${page}&limit=100`;

  fetch(api)
    .then(response => {
      return response.json(); 
    })
    .then(response => {
      console.log(page)
      
      //pagination Next Page
      nextPage = (p) => {
        p++;
        return p
      }

      //pagination Previous Page
      previousPage = (p) => {
        p--;
        return p
      }

      // Set Pagination Menu
      
        if (response.pages == page) { 
          pagination.innerHTML = `<li class="page-item">
          <a id="previousPage" class="page-link" href="#" tabindex="-1" onclick="codeAddress(${previousPage(Npage)})">Previous</a>
      </li>
      <li class="page-item disabled">
          <a id= "nextPage" class="page-link" href="#" >Next</a>
      </li>`
        } else if( page == 1) {
          pagination.innerHTML = `<li class="page-item disabled">
          <a id="previousPage" class="page-link" href="#" tabindex="-1" >Previous</a>
      </li>
      <li class="page-item">
          <a id= "nextPage" class="page-link" href="#" onclick="codeAddress(${nextPage(Npage)})" >Next</a>
      </li>`
        } else {

          pagination.innerHTML = `<li class="page-item">
          <a id="previousPage" class="page-link" href="#" tabindex="-1" onclick="codeAddress(${previousPage(Npage)})">Previous</a>
      </li>
      <li class="page-item">
          <a id= "nextPage" class="page-link" href="#" onclick="codeAddress(${nextPage(Npage)})">Next</a>
      </li>`
        }
      

      // Set DOM elements from api
      for (i = 0; i <= response.results.length; i++) {
        if (response.results[i]) {
          container.innerHTML += `
        
               <div class="contain">
                <img src="./image/placeholderimage.jpg" class="imagestan" alt="" >
               <div>
                  <h4 class='retailerName'>${response.results[i].retailer} </h4>
                  <p class='flyerTitle'>${response.results[i].title} </p>
                  <p class= 'flyerDate'> ${response.results[i].start_date} - ${response.results[i].end_date} </p>
                  <input id= "inputIconN${response.results[i].id}" value="${response.results[i].id}" class="icon" type="image" src="./image/heart-unclicked.svg" onclick="changeHeart('${response.results[i].id}', '${response.results[i].title}', '${response.results[i].retailer}', 'inputIconN${response.results[i].id}')" alt="heart"/>
                </div>
              
            </div>`
        };
      }
      heartsControl()
    })

};

window.onload = () => {
  if (localStorage.Favorites == undefined) {
    localStorage.setItem("Favorites", "[]");
  }
  codeAddress(1);

}



// Set Favorites in he localStorage
addFav = (id, title, retailer) => {

  let string_json = localStorage.getItem("Favorites")

  let obj_json = JSON.parse(string_json);
  obj_json.push(
    {
      id: id,
      title: title,
      retailer: retailer
    }
  );

  let new_json_string = JSON.stringify(obj_json);
  localStorage.setItem("Favorites", new_json_string);

};

// remove data from localStorage
RemoveFav = (id) => {
  let string_json = localStorage.getItem("Favorites")

  let obj_json = JSON.parse(string_json);

  let posId
  for (let i = 0; i < obj_json.length; i++) {
    if (obj_json[i].id == id) {
      posId = i;
      break
    }
  }
  obj_json.splice(posId, 1)
  localStorage.setItem("Favorites", JSON.stringify(obj_json));

}

// Change Favorites'heart
function changeHeart(id, title, retailer, inputId) {
  let inputIcon = document.getElementById(inputId);


  if (inputIcon.src == `http://localhost:8080/image/heart-unclicked.svg`) {
    addFav(id, title, retailer);
    inputIcon.src = `http://localhost:8080/image/heart-clicked.svg`;
  } else {
    RemoveFav(id);
    inputIcon.src = `http://localhost:8080/image/heart-unclicked.svg`;
  }
}

// Set a dinamic heart
heartsControl = () => {
  let heartsList = document.getElementsByClassName('icon')
  let string_json = localStorage.getItem("Favorites")

  let obj_json = JSON.parse(string_json); 

  for (let i = 0; i < heartsList.length; i++) {
    for (let e = 0; e < obj_json.length; e++) {
      if (heartsList[i].value == obj_json[e].id) {
        heartsList[i].src = 'http://localhost:8080/image/heart-clicked.svg'
        break
      }
    }
  }
};

// Set Favorites dropdown menu
document.getElementById("openFavorite").onclick = function() {
  //READ localstorage
  let string_json = localStorage.getItem("Favorites")
  //Set it as Obj with data inside

  let obj_json = JSON.parse(string_json);

  document.getElementById("favorite").innerHTML = ``;
  
  obj_json.forEach(flyer => {
    document.getElementById("favorite").innerHTML+=
     `<li class= "dropdown-item liElement">${flyer.retailer}: ${flyer.title} </li>`;
  });
}
