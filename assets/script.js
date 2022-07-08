(function () {
  const $ = document.querySelector.bind(document);
  const $$ = document.querySelectorAll.bind(document);

  const Modal = {
    theme: 1,
    calcInput: "0",
  };

  const Controller = {
    getTheme: () => Modal.theme,
    setTheme: (val) => (Modal.theme = val),

    getCalcInput: () => Modal.calcInput,
    resetCalcInput: () => (Modal.calcInput = "0"),
    setCalcInput: (val) => (Modal.calcInput = val),

    init: function () {
      ThemeViews.init();
      CalcViews.init();
    },
  };

  const ThemeViews = {
    init: function () {
      const { setTheme } = Controller;

      // [1] Changing theme depends on prefers-color-scheme

      window?.matchMedia("(prefers-color-scheme: light)").matches
        ? setTheme(2)
        : setTheme(3);

      this.render();

      // [2] Handle theme-toggler click

      $("#theme-toggler").onclick = () => {
        switch ($("html").dataset.theme) {
          case "1":
            setTheme(2);
            break;
          case "2":
            setTheme(3);
            break;
          case "3":
            setTheme(1);
        }

        this.render();
      };
    },

    render: function () {
      const { getTheme } = Controller;

      $("html").dataset.theme = getTheme();
      $("#theme-toggler").ariaLabel = `Theme ${getTheme()} is selected`;
    },
  };

  const CalcViews = {
    init: function () {
      // [1] Handle Click
      $("#del").onclick = (e) => this.render.handleDel(e);
      $("#reset").onclick = (e) => this.render.handleReset(e);
      $("#equal").onclick = (e) => this.render.handleEqual(e);
      $$(".calc .controls *:not(.special)").forEach(
        (ele) => (ele.onclick = (e) => this.render.handleBtn(e))
      );

      // [2] Handle Keydown
      document.body.addEventListener("keydown", (e) => {
        $$(".calc .controls *").forEach(
          (ele) => ele.innerHTML == e.key && ele.click()
        );

        switch (e.key) {
          case "*":
            $("#multiply").click();
            break;
          case "Enter":
            document.activeElement.tagName !== "BUTTON" && $("#equal").click();
            break;
          case "Backspace":
            $("#del").click();
            break;
          case "Escape":
          case "Delete":
            $("#reset").click();
        }
      });
    },

    render: {
      screenNode: $(".calc .screen"),
      updateScreen: () => ($("#screen").innerHTML = Controller.getCalcInput()),
      handleClickEffect: (e) => {
        //if (e) {}
        e?.target.classList.add("active");
        let timer = setTimeout(() => e?.target.classList.remove("active"), 50);
        return () => clearTimeout(timer);
      },

      handleEqual: function (e) {
        const { getCalcInput, setCalcInput } = Controller;
        this.handleClickEffect(e);

        // [1] Remove non numbers last value (if exists) before get the results
        isNaN(+getCalcInput().slice(-1)) && this.handleDel();

        // [2] Format the results
        let results = eval(getCalcInput().replace(/x/g, "*"));
        results = String(results).includes(".") ? +results.toFixed(2) : results;

        // [3] Set & Show the results
        setCalcInput(results.toLocaleString());
        this.updateScreen();
        this.screenNode.classList.add("initial");
      },
      handleReset: function (e) {
        this.handleClickEffect(e);
        this.screenNode.classList.add("initial");
        Controller.resetCalcInput();
        this.updateScreen();
      },
      handleDel: function (e) {
        const { getCalcInput, setCalcInput } = Controller;
        this.handleClickEffect(e);

        if (!this.screenNode.classList.contains("initial")) {
          if (getCalcInput().length === 1) {
            this.handleReset();
            return;
          }

          setCalcInput(getCalcInput().slice(0, -1));
          this.updateScreen();
        }
      },
      handleBtn: function (e) {
        const { getCalcInput, setCalcInput } = Controller;
        this.handleClickEffect(e);

        // Handle dot btn
        if (e.target.innerHTML === "." && getCalcInput().includes(".")) return;

        if (this.screenNode.classList.contains("initial")) {
          // Handle operation btns && zero btn at the start
          if (isNaN(+e.target.innerHTML) || e.target.innerHTML == 0) {
            if (e.target.innerHTML !== ".") return;
          }

          this.screenNode.classList.remove("initial");
          setCalcInput(e.target.innerHTML);
        } else {
          // Handle operation btns
          if (isNaN(+e.target.innerHTML) && isNaN(+getCalcInput().slice(-1))) {
            if (e.target.innerHTML !== ".") return;
          }

          setCalcInput(getCalcInput() + e.target.innerHTML);
        }

        this.updateScreen();
      },
    },
  };

  Controller.init();
})();
