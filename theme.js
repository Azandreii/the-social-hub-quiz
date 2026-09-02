const THEME_STORAGE_KEY =
    "tshTourTheme";


function getStoredTheme() {

    const urlParams =
        new URLSearchParams(
            window.location.search
        );

    const urlTheme =
        urlParams.get(
            "theme"
        );


    if (
        urlTheme === "dark" ||
        urlTheme === "light"
    ) {

        return urlTheme;

    }


    const savedTheme =
        localStorage.getItem(
            THEME_STORAGE_KEY
        );


    return savedTheme === "dark"
        ? "dark"
        : "light";
}


function applySharedTheme(theme) {

    const normalizedTheme =
        theme === "dark"
            ? "dark"
            : "light";

    document.body.dataset.theme =
        normalizedTheme;

    localStorage.setItem(
        THEME_STORAGE_KEY,
        normalizedTheme
    );

}


function initializeSharedTheme() {

    applySharedTheme(
        getStoredTheme()
    );

}


window.addEventListener(
    "message",
    function (event) {

        if (
            !event.data ||
            event.data.type !==
            "tsh-theme-update"
        ) {
            return;
        }

        applySharedTheme(
            event.data.theme
        );

    }
);


initializeSharedTheme();

/*
 * Ask the top-level tour wrapper for its
 * current theme.
 *
 * This also works when this page is nested
 * inside a Kuula card.
 */
if (window.top !== window) {

    window.top.postMessage(
        {
            type: "tsh-theme-request"
        },
        "*"
    );

}

// testing theme.js connection to quiz panels
console.log(
    "THEME.JS LOADED",
    window.location.href,
    window.top === window
);
