/**
 * Класс AccountsWidget управляет блоком
 * отображения счетов в боковой колонке
 * */

class AccountsWidget {
  /**
   * Устанавливает текущий элемент в свойство element
   * Регистрирует обработчики событий с помощью
   * AccountsWidget.registerEvents()
   * Вызывает AccountsWidget.update() для получения
   * списка счетов и последующего отображения
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   *
   * */
  constructor( element ) {
    if (!element) {
      throw new Error("Не передан элемент");
    }
    this.element = element;
    this.selectedId = null;
    this.registerEvents();
    this.update();
  }

  /**
   * При нажатии на .create-account открывает окно
   * #modal-new-account для создания нового счёта
   * При нажатии на один из существующих счетов
   * (которые отображены в боковой колонке),
   * вызывает AccountsWidget.onSelectAccount()
   * */
  registerEvents() {
   const createAccount = this.element.querySelector(".create-account");
   createAccount.addEventListener("click", () => {
     App.getModal("createAccount").open();
   });
  }

  /**
   * Метод доступен только авторизованным пользователям
   * (User.current()).
   * Если пользователь авторизован, необходимо
   * получить список счетов через Account.list(). При
   * успешном ответе необходимо очистить список ранее
   * отображённых счетов через AccountsWidget.clear().
   * Отображает список полученных счетов с помощью
   * метода renderItem()
   * */
  update() {
    if (!User.current()) {
      return;
    }
    Account.list()
        .then(response => response.json())
        .then(response => {
          this.clear();
          this.renderItem(response.data);
        });
  }

  /**
   * Очищает список ранее отображённых счетов.
   * Для этого необходимо удалять все элементы .account
   * в боковой колонке
   * */
  clear() {
    const accounts = Array.from(this.element.querySelectorAll(".account"));
    accounts.forEach(item => item.remove());
  }

  /**
   * Срабатывает в момент выбора счёта
   * Устанавливает текущему выбранному элементу счёта
   * класс .active. Удаляет ранее выбранному элементу
   * счёта класс .active.
   * Вызывает App.showPage( 'transactions', { account_id: id_счёта });
   * */
  onSelectAccount(element) {
      const currentActive = this.element.querySelector(".active");
      if (currentActive) {
          currentActive.classList.remove("active");
      }
      element.classList.add("active");
      this.selectedId = element.dataset.id;
      App.showPage('transactions', { account_id: element.dataset.id })
  }

  /**
   * Возвращает HTML-код счёта для последующего
   * отображения в боковой колонке.
   * item - объект с данными о счёте
   * */
  getAccountHTML(item) {
      let activeClass = "";
      if (item.id === this.selectedId) {
          activeClass = "active";
      }
    return `<li class="account ${activeClass}" data-id="${item.id}">
    <a href="#">
        <span>${item.name}</span> /
        <span>${item.sum} ₽</span>
    </a>
</li>`
  }

  /**
   * Получает массив с информацией о счетах.
   * Отображает полученный с помощью метода
   * AccountsWidget.getAccountHTML HTML-код элемента
   * и добавляет его внутрь элемента виджета
   * */
  renderItem(data) {
    data.forEach(item => {
       this.element.insertAdjacentHTML('beforeend', this.getAccountHTML(item));
    });
    const currentAccount = Array.from(this.element.querySelectorAll(".account a"));
    currentAccount.forEach(item => {
        item.addEventListener("click", (e) => {
            e.preventDefault();
            this.onSelectAccount(item.closest(".account"));
        });
    });
  }
}
