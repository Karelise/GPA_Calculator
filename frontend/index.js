
function getAssesmentTypeGrade(tableID){
    let table = document.getElementById(tableID);
    let rows= table.rows;

    let accumulatedPoints = 0;
    let totalPointsPossible = 0;

    // Calculates assesment grades individually
    for(let i = 2; i < rows.length; i++){
        let cells = rows[i].cells;
        
        let score = Number(cells[1].innerText);
        let bonus = Number(cells[3].innerText);
        let max = Number(cells[2].innerText);
        
        // Updates the table's "Total" column
        let total = ((score+bonus)/max)*100;
        table.rows[i].cells[4].innerText=total.toFixed(1) + "%";

        accumulatedPoints += score + bonus;
        totalPointsPossible += max;
    }

    // Updates Total Points Accumulated percentage
    let assesmentTypeTotal = accumulatedPoints/totalPointsPossible*100;
    table.rows[0].cells[2].innerText = assesmentTypeTotal.toFixed(1) + "%"
}

// Enables and disables Edit Modes 
function updateTable(tableID, buttonID){
    let t = document.getElementById(tableID);
    let b = document.getElementById(buttonID);

    if (b.innerText == "Edit Table"){ // Enters Edit Table Mode
        b.innerText = "Save Changes";

        // Turns Assignment Type text into an input box
        // Creates a text input box
        const cw_name = document.createElement("input");
        cw_name.classList.add("assignmentType")
        cw_name.type = "text";
        cw_name.value = t.rows[0].cells[0].innerText;
        cw_name.placeholder = t.rows[0].cells[0].innerText

        t.rows[0].cells[0].innerText = ""; // Clears cell's text
        t.rows[0].cells[0].appendChild(cw_name); // Inserts input box into cell

        // Turns Weight in Grade into a number input box
        // Creates a number input box
        const cw_weight = document.createElement("input");
        cw_weight.classList.add("weight");
        cw_weight.type = "number";
        cw_weight.value = Number(t.rows[0].cells[1].innerText.slice(0,-1));
        cw_weight.placeholder == Number(t.rows[0].cells[1].innerText.slice(0,-1));
        cw_weight.width = 40;

        t.rows[0].cells[1].innerText = ""; // Clears cell's text
        t.rows[0].cells[1].appendChild(cw_weight); // Inserts input box into cell

        enableInputTableData(t.rows);

        // Adds "Add new row" button
        // Creates the button
        const newRowButton = document.createElement("button");
        newRowButton.classList.add("newRow")
        newRowButton.innerText = "+ Add New Row"
        newRowButton.onclick = () => createTableRow(t);

        const newRow = t.insertRow(-1);  // Creates a new row at the end of the table
        const cell1 = newRow.insertCell(0); // Adds 1 cell to the new row
        cell1.colSpan = 5; // Ensures the row's singular cell spans the entirety of the table
            
        cell1.appendChild(newRowButton) // Adds the button into the table
    } else if(b.innerText == "Save Changes"){ // Disables Edit Mode
        b.innerText = "Edit Table";

        // Updates "Assigment Type"
        cw_name = t.rows[0].cells[0].querySelector("input");
        t.rows[0].cells[0].innerText = cw_name.value;

        // Updates "Weight in Grade"
        cw_weight = t.rows[0].cells[1].querySelector("input");
        t.rows[0].cells[1].innerText = cw_weight.value + "%";

        // Updates "Title", "Score", and "Max"
        let rows = t.rows;
        for(let r = 2; r<rows.length; r++){
            let columns = rows[r].cells;
            for(let c = 0; c<columns.length-1;c++){
                cw_c = columns[c].querySelector("input");
                columns[c].innerText =  cw_c.value;
            }
        } 

        // Removes the "Add New Row Button"
        t.deleteRow(-1);
        getAssesmentTypeGrade(tableID);
    }

}

// Clears user data cells and adds input boxes
function enableInputTableData(rows){
    for(let r = 2; r<rows.length; r++){
            let columns = rows[r].cells;
            for(let c = 0; c<(columns.length)-1;c++){
                const inputBox = columns[c].querySelector('input'); // Searches for input boc
                if(inputBox !==null) break;// Jumps rows if they already have input boxes

                const cw_c = document.createElement("input");
                if (c==0){ // Creates text input box for "Title" column
                    cw_c.classList.add("tDTitle")
                    cw_c.type = "text";
                    cw_c.value = columns[c].innerText;
                    cw_c.placeholder = columns[c].innerText;
                }else{ // Creates number input box for "Score", "Max", and "Bonus" columns
                    cw_c.classList.add("tData")
                    cw_c.type = "number";
                    cw_c.value = Number(columns[c].innerText);
                    cw_c.placeholder = Number(columns[c].innerText);
                    cw_c.min = 0;
                }
                columns[c].innerText = ""; // Clears cell's text
                columns[c].appendChild(cw_c); // Puts input box inside cell
            }
        }
}

// Adds a new row at the end of all user data rows
function createTableRow(table){
    let rows = table.rows;
    const newRow = table.insertRow(rows.length-1); // Adds new rows

    // Adds 5 cells to the new row
    newRow.insertCell(0);
    newRow.insertCell(1);
    newRow.insertCell(2);
    newRow.insertCell(3);
    newRow.insertCell(4);

    enableInputTableData(rows); // Ensures last row is editable
}
