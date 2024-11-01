const randomButton = document.querySelector(".random-coupon");
const generateRandomString = (length) => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    let result = "";

    for (let i = 0; i < length; i++) {
        result += characters.charAt(
            Math.floor(Math.random() * characters.length)
        );
    }

    return result;
};
if (randomButton) {
    randomButton.addEventListener("click", () => {
        const codeCoupon = document.querySelector("#codeCoupon");
        codeCoupon.value = generateRandomString(9);
    });
}
