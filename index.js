// index.js

const xlsx = require("xlsx");
const url = "https://www.espncricinfo.com/series/indian-premier-league-2024-1410320";
const request = require("request");
const cheerio = require("cheerio");
const fs = require("fs");
const path = require("path");
const AllMatchObj = require("./allMatch");

//const scoreCardObj = require("./scoreCard");

const IplPath = path.join(__dirname, "IPL");
dirCreater(IplPath);

request(url, cb);

// Home page
function cb(err, response, html) {
    if (err) {
        console.log(err);
    } else {
        extractLink(html);
    }
}

// Extracting the IPL 2024 page link
function extractLink(html) {
    let $ = cheerio.load(html);

    let link = "/series/indian-premier-league-2024-1410320/match-schedule-fixtures-and-results";
    let fullLink = "https://www.espncricinfo.com" + link;

    console.log("Fetching all match links from: ", fullLink); // Log the match schedule link

    // Call the function to get all match links
    AllMatchObj.gAlmatches(fullLink);
}

// Function to create directories if they don't exist
function dirCreater(filePath) {
    if (fs.existsSync(filePath) === false) {
        fs.mkdirSync(filePath, { recursive: true }); // Ensure directories are created recursively
    }
}
