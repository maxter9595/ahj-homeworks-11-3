import Store from "./Store.js";
import StatsWidget from "./StatsWidget.js";
import TasksWidget from "./TasksWidget.js";

const store = new Store();
new StatsWidget(store);

const tasksWidget = new TasksWidget(store);
tasksWidget.setProject(1);
