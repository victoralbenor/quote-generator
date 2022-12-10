// initialize firebase
firebase.initializeApp({
    databaseURL: "https://quotes-gpt-default-rtdb.firebaseio.com/"
});

// get the database reference
const db = firebase.database();

// get a reference to the quotes object
const quotesRef = db.ref("quotes");

let quoteIndex = "";

// displays first quote on page load
showRandomQuote();

// function to update the page with a new random quote
function showRandomQuote() {
    // get the number of quotes
    quotesRef.once("value", snapshot => {
        const numQuotes = snapshot.numChildren();

        // get a random index
        const randomIndex = Math.floor(Math.random() * numQuotes);

        // get the quote at the random index
        const randomQuoteRef = quotesRef.child(randomIndex);

        // get the quote data
        randomQuoteRef.once("value", quoteSnapshot => {
            const quoteData = quoteSnapshot.val();

            // get the index of the quote that is displayed on the page
            quoteIndex = randomQuoteRef.key;

            // update the page with the quote content and source
            document.querySelector(".quote-content").textContent = quoteData.content;
            document.querySelector(".quote-source").textContent = quoteData.source;
        });
    });
}

// function to increase the rating of a quote
function increaseRating(ratingIncrease) {
    if (quoteIndex === "") {
        return;
    }

    // get a reference to the quote at the specified index
    const quoteRef = quotesRef.child(quoteIndex);

    // get the current value of the rating and add the ratingIncrease to it
    quoteRef.once("value").then(function (snapshot) {
        const newRating = snapshot.val().rating + ratingIncrease;

        // update the quote's rating in the database
        quoteRef.update({
            rating: newRating
        });
    });
}