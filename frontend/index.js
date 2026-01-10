
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

    //Updates Total Points Accumulated percentage
    let assesmentTypeTotal = accumulatedPoints/totalPointsPossible*100;
    table.rows[0].cells[2].innerText = assesmentTypeTotal.toFixed(1) + "%"
}

function updateTable(tableID, buttonID){
    let t = document.getElementById(tableID);
    let b = document.getElementById(buttonID);

    if (b.innerText == "Edit Table"){
        b.innerText = "Save Changes";

        // Turns Assignment Type text into an input box
        // Creates a text input box
        const cw_name = document.createElement("input");
        cw_name.classList.add("assignmentType")
        cw_name.type = "text";
        cw_name.value = t.rows[0].cells[0].innerText;
        cw_name.placeholder = t.rows[0].cells[0].innerText
        // Inserts the input box into the given cell
        t.rows[0].cells[0].innerText = "";
        t.rows[0].cells[0].appendChild(cw_name);

        // Turns Weight in Grade into a number input box
        // Creates a number input box
        const cw_weight = document.createElement("input");
        cw_weight.classList.add("weight");
        cw_weight.type = "number";
        cw_weight.value = Number(t.rows[0].cells[1].innerText.slice(0,-1));
        cw_weight.placeholder == Number(t.rows[0].cells[1].innerText.slice(0,-1));
        cw_weight.width = 40;

        t.rows[0].cells[1].innerText = "";
        t.rows[0].cells[1].appendChild(cw_weight)

        // Turns table's data cells into number input boxes
        let rows = t.rows;
        for(let r = 2; r<rows.length; r++){
            let columns = rows[r].cells;
            for(let c = 0; c<(columns.length)-1;c++){
                const cw_c = document.createElement("input");
                if (c==0){
                    cw_c.classList.add("tDTitle")
                    cw_c.type = "text";
                    cw_c.value =columns[c].innerText;
                    cw_c.placeholder =columns[c].innerText;

                    columns[c].innerText = "";
                    columns[c].appendChild(cw_c);

                }else{
                    cw_c.classList.add("tData")
                    cw_c.type = "number";
                    cw_c.value = Number(columns[c].innerText);
                    cw_c.placeholder = Number(columns[c].innerText);

                    columns[c].innerText = "";
                    columns[c].appendChild(cw_c);
                }
            }
        }

    }
    else if(b.innerText == "Save Changes"){
        b.innerText = "Edit Table";

        // Updates Assigment Type
        cw_name = t.rows[0].cells[0].querySelector("input");
        t.rows[0].cells[0].innerText = cw_name.value;

        // Updates Weight in Grade
        cw_weight = t.rows[0].cells[1].querySelector("input");
        t.rows[0].cells[1].innerText = cw_weight.value + "%";

        rows = t.rows;
        for(let r = 2; r<rows.length; r++){
            let columns = rows[r].cells;
            for(let c = 0; c<columns.length-1;c++){
                cw_c = columns[c].querySelector("input");
                columns[c].innerText =  cw_c.value;
            }
        } 

        getAssesmentTypeGrade(tableID)
    }

}

