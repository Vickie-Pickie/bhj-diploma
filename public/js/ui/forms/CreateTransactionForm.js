/**
 * Класс CreateTransactionForm управляет формой
 * создания новой транзакции
 * */
class CreateTransactionForm extends AsyncForm {
  /**
   * Вызывает родительский конструктор и
   * метод renderAccountsList
   * */
  constructor(element) {
    super(element);
    this.renderAccountsList();
  }

  /**
   * Получает список счетов с помощью Account.list
   * Обновляет в форме всплывающего окна выпадающий список
   * */
  renderAccountsList() {
    const selectAccount = this.element.querySelector(".accounts-select");
    Account.list()
        .then(response => response.json())
        .then(response => {
            Array.from(selectAccount.querySelectorAll("option")).forEach(item => item.remove());
            response.data.forEach(item => {
            let newOption = new Option(`${item.name}`, `${item.id}`);
            selectAccount.append(newOption);
          });
        });
  }

  /**
   * Создаёт новую транзакцию (доход или расход)
   * с помощью Transaction.create. По успешному результату
   * вызывает App.update(), сбрасывает форму и закрывает окно,
   * в котором находится форма
   * */
  onSubmit(data) {
    Transaction.create(data)
        .then(response => response.json())
        .then(response => {
          if (response.success) {
            App.getModal("newIncome").close();
            App.getModal("newExpense").close();
            this.element.reset();
            App.update();
          }
        });
  }
}