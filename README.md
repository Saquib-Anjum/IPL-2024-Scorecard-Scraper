# IPL Scorecard Scraper

This Node.js project scrapes IPL scorecards from ESPN Cricinfo and extracts match details such as the match results, player performances, and other statistics. The data is then organized and exported into an Excel file using the `xlsx` library.

## Features

- Scrape detailed match data like teams, venue, date, and result.
- Extract player details including runs, balls faced, fours, sixes, and strike rate for each match.
- Automatically organize and store the extracted data in an Excel file.
- Efficient handling of multiple matches with separate sheets for each match or team.

## Prerequisites

- **Node.js** (v21.2.0 or later)
- **npm** (Node Package Manager)

### Required Node Modules

- `request`: To make HTTP requests to the ESPN Cricinfo website for data scraping.
- `cheerio`: For parsing and navigating the scraped HTML content.
- `xlsx`: For writing the extracted match data into an Excel file.

## Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/your-username/IPL-Scorecard-Scraper.git
    ```

2. Navigate into the project directory:

    ```bash
    cd IPL-Scorecard-Scraper
    ```

3. Install the required dependencies:

    ```bash
    npm install
    ```

## How to Run the Project

Once you've installed the dependencies, you can run the scraper by executing the following command:

```bash
node index.js
