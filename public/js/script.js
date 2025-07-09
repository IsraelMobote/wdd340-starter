function getTemplate(data) {
    return `<div>
  <img src="${data.image}" alt="icon showing a ${data.name}">
  <p>${data.name}</p>
</div>`
}

upgradeList = [
    {
        image: "/images/upgrades/flux-cap.png",
        name: "Flux Capacitor"
    },
    {
        image: "/images/upgrades/flame.jpg",
        name: "Flames Decals"
    },
    {
        image: "/images/upgrades/bumper_sticker.jpg",
        name: "Bumper Stickers"
    },
    {
        image: "/images/upgrades/hub-cap.jpg",
        name: "Hub Caps"
    }
]

const upgradeSection = document.querySelector(".upgrades");

function RenderTemplate(template, dataList, parentElement) {
    const htmlStrings = dataList.map((data) => template(data))
    parentElement.insertAdjacentHTML("beforeend", htmlStrings)
}

RenderTemplate(getTemplate, upgradeList, upgradeSection);