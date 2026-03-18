/* ============================================================
   js/lol-widget.js
   Consulta /api/lol-stats y actualiza el banner de LoL
   con rango, stats y puntos de maestría en tiempo real.
   ============================================================ */

(function () {

  var TIER_ES = {
    IRON:'Hierro', BRONZE:'Bronce', SILVER:'Plata', GOLD:'Oro',
    PLATINUM:'Platino', EMERALD:'Esmeralda', DIAMOND:'Diamante',
    MASTER:'Master', GRANDMASTER:'Gran Master', CHALLENGER:'Challenger'
  };

  var TIER_COLOR = {
    IRON:'#94a3b8', BRONZE:'#cd7f32', SILVER:'#94a3b8', GOLD:'#fbbf24',
    PLATINUM:'#2dd4bf', EMERALD:'#4ade80', DIAMOND:'#818cf8',
    MASTER:'#c084fc', GRANDMASTER:'#f87171', CHALLENGER:'#38bdf8'
  };

  function renderStats(data) {
    var solo = data.solo;

    /* Rango */
    if (solo) {
      var color = TIER_COLOR[solo.tier] || '#4ade80';
      var tier  = TIER_ES[solo.tier]    || solo.tier;

      var titleEl = document.getElementById('lol-rank-title');
      if (titleEl) {
        titleEl.innerHTML =
          '<span style="color:' + color + '">' + tier + ' ' + solo.rank + '</span>' +
          '<br><span id="lol-summoner">' + data.summoner.name + ' · ' + data.summoner.tag + '</span>';
      }

      var playedEl  = document.getElementById('lol-played');
      var winrateEl = document.getElementById('lol-winrate');
      var winsEl    = document.getElementById('lol-wins');

      if (playedEl)  playedEl.textContent  = solo.played;
      if (winrateEl) winrateEl.textContent = solo.winrate + '%';
      if (winsEl)    winsEl.textContent    = solo.wins;
    }

    /* Mains con maestría */
    if (data.mains) {
      var mainsEl = document.getElementById('lol-mains-col');
      if (mainsEl) {
        mainsEl.innerHTML = data.mains.map(function (m) {
          return '<div class="main-pill">' +
            '<span class="main-pill-dot" style="background:' + m.color + '"></span>' +
            '<span>' + m.name + '</span>' +
            '<span class="main-pill-role">' + m.role + '</span>' +
            '<span class="main-mastery">' + m.masteryFmt + '</span>' +
          '</div>';
        }).join('');
      }
    }
  }

  function renderError() {
    console.warn('No se pudieron cargar los stats de LoL.');
  }

  fetch('/api/lol-stats')
    .then(function (r) { return r.json(); })
    .then(function (data) {
      if (data.error) { renderError(); return; }
      renderStats(data);
    })
    .catch(renderError);

})();
