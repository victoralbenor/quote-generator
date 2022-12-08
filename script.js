// initialize firebase
firebase.initializeApp({
    databaseURL: "https://quotes-gpt-default-rtdb.firebaseio.com/"
});

// get the database reference
const db = firebase.database();

// get a reference to the quotes object
const quotesRef = db.ref("quotes");

// get the number of quotes
quotesRef.once("value", snapshot => {
    // get the number of quotes
    const numQuotes = snapshot.numChildren();

    // get a random index
    const randomIndex = Math.floor(Math.random() * numQuotes);

    // get the quote at the random index
    const randomQuoteRef = quotesRef.child(randomIndex);

    // get the quote data
    randomQuoteRef.once("value", quoteSnapshot => {
        const quoteData = quoteSnapshot.val();

        // display the quote content and source
        document.querySelector(".quote-content").textContent = quoteData.content;
        document.querySelector(".quote-source").textContent = quoteData.source;
    });
});