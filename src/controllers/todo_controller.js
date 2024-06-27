import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = ["description", "show", "mainButton", "span", "entity"];

  initialize() {
    this.tasks = [];
  }
  connect() {}

  listenEvent(event) {
    if (event.key === "Enter") {
      this.mainButtonTarget.click();
    }
  }

  addTask() {
    const taskHtml = `
      <span data-action="click->todo#edit" data-todo-target="span" class="pt-2" >${this.description}</span>
      <div>
      <button data-action="todo#completed" class="text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm p-2 text-center me-2 mb-2 mt-1">Completed</button>
      <button data-action="todo#delete" class="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm p-2 text-center me-2 mb-2">Delete</button>
      </div>
      `;
    this.tasks.unshift(taskHtml);
    this.descriptionTarget.value = "";
    this.updateShowTarget();
  }

  delete(event) {
    const parent = event.target.closest("[data-todo-target]");
    console.log(parent);
    const index = parseInt(parent.getAttribute("index"), 10);
    console.log(index);
    this.tasks.splice(index, 1);
    this.updateShowTarget();
  }

  completed(event) {
    // const parent = event.target.parentElement;
    // const index = parent.value;
    // const spanElement = parent.querySelector("span");
    const parent = event.target.closest('[data-todo-target="entity"]');
    const index = parseInt(parent.getAttribute("index"), 10);
    console.log(index);
    const spanElement = parent.querySelector("span");
    console.log(spanElement);

    spanElement.innerHTML = `<del class="mt-2">${spanElement.textContent}</del>`;

    const taskHtml = `
      <del class="pt-2" >${spanElement.textContent}</del>
      <div>
        <button class="bg-gray-300  cursor-not-allowed opacity-50 font-medium rounded-lg text-sm p-2 text-center me-2 mb-2 mt-1" disabled>
       Completed
      </button>
      <button class="bg-gray-300 rounded-md cursor-not-allowed opacity-50 font-medium rounded-lg text-sm p-2 text-center me-2 mb-2 mt-1" disabled>
    Delete
  </button>
      </div>
      `;

    this.tasks[index] = taskHtml;
    this.updateShowTarget();
  }
  edit(event) {
    const parent = event.target.closest('[data-todo-target="entity"]');
    console.log(parent);
    console.log(event.currentTarget.innerText);

    const index = parseInt(parent.getAttribute("index"), 10);
    const description = parent.querySelector("span").innerHTML;

    const edit_field = `<input type="text" value="${description}" id="edit-input" /> 
    <button data-action="todo#update" id="edit-button" class="text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium p-2 m-2 rounded text-sm">Update</button>`;
    this.tasks[index] = edit_field;
    this.mainButton.disabled = true;
    this.updateShowTarget();

    // Attach the event listener to the newly added edit input field
    const editInput = this.element.querySelector("#edit-input");
    const editButton = this.element.querySelector("#edit-button");
    editInput.addEventListener("keypress", (event) => {
      console.log("in the target function");
      if (event.key === "Enter") {
        editButton.click();
      }
    });
  }

  update(event) {
    const updated_description = document.getElementById("edit-input").value;
    const parent = event.target.closest("[data-todo-target]");
    console.log(parent);
    const index = parseInt(parent.getAttribute("index"), 10);
    const updated_entry = `<span data-action="click->todo#edit class="inline-block pt-2">${updated_description}</span>
    <div>
      <button data-action="todo#completed" class="text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm p-2 text-center me-2 mb-2 mt-1">Completed</button>
      <button data-action="todo#delete" class="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm p-2 text-center me-2 mb-2">Delete</button>
      </div>
    `;
    this.tasks[index] = updated_entry;
    this.mainButton.disabled = false;
    this.updateShowTarget();
  }

  updateShowTarget() {
    this.showTarget.innerHTML = "";
    this.tasks.forEach((element, index) => {
      const taskElement = document.createElement("div");
      taskElement.setAttribute("index", index);
      taskElement.classList.add("flex");
      taskElement.classList.add("justify-between");
      taskElement.classList.add("flex-wrap");
      taskElement.classList.add("w-full");
      taskElement.setAttribute("data-todo-target", "entity");
      taskElement.innerHTML = element;
      this.showTarget.appendChild(taskElement);
    });
  }

  get description() {
    return this.descriptionTarget.value;
  }
  get mainButton() {
    return this.mainButtonTarget;
  }
}
