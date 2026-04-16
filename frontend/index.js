const courseCategories = ["Core", "Professional Elective", "Open Elective", "Humanities", "Social Sciences", "Capstone"]

// Calculates Assigment type overall grade
function getAssesmentTypeGrade(table){
    let rows= table.rows;

    let accumulatedPoints = 0;
    let totalPointsPossible = 0;

    // Calculates assesment grades individually
    for(let i = 2; i < rows.length; i++){
        let cells = rows[i].cells;
        
        let score = Number(cells[1].innerText);
        let bonus = Number(cells[3].innerText);
        let max = Number(cells[2].innerText);
        
        if(cells[1].innerText !== "" && cells[2].innerText !== ""){
            // Updates the table's "Total" column
            let total = ((score+bonus)/max)*100;
            table.rows[i].cells[4].innerText=total.toFixed(1) + "%";
            
            accumulatedPoints += score + bonus;
            totalPointsPossible += max;
        }else table.rows[i].cells[4].innerText = "";
        table.rows[i].cells[4].classList.remove("clear");

    }

    // Updates Assignment Type Percentage Score
    let assesmentTypeTotal = accumulatedPoints/totalPointsPossible*100;
    if(typeof assesmentTypeTotal == "number") table.rows[0].cells[2].innerText = assesmentTypeTotal.toFixed(1) + "%";
    else table.rows[0].cells[2].innerText = "";
    
    const aT_gradeWeight = Number(table.rows[0].cells[1].innerText.slice(0,-1))/100;

    return assesmentTypeTotal*aT_gradeWeight;
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
        cw_name.classList.add("assignmentType");
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
        deleteTable.onclick = () => {t.remove(); b.remove();}
        deleteTable.innerText = "🗑";
        
        t.rows[1].cells[4].classList.add("clear");
        t.rows[1].cells[4].innerText = "";
        t.rows[1].cells[4].appendChild(deleteTable);

        // Adds "Add new row" button
        // Creates the button
        const newRowButton = document.createElement("button");
        newRowButton.classList.add("newRow");
        newRowButton.innerText = "+ Add New Row";
        newRowButton.onclick = () => createTableRow(t);

        const newRow = t.insertRow(-1);  // Creates a new row at the end of the table
        const cell1 = newRow.insertCell(0); // Adds 1 cell to the new row
        cell1.colSpan = 4; // Ensures the row's singular cell spans the entirety of the table
        cell1.classList.add("clear");

        cell1.appendChild(newRowButton); // Adds the button into the table
        
        enableInputTableData(t.rows, 2); 
    } else if(b.innerText == "Save Changes"){ // Disables Edit Mode
        b.innerText = "Edit Table";

        // Updates "Assigment Type"
        cw_name = t.rows[0].cells[0].querySelector("input");
        t.rows[0].cells[0].innerText = cw_name.value;

        // Updates "Weight in Grade"
        cw_weight = t.rows[0].cells[1].querySelector("input");
        t.rows[0].cells[1].innerText = cw_weight.value + "%";

        // Updates "Title", "Score", and "Max"
        for(let r = 2; r<t.rows.length; r++){
            let columns = t.rows[r].cells;
            for(let c = 0; c<columns.length-1;c++){
                let cw_c = columns[c].querySelector("input");

                if(c!=0){// Validates user's number input
                    if(cw_c.value < cw_c.min) cw_c.value = null; // Leaves cell empty if input is invalid
                }
                
                columns[c].innerText = cw_c.value;
            }
        } 
        // Resets "Total" cell
        t.rows[1].cells[4].classList.remove("clear");
        t.rows[1].cells[4].innerText = "Total"

        t.deleteRow(-1); // Removes the "Add New Row Button"

        // Updates Assignment Type percentage grade
        getAssesmentTypeGrade(t);

        // Updates Course grade
        const course = t.parentElement;
        const elements = course.querySelector("ul").children;
        getCourseGrade(course, elements[1].querySelector("h5"), elements[3].querySelector("h6"));
    }

}

