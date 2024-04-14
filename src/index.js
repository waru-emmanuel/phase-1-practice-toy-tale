let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  const toyForm = document.querySelector(".add-toy-form");
  const toyCollection = document.querySelector("#toy-collection");

  addBtn.addEventListener("click", () => {
    // Toggling the visibility of the toy form container
    addToy = !addToy;
    toyFormContainer.style.display = addToy ? "block" : "none";
  });

  // Addin the  event listener for toy form submission
  toyForm.addEventListener("submit", (event) => {
    event.preventDefault(); // Prevent default form submission behavior

    // Retrieve form input values
    const toyName = toyForm.querySelector("input[name='name']").value;
    const toyImage = toyForm.querySelector("input[name='image']").value;

    // Create toy object
    const newToy = {
      name: toyName,
      image: toyImage,
      likes: 0 // Initial likes count for new toy
    };

    // Send POST request to add new toy
    fetch("http://localhost:3000/toys", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(newToy)
    })
    .then(response => response.json())
    .then(data => {
      // Add new toy card to the DOM
      const toyCard = createToyCard(data); // Assume createToyCard function creates a new toy card element
      toyCollection.appendChild(toyCard);
    })
    .catch(error => {
      console.error("Error adding new toy:", error);
    });
  });

  // Add event listener for toy like button clicks
  toyCollection.addEventListener("click", (event) => {
    if (event.target.classList.contains("like-btn")) {
      const toyId = event.target.dataset.toyId; // Assuming toy id is stored in a data attribute
      const toyLikes = parseInt(event.target.dataset.likes);
      const newLikes = toyLikes + 1;

      // Send PATCH request to update toy's likes count
      fetch(`http://localhost:3000/toys/${toyId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({ likes: newLikes })
      })
      .then(response => response.json())
      .then(data => {
        // Update toy's likes count in the DOM
        event.target.dataset.likes = newLikes;
        event.target.previousElementSibling.textContent = `${newLikes} Likes`;
      })
      .catch(error => {
        console.error("Error updating toy likes:", error);
      });
    }
  });

  // Create toy cards from initial data
  toys.forEach(toy => {
    const toyCard = createToyCard(toy);
    toyCollection.appendChild(toyCard);
  });
});

function createToyCard(toyData) {
  // Create elements for the toy card
  const card = document.createElement('div');
  card.classList.add('toy-card');

  const h2 = document.createElement('h2');
  h2.textContent = toyData.name;

  const img = document.createElement('img');
  img.classList.add('toy-avatar');
  img.src = toyData.image;

  const p = document.createElement('p');
  p.textContent = `${toyData.likes} Likes`;

  const button = document.createElement('button');
  button.classList.add('like-btn');
  button.textContent = 'Like ❤️';
  button.dataset.toyId = toyData.id; // Set the toy's id as a data attribute
  button.dataset.likes = toyData.likes; // Set the toy's likes count as a data attribute

  // Append elements to the card
  card.appendChild(h2);
  card.appendChild(img);
  card.appendChild(p);
  card.appendChild(button);

  return card;
}
