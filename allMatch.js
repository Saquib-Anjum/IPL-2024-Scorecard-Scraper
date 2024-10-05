// allMatch.js

const request = require("request");
const cheerio = require("cheerio");
const scoreCardObj = require("./scoreCard");

function getAllMatchesLink(fullLink) {
    request(fullLink, function (err, response, html) {
        if (err) {
            console.log("Error fetching all matches page:", err);
        } else {
            getAllLink(html);
        }
    });
}

function getAllLink(html) {
    let $ = cheerio.load(html);

    // Selecting all anchor tags with 'full-scorecard' in href
    let scoreCardEle = $('a[href*="full-scorecard"]');

    // To avoid duplicates, use a Set
    let scoreCardLinks = new Set();

    // Loop through and extract the href (link) attribute
    for (let i = 0; i < scoreCardEle.length; i++) {
        let link = $(scoreCardEle[i]).attr("href");
        if (link) {
            // Construct the full URL for the scorecard link
            let fullLink = "https://www.espncricinfo.com" + link;

            // Add to Set to avoid duplicate processing
            if (!scoreCardLinks.has(fullLink)) {
                scoreCardLinks.add(fullLink);
                console.log("Fetching scorecard from: ", fullLink);
                scoreCardObj.PS(fullLink);
            }
        }
    }
}

module.exports = {
    gAlmatches: getAllMatchesLink
};
