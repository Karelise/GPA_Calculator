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
    let assesmentTypeTotal = (accumulatedPoints/totalPointsPossible)*100;
    if(typeof assesmentTypeTotal == "number") table.rows[0].cells[2].innerText = assesmentTypeTotal.toFixed(1) + "%";
    else table.rows[0].cells[2].innerText = "";
    
    const aT_gradeWeight = Number(table.rows[0].cells[1].innerText.slice(0,-1))/100;

    return [assesmentTypeTotal,aT_gradeWeight]
}

// Enables and disables Edit Modes 
function updateTable(tableID, mode){
    let t = document.getElementById(tableID);

    if (mode == "edit"){ // Enters Edit Table Mode

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
        deleteTable.onclick = () => {t.remove();}
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
    } else if(mode == "save"){ // Disables Edit Mode

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
    const newRow = table.insertRow(rows.length-1); // Inserts a new row at the bottom

    // Adds 5 cells to the new row
    for(let r = 0; r<5; r++) newRow.insertCell(r);

    enableInputTableData(rows, rows.length-2); // Ensures last row is editable
}

// Creates an Assigment Type Table
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
    const h2_element_txts = ["Title", "Score", "Max","Bonus","Total"]

    for(let eNum = 0; eNum < h2_element_txts.length; eNum++){
        const h2_element = document.createElement("th");
        h2_element.innerText = h2_element_txts[eNum];
        h2.appendChild(h2_element);
    }

    // Adds table to section
    course.insertBefore(aT_table, course.lastElementChild);
    updateTable(aT_table.id, "edit")
}

// Enables and disables course edit mode
function updateCourse(courseID){
    const course = document.getElementById(courseID);
    const ul = course.querySelector("ul");
    const elements = ul.children;
    const button = elements[4];

    if(button.innerText.includes("Edit")){
        button.innerText = "Save";

        // Creates and places Course name input box
        const courseName = document.createElement("input");
        courseName.classList.add("assignmentType");
        courseName.type = "text";
        courseName.value = elements[0].innerText;
        courseName.placeholder = courseName.value;
        
        elements[0].innerText = ""
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
        elements[2].innerText = "";
        elements[2].appendChild(category);

        // Enters edit mode for all the present assignment type tables
        let courseTables = course.querySelectorAll("table");
        for(let a = 0; a < courseTables.length; a++){
            updateTable(courseTables[a].id, "edit")            
        }

        // Creates the add new table button
        let newAssigment_button = document.createElement("button");
        newAssigment_button.onclick = () => {createAssignmentType(courseID);}
        newAssigment_button.innerText = "+ Add Assignment Type"

        course.appendChild(newAssigment_button)

    }else if(button.innerText.includes("Save")){
        button.innerText = "✎ Edit";
        
        // Removes the new assigment type button
        course.lastElementChild.remove()

        // Updates Course name
        elements[0].innerText = elements[0].lastElementChild.value;

        // Updates Category
        const category = elements[2].lastElementChild;
        const selectedOption = category.querySelector("span");

        elements[2].innerText = selectedOption.innerText;

        // Updates assignment tables
        let assignments = course.querySelectorAll("table");
        let grades_weights = [];
        for(let b = 0; b < assignments.length; b++){
            updateTable(assignments[b].id, "save")
            grades_weights.push(getAssesmentTypeGrade(assignments[b]))
        }
        
        // Updates Percentage and Letter grades 
        let grades = getCourseGrades(grades_weights);
        
        elements[1].innerText = grades[0].toFixed(1) + "%";
        elements[3].innerText = grades[1];
    }
}

// Calculates course percentage and assignings grade letter
function getCourseGrades(g_w){
    // Validades grades available and calculates max points possible
    let maxPointsPossible = 0;
    for(let r = 0; r<g_w.length;r++){
        if(Number.isFinite(g_w[r][0]) && Number.isFinite(g_w[r][1])) maxPointsPossible += g_w[r][1];
        else{
            g_w.splice(r,1);
            r--;
    }}

    // Calculates the current grade in percent
    let gradeInPercent = 0
    for(let r = 0; r<g_w.length;r++){
        gradeInPercent+= (g_w[r][0]*(g_w[r][1]/maxPointsPossible))
    }

    // Assigns the grade letter
    let gradeInLetter = "---"
    if(gradeInPercent>=90) gradeInLetter = "A";
    else if(gradeInPercent>=80) gradeInLetter = "B";
    else if(gradeInPercent>=70) gradeInLetter = "C";
    else if(gradeInPercent>=60) gradeInLetter = "D";
    else if(gradeInPercent<=50) gradeInLetter = "F";

    return [gradeInPercent, gradeInLetter];
}

// Adds a new course section
function createCourse(semesterID){
    let semester = document.getElementById(semesterID);

    // Creates the course section
    let course = document.createElement("section")
    course.classList.add("course")
    // Finds the course's ID number
    let allCourses = semester.querySelectorAll("section")
    let courseNum = maxIDLastNum(allCourses)+1;
    course.id = semester.id+"c"+courseNum;

    // Creates the unordered list that acts as the course's header
    let ul = document.createElement("ul");

    let courseName = document.createElement("h4");
    courseName.innerText = "Course Name";

    let coursePercentage = document.createElement("h5");
    coursePercentage.innerText = "00.0%"

    let courseCategory = document.createElement("h5");
    courseCategory.innerText = "Category";

    let courseLetter =document.createElement("h6");
    courseLetter.innerText = "---";

    let courseEditButton = document.createElement("button");
    courseEditButton.innerText = "✎ Edit";
    courseEditButton.onclick = ()  => {updateCourse(course.id)}

    ul.appendChild(courseName);
    ul.appendChild(coursePercentage);
    ul.appendChild(courseCategory);
    ul.appendChild(courseLetter);
    ul.appendChild(courseEditButton);

    course.appendChild(ul);
    semester.insertBefore(course, semester.lastElementChild)

    // Enters edit mode by default with an empty table
    updateCourse(course.id);
    createAssignmentType(course.id);
}

// Helper function that finds the max last number in the ids
function maxIDLastNum(elements){
    let max = 1; // Default

    for(let i = 0; i < elements.length; i++){
        const id = elements[i].id; 

        if(typeof id !== "string") continue; // Ensures an id was found

        // Gathers the id's last number
        let lastNum = "";
        for(let j=id.length-1; j>0; j--){
            if(Number.isFinite(Number(id[j]))) lastNum= id[j]+lastNum;
            else j = -1; // Character was found, last number is complete 
        }

        if(max < Number(lastNum)) max = Number(lastNum);
    }
    return max;
}