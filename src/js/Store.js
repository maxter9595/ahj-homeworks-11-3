import { BehaviorSubject } from "rxjs";
import initialState from "../data/initialState";

export default class Store {
  constructor() {
    this.state$ = new BehaviorSubject(initialState);
  }

  getState() {
    return this.state$.getValue();
  }

  updateTaskStatus(projectId, taskId, done) {
    const state = this.getState();
    const project = state.projects.find((p) => p.id === projectId);
    if (project) {
      const task = project.tasks.find((t) => t.id === taskId);
      if (task) {
        task.done = done;
        this.state$.next(state);
      }
    }
  }
}
