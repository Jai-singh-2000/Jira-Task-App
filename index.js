let add=document.querySelector(".add-btn");
let remove=document.querySelector(".remove-btn");
let trashIcon=document.querySelector(".fa-trash");
let container=document.querySelector(".container");
let input=document.querySelector(".inputfield");
let ticketMain=document.querySelector(".ticket-main");
let toolBox=document.querySelectorAll(".tool-down .box")
let insertTool=document.querySelectorAll(".container-box");
let ticketWrapper=document.querySelectorAll(".ticket-wrapper");
let flag=true;
let deleteFlag=false;
let selectFlag=true;



// color and status array and default color is red, default status is Urgent

let allColors=["red","blue","orange","green"];
let allStatus=["Urgent","To-do","Hold","Done"];
let currStatus=allStatus[0];
let inputColor=allColors[0];

//task ticket delete event listener

for(let i=0;i<ticketWrapper.length;i++)
{
    ticketWrapper[i].addEventListener('click',function(){
        if(deleteFlag==true)
        {
            console.log(ticketWrapper[i]);
            ticketWrapper[i].remove();
        }

    })
}



//Remove icon functionality

remove.addEventListener("click",function(){
    if(deleteFlag)
    {
        trashIcon.style.color="black";
    }else{
        trashIcon.style.color="red";
    }

    deleteFlag=!deleteFlag;
   
})



//Show or hide container
 
add.addEventListener("click",function(){
    if(flag)
    {
        container.style.display="flex";
    }else{
        container.style.display="none";
    }   
    flag=!flag;
})



//Select color at time of inserting

for(let i=0;i<insertTool.length;i++)
{
    insertTool[i].addEventListener('click',function(){
        for(let j=0;j<insertTool.length;j++)
        {
            insertTool[j].classList.remove("active");
        }
        insertTool[i].classList.add("active");
        
        inputColor=insertTool[i].classList[0];
        let colorIndex=-1;
        for(let i=0;i<allColors.length;i++)
        {
            if(inputColor==allColors[i])
            {
                colorIndex=i;
                break;
            }
        }

        currStatus=allStatus[colorIndex];
    })   
}




// Make new Ticket

container.addEventListener('keydown',function(e){
    let key=e.key;
    if(key=='Enter'){
        createTicket(input.value,inputColor);
        input.value = ""; 
        container.style.display="none";
        flag=!flag;
    }


})


