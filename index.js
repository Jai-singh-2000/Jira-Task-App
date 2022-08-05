let addButton=document.querySelector('.add-btn');
let inputContainer=document.querySelector(".container");
let textAreaContainer=document.querySelector(".inputfield");
let ticketMainContainer=document.querySelector(".ticket-main");
let addFlag=true;
let allInputColors=document.querySelectorAll(".container-box");
let removeButton=document.querySelector(".remove-btn");
let removeFlag=false;
let trashIcon=document.querySelector(".fa-trash");
let colorsArr=['red','blue','orange','green'];
let priorityArr=['Urgent','To-do','Hold','Done'];
var uid = new ShortUniqueId();
let filterBox=document.querySelectorAll(".box")
let ticketArr=[];

loadLocalStorage();

function loadLocalStorage()
{
    if(localStorage.getItem("tickets"))
    {
        let strArr=localStorage.getItem("tickets");
        let parseArr=JSON.parse(strArr);
        ticketArr=parseArr;
        loadAllTickets(ticketArr);
    }
}


function loadAllTickets(arrayOfTickets)
{
    for(let i=0;i<arrayOfTickets.length;i++)
    {
        let oneTicket=arrayOfTickets[i];
        createTicket(oneTicket.task,oneTicket.color,oneTicket.id);
    }
}
 


function removeAllTickets()
{
    let oldTickets=document.querySelectorAll(".ticket-wrapper");
    for(let i=0;i<oldTickets.length;i++)
    {
        oldTickets[i].remove();
    }
}




//Show add container on add click
addButton.addEventListener('click',function(){
    if(addFlag)
    {
        inputContainer.style.display="flex";
    }else{
        inputContainer.style.display="none";
    }
    addFlag=!addFlag;
})




//Input box me enter pe 
inputContainer.addEventListener('keydown',function(e){
    let key=e.key;
    if(key=="Enter")
    {
        let active=document.querySelector(".active");//Select which class is active
        let color=active.classList[0];//Color is present in 0th position in that selected color div
        createTicket(textAreaContainer.value,color);
        textAreaContainer.value="";
        inputContainer.style.display="none";
        addFlag=!addFlag;
    }
})





//New ticket create karne ka Method
function createTicket(task,ticketColor,ticketId)
{
    let uniqueId=ticketId;
    if(uniqueId==undefined)
    {
        uniqueId=uid();
    }

    let priorityIdx=colorsArr.indexOf(ticketColor);//Find index of current color w
    
    let ticketContainer=document.createElement("div");
    ticketContainer.setAttribute("class","ticket-wrapper noselect")
    ticketContainer.innerHTML=`<div class="ticket-color ${ticketColor} "><p>${priorityArr[priorityIdx]}</p></div>
                                <div class="ticket-id"><p>${uniqueId}</p></div> 
                                <div class="task-area">${task}</div>
                                <div class="lock-unlock"><i class="fa fa-lock"></i></div>`

    ticketMainContainer.appendChild(ticketContainer);



    //Add event on every ticket of click if delete icon is active and then click to ticket, then it will automatically delete  
    ticketContainer.addEventListener('click',function(){
        let thisDivId=uniqueId;
        
        //If flag is true means it is active and red
        if(removeFlag)
        {
            ticketContainer.remove();
            
            //Remove from ticketArr
            ticketArr=ticketArr.filter((item)=>{
                return item.id!=thisDivId;
            })
            
            
            // Update local storage
            updateLocalStorage();;
        }
    })




     // Lock Unlock ke liye event 
     let lockUnlock=ticketContainer.querySelector(".lock-unlock i");
     lockUnlock.addEventListener('click',function(){
        
        let taskArea=ticketContainer.querySelector(".task-area");
        let thisDivId=uniqueId;

        if(lockUnlock.classList.contains("fa-lock"))
        {
            lockUnlock.classList.remove("fa-lock");
            lockUnlock.classList.add("fa-unlock");
            taskArea.setAttribute("contenteditable","true");
        }else{
            lockUnlock.classList.add("fa-lock");
            lockUnlock.classList.remove("fa-unlock");
            taskArea.removeAttribute("contenteditable");

            // When you lock again then you have to save your current task in ticketArr
            let myTicketIdx=findIndexOfTicketArrById(thisDivId);
            ticketArr[myTicketIdx].task=taskArea.textContent;

            // Update local storage
            updateLocalStorage();
        }

       


            
     })
 




    //Handle task Color || Priority
    let currentTicketColor=ticketContainer.querySelector(".ticket-color");//Select newly created ticket
    currentTicketColor.addEventListener('click',function()
    {
        let color=currentTicketColor.classList[1];
        let thisDivId=uniqueId;
        let index=colorsArr.indexOf(color); //Same work as colorIndex code above
        let nextIndex=(index+1)%colorsArr.length;
        

        //Update Ui
        currentTicketColor.classList.remove(color);
        currentTicketColor.classList.add(colorsArr[nextIndex]);

        let paragraph=currentTicketColor.querySelector('p');
        paragraph.innerText=priorityArr[nextIndex];


        //Update ticketArr as well
        
        let myticketIdx=findIndexOfTicketArrById(thisDivId);
        ticketArr[myticketIdx].color=colorsArr[nextIndex];

        // Update local storage
        updateLocalStorage();

    })



    if(ticketId==undefined)//If ticketId is not pass in createFunction Parameter means it is new ticket
    {

        let ticketObj={
            id:uniqueId,
            color:ticketColor,
            task:task
        }
        
        ticketArr.push(ticketObj);

        // Update local storage
        updateLocalStorage();
    }

}






//Container colors me active ke liye event 

 for(let i=0;i<allInputColors.length;i++)
 {  
    let currentInputColor=allInputColors[i];

    currentInputColor.addEventListener('click',function(){
        let activeBox=document.querySelector(".active"); //Find which one div is active
        activeBox.classList.remove("active");//Simply remove it
        currentInputColor.classList.add("active");//Add to current div
    })
 }






 //Remove button functionality

 removeButton.addEventListener("click",function(){
    if(removeFlag)//If flag true means button is already red (active )
    {
        trashIcon.style.color="black";//So make it false
    }else{
        trashIcon.style.color="red";
    }
    removeFlag=!removeFlag;

 })






 
//Filter Box functionality

for(let i=0;i<filterBox.length;i++)
{


   filterBox[i].addEventListener('click',function(){
       let currentFilterColor=filterBox[i].classList[1];       
       let filteredArr=ticketArr.filter((item)=>{
           return item.color==currentFilterColor;
       })
       
       removeAllTickets();
       loadAllTickets(filteredArr);
   })

   filterBox[i].addEventListener('dblclick',function(){
       removeAllTickets();
       loadAllTickets(ticketArr);
   })
}






//Functions 

function findIndexOfTicketArrById(yourId)
{
    let index=-1;
    for(let i=0;i<ticketArr.length;i++)
        {
            if(ticketArr[i].id==yourId)
            {
                index=i;
                break;
            }
        }
        return index;
}


function updateLocalStorage()
{
    localStorage.setItem("tickets",JSON.stringify(ticketArr));
}
