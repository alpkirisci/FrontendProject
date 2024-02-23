let lists = loadListsFromStorage()
let tasks = [{name:"",status:false}];
let curList;

var members = [
    {name:"Ahmet Selim Alpkirişçi",
    section:"02",
    id:"22203143",
    img:"img/selim.jpg",},
    {name:"Ali Ekin Bozay",
    section:"02",
    id:"22101797",
    img:"img/ekin.jpg",},
    {name:"Orhan Demir Demiröz",
    section:"02",
    id:"22201654",
    img:"img/demir.jpg",},
    {name:"Yiğithan Özyurt",
    section:"02",
    id:"22102271",
    img:"img/yigithan.jpg"}
]

$(function(){
    //window.alert("starting jq parts")
    
    //displaying the members via foreach
    members.forEach(function(mem){
        $("#membersPage ul").append(`
        <li>
            <div class="floatingHead">
                <img class="userIcon" src="${mem.img}" alt="">
                <div>
                    <h3>${mem.name}</h3>
                    <h3>Section: ${mem.section}</h3>
                    <h3>${mem.id}</h3>
                </div>
            </div>
        </li>`);
    });

    renderAllLists();

    //opening the project members version of the #main div
    $("#membersLink").on("click",function(){
        $("#main").html(`
        <div id="membersPage">
            <div id="membersHeader"><i class="fa-regular fa-star"></i><span>Project Members</span></div>
            <ul>
            </ul>
        </div>`);

    members.forEach(function(mem){
        $("#membersPage ul").append(`
        <li>
            <div class="floatingHead">
                <img class="userIcon" src="${mem.img}" alt="">
                <div>
                    <h3>${mem.name}</h3>
                    <h3>Section: ${mem.section}</h3>
                    <h3>${mem.id}</h3>
                </div>
            </div>
        </li>`);
    });
    //adding left blue border
    $(".chosen").removeClass("chosen");

    $("#membersLink").addClass("chosen");


    $("#main").removeClass("listChosen");
    $("#main").addClass("mainMembersChosen");


    });


    $(document).on("click", ".listClass" ,function(event){
        event.stopPropagation();
        event.stopImmediatePropagation();
        //console.log(this);
        $(".chosen").removeClass("chosen");
        $(this).addClass("chosen");
        let listName = $(this).children("span").text();
        //console.log($(this).children("span").text());
        lists.forEach(function(i){
            //console.log(i);
            if(listName === i.name){
                openListPage(i);
                curList = i;
            }
        });
        renderTasks(curList);
    });

    $(document).on("click", "#tasksDiv li" ,function(event){
        event.stopPropagation();
        event.stopImmediatePropagation();

        let searcher = $(this).text()
        let stats;
        let inp = $(this);
        //console.log(searcher)
        curList.tasks.forEach(function(i){
            // console.log($(this).text());
            // console.log(i.name);
            if (i.name === searcher){
                i.status = !(i.status);
                stats = i.status;
            }
            if(i.status == true)
                $(inp).addClass("chosenTask");
            else
                $(inp).removeClass("chosenTask");

        });

        $(this).children("input").attr("checked", stats)
        console.log($(this).children("input"));
        saveAllLists();
        taskChecker(curList);
    });



    $(document).on("click", ".fa-trash", function(event){
        event.stopPropagation();
        event.stopImmediatePropagation();
        let listName = $(this).parent("span").text();

        if ($(this).parent().parent().hasClass("chosen"))
            openMembers();


        $(this).parent().parent().remove();
        lists.forEach(function(i){
            console.log(i.name);
            if(listName === i.name){
                lists.splice(lists.indexOf(i),1);
                localStorage.removeItem(i);
            }
        });
        saveAllLists();

    });


    $(document).on("keypress", "#taskInput", function(e){
        e.stopPropagation();
        e.stopImmediatePropagation();
        if(e.which===13){
            console.log(curList.tasks);
            let namee = $("#taskInput").val();
            let statuss = false;
            curList.tasks.push({name:namee,status:statuss});
            saveAllLists();
            renderTasks(curList);
            $("#taskInput").val("");
        }


    });

    $("#cancelList").on("click",function(){
        $("#popList").addClass("displayNone");
        $("#popListBack").addClass("displayNone");

        //console.log(this);
    });

    $("#newList").on("click", function(){
        $("#popList").removeClass("displayNone");
        $("#popListBack").removeClass("displayNone");
        $("#listInput").val("").focus();
    });

    $("#createList").on("click", function(){


        if ($("#listInput").val() === "")
            window.alert("Please enter a task name.")
        else{
            let namee = $("#listInput").val();
            let newList = {name:namee,tasks:[]};
            lists.push(newList);
            openListPage(newList);
            renderList(newList);
            $("#popList").addClass("displayNone");
            $("#popListBack").addClass("displayNone");
            $("#taskInput").val("").focus();
            curList = newList;

        }
        saveAllLists();
    });

    
});

function taskChecker(){
    $("#tasksDiv li").each(function(i){
        let searcher = $(this).text()
        let inp = $(this);
        curList.tasks.forEach(function(i){
            if (i.name === searcher){
                $(inp).children("input").attr("checked", i.status);
                if(i.status == true)
                    $(inp).addClass("chosenTask");
                else
                    $(inp).removeClass("chosenTask");
            }       
        });

    })

};

function renderTasks(listt){
    $("#tasksDiv>ul").html("");
    listt.tasks.forEach(function(i){
        //console.log(i);
        $("#tasksDiv>ul").append(`<li><input type="checkbox" name="" id="">${i.name}</li>`);
    });

    taskChecker();

}


function renderAllLists(){
    for (let t of lists){
        renderList(t)
    }
    $(".chosen").removeClass("chosen");
    $("#membersLink").addClass("chosen");

}

function loadListsFromStorage(){
    let data = localStorage.getItem("lists")  // null if tasks is not availabe.
    return data ? JSON.parse(data) : [] 
}

function renderList(list){
    $(".chosen").removeClass("chosen");
    $("#newList").before(`<div class="listClass chosen"><i class="fa-solid fa-bars"></i><span>${list.name}<i class="fa fa-trash" aria-hidden="true"></i></span></div>`);
}

function openListPage(list){
    $("#main").addClass("listChosen");
    $("#main").removeClass("mainMembersChosen");
    $("#main").html(`        <h3>${list.name}</h3>
    <div id="tasksDiv">
        <ul></ul>
    </div>
    <div id="addTask">
        <input type="text" id="taskInput"><i class="fa-solid fa-plus"></i>
    </div>`);
}

function openMembers(){
        $("#main").html(`
        <div id="membersPage">
            <div id="membersHeader"><i class="fa-regular fa-star"></i><span>Project Members</span></div>
            <ul>
            </ul>
        </div>`);

    members.forEach(function(mem){
        $("#membersPage ul").append(`
        <li>
            <div class="floatingHead">
                <img class="userIcon" src="/img/selim.jpg" alt="">
                <div>
                    <h3>${mem.name}</h3>
                    <h3>Section: ${mem.section}</h3>
                    <h3>${mem.id}</h3>
                </div>
            </div>
        </li>`);
    });
    //adding left blue border
    $(".chosen").removeClass("chosen");

    $("#membersLink").addClass("chosen");


    $("#main").removeClass("listChosen");
    $("#main").addClass("mainMembersChosen");


}

function saveAllLists(){
    localStorage.setItem("lists", JSON.stringify(lists));
}