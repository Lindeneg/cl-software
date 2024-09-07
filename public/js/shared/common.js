/** @typedef {import('./globals')} */

(() => {
    /** @typedef {import('./globals').StrObj}           StrObj */
    /** @typedef {import('./globals').HttpDataResponse} HttpDataResponse */
    /** @typedef {import('./globals').ModalQueueItem}   ModalQueueItem */
    /** @typedef {import('./globals').TableState}       TableState */
    /** @typedef {import('./globals').TableApi}         TableApi */
    /** @typedef {import('./globals').TableRow}         TableRow */

    ////////////////////////////
    ////////////////////////////
    //////// CL COMMON /////////
    ////////////////////////////
    ////////////////////////////

    if (!window.clCommon) {
        window.clCommon = {};
    }

    /** @type {Window["clCommon"]["ensureArray"]} */
    const ensureArray = (val) => {
        if (Array.isArray(val)) return val;
        return [val];
    };
    window.clCommon.ensureArray = ensureArray;

    /** @type {Window["clCommon"]["disableEl"]} */
    const disableEl = (...el) => {
        el.forEach((e) => {
            e.setAttribute("disabled", "true");
        });
    };
    window.clCommon.disableEl = disableEl;

    /** @type {Window["clCommon"]["enableEl"]} */
    const enableEl = (...el) => {
        el.forEach((e) => {
            e.removeAttribute("disabled");
        });
    };
    window.clCommon.enableEl = enableEl;

    /** @type {Window["clCommon"]["disableBtn"]} */
    const disableBtn = (...btns) => {
        btns.forEach((btn) => {
            disableEl(btn);
            btn.classList.add("pure-button-disabled");
        });
    };
    window.clCommon.disableBtn = disableBtn;

    /** @type {Window["clCommon"]["enableBtn"]} */
    const enableBtn = (...btns) => {
        btns.forEach((btn) => {
            enableEl(btn);
            btn.classList.remove("pure-button-disabled");
        });
    };
    window.clCommon.enableBtn = enableBtn;

    /** @type {Window["clCommon"]["hideEl"]} */
    const hideEl = (...el) => {
        el.forEach((e) => {
            e.classList.add("hidden");
        });
    };
    window.clCommon.hideEl = hideEl;

    /** @type {Window["clCommon"]["showEl"]} */
    const showEl = (...el) => {
        el.forEach((e) => {
            e.classList.remove("hidden");
        });
    };
    window.clCommon.showEl = showEl;

    /** @type {Window["clCommon"]["showElIf"]} */
    const showElIf = (condition, ...el) => {
        if (condition) return showEl(...el);
        hideEl(...el);
    };
    window.clCommon.showElIf = showElIf;

    /** @type {Window["clCommon"]["enableElIf"]} */
    const enableElIf = (condition, ...btns) => {
        if (condition) return enableBtn(...btns);
        disableBtn(...btns);
    };
    window.clCommon.enableElIf = enableElIf;

    /** @type {Window["clCommon"]["tempDisable"]} */
    const tempDisable = (...btns) => {
        /** @type {Map<HTMLButtonElement, boolean>} */
        const enabledMap = new Map();
        btns.forEach((btn) => {
            enabledMap.set(
                btn,
                !btn.hasAttribute("disabled") &&
                    !btn.classList.contains("pure-button-disabled")
            );
            disableEl(btn);
        });
        return {
            revert: () => {
                for (const [btn, enabled] of enabledMap.entries()) {
                    enableElIf(enabled, btn);
                }
            },
        };
    };
    window.clCommon.tempDisable = tempDisable;

    /** @type {Window["clCommon"]["getNameFromId"]} */
    const getNameFromId = (id, obj) => {
        const found = obj.find((e) => e.id === id);
        if (found && found.name) return found.name;
        return "";
    };
    window.clCommon.getNameFromId = getNameFromId;

    /** @type {Window["clCommon"]["switchVisible"]} */
    const switchVisible = (visible, hidden) => {
        showEl(...ensureArray(visible));
        hideEl(...ensureArray(hidden));
    };
    window.clCommon.switchVisible = switchVisible;

    /** @type {Window["clCommon"]["strToIntId"]} */
    const strToIntId = (str) => {
        const match = str.match(/^.+-(\d+)/);
        if (match && match[1]) return Number(match[1]);
        return null;
    };
    window.clCommon.strToIntId = strToIntId;

    /** @type {Window["clCommon"]["strToUser"]} */
    const strToUser = (str) => {
        const match = str.match(/^.+-(.+)-(\d)/);
        if (match && match[1] && match[2]) {
            return {
                name: match[1],
                id: Number(match[2]),
            };
        }
        return null;
    };
    window.clCommon.strToUser = strToUser;

    /** @type {Window["clCommon"]["durationInMins"]} */
    const durationInMins = (started, ended) => {
        if (!started || !ended) return "-";
        return `${Math.ceil(
            (new Date(ended) - new Date(started)) / 1000 / 60
        )} mins`;
    };
    window.clCommon.durationInMins = durationInMins;

    ////////////////////////////
    ////////////////////////////
    //////// CL ELEMENT ////////
    ////////////////////////////
    ////////////////////////////

    if (!window.clEl) {
        window.clEl = {};
    }

    /** @type {Window["clEl"]["append"]} */
    const append = (parent, ...children) => {
        children.forEach((child) => {
            if (!child) return;
            parent.appendChild(child);
        });
        return parent;
    };
    window.clEl.append = append;

    /** @type {Window["clEl"]["any"]} */
    const any = (tag, props = {}, classes = []) => {
        const el = document.createElement(tag);
        Object.entries(props).forEach(([key, value]) => {
            el[key] = value;
        });
        if (classes.length > 0) {
            if (typeof classes === "string") {
                el.classList.add(classes);
            } else {
                el.classList.add(...classes);
            }
        }
        return el;
    };
    window.clEl.any = any;

    /** @type {Window["clEl"]["div"]} */
    const div = (props = {}, classes = []) => {
        return any("div", props, classes);
    };
    window.clEl.div = div;

    /** @type {Window["clEl"]["withListener"]} */
    const withListener = (el, onClick = null, event = "click") => {
        if (!el || typeof onClick !== "function") return el;
        el.addEventListener(event, onClick);
        return el;
    };
    window.clEl.withListener = withListener;

    /** @type {Window["clEl"]["button"]} */
    const button = (
        props = {},
        classes = [],
        onClick = null,
        as = "button"
    ) => {
        const btn = any(as, { type: "button", ...props }, [
            "pure-button",
            ...ensureArray(classes),
        ]);
        return withListener(btn, onClick);
    };
    window.clEl.button = button;

    /** @type {Window["clEl"]["input"]} */
    const input = (props = {}, classes = [], onChange = null) => {
        const inp = any("input", props, [
            "pure-input",
            ...ensureArray(classes),
        ]);
        return withListener(inp, onChange, "change");
    };
    window.clEl.input = input;

    /** @type {Window["clEl"]["select"]} */
    const select = (onChange, options = [], props = {}, classes = []) => {
        /** @type {HTMLSelectElement} */
        const sel = withListener(
            any("select", props, ["pure-select", ...ensureArray(classes)]),
            onChange,
            "change"
        );
        options.forEach((option) => {
            sel.options.add(option);
        });
        return sel;
    };
    window.clEl.select = select;

    /** @type {Window["clEl"]["option"]} */
    const option = (value, displayName, props = {}, classes = []) => {
        const opt = any("option", props, classes);
        opt.value = value;
        opt.innerText = displayName;
        return opt;
    };
    window.clEl.option = option;

    /** @type {Window["clEl"]["hr"]} */
    const hr = (props = {}, classes = []) => {
        return any("hr", props, classes);
    };
    window.clEl.hr = hr;

    ////////////////////////////
    ////////////////////////////
    ////////// CL HTTP /////////
    ////////////////////////////
    ////////////////////////////

    if (!window.clHttp) {
        window.clHttp = {};
    }

    const unknownError = new Error("Unknown Error");
    window.clHttp.unknownError = unknownError;

    const errorEl = () => document.getElementById("error-div");
    const spinnerEl = () => document.getElementById("spinner");

    /**
     * @param {Response} response
     * @returns {Promise<HttpDataResponse["data"]>} */
    const getData = async (response) => {
        try {
            return await response.json();
        } catch (_) {}
        return null;
    };

    /** @type {Window["clHttp"]["setError"]} */
    const setError = (message, error = []) => {
        setErrorEx(errorEl(), message, error);
    };
    window.clHttp.setError = setError;

    /** @type {Window["clHttp"]["setErrorTimeout"]} */
    const setErrorTimeout = (el, err, timeout = 10) => {
        setErrorEx(el, err.message, err.error);
        if (timeout > 0) {
            setTimeout(() => clearErrorEx(el), timeout * 1000);
        }
    };
    window.clHttp.setErrorTimeout = setErrorTimeout;

    /** @type {Window["clHttp"]["setErrorEx"]} */
    const setErrorEx = (el, message, error = []) => {
        if (!el) return;
        showEl(el);
        if (!Array.isArray(error)) {
            error = [error];
        }
        error.unshift(message);
        append(
            el,
            ...error.map((err) =>
                any("p", { innerText: err }, ["request-error-message"])
            )
        );
    };
    window.clHttp.setErrorEx = setErrorEx;

    /** @type {Window["clHttp"]["clearError"]} */
    const clearError = () => {
        clearErrorEx(errorEl());
    };
    window.clHttp.clearError = clearError;

    /** @type {Window["clHttp"]["clearErrorEx"]} */
    const clearErrorEx = (el) => {
        if (!el) return;
        el.innerHTML = "";
        hideEl(el);
    };
    window.clHttp.clearErrorEx = clearErrorEx;

    /** @type {Window["clHttp"]["sendRequest"]} */
    const sendRequest = async (
        path,
        method,
        headers = null,
        body = null,
        errorTimeout = 10,
        errDiv = errorEl()
    ) => {
        showEl(spinnerEl());
        const opts = { method };
        if (method !== "GET" && body) {
            opts.body = JSON.stringify(body);
        }
        if (headers) {
            opts.headers = headers;
        }
        const response = await fetch("/api" + path, opts);
        if (response.ok) {
            hideEl(spinnerEl());
            return { response, err: null };
        }
        let err = unknownError;
        try {
            err = await response.json();
        } catch (_) {}
        if (errorTimeout > 0) {
            setErrorTimeout(errDiv, err, errorTimeout);
        }
        hideEl(spinnerEl());
        return { response: null, err };
    };
    window.clHttp.sendRequest = sendRequest;

    /** @type {Window["clHttp"]["getJson"]} */
    const getJson = async (path, errorTimeout = 10, errDiv = errorEl()) => {
        const result = await sendRequest(
            path,
            "GET",
            null,
            null,
            errorTimeout,
            errDiv
        );
        if (result.err || !result.response.ok) return result;
        return { ...result, data: await getData(result.response) };
    };
    window.clHttp.getJson = getJson;

    /** @type {Window["clHttp"]["postJson"]} */
    const postJson = async (
        path,
        body,
        errorTimeout = 10,
        errDiv = errorEl()
    ) => {
        const result = await sendRequest(
            path,
            "POST",
            { "Content-Type": "application/json" },
            body,
            errorTimeout,
            errDiv
        );
        if (result.err || !result.response.ok) return result;
        return { ...result, data: await getData(result.response) };
    };
    window.clHttp.postJson = postJson;

    /** @type {Window["clHttp"]["delete"]} */
    const deleteReq = async (path, errorTimeout = 10, errDiv = errorEl()) => {
        const result = await sendRequest(
            path,
            "DELETE",
            null,
            null,
            errorTimeout,
            errDiv
        );
        if (result.err || !result.response.ok) return result;
        return { ...result, data: await getData(result.response) };
    };
    window.clHttp.delete = deleteReq;

    ////////////////////////////
    ////////////////////////////
    ////////// CL MODAL ////////
    ////////////////////////////
    ////////////////////////////

    if (!window.clModal) {
        window.clModal = {};
    }

    /** @type {Window["clModal"]["initialize"]} */
    const initializeModal = ({ wrapperId, backdropId, withKeyListener }) => {
        const modalBackdrop = document.getElementById(
            wrapperId ?? "modal-backdrop"
        );
        const modalWrapper = document.getElementById(
            backdropId ?? "modal-wrapper"
        );
        /** @type {ModalQueueItem[]} */
        const modalQueue = [];
        /** @type {ModalQueueItem | null} */
        let modalItem = null;
        /** @type {(() => void) | null} */
        let modalCleanup = null;
        let isModalVisible = false;

        /** @param {boolean} visible */
        const setModalVisible = (visible) => {
            if (visible && modalItem) {
                isModalVisible = true;
                showEl(modalBackdrop, modalWrapper);
                renderModalItem();
            } else {
                isModalVisible = false;
                hideEl(modalBackdrop, modalWrapper);
                if (typeof modalCleanup === "function") {
                    modalCleanup();
                    modalCleanup = null;
                }
                modalItem = null;
                if (modalQueue.length > 0) {
                    popModalQueue();
                }
            }
        };

        const renderModalItem = () => {
            if (!modalItem) return;
            const modal = div({}, "modal");
            if (modalItem.contents instanceof HTMLElement) {
                modal.appendChild(modalItem.contents);
            } else {
                modal.innerHTML = modalItem.contents;
            }
            modal.appendChild(hr());

            const actions = div(
                {
                    ...(modalItem.noConfirm ? { style: "padding:1rem;" } : {}),
                },
                modalItem.noConfirm ? "" : "modal-actions"
            );

            let confirmButton = null;
            if (!modalItem.noConfirm) {
                confirmButton = button(
                    { innerText: modalItem.confirmName || "Confirm" },
                    "primary",
                    modalItem.onConfirm
                );
                actions.appendChild(confirmButton);
            }

            const cancelButton = button(
                {
                    innerText: modalItem.cancelName || "Cancel",
                    ...(modalItem.noConfirm ? { style: "width:100%;" } : {}),
                },
                "secondary",
                modalItem.onCancel
            );

            actions.appendChild(cancelButton);
            modal.appendChild(actions);
            modalWrapper.appendChild(modal);

            const rect = modal.getBoundingClientRect();
            modalWrapper.setAttribute(
                "style",
                `top: calc(50% - (${rect.height}px / 2));left: 50%;`
            );

            modalCleanup = () => {
                modalItem.cleanup();
                modalWrapper.style = "top:50%; left:50%;";
                confirmButton?.removeEventListener(
                    "click",
                    modalItem.onConfirm
                );
                cancelButton.removeEventListener("click", modalItem.onCancel);
                modal.remove();
            };
        };

        const popModalQueue = () => {
            if (isModalVisible || modalItem) return;
            const newItem = modalQueue.shift();
            if (!newItem) return;
            modalItem = newItem;
            setModalVisible(true);
        };

        modalBackdrop.addEventListener("click", () => {
            if (!isModalVisible || !modalItem?.onCancel) return;
            modalItem.onCancel();
        });

        if (withKeyListener) {
            document.addEventListener("keyup", ({ key }) => {
                if (!modalItem) return;
                switch (key) {
                    case "Enter":
                        modalItem.onConfirm();
                        break;
                    case "Escape":
                        modalItem.onCancel();
                        break;
                }
            });
        }
        return {
            visible: () => isModalVisible,
            addItem: (item) => {
                modalQueue.push({
                    ...item,
                    onConfirm: async () => {
                        let show = false;
                        if (typeof item.onConfirm === "function") {
                            show = await item.onConfirm();
                        }
                        if (!show) setModalVisible(show);
                        return show;
                    },
                    onCancel: () => {
                        if (typeof item.onCancel === "function") {
                            item.onCancel();
                        }
                        setModalVisible(false);
                    },
                    cleanup: () => {
                        if (typeof item.cleanup === "function") {
                            item.cleanup();
                        }
                    },
                });
                popModalQueue();
            },
        };
    };
    window.clModal.initialize = initializeModal;

    ////////////////////////////
    ////////////////////////////
    ////////// CL TABLE ////////
    ////////////////////////////
    ////////////////////////////

    if (!window.clTable) {
        window.clTable = {};
    }

    /** @type {Window["clTable"]["initialize"]} */
    const initializeTable = ({
        id,
        prevId,
        nextId,
        sizeId,
        currentPageId,
        maxPageId,
        defaultLimit,
        defaultOffset,
        transform,
        onRender,
        afterRender,
        onInitialize,
        onClick,
        onFetch,
    }) => {
        /** @type {TableState} */
        const state = {
            search: new URLSearchParams(window.location.search),
            data: {},
        };

        const getLimit = () => {
            const l = state.search.get("limit");
            if (l === null) return defaultLimit;
            return Number(l);
        };

        const getOffset = () => {
            const l = state.search.get("offset");
            if (l === null) return defaultOffset;
            return Number(l);
        };

        /**
         * @param {string} key
         * @param {string} value */
        const setSearchSoft = (key, value) => {
            state.search.set(key, value);
            window.history.replaceState(
                null,
                null,
                "?" + state.search.toString()
            );
        };

        setSearchSoft("limit", getLimit());
        setSearchSoft("offset", getOffset());

        /** @type {TableApi["page"]} */
        const page = (() => {
            const currentPage = document.getElementById(
                currentPageId ?? "current-page"
            );
            const maxPage = Number(
                document.getElementById(maxPageId ?? "max-page").innerText
            );
            const current = () => Number(currentPage.innerText);
            const max = () => current() === maxPage;
            const min = () => current() === 1;
            return {
                current,
                max,
                min,
                inc: () => {
                    if (max()) return false;
                    currentPage.innerText = current() + 1;
                    return true;
                },
                dec: () => {
                    if (min()) return false;
                    currentPage.innerText = current() - 1;
                    return true;
                },
            };
        })();

        /** @type {HTMLButtonElement} */
        const prevBtn = document.getElementById(prevId ?? "previous-btn");
        /** @type {HTMLButtonElement} */
        const nextBtn = document.getElementById(nextId ?? "next-btn");
        /** @type {HTMLTableElement} */
        const root = document.getElementById(id);
        /** @type {HTMLTableSectionElement} */
        const body = root.getElementsByTagName("tbody")[0];
        /** @type {string[]} */
        const cols = [...root.querySelectorAll("th")].map((e) =>
            e.innerText.toLowerCase()
        );
        /** @type {TableRow | null} */
        let selectedRow = null;

        const hasData = () => {
            for (const key in state.data) {
                const val = state.data[key];
                if (val && Array.isArray(val) && val.length > 0) {
                    return true;
                }
            }
            return false;
        };

        /**
         * @param {HTMLTableRowElement} tr
         * @returns {TableRow} */
        const createRow = (tr) => {
            const col = (name) => tr.querySelector(`td[data-name=${name}]`);
            return {
                el: tr,
                col,
                val: (name) => col(name).innerText ?? "",
                data: (name, item) =>
                    name
                        ? col(name).dataset[item] ?? ""
                        : tr.dataset[item] ?? "",
                state: () => {
                    const id = strToIntId(tr.id);
                    const data = state.data[page.current()];
                    const item = data.find((e) => e.id === id);
                    return item || null;
                },
                setActive: () => {
                    tr.dataset.isActive = "1";
                },
                setInactive: () => {
                    tr.dataset.isActive = "0";
                },
            };
        };

        /** @type {TableApi["table"]["rows"]} */
        const rows = () =>
            [...body.getElementsByTagName("tr")].map((el) => createRow(el));

        const padRows = () => {
            const r = rows();
            const limit = getLimit();
            if (r.length >= limit) return;
            const diff = limit - r.length;
            for (let i = 0; i < diff; i++) {
                const row = createRow(
                    append(
                        any("tr", {}, onClick ? "clickable-row" : []),
                        ...cols.map((col) => {
                            const td = any("td");
                            td.dataset.name = col;
                            return td;
                        })
                    )
                );
                body.appendChild(
                    onClick ? withListener(row.el, () => onClick(row)) : row.el
                );
            }
        };

        /** @type {TableApi["table"]["rowId"]} */
        const rowId = (id) => `${root.id}-row-${id}`;

        /** @type {TableApi["table"]["cellId"]} */
        const cellId = (id, name) => `${root.id}-row-${id}-data-${name}`;

        /** @type {TableApi["table"]["active"]} */
        const active = () => {
            return rows().find((r) => r.data(null, "isActive") === "1") ?? null;
        };

        /** @param {TableRow | null} [row = null] */
        const highlightActiveSession = (row = null) => {
            const activeRow = row ?? active();
            if (!activeRow) return;
            selectedRow = null;
            activeRow.el.classList.add("selected-row");
            return rows().forEach((r) => {
                if (r.el.id === activeRow.el.id) return;
                r.el.classList.remove("selected-row");
            });
        };

        /** @type {TableApi["table"]["highlight"]} */
        const highlight = (row) => {
            if (row.data(null, "isActive") === "1") {
                return highlightActiveSession(row);
            }
            rows().forEach((r) => {
                if (r.el.id === row.el.id) {
                    if (r.el.classList.contains("selected-row")) {
                        selectedRow = null;
                        r.el.classList.remove("selected-row");
                        return highlightActiveSession();
                    } else {
                        r.el.classList.add("selected-row");
                        selectedRow = r;
                        return;
                    }
                }
                r.el.classList.remove("selected-row");
            });
        };

        /** @type {TableApi["table"]["removeHighlight"]} */
        const removeHighlight = () => {
            selectedRow = null;
            rows().forEach((r) => r.el.classList.remove("selected-row"));
        };

        /**
         * @param {string} col
         * @param {StrObj} data
         * @param {TableRow} row
         * @returns {string | HTMLElement} */
        const handleTransform = (col, data, row) => {
            const val = data[col];
            if (typeof transform === "function") {
                return transform(ctx, col, val, row, data);
            }
            return val;
        };

        /** @type {TableApi["renderCurrentPage"]} */
        const renderCurrentPage = () => {
            const data = state.data[page.current()];
            if (!data) return;
            rows().forEach((row, idx) => {
                const entry = data[idx];
                if (!entry) return hideEl(row.el);
                showEl(row.el);
                cols.forEach((col) => {
                    const cell = row.col(col);
                    const tranformed = handleTransform(col, entry, row);
                    cell.innerHTML = "";
                    if (tranformed instanceof HTMLElement) {
                        cell.appendChild(tranformed);
                    } else {
                        cell.innerText = tranformed;
                    }
                    cell.id = cellId(row.val("id"), col);
                });
                if (typeof onRender === "function") {
                    onRender(ctx, entry, row);
                }
                row.el.id = rowId(row.val("id"));
            });
            if (typeof afterRender === "function") {
                afterRender(ctx, data);
            }
        };

        /**
         * @param {"min" | "max"} pageKey
         * @param {HTMLButtonElement} btn
         * @param {HTMLButtonElement} otherBtn */
        const onPageChangeClick = async (pageKey, btn, otherBtn) => {
            if (page[pageKey]()) return disableBtn(btn);
            const limit = getLimit();
            const offset = getOffset();
            const normalizer = active() ? 1 : 0;
            setSearchSoft(
                "offset",
                pageKey === "min"
                    ? Math.max(offset - (limit - normalizer), 0)
                    : limit + offset - normalizer
            );
            page[pageKey === "min" ? "dec" : "inc"]();
            if (page[pageKey]()) disableBtn(btn);
            enableElIf(!page[pageKey === "min" ? "max" : "min"](), otherBtn);
            const currentPage = page.current();
            if (!state.data[currentPage]) {
                state.data[currentPage] = await onFetch(
                    state.search.toString()
                );
            }
            renderCurrentPage();
        };

        const pageSizeSelect = document.getElementById(sizeId ?? "size-select");
        pageSizeSelect.addEventListener("change", ({ target }) => {
            state.search.set("limit", target.value);
            state.search.set("offset", 0);
            window.location.search = state.search.toString();
        });

        prevBtn.addEventListener(
            "click",
            onPageChangeClick.bind(null, "min", prevBtn, nextBtn)
        );
        nextBtn.addEventListener(
            "click",
            onPageChangeClick.bind(null, "max", nextBtn, prevBtn)
        );

        const hasClickListener = typeof onClick === "function";
        const hasInitialize = typeof onInitialize === "function";

        /** @type {TableApi} */
        const ctx = {
            state,
            table: {
                root,
                body,
                cols,
                rows,
                selected: () => selectedRow,
                active,
                highlight,
                removeHighlight,
                rowId,
                cellId,
            },
            page,
            prevBtn,
            nextBtn,
            getLimit,
            getOffset,
            hasData,
            renderCurrentPage,
        };

        state.data[page.current()] = rows().map((row) => {
            if (hasClickListener) {
                row.el.addEventListener("click", () => onClick(row));
            }
            const initial = hasInitialize ? onInitialize(ctx, row) : {};
            return cols.reduce((acc, col) => {
                if (typeof acc[col] !== "undefined") return acc;
                if (col === "id") {
                    acc[col] = Number(row.val(col));
                } else {
                    acc[col] = row.val(col);
                }
                return acc;
            }, initial);
        });

        padRows();
        renderCurrentPage();

        return ctx;
    };
    window.clTable.initialize = initializeTable;
})();