// Clears user data cells and adds input boxes
function enableInputTableData(rows, rowIndexStart){
    for(let r = rowIndexStart; r<rows.length-1; r++){
            let columns = rows[r].cells;
            for(let c = 0; c<(columns.length);c++){
                if(c==4){ // Replaces the "Total" column number with Delete Row button
                    const deleteRowButton = document.createElement("button");
                    deleteRowButton.classList.add("delete");
                    deleteRowButton.innerText = "×";

                    const row = rows[r];
                    columns[c].classList.add("clear");
                    deleteRowButton.onclick = () => row.remove();
                    
                    columns[c].innerText = ""; // Clears cell's text
                    columns[c].appendChild(deleteRowButton);
                }else{
                    const cw_c = document.createElement("input");
                    if (c==0){ // Creates text input box for "Title" column
                        cw_c.classList.add("tDTitle");
                        cw_c.type = "text";
                        cw_c.value = columns[c].innerText;
                        cw_c.placeholder = columns[c].innerText;
                    }else{ // Creates number input box for "Score", "Max", and "Bonus" columns
                        cw_c.classList.add("tData");
                        cw_c.type = "number";
                        cw_c.min = 0;

                        const currentVal = columns[c].innerText;
                        if(currentVal == "" || currentVal == undefined || currentVal == null) cw_c.value = -1; // Flags empty cells
                        else{
                            cw_c.value = Number(currentVal);
                            cw_c.placeholder = Number(currentVal);
                        }
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

    enableInputTableData(rows, rows.length-2); // Ensures last row is editable
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

// Enables and disables course edit mode
function updateCourse(courseID){
    const course = document.getElementById(courseID);
    const ul = course.querySelector("ul");
    const elements = ul.children;

    const button = elements[4].querySelector("button");

    if(button.innerText.includes("Edit")){
        button.innerText = "Save";
        
        // Creates and places Course name input box
        const courseName = document.createElement("input");
        courseName.classList.add("assignmentType");
        courseName.type = "text";
        courseName.value = elements[0].querySelector("h4").innerText;
        courseName.placeholder = elements[0].querySelector("h4").innerText;

        elements[0].querySelector("h4").innerText = ""
        elements[0].appendChild(courseName);

        // Creates a drop down menu for Categories
        const category = document.createElement("div");
        category.classList.add("category");

        const selectedOption = document.createElement("span");
        selectedOption.innerText = elements[2].innerText;

        category.appendChild(selectedOption);

        const categoryOptions = document.createElement("div");
        categoryOptions.classList.add("categoryOptions");

        for(let i = 0; i < courseCategories.length; i++){
            const option = document.createElement("a");
            option.href = "#";
            option.innerText = courseCategories[i];
            option.onclick = function (event) {
                event.preventDefault();
                selectedOption.innerText = option.innerText;
            } 
            categoryOptions.appendChild(option);
        }    
        
        category.appendChild(categoryOptions);
        elements[2].querySelector("h5").remove();
        elements[2].appendChild(category);

    }else if(button.innerText.includes("Save")){
        button.innerText = "✎ Edit";

        // Updates Course name
        elements[0].querySelector("h4").innerText = elements[0].querySelector("input").value;
        elements[0].querySelector("input").remove();

        // Updates Category
        const h5 = document.createElement("h5");
        const category = elements[2].querySelector("div");
        const selectedOption = category.querySelector("span");

        h5.innerText = selectedOption.innerText;
        category.remove();
        elements[2].appendChild(h5);
    }
}

// Calculates total course grade
function getCourseGrade(course, grade_percentage, grade_letter){
    const assignments = course.querySelectorAll("table");

    let grade = 0;

    for(let i = 0; i < assignments.length; i++){
        const points = getAssesmentTypeGrade(assignments[i]);
        if(typeof points == "number") grade+= points;
    }

    grade_percentage.innerText = grade.toFixed(0) + "%";

    if(grade>=90) grade_letter.innerText = "A";
    else if(grade>=80) grade_letter.innerText = "B";
    else if(grade>=70) grade_letter.innerText = "C";
    else if(grade>=60) grade_letter.innerText = "D";
    else grade_letter.innerText = "F";
}