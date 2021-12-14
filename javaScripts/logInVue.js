let logiInApp = new Vue({
  el: "#logInScreen",
  data: {
    userName: "",
    password: "",
  },
  methods: {
    submitLogin: function () {
      // emit an object with the userName and password
      socket.emit("clientTrysToLogIn", {
        userName: logiInApp.userName,
        password: logiInApp.password,
      });
    },
  }
});