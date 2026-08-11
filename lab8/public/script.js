const API_URL = "/api/books";


// Display all books
async function loadBooks() {

    const response = await fetch(API_URL);

    const books = await response.json();

    const bookList = document.getElementById("bookList");

    bookList.innerHTML = "";

    books.forEach(book => {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>₹${book.price}</td>

            <td>
                <button
                    class="edit-btn"
                    onclick="editBook('${book._id}')">
                    Edit
                </button>

                <button
                    class="delete-btn"
                    onclick="deleteBook('${book._id}')">
                    Delete
                </button>
            </td>
        `;

        bookList.appendChild(row);
    });
}


// Add book
async function addBook() {

    const title = document.getElementById("title").value;
    const author = document.getElementById("author").value;
    const price = document.getElementById("price").value;

    if (!title || !author || !price) {
        alert("Please fill all fields");
        return;
    }

    await fetch(API_URL, {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            title: title,
            author: author,
            price: Number(price)
        })
    });

    document.getElementById("title").value = "";
    document.getElementById("author").value = "";
    document.getElementById("price").value = "";

    loadBooks();
}


// Delete book
async function deleteBook(id) {

    if (!confirm("Are you sure you want to delete this book?")) {
        return;
    }

    await fetch(`${API_URL}/${id}`, {
        method: "DELETE"
    });

    loadBooks();
}


// Edit book
async function editBook(id) {

    const title = prompt("Enter new title:");

    if (!title) return;

    const author = prompt("Enter new author:");

    if (!author) return;

    const price = prompt("Enter new price:");

    if (!price) return;


    await fetch(`${API_URL}/${id}`, {

        method: "PUT",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            title: title,
            author: author,
            price: Number(price)
        })
    });

    loadBooks();
}


// Load books when page opens
loadBooks();