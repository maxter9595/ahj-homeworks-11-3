export default class StatsWidget {
  constructor(store) {
    this.store = store;
    this.container = document.getElementById("stats-widget");
    this.render();
    this.store.state$.subscribe(() => this.render());
  }

  render() {
    const state = this.store.getState();
    const stats = state.projects.map((project) => ({
      name: project.name,
      open: project.tasks.filter((task) => !task.done).length,
    }));

    this.container.innerHTML = `
      <div style="font-weight: bold;">Stats</div>
      <table>
        <tr>
          <th>Project</th>
          <th>Open</th>
        </tr>
        ${stats
          .map(
            (stat) => `
          <tr>
            <td>${stat.name}</td>
            <td><span class="badge">${stat.open}</span></td>
          </tr>
        `,
          )
          .join("")}
      </table>
    `;
  }
}
