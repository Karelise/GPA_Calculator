// Calculates Assigment type overall grade
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
        table.rows[i].cells[4].classList.remove("clear");
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
        
        // Turns "Total" cell into delete table button
        const deleteTable = document.createElement("button");
        deleteTable.classList.add("delete");
        deleteTable.onclick = () => {t.remove(); b.remove()}
        deleteTable.innerText = "🗑";
        
        t.rows[1].cells[4].classList.add("clear");
        t.rows[1].cells[4].innerText = "";
        t.rows[1].cells[4].appendChild(deleteTable);


        // Adds "Add new row" button
        // Creates the button
        const newRowButton = document.createElement("button");
        newRowButton.classList.add("newRow")
        newRowButton.innerText = "+ Add New Row"
        newRowButton.onclick = () => createTableRow(t);

        const newRow = t.insertRow(-1);  // Creates a new row at the end of the table
        const cell1 = newRow.insertCell(0); // Adds 1 cell to the new row
        cell1.colSpan = 4; // Ensures the row's singular cell spans the entirety of the table
        cell1.classList.add("clear");

        cell1.appendChild(newRowButton); // Adds the button into the table
        
        enableInputTableData(t.rows);
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

                if(c!=0){// Validates user's number input
                    if(cw_c.value < cw_c.min) cw_c.value = cw_c.min;
                }
                
                columns[c].innerText =  cw_c.value;
            }
        } 
        // Resets "Title" cell
        t.rows[1].cells[4].classList.remove("clear");
        t.rows[1].cells[4].innerText = "Total"

        // Removes the "Add New Row Button"
        t.deleteRow(-1);
        getAssesmentTypeGrade(tableID);
    }

}

// Clears user data cells and adds input boxes
function enableInputTableData(rows){
    for(let r = 2; r<rows.length-1; r++){
            let columns = rows[r].cells;
            for(let c = 0; c<(columns.length);c++){
                const inputBox = columns[c].querySelector('input'); // Searches for input boc
                if(inputBox !==null) break;// Jumps rows if they already have input boxes

                if(c==4){ // Adds delete row button
                    const deleteRowButton = document.createElement("button");
                    // deleteRowButton.appendChild(img)
                    deleteRowButton.classList.add("delete");
                    deleteRowButton.innerText = "×"

                    const row = rows[r];
                    columns[c].classList.add("clear");
                    deleteRowButton.onclick = () => row.remove(); // CHECK
                    
                    columns[c].innerText = ""; // Clears cell's text
                    columns[c].appendChild(deleteRowButton);
                }else{
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

// Creates a Course Table with its corresponding Edit button
function createAssignmentType(courseID){
    const course = document.getElementById(courseID);

    const aT_table = document.createElement("table");
    aT_table.classList.add("assignment");

    // Finds the assigment's corresponding number
    const tables = course.querySelectorAll("table"); // Gets a list of all the tables in the given Course
    const lastTable = tables[tables.length-1]; 
    
    let idLastNum = 1; // Default, course has no tables
    if(lastTable !==undefined && lastTable !== null) idLastNum = Number(lastTable.id.slice(-1))+1;

    aT_table.id = courseID + "a" + idLastNum;

    // Create's the table's headers
    const tHead = aT_table.createTHead();
    const h1 = tHead.insertRow();
    const h2 = tHead.insertRow();

    // Creates & adds h1 cells
    const a_Name = document.createElement("th");
    a_Name.colSpan = 3;
    a_Name.classList.add("tableTitle");
    a_Name.innerText = "Assignment Type";

    const a_weight = document.createElement("th");
    a_weight.classList.add("tableTitle");
    a_weight.innerText = "00%";
    
    const a_percentage = document.createElement("th");
    a_percentage.classList.add("percentage");
    a_percentage.innerText = "00.0%";

    h1.appendChild(a_Name);
    h1.appendChild(a_weight);
    h1.appendChild(a_percentage);

    // Creates & adds h2 cells
    const a_title = document.createElement("th");
    a_title.innerText = "Title";

    const a_score = document.createElement("th");
    a_score.innerText = "Score";
    
    const a_max = document.createElement("th");
    a_max.innerText = "Max";

    const a_bonus = document.createElement("th");
    a_bonus.innerText = "Bonus";

    const a_total = document.createElement("th");
    a_total.innerText = "Total";

    h2.appendChild(a_title);
    h2.appendChild(a_score);
    h2.appendChild(a_max);
    h2.appendChild(a_bonus);
    h2.appendChild(a_total);

    // Creates edit/save button
    const editButton = document.createElement("button");
    editButton.classList.add("edit");
    editButton.id = aT_table.id + "_editButton";
    editButton.onclick = ()=> updateTable(aT_table.id,editButton.id);
    editButton.innerText = "Edit Table";

    // Adds table to section
    course.insertBefore(aT_table, course.lastElementChild);
    course.insertBefore(editButton, course.lastElementChild)
    
    // By default, opens edit mode when an assigment type is created
    updateTable(aT_table.id, editButton.id);
}
