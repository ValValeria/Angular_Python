(() => {
    const time = Date.now();
    let timerId = null;

    document.addEventListener("DOMContentLoaded", () => {
        const loadingElem = document.querySelector('#loadingElem');

        document.addEventListener("readystatechange", () => {
            if (document.readyState === "complete") {

                loadingElem.classList.add('zero-opacity');

                loadingElem.addEventListener("transiotionend", () => {
                    body.style.overflowY = "auto";
                    loadingElem.parentElement.removeChild(loadingElem);
                    clearInterval(timerId);
                });

                timerId = setInterval(() => {
                    const diffTime = Date.now() - time;

                    if (diffTime > 15000) {
                        clearInterval(timerId);
                        loadingElem.parentElement.removeChild(loadingElem);
                    }
                }, 500);
            }
        });
    });
})();