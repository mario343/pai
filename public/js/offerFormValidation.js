(function () {
  "use strict";

  const form = document.querySelector(".needs-validation");

  if (form) {
    form.addEventListener(
      "submit",
      function (event) {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }
        form.classList.add("was-validated");
      },
      false
    );

    form.querySelectorAll("input").forEach((input) => {
      input.addEventListener("input", function () {
        if (this.checkValidity()) {
          this.classList.remove("is-invalid");
        } else {
          this.classList.add("is-invalid");
        }
      });
    });
  }
})();
