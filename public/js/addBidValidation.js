function validateForm() {
  const form = document.forms[0];
  let isValid = true;

  form.classList.remove("was-validated");

  const textFields = form.querySelectorAll("input[pattern], textarea[pattern]");
  textFields.forEach((field) => {
    if (!field.value.match(field.pattern)) {
      field.classList.add("is-invalid");
      isValid = false;
    }
  });

  const now = new Date();
  const start = new Date(form.elements.start.value);
  const end = new Date(form.elements.end.value);

  if (!form.elements.start.value || start <= now) {
    form.elements.start.classList.add("is-invalid");
    isValid = false;
  }

  if (!form.elements.end.value || end <= start) {
    form.elements.end.classList.add("is-invalid");
    isValid = false;
  }

  if (
    !form.elements.max_budget.value ||
    parseFloat(form.elements.max_budget.value) <= 0
  ) {
    form.elements.max_budget.classList.add("is-invalid");
    isValid = false;
  }

  if (!isValid) {
    form.classList.add("was-validated");
    return false;
  }

  return true;
}

document.addEventListener("DOMContentLoaded", function () {
  const form = document.forms[0];

  form.querySelectorAll("input, textarea").forEach((element) => {
    element.addEventListener("input", function () {
      if (this.classList.contains("is-invalid")) {
        this.classList.remove("is-invalid");
      }
    });
  });

  form.elements.start.addEventListener("change", function () {
    if (new Date(this.value) <= new Date()) {
      this.classList.add("is-invalid");
    } else {
      this.classList.remove("is-invalid");
    }
  });

  form.elements.end.addEventListener("change", function () {
    const start = new Date(form.elements.start.value);
    if (new Date(this.value) <= start) {
      this.classList.add("is-invalid");
    } else {
      this.classList.remove("is-invalid");
    }
  });
});
