// ==UserScript==
// @name         Sayfa Gezgini
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  İnsan gibi gezinme, süre/sayfa bilgisi ve her yeni sayfadan URL alma.
// @author       Seyit Ahmet TANRIVER
// @match        *://*/*
// @grant        none
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// ==/UserScript==

(function () {
    'use strict';

    // Configurations
    let scrollIntervals = [1000, 2000, 3000];  // Varsayılan hız
    const transitionTime = 2000;

    // State management
    const storageKey = "akilliLinkAciciDurumu";
    function saveState(state) {
        localStorage.setItem(storageKey, JSON.stringify(state));
    }
    function loadState() {
        const state = localStorage.getItem(storageKey);
        return state
            ? JSON.parse(state)
            : { isRunning: false, pagesVisited: 0, startTime: null, elapsedPausedTime: 0, lastOpenedLink: null, scrollSpeed: 'slow', baseUrl: window.location.hostname };
    }
    function clearState() {
        localStorage.removeItem(storageKey);
    }

    // Scroll function
    async function scrollPageRandomly() {
        const maxScrollHeight = document.body.scrollHeight;
        const positions = [0, maxScrollHeight / 4, maxScrollHeight / 2, (maxScrollHeight * 3) / 4, maxScrollHeight];

        for (let i = 0; i < 5; i++) {
            const randomPosition = positions[Math.floor(Math.random() * positions.length)];
            window.scrollTo({ top: randomPosition, behavior: "smooth" });

            const randomInterval = scrollIntervals[Math.floor(Math.random() * scrollIntervals.length)];
            await new Promise((r) => setTimeout(r, randomInterval));
        }
    }

    // Extract links
    function extractLinks() {
        return $('a[href]')
            .map(function () {
                return $(this).attr('href');
            })
            .get()
            .filter((href) => href && !href.startsWith("#") && !href.startsWith("javascript"));
    }

    // Filter links based on domain
    function filterLinksByDomain(links, baseUrl) {
        return links.filter((href) => {
            if (href.startsWith('/')) return true; // relative links
            try {
                const url = new URL(href);
                return url.hostname === baseUrl; // links that belong to the same domain
            } catch (e) {
                return false;
            }
        });
    }

    // Process links
    async function processLinks() {
        const state = loadState();
        const links = extractLinks();
        const filteredLinks = filterLinksByDomain(links, state.baseUrl);

        if (filteredLinks.length === 0) {
            alert("Sayfada geçerli bir bağlantı bulunamadı!");
            stopProcess();
            return;
        }

        // Rastgele bir link seç
        let nextLink;
        do {
            nextLink = filteredLinks[Math.floor(Math.random() * filteredLinks.length)];
        } while (nextLink === state.lastOpenedLink); // Aynı linki tekrar seçmemeye çalış

        state.pagesVisited++;
        state.lastOpenedLink = nextLink;
        saveState(state);

        window.location.href = nextLink;
    }

    // Toggle process
    function toggleProcess() {
        const state = loadState();
        if (state.isRunning) {
            stopProcess();
        } else {
            startProcess();
        }
    }

    function startProcess() {
        const state = loadState();
        state.isRunning = true;

        if (!state.startTime) {
            state.startTime = Date.now();
        }

        saveState(state);
        updatePanel();
        disableScrollSpeed();  // Disable scroll speed selector during process
        processLinks();
    }

    function stopProcess() {
        const state = loadState();
        state.isRunning = false;
        state.elapsedPausedTime += Date.now() - state.startTime;
        state.startTime = null; // Start time sıfırlanmaz, süreç durdurulur.
        saveState(state);
        updatePanel();
        enableScrollSpeed();  // Re-enable scroll speed selector after process
    }

   function resetProcess() {
    clearState();
    const state = loadState();
    state.scrollSpeed = 'fast';  // Scroll speed'i varsayılan olarak 'fast' olarak ayarla
    saveState(state);
    $('#scrollSpeed').val('fast');  // Dropdown menüsünü 'fast' olarak ayarla
    updatePanel();
}


    // Format elapsed time
    function formatElapsedTime(milliseconds) {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
        const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
        const seconds = String(totalSeconds % 60).padStart(2, "0");
        return `${hours}:${minutes}:${seconds}`;
    }

    function getElapsedTime() {
        const state = loadState();
        if (!state.startTime) return state.elapsedPausedTime;

        if (state.isRunning) {
            return Date.now() - state.startTime + state.elapsedPausedTime;
        } else {
            return state.elapsedPausedTime;
        }
    }

    function updatePanel() {
        const state = loadState();
        const elapsedTime = getElapsedTime();

        $('#processButton').text(state.isRunning ? "Durdur" : "Başlat");
        $('#resetButton').prop("disabled", state.isRunning);
        $('#infoPanel').html(`
            <p>Gezilen Sayfa Sayısı: <strong>${state.pagesVisited}</strong></p>
            <p>Geçen Süre: <strong>${formatElapsedTime(elapsedTime)}</strong></p>
        `);

                $('#scrollSpeed').prop('disabled', state.isRunning);

    }

    // Disable and enable scroll speed dropdown
    function disableScrollSpeed() {
        $('#scrollSpeed').prop('disabled', true);
    }

    function enableScrollSpeed() {
        $('#scrollSpeed').prop('disabled', false);
    }


    const panelHtml = `
    <div id="linkOpenerPanel" style="position: fixed; top: 10px; right: 10px; background: #f8f9fa; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); border-radius: 8px; width: 300px; z-index: 10000; padding: 20px; font-family: Arial, sans-serif;">
        <!-- Close Button -->
        <button id="closeButton" style="background: transparent; border: none; position: absolute; top: 10px; right: 10px; font-size: 20px; color: #343a40; cursor: pointer;">&times;</button>

        <h4 style="margin: 0 0 10px; color: #343a40;">Sayfa Gezgini</h4>
        <button id="processButton" style="background: #007bff; color: white; border: none; padding: 10px 20px; margin-bottom: 10px; border-radius: 5px; cursor: pointer; width: 100%;">Başlat</button>
        <button id="resetButton" style="background: #dc3545; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; width: 100%;">Sıfırla</button>

        <!-- Hızlı ve Yavaş Gezinti Seçenekleri -->
        <div style="margin-top: 15px;">
            <label for="scrollSpeed">Gezinti Hızı:</label>
            <select id="scrollSpeed" style="width: 100%; padding: 5px; margin-top: 5px;">
                <option value="fast">Hızlı Gezinti</option>
                <option value="slow">Yavaş Gezinti</option>
            </select>
        </div>

        <div id="infoPanel" style="margin-top: 15px; color: #495057;">
            <p>Gezilen Sayfa Sayısı: <strong>0</strong></p>
            <p>Geçen Süre: <strong>00:00:00</strong></p>
        </div>

        <!-- Geliştirici Bilgisi -->
        <div style="margin-top: 20px; font-size: 14px; color: #495057; font-weight: bold;">
            <p>Geliştirici:<a href="https://wa.me/31637952159" style="color: #007bff; text-decoration: none;" target="_blank">Seyit Ahmet TANRIVER</a></p>
        </div>
    </div>
`;

    $('body').append(panelHtml);

    // Event listener for scroll speed change
    $('#scrollSpeed').on('change', function () {
        const selectedSpeed = $(this).val();
        if (selectedSpeed === 'fast') {
            scrollIntervals = [500, 1000, 1500];
        } else {
            scrollIntervals = [2000, 3000, 4000];
        }

        const state = loadState();
        state.scrollSpeed = selectedSpeed;  // Update scroll speed in state
        saveState(state);
    });

     $('#closeButton').on('click', function() {
        $('#linkOpenerPanel').hide();  // Hide the panel when "X" is clicked
    });

    // Set initial scroll speed based on stored value
    const storedSpeed = loadState().scrollSpeed;
    if (storedSpeed === 'fast') {
        scrollIntervals = [500, 1000, 1500];
        $('#scrollSpeed').val('fast');
    } else {
        scrollIntervals = [2000, 3000, 4000];
        $('#scrollSpeed').val('slow');
    }

    $('#processButton').on('click', toggleProcess);
    $('#resetButton').on('click', resetProcess);

    const state = loadState();
    if (state.isRunning) {
        (async function () {
            updatePanel();
            await scrollPageRandomly();
            await new Promise((r) => setTimeout(r, transitionTime));
            processLinks();
        })();
    }

    setInterval(updatePanel, 1000);
})();
