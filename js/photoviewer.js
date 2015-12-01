"use strict";

var Create, create, window, Images, img, images, Update, update, Remove, remove, Give, give;

(function () {
  var bodyNode, mainDiv, amountImages, divider, grid, mainNode, imageContainer, imgSrc, mode = "default", currentImage, index, info, zoomNode;

/**
 * Create class containg all methods to create
 */
  Create = {
/**
 * The main function initializes the application.
 */
    main: function () {
      console.log("Creating main div");
      bodyNode = document.getElementsByTagName("body")[0];
      mainDiv = document.createElement("div");
      mainDiv.id = "main";
      bodyNode.appendChild(mainDiv);
      mode = "thumb";
    },
    /**
     * This function creates the grid depending on amountImages.
     */
    grid: function () {
      if (amountImages === undefined) {
        amountImages = 25;
      }
      if (amountImages > 16 && amountImages <= 25) {
        divider = 5;
      } else if (amountImages > 9 && amountImages <= 16) {
        divider = 4;
      } else if (amountImages > 4 && amountImages <= 9) {
        divider = 3;
      } else if (amountImages > 1 && amountImages <= 4) {
        divider = 2;
      } else if (amountImages <= 1) {
        divider = 1;
      }
      mainNode = document.getElementById("main");
      grid = document.createElement("div");
      grid.id = "grid";
      grid.className = "grid";
      grid.className += " grid--divide-" + divider;
      mainNode.appendChild(grid);

    },
/**
 * Add the eventlistener to the images.
 * @param {[type]} imageContainer 
 * @param {[type]} index          
 */
    addEventListenerToImage: function (imageContainer, index) {
      imageContainer.addEventListener('click', function () {
        //zoom
        console.log(mode);
        zoomNode = document.getElementById("zoom");
        if (mode === "thumb") {
          create.zoom(index);
        } else if (mode === "zoom") {
          zoomNode.remove();
          info.remove();
          create.grid();
          create.images();
          mode = "thumb";
        }

      });
    },
    /**
     * Add the context menu event to the image, inputs filename.
     * @param {[type]} imageContainer [description]
     * @param {[type]} name           [description]
     */
    addContextMenuToImage: function (imageContainer, name) {
      imageContainer.oncontextmenu = function () {
        remove.image(name);
        this.remove(); //remove current image
        update.grid();
        return false;
      };
    },
/**
 * Creates the grid view.
 * @return {[type]} [description]
 */
    images: function () {
      images = img.data;
      amountImages = images.length;
      var counter;
      console.log(amountImages);
      for (counter = 0; counter < amountImages; counter++) {
        currentImage = counter;
        //create images in thumb mode
        imageContainer = document.createElement("div");
        imageContainer.className = "grid_unit";

        index = counter;

        create.addContextMenuToImage(imageContainer, img.data[counter].name);
        create.addEventListenerToImage(imageContainer, counter);

        grid.appendChild(imageContainer);
        create.image(index);
      }

    },
    /**
     * Creates the image source
     * @param  {[type]} index [description]
     * @return {[type]}       [description]
     */
    image: function (index) {
      imgSrc = document.createElement("img");
      imgSrc.src = "./images/" + img.data[index].name;
      imgSrc.alt = "alt";
      imageContainer.appendChild(imgSrc);

    },
    /**
     * Creates the info for zoom mode
     * @param  {[type]} id [description]
     * @return {[type]}    [description]
     */
    info: function (id) {
      var title, photographer, name, titleText, photographerText, nameText;
      info = document.createElement("div");
      info.id = "info";
      mainDiv.appendChild(info);

      // title, photographer, name
      title = document.createElement("h4");
      photographer = document.createElement("p");
      name = document.createElement("p");

      titleText = document.createTextNode("Title: " + img.data[id].title);
      photographerText = document.createTextNode("Photographer: " + img.data[id].photographer);
      nameText = document.createTextNode("Filename: " + img.data[id].name);

      title.appendChild(titleText);
      photographer.appendChild(photographerText);
      name.appendChild(nameText);

      info.appendChild(title);
      info.appendChild(photographer);
      info.appendChild(name);


    },
    /**
     * Sets up the zoom view using the index if given
     * @param  {[type]} index [description]
     * @return {[type]}       [description]
     */
    zoom: function (index) {
      grid.remove();
      console.log(index);
      if (index === null) { // using spacebar so pick first image in array
        index = 0;
      }
      currentImage = index;
      imageContainer = document.createElement("div");
      imageContainer.id = "zoom";
      create.addEventListenerToImage(imageContainer, index);

      create.info(index);
      create.image(index);
      mainDiv.appendChild(imageContainer);

      mode = "zoom";
    }

  };
/**
 * Updates the grid and handles spacebar updates
 * @type {Object}
 */
  Update = {
    /**
     * Updates the grid depending on how many images we have
     * @return {[type]} [description]
     */
    grid: function () {
      if (amountImages > 16 && amountImages <= 25) {
        divider = 5;
      } else if (amountImages > 9 && amountImages <= 16) {
        divider = 4;
      } else if (amountImages > 4 && amountImages <= 9) {
        divider = 3;
      } else if (amountImages > 1 && amountImages <= 4) {
        divider = 2;
      } else if (amountImages <= 1) {
        divider = 1;
      }
      grid.className = "";
      grid.className = "grid";
      grid.className += " grid--divide-" + divider;

    },
/**
 * Handles the space bar actions depending on mode
 * @return {[type]} [description]
 */
    handleSpaceBar: function () {
      console.log("array length" + img.data.length);
      if (mode === "thumb") {
        create.zoom(null); //hierdoor komt rare bug denk ik
        mode = "zoom";
      } else if (mode === "zoom") {
        zoomNode = document.getElementById("zoom");
        zoomNode.remove();
        info.remove();
        create.grid();
        create.images();
        mode = "thumb";
      }
    },
/**
 * Loads next image in zoom view, also checks if possible.
 * @return {[type]} [description]
 */
    nextZoom: function () { // hier de check of er nog wel images zijn en anders weer naar de eerste index?
      if (currentImage === img.data.length - 1) {
        currentImage = 0;
      } else {
        currentImage++;

      }
      zoomNode = document.getElementById("zoom");
      zoomNode.remove();
      info.remove();
      create.zoom(currentImage);
    },
/**
 * Loads previous image in zoom view, also checks if possible.
 * @return {[type]} [description]
 */
    previousZoom: function () {
      if (currentImage === 0) {
        currentImage = img.data.length - 1;
      } else {
        currentImage--;

      }
      zoomNode = document.getElementById("zoom");
      zoomNode.remove();
      info.remove();
      create.zoom(currentImage);
    }

  };
/**
 * Class containg the remove methods.
 * @type {Object}
 */
  Remove = {
    /**
     * Removes an image from the JSON array based on name.
     * @param  {[type]} name [description]
     * @return {[type]}      [description]
     */
    image: function (name) {
      var c, found = false;
      for (c in img.data) {
        if (img.data.hasOwnProperty(c)) {

          if (img.data[c].name === name) {
            console.log("Deleting " + name);
            found = true;
            break;
          }
        }

      }
      if (found) {
        img.data.splice(c, 1);
        grid.remove();
        create.grid();
        create.images();
      }
      console.log(img.data);
    }
  };

  Give = {
    /**
     * Gives the current index based on id
     * @param  {[type]} id [description]
     * @return {[type]}    [description]
     */
    indexById: function (id) {
      var c, found = false;
      for (c in img.data) {
        if (img.data[c] === id) {
          found = true;
          break;
        }
      }
      if (found) {
        console.log("found the index " +  c + " by id " + id);
        return c;
      }
    }
  };
/**
 * Json array class containg the images
 * @type {Object}
 */
  Images = {
    "data": [
      {"id": "0", "title": "Palmboom", "photographer": "Hans Aarsman", "name": "0004681.jpg"},
      {"id": "1", "title": "Fiets", "photographer": "Emmy Andriesse", "name": "0004713.jpg"},
      {"id": "2", "title": "Sahara", "photographer": "Iwan Baan ", "name": "0004720.jpg"},
      {"id": "3", "title": "Chinees", "photographer": "Henze Boekhout", "name": "0004731.jpg"},
      {"id": "4", "title": "Bouwvakker", "photographer": "Anton Corbijn", "name": "0004750.jpg"},
      {"id": "5", "title": "Gezin", "photographer": "Rineke Dijkstra", "name": "0004755.jpg"},
      {"id": "6", "title": "Pruim", "photographer": "Ed van der Elsken", "name": "0004801.jpg"},
      {"id": "7", "title": "Keanu Reeves", "photographer": "Carli Hermès", "name": "0004802.jpg"},
      {"id": "8", "title": "Swingers", "photographer": "Rob Hornstra", "name": "0004827.jpg"},
      {"id": "9", "title": "Brug", "photographer": "Ad Konings ", "name": "0004853.jpg"},
      {"id": "10", "title": "Staart", "photographer": "Jeroen Kramer", "name": "0004858.jpg"},
      {"id": "11", "title": "Pier", "photographer": "Inez van Lamsweerde", "name": "0004860.jpg"},
      {"id": "12", "title": "Duuude", "photographer": "Frans Lanting", "name": "0004870.jpg"},
      {"id": "13", "title": "Gezin2", "photographer": "Erwin Olaf", "name": "0004874.jpg"},
      {"id": "14", "title": "SARS", "photographer": "Levi van Veluw", "name": "0004888.jpg"},
      {"id": "15", "title": "Swingers2", "photographer": "Laurence Aberhart", "name": "0004902.jpg"},
      {"id": "16", "title": "Brug2", "photographer": "Brian Brake", "name": "0004931.jpg"},
      {"id": "17", "title": "teste", "photographer": "Anne Geddes", "name": "0004969.jpg"},
      {"id": "18", "title": "Golf", "photographer": "Geoff Moon", "name": "0004971.jpg"},
      {"id": "19", "title": "Vet gebouw", "photographer": "Herzekiah Andrew Shanu", "name": "0006598.jpg"},
      {"id": "20", "title": "Nog een leuke titel", "photographer": "Rolf Aamot", "name": "0006630.jpg"},
      {"id": "21", "title": "NEC > Vitesse", "photographer": "Catherine Cameron", "name": "0006638.jpg"},
      {"id": "22", "title": "teste", "photographer": "Frode Fjerdingstad", "name": "0006680.jpg"},
      {"id": "23", "title": "teste", "photographer": "Petter Hegre", "name": "0006743.jpg"},
      {"id": "24", "title": "teste", "photographer": "Luca Kleve-Ruud ", "name": "0006787.jpg"}
    ]

  };

  window.create = Create;
  window.update = Update;
  window.remove = Remove;
  window.give = Give;
  window.img = Images;

}());

/**
 * Onload function sets up starting mode
 * @return {[type]} [description]
 */
window.onload = function () {
  create.main();
  create.grid();
  create.images();
};

window.addEventListener('keyup', this.handleEvents, false);
/**
 * Handles events and calls proper methods.
 * @param  {[type]} e [description]
 * @return {[type]}   [description]
 */
function handleEvents(e) {
  var code = e.keyCode;
  switch (code) {
  case 32:
    update.handleSpaceBar();
    break;
  case 39: //right
    update.nextZoom();
    break;
  case 37: //left
    update.previousZoom();
    break;
  }
}