/* 
 * NAME: table.js
 * DESCRIPTION: This script searches the page for all Headers and Sub-Headers and 
 * populates a table (with clickable links) in the side-bar.
*/

// Function to populate the table from headers
function populateTable() {
    const headerContainer = document.getElementById("headerContainer");
    const tableBody = document.getElementById("tableBody");

    // Get all the headers and subheaders
    const headers = Array.from(headerContainer.querySelectorAll("h, h2"));

    // Iterate through headers and populate the table
    headers.forEach(header => {

        // add an id to each header
        header.setAttribute("id", header.textContent.replaceAll(" ", "-"));

        // create relevant elements and class attributes
        const row = document.createElement("tr");
        const cell = document.createElement("td");
        const anchor = document.createElement("a");

        if (header.tagName === "H") {
            cell.setAttribute("class", "hd");
            // cell.classList.add("hd");
        }

        if (header.tagName === "H2") {
            cell.setAttribute("class", "sb");
            // cell.classList.add("sb");
        }

        // setup the anchor
        anchor.textContent = header.textContent;
        anchor.href = "#" + header.textContent.replaceAll(" ", "-")
        anchor.target = "_self"

        // append children
        cell.appendChild(anchor);
        row.appendChild(cell);
        tableBody.appendChild(row);
    });
}

// Call the populateTable function
populateTable();