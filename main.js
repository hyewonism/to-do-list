// 유저가 값을 입력한다
// +버튼을 클릭하면, 할일이 추가된다
// delete버튼을 누르면 할일이 삭제된다
// check 버튼을 누르면 할일이 끝나면서 밑줄이 간다
//1. check 버튼을 클릭하는 순간 true false
//2. true이면 끝난걸로 간주하고 밑줄 보여주기
//3. false이면 안끝난걸로 간주하고 그대로
// 진행 중 끝남 탭을 누르면, 언더바가 이동한다
// 끝남 탭은, 끝난 아이템만, 진행중탭은 진행중인 아이템만 나온다
// 전체 탭을 누르면 다시 전체 아이템으로 돌아옴

let taskInput = document.getElementById("task-input");
let addButton = document.getElementById("add-button");
let tabs = document.querySelectorAll(".task-tabs div");
let underLine = document.getElementById("under-line");
let underLineMenu = document.querySelectorAll(".task-tabs div");
let taskList = [];
let mode = "all";
let filterList = [];

addButton.addEventListener("click", addTask);

underLineMenu.forEach((menu) =>
  menu.addEventListener("click", (e) => underLineIndicator(e))
);

function underLineIndicator(e) {
  underLine.style.left = e.currentTarget.offsetLeft + "px";
  underLine.style.width = e.currentTarget.offsetWidth + "px";
  underLine.style.top =
    e.currentTarget.offsetTop + e.currentTarget.offsetHeight + "px";
}

for (let i = 1; i < tabs.length; i++) {
  tabs[i].addEventListener("click", function (event) {
    filter(event);
  });
}

taskInput.addEventListener("keydown", function (event) {
  // 엔터 키 (키 코드 13)가 눌렸을 때 addTask 함수 호출
  if (event.keyCode === 13) {
    addTask();
  }
});

function addTask() {
  const inputValue = taskInput.value.trim();
  if (inputValue === "") {
    // 빈 값이면 알림창 띄우고 함수 종료
    alert("기록하고 싶은 일을 입력하세요.");
    return;
  }
  let task = {
    id: randomIDGenerate(),
    taskContent: taskInput.value,
    isComplete: false,
  };
  taskList.push(task);
  render();

  taskInput.value = "";
  taskInput.placeholder = "📓 해야할 일 기록하기";
}

function render() {
  let list = [];

  if (mode === "all") {
    list = taskList;
  } else if (mode === "ongoing" || mode === "done") {
    list = filterList;
  }

  let resultHTML = "";
  for (let i = 0; i < list.length; i++) {
    if (list[i].isComplete == true) {
      resultHTML += `<div class="task">
        <div class="task-done">${list[i].taskContent}</div>
        <div class="btn-area">
            <i class="fas fa-square-caret-left refresh-btn" onClick="refreshTask('${list[i].id}')"></i>
            <i class="far fa-minus-square delete-btn" onClick="deleteTask('${list[i].id}')"></i>
        </div>
      </div>`;
    } else {
      resultHTML += `<div class="task">
            <div>${list[i].taskContent}</div>
            <div class="btn-area">
              <i class="far fa-check-square check-btn" onClick="toggleComplete('${list[i].id}')"></i>
              <i class="far fa-minus-square delete-btn" onClick="deleteTask('${list[i].id}')"></i>
            </div>
          </div>`;
    }
  }
  document.getElementById("task-board").innerHTML = resultHTML;

  updateTabCounts(); // 탭 옆에 갯수 업데이트
}

function updateTabCounts() {
  let allCount = taskList.length;
  let ongoingCount = taskList.filter((task) => !task.isComplete).length;
  let doneCount = taskList.filter((task) => task.isComplete).length;

  document.getElementById("all").textContent = `전체(${allCount})`;
  document.getElementById("ongoing").textContent = `진행 중(${ongoingCount})`;
  document.getElementById("done").textContent = `완료(${doneCount})`;
}

function toggleComplete(id) {
  for (let i = 0; i < taskList.length; i++) {
    if (taskList[i].id === id) {
      taskList[i].isComplete = !taskList[i].isComplete;

      if (mode === "ongoing") {
        filterList = filterList.filter((task) => task.id !== id);
        if (!taskList[i].isComplete) {
          filterList.push(taskList[i]);
        }
      }

      break;
    }
  }
  render();
}

function deleteTask(id) {
  let isConfirmed = window.confirm("정말 삭제하시겠습니까?");

  if (isConfirmed) {
    for (let i = 0; i < taskList.length; i++) {
      if (taskList[i].id == id) {
        taskList.splice(i, 1);
        break;
      }
    }

    filterList = filterList.filter((task) => task.id !== id);

    render();
  }
}

function filter(event) {
  mode = event.target.id;
  filterList = [];

  if (mode === "all") {
    render();
  } else if (mode === "ongoing") {
    for (let i = 0; i < taskList.length; i++) {
      if (taskList[i].isComplete === false) {
        filterList.push(taskList[i]);
      }
    }
    render();
  } else if (mode === "done") {
    for (let i = 0; i < taskList.length; i++) {
      if (taskList[i].isComplete === true) {
        filterList.push(taskList[i]);
      }
    }
    render();
  }
}

function randomIDGenerate() {
  return "_" + Math.random().toString(36).substr(2, 9);
}

function refreshTask(id) {
  for (let i = 0; i < taskList.length; i++) {
    if (taskList[i].id === id) {
      taskList[i].isComplete = false; // 취소선 제거
      render();

      break;
    }
  }
}