function createTicket(task,ticketColor,ticketId,ticketStatus){
    if(task==undefined||task=="")
    {
        return;
    }
    
    let uniqueId;
    if(ticketId==undefined)
    {
        uniqueId=uid();
    }else{
        uniqueId=ticketId;
    }

    if(ticketStatus==undefined)
    {
        ticketStatus=currStatus;
    }

    let ticketCont = document.createElement("div");
    ticketCont.setAttribute('class','ticket-wrapper');
    ticketCont.innerHTML = `<div class="noselect ticket-color ${ticketColor}" ><p>${ticketStatus}</p></div>
                    <div class="ticket-id"><p>${uniqueId}</p></div>
                    <div class="task-area">${task}</div>
                    <div class="lock-unlock"><i class="fa fa-lock"></i></div>`;

    ticketMain.appendChild(ticketCont);

    //Save Ticket Details
    if(ticketId==undefined)
    {
        let obj={
            "color":ticketColor,
            "id":uniqueId,
            "task":task,
            "status":ticketStatus
        }
        
        ticketDetails.push(obj);
        //  console.log(ticketDetails);

        updateLocalStorage(ticketDetails);
        
    }


     //Lock unlock feature
     let lock=ticketCont.querySelector(".lock-unlock i");
     let textArea=ticketCont.querySelector(".task-area");
     lock.addEventListener("click",function(){
        console.log(lock.classList[1]);
        
        if(lock.classList[1]=="fa-lock")
        {
            lock.classList.remove("fa-lock");
            lock.classList.add("fa-unlock");
            
            textArea.setAttribute("contenteditable","true");

        }else{
            lock.classList.remove("fa-unlock");
            lock.classList.add("fa-lock");
            
            textArea.setAttribute("contenteditable","false");
        }
        
        
        let index=getTicketByIndex(uniqueId);
        ticketDetails[index].task=textArea.textContent;

        updateLocalStorage(ticketDetails)
     })


    //delete ticket container event listener apply on every ticker container at the time of formation
    ticketCont.addEventListener('click',function(){
        if(deleteFlag==true)
        {
            // console.log(ticketCont);
            ticketCont.remove();

            let index=getTicketByIndex(uniqueId);
            ticketDetails.splice(index,1); 

            //take whole ticket array and store it on local storage
            updateLocalStorage(ticketDetails)
        }

    })



    //Change color of ticket container 

    let ticketColorBand=ticketCont.querySelector(".ticket-color");

    ticketColorBand.addEventListener("click",function(){
        let color=ticketColorBand.classList[2];

        let pos=-1;
        for(let i=0;i<allColors.length;i++)
        {
            if(color==allColors[i])
            {
                pos=i;
                break;
            }
        }
    
        ticketColorBand.classList.remove(color);
        
        
        pos=(pos+1)%allColors.length;
        ticketColorBand.classList.add(allColors[pos]);

        console.log(allColors[pos])
        
        //change color in array 
        let index=getTicketByIndex(uniqueId);
        ticketDetails[index].color=allColors[pos];
        ticketDetails[index].status=allStatus[pos];

        //change on desktop status by dom manupulation
        ticketColorBand.childNodes[0].textContent=allStatus[pos];
        updateLocalStorage(ticketDetails)

    })


    //Get ticket index of that unique id
    function getTicketByIndex(uniqueId)
    {
        for(let i=0;i<ticketDetails.length;i++)
        {
            if(ticketDetails[i].id==uniqueId)
            {
                return i;
            }
        }
    }
    

    //Update new data to local storage
    function updateLocalStorage(ticketDetails)
    {
        let stringifyTicketsArr=JSON.stringify(ticketDetails);
        localStorage.setItem("tickets",stringifyTicketsArr);
    }

}



//Select all one type of task filter out selective color tasks

for(let i=0;i<toolBox.length;i++)
{
    toolBox[i].addEventListener("click",function(){

        let allTickets=document.querySelectorAll(".ticket-wrapper");
        let currentColor=toolBox[i].classList[1];
        let newFilteredArray=[];
        
            //push same color task objects into newFilter Array
            for(let i=0;i<ticketDetails.length;i++)
            {
                if(ticketDetails[i].color==currentColor)
                {
                    newFilteredArray.push(ticketDetails[i]);
                }
            }
            
            //remove all visible desktop tickets
            for(let i=0;i<allTickets.length;i++)
            {
                allTickets[i].remove();
            }
    
            
            for(let i=0;i<newFilteredArray.length;i++)
            {
                createTicket(newFilteredArray[i].task,newFilteredArray[i].color,newFilteredArray[i].id,newFilteredArray[i].status);
                
            }
            console.log(newFilteredArray);

    })

    toolBox[i].addEventListener("dblclick",function()
    {
        let allTickets=document.querySelectorAll(".ticket-wrapper");
        
        for(let i=0;i<allTickets.length;i++)
        {
            allTickets[i].remove();
        }
        
        for(let i=0;i<ticketDetails.length;i++)
        {
        createTicket(ticketDetails[i].task,ticketDetails[i].color,ticketDetails[i].id,ticketDetails[i].status);
        }
    
    })
    
 


}



//Add tickets from localStorage

var uid = new ShortUniqueId();

// let ticketDetails=[{
//     "color":"red",
//     "id":"lksdflk",
//     "task":"This is a one",
//      "status":"Urgent"
// }];

let ticketDetails=[];

if(localStorage.getItem("tickets"))
{

    let stringArr=localStorage.getItem("tickets");
    let arr=JSON.parse(stringArr);
    ticketDetails=arr;

    for(let i=0;i<ticketDetails.length;i++)
    {
    createTicket(ticketDetails[i].task,ticketDetails[i].color,ticketDetails[i].id,ticketDetails[i].status);
    }

}
