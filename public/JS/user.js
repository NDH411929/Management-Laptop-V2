const test = document.querySelector(".link-test");
if (test) {
    test.addEventListener("click", () => {
        const card = document.querySelector(".test1");
        card.classList.add("d-block");
        const card2 = document.querySelector(".test");
        card2.classList.add("d-none");
    });
}
