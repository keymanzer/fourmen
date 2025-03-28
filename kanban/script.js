document.addEventListener("DOMContentLoaded", function () {
  const columns = document.querySelectorAll(".kanban-column");

  columns.forEach((column) => {
    new Sortable(column, {
      group: "kanban",
      animation: 150,
      draggable: ".kanban-item",
      handle: ".kanban-item", // 드래그 핸들
    });
  });

  // 초기 아이템에 삭제 버튼 이벤트 리스너
  setupDeleteButtons();

  // 체크박스 이벤트 리스너
  document.querySelectorAll(".checkbox").forEach((checkbox) => {
    checkbox.addEventListener("change", function () {
      const item = checkbox.closest(".kanban-item");
      if (checkbox.checked) {
        item.classList.add("checked"); // 체크된 항목에 줄 긋기
      } else {
        item.classList.remove("checked"); // 체크 해제 시 줄 제거
      }
    });
  });
});

// 아이템 추가 함수 (모달에서 호출)
function openModal(columnId) {
  document.getElementById("modal").style.display = "flex";
  document.getElementById("modal-input").setAttribute("data-column", columnId);
}

function closeModal() {
  document.getElementById("modal").style.display = "none";
}

// 모달 외부 클릭 시 모달 닫기
document.getElementById("modal").addEventListener("click", function (e) {
  if (e.target === document.getElementById("modal")) {
    closeModal();
  }
});

function addItemFromModal() {
  const columnId = document
    .getElementById("modal-input")
    .getAttribute("data-column");
  const itemText = document.getElementById("modal-input").value.trim();

  // 유효성 검사: 빈 문자열로 아이템 추가 방지
  if (!itemText) {
    alert("아이템을 입력해주세요!");
    return;
  }

  const newItem = document.createElement("div");
  newItem.classList.add("kanban-item");
  newItem.innerHTML = `<input type="checkbox" class="checkbox"> ${itemText} <button class="delete-btn">삭제</button>`;

  // 새 아이템에 삭제 버튼 이벤트 리스너와 체크박스 이벤트 리스너를 추가
  setupDeleteButtons(newItem);
  setupCheckbox(newItem);

  document.getElementById(columnId).appendChild(newItem);
  closeModal();
}

// 삭제 버튼 이벤트 리스너를 설정하는 함수
function setupDeleteButtons(item = null) {
  const items = item ? [item] : document.querySelectorAll(".kanban-item");
  items.forEach((item) => {
    const deleteBtn = item.querySelector(".delete-btn");
    item.addEventListener("mouseenter", function () {
      deleteBtn.style.display = "inline-block"; // 마우스가 올라오면 삭제 버튼 보이기
    });
    item.addEventListener("mouseleave", function () {
      deleteBtn.style.display = "none"; // 마우스가 벗어나면 삭제 버튼 숨기기
    });
    deleteBtn.addEventListener("click", function () {
      item.remove();
    });
  });
}

// 체크박스 이벤트 리스너를 설정하는 함수
function setupCheckbox(item) {
  const checkbox = item.querySelector(".checkbox");
  checkbox.addEventListener("change", function () {
    if (checkbox.checked) {
      item.classList.add("checked"); // 체크된 항목에 줄 긋기
    } else {
      item.classList.remove("checked"); // 체크 해제 시 줄 제거
    }
  });
}
