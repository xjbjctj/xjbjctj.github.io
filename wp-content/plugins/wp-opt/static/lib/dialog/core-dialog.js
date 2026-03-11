const prefix = "#";
const elContainerKey = "gh-container";

function getContainerID() {
    return prefix + elContainerKey;
}

function init(isCenter, lockScroll, zIndex, top) {
    const el = document.querySelector(getContainerID()) ?? document.createElement("div");
    el.id = elContainerKey;
    el.classList.add("gh-container");
    el.style.zIndex = zIndex;

    if (!isCenter && top) el.style.paddingTop = `${top}px`;

    if (isCenter) el.classList.add("center");

    if (lockScroll) document.body.style.overflow = "hidden";

    document.body.appendChild(el);
}

function createDialog(title, content, operations, options = {}) {
    const {
        showFooter = true,
        showHeader = true,
        showClose = true,
        width,
        isCenter,
        closedFn,
    } = options;

    const dialog = document.createElement("div");
    dialog.classList.add("gh-dialog");

    if (isCenter) dialog.classList.add("center");

    const wrapper = document.createElement("div");
    wrapper.classList.add("gh-dialog--wrapper");
    dialog.appendChild(wrapper);

    const body = createDialogBody(wrapper, content, width);

    if (showClose) createCloseBtn(wrapper);

    if (showHeader && title) createDialogHeader(wrapper, body, title);

    if (showFooter && operations && Array.isArray(operations))
        createDialogFooter(wrapper, operations, closedFn);

    document.querySelector(getContainerID())?.appendChild(dialog);
    requestAnimationFrame(() => {
        document.querySelector(getContainerID())?.classList.add("show");
        dialog.classList.add("show");
    });
}

function createDialogHeader(container, to, title) {
    const header = document.createElement("div");
    header.classList.add("gh-dialog--header");
    header.innerText = title;
    container.insertBefore(header, to);
}

function createCloseBtn(container) {
    const close = document.createElement("span");
    close.classList.add("gh-dialog--close");
    close.innerHTML = `<svg fill-rule="evenodd" viewBox="64 64 896 896" focusable="false" data-icon="close" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M799.86 166.31c.02 0 .04.02.08.06l57.69 57.7c.04.03.05.05.06.08a.12.12 0 010 .06c0 .03-.02.05-.06.09L569.93 512l287.7 287.7c.04.04.05.06.06.09a.12.12 0 010 .07c0 .02-.02.04-.06.08l-57.7 57.69c-.03.04-.05.05-.07.06a.12.12 0 01-.07 0c-.03 0-.05-.02-.09-.06L512 569.93l-287.7 287.7c-.04.04-.06.05-.09.06a.12.12 0 01-.07 0c-.02 0-.04-.02-.08-.06l-57.69-57.7c-.04-.03-.05-.05-.06-.07a.12.12 0 010-.07c0-.03.02-.05.06-.09L454.07 512l-287.7-287.7c-.04-.04-.05-.06-.06-.09a.12.12 0 010-.07c0-.02.02-.04.06-.08l57.7-57.69c.03-.04.05-.05.07-.06a.12.12 0 01.07 0c.03 0 .05.02.09.06L512 454.07l287.7-287.7c.04-.04.06-.05.09-.06a.12.12 0 01.07 0z"></path></svg>`;
    close.onclick = () => closeDialog();
    container.appendChild(close);
}

function createDialogBody(container, content, width) {
    const body = document.createElement("div");
    body.classList.add("gh-dialog--body");
    body.innerHTML = content || "";

    if (width) body.style.width = `${width}px`;
    container.appendChild(body);
    return body;
}

function createDialogFooter(container, operations, closedFn) {
    const footer = document.createElement("div");
    footer.classList.add("gh-dialog--footer");
    operations.forEach((op) => {
        const button = document.createElement("button");
        button.classList.add("gh-dialog--btn");

        if (op.bgColor) {
            button.style.backgroundColor = op.bgColor;
        } else if (op.type) {
            button.classList.add(op.type);
        }

        button.innerText = op.label;
        button.onclick = () => {
            op.onClick && op.onClick(() => closeDialog(closedFn));
        };
        footer.appendChild(button);
    });
    container.appendChild(footer);
}
function closeDialog(cb) {
    const container = document.querySelector(getContainerID());
    if (!container) return;
    const dialog = Array.from(container.children)[0];
    if (!dialog) return;
    dialog.classList.remove("show");

    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            dialog.classList.add("close");
            monitorAnimationStatue(dialog, "animationend", (_, cancel) => {
                cancel();
                container.removeChild(dialog);
                cb && cb();

                container.classList.add("close");
                monitorAnimationStatue(
                    container,
                    "transitionend",
                    (_, cancel) => {
                        cancel();
                        container.remove();
                        container.classList.remove("close", "show");
                        document.body.style.overflow = ""
                    }
                );
            });
        });
    });
}

function monitorAnimationStatue(target, type, cb) {
    target.addEventListener(type, (e) =>
        cb(e, () => target.removeEventListener(type, cb))
    );
}

function WPOPTDialog(config) {
    const {
        title,
        content,
        operations,
        isCenter,
        distanceTop = 100,
        lockScroll = true,
        zIndex = 2000,
        ...other
    } = config;

    return {
        show() {
            init(isCenter, lockScroll, zIndex, distanceTop);
            createDialog(title, content, operations, {
                ...other,
                isCenter,
            });
        },
    };
}
WPOPTDialog.show = function (config) {
    Dialog(config).show();
};
window.WPOPTDialog = WPOPTDialog;