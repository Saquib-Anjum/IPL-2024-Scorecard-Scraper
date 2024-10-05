// scoreCard.js

const fs = require("fs");
const path = require("path");
const xlsx = require("xlsx");
const request = require("request");
const cheerio = require("cheerio");

// Function to process a single scorecard URL
function processScoreCard(url) {
    console.log(`Processing scorecard for URL: ${url}`); // Log the URL being processed
    request(url, cb);
}

// Callback function to handle the HTTP response
function cb(err, response, html) {
    if (err) {
        console.log("Error fetching the scorecard:", err);
    } else {
        extractMatchDetails(html);
    }
}

// Function to extract match details from the HTML
function extractMatchDetails(html) {
    let $ = cheerio.load(html);

    // Initialize variables
    let venue = "Venue not found";
    let date = "Date not found";
    let result = "Result not found";

    // Extract match details (venue and date)
    let desEle = $(".ds-text-tight-m.ds-font-regular.ds-text-typo-mid3");
    if (desEle.length === 0) {
        console.log("No match details found with the given selector.");
        console.log("HTML structure snippet for inspection:", html.substring(0, 1000)); // Log part of HTML for inspection
    } else {
        let stringArr = desEle.text().split(",");
        if (stringArr.length >= 3) {
            venue = stringArr[1].trim();
            date = stringArr[2].trim();
        }
        console.log(`Venue: ${venue}, Date: ${date}`);
    }

    // Extract match result
    let resultEle = $(".ds-text-tight-s.ds-font-medium.ds-truncate.ds-text-typo span");
    result = resultEle.text().trim();
    console.log(`Match Result: ${result}`);

    // Extracting team names
    const teamElements = $(".ci-team-score");
    const teams = [];

    teamElements.each((i, elem) => {
        const teamName = $(elem).find("a").attr("title");
        if (teamName) {
            teams.push(teamName.trim());
        }
    });

    // Log the team names
    const teamName = teams[0] || "Team 1 not found";
    const opponentTeamName = teams[1] || "Team 2 not found";
    console.log(`Teams: ${teamName} vs ${opponentTeamName}`);

    // Extracting innings
    let innings = $(".ci-scorecard-table");
    console.log(`Number of innings found: ${innings.length}`);

    if (innings.length === 0) {
        console.log("No innings data found.");
        return;
    }

    for (let i = 0; i < innings.length; i++) {
        let cInning = $(innings[i]);
        let allRows = cInning.find("tbody tr");
        console.log(`Number of rows found in inning ${i + 1}: ${allRows.length}`);

        for (let j = 0; j < allRows.length; j++) {
            let allCols = $(allRows[j]).find("td");
            if (allCols.length > 7) { // Ensure there are enough columns
                let playerName = $(allCols[0]).find("a").text().trim() || $(allCols[0]).text().trim();
                let run = $(allCols[2]).text().trim();
                let balls = $(allCols[3]).text().trim();
                let fours = $(allCols[5]).text().trim();
                let sixes = $(allCols[6]).text().trim();
                let strikeRate = $(allCols[7]).text().trim();

                // Handle cases where runs might be "not out" or similar
                if (run.toLowerCase().includes("not out")) {
                    run = "0"; // Assign 0 or handle as needed
                    balls = "0"; // Assign 0 or handle as needed
                }

                // Check if playerName and run are present
                if (playerName && run) {
                    console.log(`${playerName} | Runs: ${run}, Balls: ${balls}, Fours: ${fours}, Sixes: ${sixes}, SR: ${strikeRate}`);
                    processPlayer(teamName, playerName, run, balls, fours, sixes, strikeRate, opponentTeamName, venue, date, result);
                }
            }
        }
    }
}

// Function to process each player's data and save to Excel
function processPlayer(teamName, playerName, run, balls, fours, sixes, strikeRate, opponentTeamName, venue, date, result) {
    const IplPath = path.join(__dirname, "IPL"); // Define IplPath within scoreCard.js
    let teamPath = path.join(IplPath, teamName);
    dirCreater(teamPath);

    // Correct filePath to include the IPL directory
    let filePath = path.join(teamPath, playerName + ".xlsx");

    // Read existing data
    let content = excelReader(filePath, playerName);
    let playerObj = {
        teamName,
        playerName,
        run,
        balls,
        fours,
        sixes,
        strikeRate,
        opponentTeamName,
        venue,
        date,
        result
    };

    content.push(playerObj);
    excelWriter(filePath, content, playerName);
}

// Function to create directories if they don't exist
function dirCreater(filePath) {
    if (fs.existsSync(filePath) === false) {
        fs.mkdirSync(filePath, { recursive: true }); // Ensure directories are created recursively
    }
}

// Function to write data to Excel
function excelWriter(filePath, json, sheetName) {
    let newWB = xlsx.utils.book_new();
    let newWS = xlsx.utils.json_to_sheet(json); // Fixed typo: sheet instead of sheeet
    xlsx.utils.book_append_sheet(newWB, newWS, sheetName);
    xlsx.writeFile(newWB, filePath);
}

// Function to read existing Excel data
function excelReader(filePath, sheetName) {
    if (fs.existsSync(filePath) === false) {
        return [];
    }
    let wb = xlsx.readFile(filePath);
    let excelData = wb.Sheets[sheetName]; // Fixed 'wb.sheet' to 'wb.Sheets[sheetName]'
    let ans = xlsx.utils.sheet_to_json(excelData);
    return ans;
}

module.exports = {
    PS: processScoreCard
};
