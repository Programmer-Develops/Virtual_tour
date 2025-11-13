// Tour.js
AFRAME.registerComponent("tour", {
  schema: {
    state: { type: "string", default: "places-list" },
    selectedCard: { type: "string", default: "#card1" },
    zoomAspectRatio: { type: "number", default: 1 },
  },
  init: function () {
    this.placesContainer = this.el;
    this.cameraEl = document.querySelector("#camera");
    this.createCards();
  },
  tick: function () {
    const { state } = this.el.getAttribute("tour");

    if (state === "view") {
      this.hideEl([this.placesContainer]);
      this.showView();
      // const vrButton = document.querySelector("#vr-button")
      const appTitle = document.querySelector("#app-title")
      // vrButton.setAttribute("visible", false);
      appTitle.setAttribute("visible", false)
      this.updateSidebar();
    }
    
    if (state !== "view" && state !== "change-view") {
      const sidebar = document.querySelector("#sidebar");
      sidebar.setAttribute("visible", false);
    }
  },
  hideEl: function (elList) {
    elList.map((el) => {
      el.setAttribute("visible", false);
    });
  },
  createCards: function () {
    const thumbNailsRef = [
      {
        id: "taj-mahal",
        title: "Taj Mahal",
        url: "../assets/thumbnails/taj_mahal.png",
        description: "Taj Mahal is an ivory-white marble mausoleum on the right bank of the river Yamuna in the Indian city of Agra. It was commissioned in 1632 by the Mughal emperor Shah Jahan to house the tomb of his favourite wife, Mumtaz Mahal."
      },
      {
        id: "coming-soon-1",
        title: "Coming Soon",
        url: "../assets/NA.png",
        description: "This location is coming soon. Check back later for an amazing virtual tour experience."
      },
      {
        id: "coming-soon-2",
        title: "Coming Soon",
        url: "../assets/NA.png",
        description: "This location is coming soon. Check back later for an amazing virtual tour experience."
      }
    ];
    let prevoiusXPosition = -60;
    for (var item of thumbNailsRef) {
      const posX = prevoiusXPosition + 25;
      const posY = 10;
      const posZ = -40;
      const position = { x: posX, y: posY, z: posZ };
      prevoiusXPosition = posX;

      const borderEl = this.createBorder(position, item.id);
      const thumbNail = this.createThumbNail(item);
      borderEl.appendChild(thumbNail);

      const titleEl = this.createTitleEl(position, item);
      borderEl.appendChild(titleEl);

      this.placesContainer.appendChild(borderEl);
    }
  },
  createBorder: function (position, id) {
    const entityEl = document.createElement("a-entity");
    entityEl.setAttribute("id", id);
    entityEl.setAttribute("visible", true);
    entityEl.setAttribute("geometry", {
      primitive: "ring",
      radiusInner: 9,
      radiusOuter: 10,
    });
    entityEl.setAttribute("position", position);
    entityEl.setAttribute("material", {
      color: "rgba(0, 0, 0, 1)",
      opacity: 0.4,
    });
    entityEl.setAttribute("cursor-listener", {});
    return entityEl;
  },
  createThumbNail: function (item) {
    const entityEl = document.createElement("a-entity");
    entityEl.setAttribute("visible", true);
    entityEl.setAttribute("geometry", {
      primitive: "circle",
      radius: 9,
    });
    entityEl.setAttribute("material", { src: item.url });
    entityEl.setAttribute("cursor-listener", {});
    return entityEl;
  },
  createTitleEl: function (position, item) {
    const entityEl = document.createElement("a-entity");
    entityEl.setAttribute("text", {
      font: "exo2bold",
      align: "center",
      width: 80,
      color: "rgba(7, 70, 158, 1)",
      value: item.title,
    });
    const elPosition = position;
    elPosition.y = -20;
    entityEl.setAttribute("position", elPosition);
    entityEl.setAttribute("visible", true);
    return entityEl;
  },
  showView: function () {
    const { selectedCard } = this.data;
    const skyEl = document.querySelector("#main-container");
    
    // Only show 360 image for Taj Mahal, show default sky for others
    if (selectedCard === "taj-mahal") {
      skyEl.setAttribute("material", {
        src: `../assets/360_images/${selectedCard}/place-0.jpg`,
        color: "#fff",
      });
    } else {
      skyEl.setAttribute("material", {
        color: "#96D3F1"
      });
    }
  },
  updateSidebar: function() {
    const { selectedCard } = this.data;
    const sidebar = document.querySelector("#sidebar");
    const sidebarTitle = document.querySelector("#sidebar-title");
    const sidebarBody = document.querySelector("#sidebar-body");
    
    // Define location information
    const locationInfo = {
      "taj-mahal": {
        title: "Taj Mahal",
        description: "Taj Mahal is an ivory-white marble mausoleum on the right bank of the river Yamuna in the Indian city of Agra. It was commissioned in 1632 by the Mughal emperor Shah Jahan to house the tomb of his favourite wife, Mumtaz Mahal."
      },
      "coming-soon-1": {
        title: "Coming Soon",
        description: "This location is coming soon. Check back later for an amazing virtual tour experience."
      },
      "coming-soon-2": {
        title: "Coming Soon",
        description: "This location is coming soon. Check back later for an amazing virtual tour experience."
      }
    };
    
    // Update sidebar with location information
    if (locationInfo[selectedCard]) {
      sidebarTitle.setAttribute("text", { value: locationInfo[selectedCard].title });
      sidebarBody.setAttribute("text", { value: locationInfo[selectedCard].description });
      sidebar.setAttribute("visible", true);
    }
  },
  update: function () {
    window.addEventListener("keydown", (e) => {
      if (e.key === "ArrowUp") {
        if (
          (this.data.zoomAspectRatio <= 10 && this.data.state === "view") ||
          (this.data.zoomAspectRatio <= 10 && this.data.state === "change-view")
        ) {
          this.data.zoomAspectRatio += 0.002;
          this.cameraEl.setAttribute("zoom", this.data.zoomAspectRatio);
        }
      }
      if (e.key === "ArrowDown") {
        if (
          (this.data.zoomAspectRatio > 1 && this.data.state === "view") ||
          (this.data.zoomAspectRatio > 1 && this.data.state === "change-view")
        ) {
          this.data.zoomAspectRatio -= 0.002;
          this.cameraEl.setAttribute("zoom", this.data.zoomAspectRatio);
        }
      }
    });
  },
});