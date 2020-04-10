import ArrData from './ArrData';
import DisplayForm from './DisplayForm';
import initData from './InitData';

const arrData = new ArrData();
const displayForm = new DisplayForm();

export default class WorkTasks {
  constructor() {
    this.divPinned = document.getElementById('pinned');
    this.divAllTasks = document.getElementById('all-tasks');
    this.formInput = document.getElementById('input-form');
    this.elementInput = document.getElementById('input-task');
    this.elementError = document.querySelector('.error');
  }

  init() {
    initData(arrData);
    displayForm.redrawTasks(arrData.tasks);
    this.setupEventHandlers();
  }

  setupEventHandlers() {
    this.formInput.addEventListener('submit', (event) => {
      event.preventDefault();
      const elementValue = this.elementInput.value;

      if (elementValue === '') {
        this.elementError.classList.remove('hidden');
        const top = this.elementInput.offsetTop - this.elementError.offsetHeight;
        this.elementError.style.top = `${top - 5}px`;
        return;
      }

      if (!this.elementError.classList.contains('hidden')) {
        this.elementError.classList.add('hidden');
      }

      arrData.addTask(this.elementInput.value);
      this.elementInput.value = '';
      this.filterTask(this.elementInput.value);
    });

    this.elementInput.addEventListener('input', () => {
      this.filterTask(this.elementInput.value);
    });

    this.divPinned.addEventListener('click', (event) => {
      if (event.target.className === 'checked') {
        const lementId = event.target.closest('.item-task').dataset.id;
        this.moveTask(lementId, false);
      }
    });

    this.divAllTasks.addEventListener('click', (event) => {
      if (event.target.className === 'checked') {
        const elmentId = event.target.closest('.item-task').dataset.id;
        this.moveTask(elmentId, true);
      }
    });

    this.elementError.addEventListener('click', (event) => {
      if (event.target.className === 'close-error') {
        this.elementError.classList.add('hidden');
      }
    });
  }

  filterTask(value) {
    const filtrArr = arrData.tasks.filter((item) => {
      const valueLowerCase = value.trim().toLowerCase();
      const trueName = item.name.toLowerCase().includes(valueLowerCase);
      return trueName || item.pinned;
    });
    displayForm.redrawTasks(filtrArr);
  }

  moveTask(itemIdTask, pinned) {
    const idTask = arrData.tasks.findIndex((item) => item.id === Number(itemIdTask));
    arrData.tasks[idTask].pinned = pinned;
    this.filterTask(this.elementInput.value);
  }
}
