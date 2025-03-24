export default class TasksWidget {
  constructor(store) {
    this.store = store;
    this.container = document.getElementById("tasks-widget");
    this.currentProject = null;
    this.render();
    this.store.state$.subscribe(() => this.render());
  }

  setProject(projectId) {
    this.currentProject = projectId;
    this.render();
  }

  render() {
    const state = this.store.getState();
    const project = state.projects.find((p) => p.id === this.currentProject);

    if (!project) {
      this.container.innerHTML = "<div>Please select a project</div>";
      return;
    }

    this.container.innerHTML = `
      <div style="font-weight: bold;">Tasks</div>
      <table>
        <thead>
          <tr>
            <th><div class="project-name">Project: <span class="project-selector">${project.name}</span></div></th>
          </tr>
        </thead>
        <tbody>
          ${project.tasks
            .map(
              (task) => `
            <tr class="task-item">
              <td>
                <input type="checkbox" ${task.done ? "checked" : ""} 
                  data-project-id="${project.id}" data-task-id="${task.id}" />
                ${task.name}
              </td>
            </tr>
          `,
            )
            .join("")}
        </tbody>
      </table>
    `;

    this.container
      .querySelectorAll('input[type="checkbox"]')
      .forEach((checkbox) => {
        checkbox.addEventListener("change", (event) => {
          const projectId = parseInt(
            event.target.getAttribute("data-project-id"),
          );
          const taskId = parseInt(event.target.getAttribute("data-task-id"));
          const done = event.target.checked;
          this.store.updateTaskStatus(projectId, taskId, done);
        });
      });

    const projectSelector = this.container.querySelector(".project-selector");
    if (projectSelector) {
      projectSelector.addEventListener("click", () =>
        this.showProjectDropdown(projectSelector),
      );
    }
  }

  showProjectDropdown(targetElement) {
    const state = this.store.getState();
    const dropdown = document.createElement("div");
    dropdown.className = "project-dropdown";

    const header = document.createElement("div");
    header.className = "dropdown-header";
    header.textContent = "Project:";
    dropdown.appendChild(header);

    const dropdownList = document.createElement("div");
    dropdownList.className = "dropdown-list";

    state.projects.forEach((project) => {
      const projectOption = document.createElement("div");
      projectOption.className = "dropdown-item";
      projectOption.textContent = project.name;
      projectOption.addEventListener("click", () => {
        this.setProject(project.id);
        dropdown.remove();
      });
      dropdownList.appendChild(projectOption);
    });

    dropdown.appendChild(dropdownList);
    document.body.appendChild(dropdown);

    const rect = targetElement.getBoundingClientRect();
    dropdown.style.top = `${rect.bottom}px`;
    dropdown.style.left = `${rect.left}px`;
  }
}
