import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"; // För att kunna köra saker som är ASYNC med Redux så måste man gå via deras API lösning, så tar därför in createAsyncThunk
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  addDoc,
} from "firebase/firestore";
import { db, auth } from "../firebase/config.js";

export const booksSlice = createSlice({
  name: "books",
  initialState: {
    books: [],
    status: "initial",
  },
  reducers: {
    // addBook: (books, action) => {
    //   let newBook = action.payload;
    //   newBook.id = books.length
    //     ? Math.max(...books.map(book => book.id)) + 1
    //     : 1;
    //   books.push(newBook);
    // },
    // eraseBook: (books, action) => {
    //   return books.filter(book => book.id != action.payload);
    // },
    // toggleRead: (books, action) => {
    //   books.map(book => {
    //     if (book.id == action.payload) {
    //       book.isRead = !book.isRead;
    //     }
    //   });
    // },
  },
  extraReducers: builder => {
    // Här måste jag ta in en extra reducer för att ladda det jag hämtar i min fetchBooks, sen här uppdaterar jag alltså state (initialState för "books")
    // Så det är HÄR jag uppdaterar det lokala "State", databasen är redan uppdaterad
    builder
      .addCase(fetchBooks.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchBooks.fulfilled, (state, action) => {
        state.status = "succeeded";
        // Add any fetched posts to the array
        state.books = action.payload;
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.status = "failed";
        console.log(action.error.message);
      })
      .addCase(toggleRead.fulfilled, (state, action) => {
        // Så för att även visa det uppdaterade staten som nu finns i db så gör jag en ny mappning och sätter omvänt värde på isRead
        state.books.map(book => {
          if (book.id == action.payload) {
            book.isRead = !book.isRead;
          }
        });
      })
      .addCase(toggleRead.rejected, (state, action) => {
        state.status = "failed";
        console.log(action.error.message);
      })
      .addCase(eraseBook.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(eraseBook.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.books = state.books.filter(book => book.id != action.payload);
      })
      .addCase(eraseBook.rejected, (state, action) => {
        state.status = "failed";
        console.log(action.error.message);
      })
      .addCase(addBook.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(addBook.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.books.push(action.payload);
      })
      .addCase(addBook.rejected, (state, action) => {
        state.status = "failed";
        console.log(action.error.message);
      });
  },
});

export const selectBooks = state => state.books;

export default booksSlice.reducer;

// Så här exporterar jag en fetchBooks som då kör med createAsyncThunk och kör en get mot books/fetchBooks (det blir actiontype prefix)
export const fetchBooks = createAsyncThunk("books/fetchBooks", async () => {
  const q = query(
    collection(db, "books"),
    where("user_id", "==", auth.currentUser.uid)
  ); // Sparar ner en query i const q men sätter att user_id i DB ska vara samma som userId som är inloggad

  const querySnapshot = await getDocs(q); // Tar en "bild" av det jag får hem i min query med await getDocs
  let bookList = []; // Skapar en tom array för att fylla med data
  querySnapshot.forEach(doc => {
    bookList.push({ id: doc.id, ...doc.data() }); // Eftersom firebase sätter id separat och jag använder tex book.id som prop så skapar jag en prop id och sätter doc.id sen spreadar jag resten av objektet så jag får in properitesen som finns med från db!
  });

  return bookList; // Här kan jag bara retunera den igen med datan
});

// Så nu för att uppdatera en prop i db, nämligen isRead till true/false så får jag först använda createAsyncThunk, skapar books/toggleRead och sätter async payload för att ta med "lasten"
// jag vill få tag i bokens id så jag går med dokument: doc(MIN-db, "books TABLE", lastenPROP-id)
export const toggleRead = createAsyncThunk(
  "books/toggleRead",
  async payload => {
    const bookRef = doc(db, "books", payload.id);

    await updateDoc(bookRef, {
      isRead: !payload.isRead,
    });
    return payload.id;
  }
);

export const eraseBook = createAsyncThunk("books/eraseBook", async payload => {
  await deleteDoc(doc(db, "books", payload));
  return payload;
});

export const addBook = createAsyncThunk("books/addBook", async payload => {
  let newBook = payload;
  newBook.user_id = auth.currentUser.uid;

  // Add a new document with a generated id.
  const docRef = await addDoc(collection(db, "books"), newBook);
  newBook.id = docRef.id;
  return newBook;
});
