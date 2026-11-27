// DealBeacon finder logic: filter, sort and render the deals in deals.js.
// No network requests: everything renders from the local DEALS array.
(function () {
  "use strict";

  var VERDICT_RANK = { "NEW LOW": 0, STRONG: 1, ROUTINE: 2 };
  var VERDICT_CLASS = {
    "NEW LOW": "badge-newlow",
    STRONG: "badge-strong",
    ROUTINE: "badge-routine"
  };

  var searchEl = document.getElementById("search");
  var categoryEl = document.getElementById("category");
  var storeEl = document.getElementById("store");
  var mindiscEl = document.getElementById("mindisc");
  var sortEl = document.getElementById("sort");
  var dealsEl = document.getElementById("deals");
  var countEl = document.getElementById("result-count");
  var compareEl = document.getElementById("compare");

  function money(n) {
    return "$" + n.toFixed(2).replace(/\.00$/, "");
  }

  function discountPct(deal) {
    return Math.round(((deal.usual - deal.sale) / deal.usual) * 100);
  }

  function saved(deal) {
    return deal.usual - deal.sale;
  }

  function currentFilters() {
    return {
      q: searchEl.value.trim().toLowerCase(),
      cat: categoryEl.value,
      store: storeEl.value,
      mindisc: Number(mindiscEl.value),
      sort: sortEl.value
    };
  }

  function matches(deal, f) {
    if (f.cat && deal.cat !== f.cat) return false;
    if (f.store && deal.store !== f.store) return false;
    if (discountPct(deal) < f.mindisc) return false;
    if (f.q) {
      var hay = (deal.name + " " + deal.store + " " + deal.cat).toLowerCase();
      if (hay.indexOf(f.q) === -1) return false;
    }
    return true;
  }

  function sortDeals(list, mode) {
    var sorted = list.slice();
    if (mode === "disc") {
      sorted.sort(function (a, b) {
        return discountPct(b) - discountPct(a) || saved(b) - saved(a);
      });
    } else if (mode === "save") {
      sorted.sort(function (a, b) {
        return saved(b) - saved(a) || discountPct(b) - discountPct(a);
      });
    } else if (mode === "verdict") {
      sorted.sort(function (a, b) {
        return (
          VERDICT_RANK[a.verdict] - VERDICT_RANK[b.verdict] ||
          discountPct(b) - discountPct(a)
        );
      });
    } else if (mode === "price-asc") {
      sorted.sort(function (a, b) {
        return a.sale - b.sale;
      });
    }
    return sorted;
  }

  function dealCard(deal) {
    var pct = discountPct(deal);
    var card = document.createElement("article");
    card.className = "deal";

    var top = document.createElement("div");
    top.className = "deal-top";
    var store = document.createElement("span");
    store.className = "store";
    store.textContent = deal.store;
    var cat = document.createElement("span");
    cat.className = "cat";
    cat.textContent = deal.cat;
    top.appendChild(store);
    top.appendChild(cat);
    card.appendChild(top);

    var name = document.createElement("h3");
    name.textContent = deal.name;
    card.appendChild(name);

    var prices = document.createElement("div");
    prices.className = "prices";
    var sale = document.createElement("span");
    sale.className = "sale";
    sale.textContent = money(deal.sale);
    var usual = document.createElement("span");
    usual.className = "usual";
    usual.textContent = money(deal.usual);
    var badge = document.createElement("span");
    badge.className = "badge " + VERDICT_CLASS[deal.verdict];
    badge.textContent = deal.verdict;
    prices.appendChild(sale);
    prices.appendChild(usual);
    prices.appendChild(badge);
    card.appendChild(prices);

    var saveLine = document.createElement("p");
    saveLine.className = "save-line";
    var saveStrong = document.createElement("strong");
    saveStrong.textContent = "Save " + money(saved(deal)) + " (" + pct + "% off)";
    saveLine.appendChild(saveStrong);
    card.appendChild(saveLine);

    var evidence = document.createElement("p");
    evidence.className = "evidence";
    evidence.textContent = deal.evidence;
    card.appendChild(evidence);

    var meta = document.createElement("p");
    meta.className = "meta";
    meta.textContent = "Checked 27 Nov 2026 · Source: " + deal.source;
    card.appendChild(meta);

    var link = document.createElement("a");
    link.className = "deal-link";
    link.href = deal.link;
    link.target = "_blank";
    link.rel = "noopener";
    link.textContent = "View at " + deal.store + " →";
    card.appendChild(link);

    return card;
  }

  function renderCompare() {
    var groups = {};
    DEALS.forEach(function (deal) {
      if (!deal.group) return;
      groups[deal.group] = groups[deal.group] || [];
      groups[deal.group].push(deal);
    });
    compareEl.textContent = "";
    Object.keys(groups).forEach(function (key) {
      var members = groups[key];
      if (members.length < 2) return;
      var cheapest = members.reduce(function (a, b) {
        return b.sale < a.sale ? b : a;
      });
      var card = document.createElement("div");
      card.className = "compare-card";
      var title = document.createElement("h2");
      title.textContent = "Same product, two stores: " + members[0].name;
      card.appendChild(title);
      members.forEach(function (deal) {
        var line = document.createElement("p");
        var label = document.createElement("span");
        label.textContent = deal.store + ": " + money(deal.sale);
        line.appendChild(label);
        if (deal === cheapest) {
          var win = document.createElement("span");
          win.className = "winner";
          win.textContent = " — cheapest here";
          line.appendChild(win);
        }
        card.appendChild(line);
      });
      var note = document.createElement("p");
      var gap = Math.abs(members[0].sale - members[1].sale);
      note.textContent =
        gap === 0
          ? "Both stores charge the same price today."
          : "Buying at " +
            cheapest.store +
            " saves " +
            money(gap) +
            " on the same product.";
      card.appendChild(note);
      compareEl.appendChild(card);
    });
  }

  function render() {
    var f = currentFilters();
    var list = sortDeals(
      DEALS.filter(function (deal) {
        return matches(deal, f);
      }),
      f.sort
    );
    dealsEl.textContent = "";
    if (list.length === 0) {
      var empty = document.createElement("div");
      empty.className = "empty";
      var msg = document.createElement("p");
      msg.textContent = "No deals match those filters.";
      var reset = document.createElement("button");
      reset.type = "button";
      reset.textContent = "Clear all filters";
      empty.appendChild(msg);
      empty.appendChild(reset);
      dealsEl.appendChild(empty);
    } else {
      list.forEach(function (deal) {
        dealsEl.appendChild(dealCard(deal));
      });
    }
    countEl.textContent =
      "Showing " + list.length + " of " + DEALS.length + " deals";
  }

  function renderStats() {
    var stores = {};
    var cats = {};
    DEALS.forEach(function (deal) {
      stores[deal.store] = true;
      cats[deal.cat] = true;
    });
    document.getElementById("stat-deals").textContent = String(DEALS.length);
    document.getElementById("stat-stores").textContent = String(
      Object.keys(stores).length
    );
    document.getElementById("stat-cats").textContent = String(
      Object.keys(cats).length
    );
  }

  // Search filters live as you type (input only): a change listener on the
  // search box would re-render when it loses focus, which rebuilds the
  // empty-state button between mousedown and mouseup and eats its click.
  searchEl.addEventListener("input", render);
  [categoryEl, storeEl, mindiscEl, sortEl].forEach(function (el) {
    el.addEventListener("change", render);
  });

  // The reset button lives inside content render() rebuilds, so handle its
  // clicks on the deals container, which never leaves the page.
  dealsEl.addEventListener("click", function (event) {
    var target = event.target;
    if (target && target.closest && target.closest(".empty button")) {
      searchEl.value = "";
      categoryEl.value = "";
      storeEl.value = "";
      mindiscEl.value = "0";
      sortEl.value = "disc";
      render();
    }
  });

  renderStats();
  renderCompare();
  render();
})();
