/**
 * Класс User управляет авторизацией, выходом и
 * регистрацией пользователя из приложения
 * Имеет свойство URL, равное '/user'.
 * */
class User {
  static URL = "/user";
  /**
   * Устанавливает текущего пользователя в
   * локальном хранилище.
   * */
  static setCurrent(user) {
    localStorage.setItem("user", JSON.stringify(user));
  }

  /**
   * Удаляет информацию об авторизованном
   * пользователе из локального хранилища.
   * */
  static unsetCurrent() {
    localStorage.removeItem("user");
  }

  /**
   * Возвращает текущего авторизованного пользователя
   * из локального хранилища
   * */
  static current() {
    let user = localStorage.getItem("user");
    return JSON.parse(user);
  }

  /**
   * Получает информацию о текущем
   * авторизованном пользователе.
   * */
  static fetch() {
   return createRequest({
      url: this.URL + "/current",
      method: "GET"
    });
  }

  /**
   * Производит попытку авторизации.
   * После успешной авторизации необходимо
   * сохранить пользователя через метод
   * User.setCurrent.
   * */
  static login(data) {
    return createRequest({
      url: this.URL + '/login',
      method: 'POST',
      data
    }).then(response => response.json())
        .then(response => {
          if (response.success) {
            this.setCurrent(response.user);
          }
          return response;
        });
  }

  /**
   * Производит попытку регистрации пользователя.
   * После успешной авторизации необходимо
   * сохранить пользователя через метод
   * User.setCurrent.
   * */
  static register(data) {
   return createRequest( {
      url: this.URL + "/register",
      method: "POST",
     data: data
    });
  }

  /**
   * Производит выход из приложения. После успешного
   * выхода необходимо вызвать метод User.unsetCurrent
   * */
  static logout() {
    return createRequest({
      url: this.URL + "/logout",
      method: "POST"
    }).then(response => response.json())
        .then(response => {
          this.unsetCurrent()
          return response;
        });
  }
}
