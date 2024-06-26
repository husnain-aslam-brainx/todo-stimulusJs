import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = ["description", "show"];

  initialize() {
    this.tasks = [];
  }

  addTask() {
    const taskHtml = `<span data-action="click->todo#edit">${this.description}</span>
      <button data-action="todo#delete" class="delete-button">Delete</button>
      <button data-action="todo#completed" class="completed-button">Completed</button>
      `;
    this.tasks.unshift(taskHtml);
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
    const index = event.target.parentElement.value;
    console.log(index);
    const parent = event.target.parentElement;
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
    console.log("edit is called", event.target);
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
}
