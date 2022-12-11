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
showWeightedRandomQuote();

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

// function to update the page with a new random quote using weighted random
function showWeightedRandomQuote() {
    // get the sum of all ratings
    let ratingSum = 0;
    quotesRef.once("value", snapshot => {
        snapshot.forEach(quoteSnapshot => {
            const quoteData = quoteSnapshot.val();
            ratingSum += parseInt(quoteData.rating);
        });

        // generate a random number between 0 and the sum of ratings
        const randomNumber = parseInt(Math.random() * ratingSum);

        // iterate over each quote to find the one with a range of ratings that includes the random number
        let runningTotal = 0;
        let chosenQuote;
        quotesRef.once("value", snapshot => {
            let shouldSkip = false;
            snapshot.forEach(quoteSnapshot => {
                if (shouldSkip) return; // DEBT: this is a hack to stop iterating over quotes. It could be improved.
                const quoteData = quoteSnapshot.val();
                runningTotal += parseInt(quoteData.rating);
                if (parseInt(randomNumber) <= parseInt(runningTotal)) {
                    // found the quote with the matching range of ratings
                    chosenQuote = quoteSnapshot;
                    shouldSkip = true; // stop iterating over quotes
                }
            });

            // update the page with the quote content and source
            const quoteData = chosenQuote.val();
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