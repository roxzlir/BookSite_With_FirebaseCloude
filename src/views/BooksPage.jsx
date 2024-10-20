import Book from "../components/Book.jsx";
import Header from "../components/Header.jsx";
import { useSelector, useDispatch } from "react-redux";
import { selectBooks, fetchBooks } from "../store/booksSlice.js";
// import { collection, query, where, getDocs } from "firebase/firestore"; // Hämtar alla funktioner jag behöver för att kunna göra querys och hantera colletions(tables)
// import { db } from "../firebase/config.js";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
// import { selectUsers } from "../store/usersSlice.js";

function BooksPage() {
  const dispatch = useDispatch();
  const books = useSelector(selectBooks).books;
  const pageTitle = "📖 Book List with Router, Redux & Firebase";

  const bookStatus = useSelector(selectBooks).status;
  useEffect(() => {
    if (bookStatus == "initial") {
      dispatch(fetchBooks());
    }
  }, []);

  // // ------------------ OBS DETTA ÄR OM JAG KÖR UTAN REDUX--------------------------------
  // -------------------    Dessa ska upp ovan
  // const userId = useSelector(selectUsers).currentUser.id;
  // const [books, setBooks] = useState([]);
  // -------------------------------------------------
  // //  Eftersom det är en await med för att hämta från db, så använder jag useEffect för att kunna köra async
  // useEffect(() => {
  //   // Gör en funktion fetchBooks och gör den async
  //   const fetchBooks = async () => {
  //     // const q = query(collection(db, "books"), where("capital", "==", true));

  //     // const q = query(collection(db, "books")); // Sparar ner en query i const q och hämtar allt från books
  //     const q = query(collection(db, "books"), where("user_id", "==", userId)); // Sparar ner en query i const q men sätter att user_id i DB ska vara samma som userId som är inloggad

  //     const querySnapshot = await getDocs(q); // Tar en "bild" av det jag får hem i min query med await getDocs
  //     let bookList = []; // Sätter upp en tom array
  //     querySnapshot.forEach(doc => {
  //       bookList.push({ id: doc.id, ...doc.data() }); // Eftersom firebase sätter id separat och jag använder tex book.id som prop så skapar jag en prop id och sätter doc.id sen spreadar jag resten av objektet så jag får in properitesen som finns med från db! - Pushar in det i min array

  //       //console.log(doc.id, " => ", doc.data());
  //     });
  //     setBooks(bookList); // Och sätter den som nytt state för books
  //     console.log(bookList);
  //   };

  //   fetchBooks();
  // }, []);

  return (
    <>
      <div className="container">
        <Header pageTitle={pageTitle} />
        <div className="books-container">
          {books.length ? (
            <div className="books-list">
              {books.map(book => (
                <Book key={book.id} book={book} />
              ))}
            </div>
          ) : bookStatus == "loading" ? (
            <p>"Loading..."</p>
          ) : (
            <p>
              Your book list is empty. <Link to="/add-book">Click here</Link> to
              add a book
            </p>
          )}
        </div>
      </div>
    </>
  );
}

export default BooksPage;
