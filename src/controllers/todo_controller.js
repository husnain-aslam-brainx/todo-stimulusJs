import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = ["description", "show", "mainButton"];

  initialize() {
    this.tasks = [];
  }
  connect() {
    // console.log("in the connect");
    // this.descriptionTarget.addEventListener("keypress", (event) => {
    //   console.log("in the function");
    //   if (event.key === "Enter") {
    //     console.log(this.mainButtonTarget);
    //     this.mainButtonTarget.click();
    //   }
    // });
  }

  listenEvent(event) {
    if (event.key === "Enter") {
      this.mainButtonTarget.click();
    }
  }

  addTask() {
    const taskHtml = `
      <span data-action="click->todo#edit">${this.description}</span>
      <button data-action="todo#completed" class="text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm p-3 text-center me-2 mb-2">Completed</button>
      <button data-action="todo#delete" class="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm p-3 text-center me-2 mb-2">Delete</button>
    `;
    this.tasks.unshift(taskHtml);
    this.descriptionTarget.value = "";
    this.updateShowTarget();
  }

  delete(event) {
    console.log(event.target.parentElement.value);
    const index = event.target.parentElement.value;
    console.log(index);
    this.tasks.splice(index, 1);
    this.updateShowTarget();
  }

  completed(event) {
    const parent = event.target.parentElement;
    const index = parent.value;

    console.log("before parent");
    console.log(parent);
    const spanElement = parent.querySelector("span");
    if (spanElement) {
      spanElement.innerHTML = `<del>${spanElement.textContent}</del>`;
    }
    parent
      .querySelectorAll("button")
      .forEach((button) => (button.disabled = true));
    console.log("before changed parent");
    console.log(parent);

    // Update the task HTML in the tasks array
    this.tasks[index] = parent.outerHTML;
    this.updateShowTarget();
  }
  edit(event) {
    const parent = event.target.parentElement;
    const index = parent.value;
    const description = parent.querySelector("span").innerHTML;
    const edit_field = `<input type="text" value="${description}" id="edit-input" /> 
    <button data-action="todo#update" id="edit-button">Update</button>`;
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
    console.log("updated is called");
    const updated_description = document.getElementById("edit-input").value;
    console.log(updated_description);
    const parent = event.target.parentElement;
    const index = parent.value;
    const updated_entry = `<span data-action="click->todo#edit">${updated_description}</span>
    <button data-action="todo#delete" class="delete-button">Delete</button>
    <button data-action="todo#completed" class="completed-button">Completed</button>
    `;
    this.tasks[index] = updated_entry;
    this.mainButton.disabled = false;
    this.updateShowTarget();
  }

  updateShowTarget() {
    this.showTarget.innerHTML = "";
    this.tasks.forEach((element, index) => {
      const taskElement = document.createElement("div");
      taskElement.value = index;
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
