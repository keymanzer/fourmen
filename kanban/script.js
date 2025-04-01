document.addEventListener("DOMContentLoaded", function () {
  loadFromLocalStorage(); // 로컬스토리지에서 불러오기

  const columns = document.querySelectorAll(".kanban-column");

  columns.forEach((column) => {
    new Sortable(column, {
      group: "kanban",
      animation: 150,
      draggable: ".kanban-item",
      handle: ".kanban-item",
      onEnd: saveToLocalStorage, // 드래그 후 저장
    });
  });

  // 기존 아이템 이벤트 설정
  setupDeleteButtons();
  setupAllCheckboxes();
});

// 모달 열기
function openModal(columnId) {
  document.getElementById("modal").style.display = "flex";
  document.getElementById("modal-input").setAttribute("data-column", columnId);
}

// 모달 닫기
function closeModal() {
  document.getElementById("modal").style.display = "none";
  document.getElementById("modal-input").value = "";
}

// 모달 바깥 클릭 시 닫기
document.getElementById("modal").addEventListener("click", function (e) {
  if (e.target === document.getElementById("modal")) {
    closeModal();
  }
});

// 모달에서 아이템 추가
function addItemFromModal() {
  const columnId = document
    .getElementById("modal-input")
    .getAttribute("data-column");
  const itemText = document.getElementById("modal-input").value.trim();

  if (!itemText) {
    alert("아이템을 입력해주세요!");
    return;
  }

  const newItem = createKanbanItem(itemText);
  document.getElementById(columnId).appendChild(newItem);
  saveToLocalStorage();
  closeModal();
}

// 아이템 생성 함수
function createKanbanItem(text, checked = false) {
  const newItem = document.createElement("div");
  newItem.classList.add("kanban-item");
  newItem.innerHTML = `<input type="checkbox" class="checkbox" ${
    checked ? "checked" : ""
  }> ${text} <button class="delete-btn">삭제</button>`;

  if (checked) {
    newItem.classList.add("checked");
  }

  setupDeleteButtons(newItem);
  setupCheckbox(newItem);

  return newItem;
}

// 삭제 버튼 설정
function setupDeleteButtons(item = null) {
  const items = item ? [item] : document.querySelectorAll(".kanban-item");

  items.forEach((item) => {
    const deleteBtn = item.querySelector(".delete-btn");

    item.addEventListener("mouseenter", function () {
      deleteBtn.style.display = "inline-block";
    });

    item.addEventListener("mouseleave", function () {
      deleteBtn.style.display = "none";
    });

    deleteBtn.addEventListener("click", function () {
      item.remove();
      saveToLocalStorage();
    });
  });
}

// 체크박스 설정
function setupCheckbox(item) {
  const checkbox = item.querySelector(".checkbox");

  checkbox.addEventListener("change", function () {
    if (checkbox.checked) {
      item.classList.add("checked");
    } else {
      item.classList.remove("checked");
    }
    saveToLocalStorage();
  });
}

// 모든 기존 체크박스에 이벤트 추가
function setupAllCheckboxes() {
  document.querySelectorAll(".kanban-item").forEach((item) => {
    setupCheckbox(item);
  });
}

// 로컬스토리지에 저장
function saveToLocalStorage() {
  const data = {};

  document.querySelectorAll(".kanban-column").forEach((column) => {
    const columnId = column.id;
    const items = [];

    column.querySelectorAll(".kanban-item").forEach((item) => {
      const checkbox = item.querySelector(".checkbox");
      const text = item.childNodes[1].textContent.trim();
      items.push({
        text: text,
        checked: checkbox.checked,
      });
    });

    data[columnId] = items;
  });

  localStorage.setItem("kanbanData", JSON.stringify(data));
}

// 로컬스토리지에서 불러오기
function loadFromLocalStorage() {
  let saved = localStorage.getItem("kanbanData");

  if (!saved) {
    // 기본 데이터 설정
    saved = JSON.stringify({
      "to-do": [
        { text: "할일 1", checked: false },
        { text: "할일 2", checked: false },
      ],
      "in-progress": [{ text: "할일 3", checked: false }],
      done: [{ text: "할일 4", checked: false }],
    });

    localStorage.setItem("kanbanData", saved);
  }

  const data = JSON.parse(saved);

  Object.keys(data).forEach((columnId) => {
    const column = document.getElementById(columnId);
    column.querySelectorAll(".kanban-item").forEach((item) => item.remove());

    data[columnId].forEach(({ text, checked }) => {
      const newItem = createKanbanItem(text, checked);
      column.appendChild(newItem);
    });
  });
}
