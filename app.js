// represent a book

class Books {
    constructor(title,author,isbn){
        this.title = title;
        this.author = author;
        this.isbn = isbn
    }
}

//Store Class

class Store {
    static getBooks(){
        let books;

        if(localStorage.getItem('books') === null){
            books = [];
        }else{
            books = JSON.parse(localStorage.getItem('books'))
        }
        return books;
    }

    static addBook(book){
        const books = Store.getBooks();
        books.push(book);

        localStorage.setItem('books', JSON.stringify(books));
    }

    static removeBook(isbn){    
        const books = Store.getBooks();

        books.forEach((book, index) => {
            if(book.isbn === isbn){
                books.splice(index, 1);
            }
        })
        localStorage.setItem('books', JSON.stringify(books));
    }
}

// handle ui task

class UI {
    static displayBooks(){
        const books = Store.getBooks();
        books.forEach((book) => UI.addBooktoList(book))
    }

    static addBooktoList(book){
        const list = document.querySelector('#book-list');
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td><a href="#" class = "btn btn-danger btn-sm delete">X</a<
        `;
        list.appendChild(row);
    }
    static deleteBook(el){
        if(el.classList.contains('delete')){
            el.parentElement.parentElement.remove();
        }
    }
    static showAlert(message, className){
        const div = document.createElement('div')
        div.className = `alert alert-${className}`
        div.appendChild(document.createTextNode(message));
        
        const container = document.querySelector('.container')
        const form = document.querySelector('#book-form');
        container.insertBefore(div,form);

        setTimeout(() => document.querySelector('.alert').remove(),3000);
    }
    static clearFields(){
        document.querySelector('#title').value = '';
        document.querySelector('#author').value = '';
        document.querySelector('#isbn').value = '';

    }
}


// events
//display book
document.addEventListener('DOMContentLoaded', UI.displayBooks);
// addbook
document.querySelector('#book-form').addEventListener('submit',(e) =>{

    e.preventDefault();

    // get form values

    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value;
    const isbn = document.querySelector('#isbn').value;

    //book validation

    if(title === '' || author === '' || isbn === ''){
        UI.showAlert('Please Fill in the fields','danger');
    }else{
        const book = new Books(title, author, isbn);
        UI.addBooktoList(book);
        Store.addBook(book);
        UI.showAlert('Book Added', 'success')
        UI.clearFields(book);
    }
})

//removeBook

document.querySelector('#book-list').addEventListener('click', (e) =>{
    UI.deleteBook(e.target);
    console.log(Store.removeBook(e.target.parentElement.previousElementSibling.textContent));
    UI.showAlert('Book Removed', 'success')
})