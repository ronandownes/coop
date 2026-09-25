---
layout: doc
handle: Lease Dashboard
title: Aircraft Leasing Decision Lab
eyebrow: OPEN · ONLINE · INTERACTIVE
intro: Explore illustrative lease, re-lease and residual-value scenarios for regional turboprop aircraft. Built as a static browser app with no proprietary BI platform.
---

## What this dashboard demonstrates

This is a **decision-support project**, not an attempt to reproduce Abelo's confidential pricing or valuation models.

It connects Financial Mathematics, statistics, accounting and asset management by letting a user change assumptions and immediately see the consequences.

**Model chain:** aircraft age → lease cash flow → costs → discounting → residual value → NPV → decision.

<div class="lease-note">
<strong>Important:</strong> All monetary defaults are illustrative assumptions for interview practice. They are not Abelo lease rates, aircraft valuations or internal forecasts.
</div>

<div id="leaseLab" class="lease-lab">
  <div class="lease-tabs" role="tablist" aria-label="Aircraft leasing dashboards">
    <button class="lease-tab active" data-tab="single" type="button">Single aircraft</button>
    <button class="lease-tab" data-tab="relet" type="button">Re-lease decision</button>
    <button class="lease-tab" data-tab="scenarios" type="button">Scenario comparison</button>
    <button class="lease-tab" data-tab="lineage" type="button">Fleet lineage</button>
  </div>

  <section class="lease-panel active" data-panel="single">
    <div class="lease-grid">
      <div class="lease-controls">
        <h3>Single-aircraft lease & value curve</h3>
        <p>Start with an aircraft at any age — for example a six-year-old aircraft entering a new lease — and model its next economic chapter.</p>
        <label>Aircraft family
          <select id="aircraftType">
            <option value="atr42">ATR 42-600</option>
            <option value="atr72" selected>ATR 72-600</option>
            <option value="d8-100">Dash 8-100 · historical</option>
            <option value="d8-300">Dash 8-300 · historical</option>
            <option value="d8-400">Dash 8-400 · historical</option>
          </select>
        </label>
        <label>Starting aircraft age <output id="ageOut"></output>
          <input id="startAge" type="range" min="0" max="30" step="1" value="6">
        </label>
        <label>Current asset value <output id="valueOut"></output>
          <input id="startValue" type="range" min="2" max="40" step="0.5" value="18">
        </label>
        <label>Monthly lease income <output id="leaseOut"></output>
          <input id="monthlyLease" type="range" min="40" max="350" step="5" value="180">
        </label>
        <label>Analysis horizon <output id="horizonOut"></output>
          <input id="horizon" type="range" min="3" max="15" step="1" value="8">
        </label>
        <label>Discount rate <output id="discountOut"></output>
          <input id="discountRate" type="range" min="2" max="15" step="0.25" value="8">
        </label>
        <label>Annual value decline <output id="declineOut"></output>
          <input id="valueDecline" type="range" min="1" max="12" step="0.25" value="5">
        </label>
        <label>Annual asset / maintenance cost <output id="costOut"></output>
          <input id="annualCost" type="range" min="0" max="1.5" step="0.05" value="0.35">
        </label>
      </div>

      <div class="lease-output">
        <div class="lease-kpis">
          <div><span>NPV incl. residual</span><strong id="npvKpi">—</strong></div>
          <div><span>End residual value</span><strong id="residualKpi">—</strong></div>
          <div><span>Gross lease income</span><strong id="incomeKpi">—</strong></div>
          <div><span>End aircraft age</span><strong id="endAgeKpi">—</strong></div>
        </div>
        <div class="lease-chart-card">
          <h3>Asset value and cumulative discounted cash</h3>
          <canvas id="singleChart" width="920" height="420" aria-label="Aircraft asset value and discounted cash flow chart"></canvas>
        </div>
        <div class="lease-mini-grid">
          <div>
            <h3>How to read it</h3>
            <p>The value curve estimates how the asset value changes from the selected starting age. The cash curve shows discounted net lease income accumulating through the scenario.</p>
          </div>
          <div>
            <h3>Interview connection</h3>
            <p><strong>“I can change an assumption, see the effect on cash flow and asset value, and then explain which assumption is driving the decision.”</strong></p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="lease-panel" data-panel="relet">
    <div class="lease-grid">
      <div class="lease-controls">
        <h3>Extend or re-lease?</h3>
        <p>Compare keeping the aircraft with its current operator against taking downtime and transition cost to place it on a new lease.</p>
        <label>Aircraft age at decision <output id="reAgeOut"></output>
          <input id="reAge" type="range" min="3" max="25" step="1" value="8">
        </label>
        <label>Current monthly lease <output id="reLeaseOut"></output>
          <input id="reLease" type="range" min="40" max="350" step="5" value="170">
        </label>
        <label>New lease change <output id="newLeaseDeltaOut"></output>
          <input id="newLeaseDelta" type="range" min="-30" max="30" step="1" value="8">
        </label>
        <label>Transition downtime <output id="downtimeOut"></output>
          <input id="downtime" type="range" min="0" max="12" step="1" value="4">
        </label>
        <label>Transition / remarketing cost <output id="transitionCostOut"></output>
          <input id="transitionCost" type="range" min="0" max="2" step="0.05" value="0.6">
        </label>
        <label>Decision horizon <output id="reHorizonOut"></output>
          <input id="reHorizon" type="range" min="3" max="10" step="1" value="6">
        </label>
      </div>

      <div class="lease-output">
        <div class="lease-kpis">
          <div><span>Extend NPV</span><strong id="extendNpv">—</strong></div>
          <div><span>Re-lease NPV</span><strong id="reletNpv">—</strong></div>
          <div><span>Difference</span><strong id="decisionDelta">—</strong></div>
          <div><span>Model result</span><strong id="decisionLabel">—</strong></div>
        </div>
        <div class="lease-chart-card">
          <h3>Discounted cash-flow comparison</h3>
          <canvas id="reletChart" width="920" height="420" aria-label="Extend versus re-lease discounted cash flow chart"></canvas>
        </div>
        <div class="lease-note">
          This is deliberately a simplified decision model. Real lessor decisions may also include maintenance status, return conditions, credit risk, taxes, financing, records, jurisdiction, technical modifications and market availability.
        </div>
      </div>
    </div>
  </section>

  <section class="lease-panel" data-panel="scenarios">
    <h3>Three-way scenario comparison</h3>
    <p>Use one set of aircraft assumptions, then stress the model. The purpose is to show sensitivity rather than claim a single “correct” valuation.</p>
    <div class="scenario-cards" id="scenarioCards"></div>
    <div class="lease-chart-card">
      <h3>NPV under conservative, base and upside assumptions</h3>
      <canvas id="scenarioChart" width="920" height="420" aria-label="Scenario NPV comparison chart"></canvas>
    </div>
    <div class="lease-mini-grid">
      <div><h3>Conservative</h3><p>Higher discount rate, faster value decline and weaker lease income.</p></div>
      <div><h3>Base</h3><p>Uses the assumptions selected in the single-aircraft dashboard.</p></div>
      <div><h3>Upside</h3><p>Lower discount rate, slower value decline and stronger lease income.</p></div>
    </div>
  </section>

  <section class="lease-panel" data-panel="lineage">
    <h3>ATR focus with historical Dash 8 context</h3>
    <p>Abelo's current public positioning is strongly centred on ATR aircraft, but its history comes through Elix Aviation's broader turboprop portfolio. Dash 8 aircraft therefore belong here as <strong>historical context</strong>, not as a claim about the present fleet.</p>

    <div class="lineage-grid">
      <article>
        <span class="lineage-tag">CURRENT FOCUS</span>
        <h3>ATR 42 family</h3>
        <p>Smaller regional turboprop family. Useful in the dashboard for lower-capacity route and asset scenarios.</p>
      </article>
      <article>
        <span class="lineage-tag">CURRENT FOCUS</span>
        <h3>ATR 72 family</h3>
        <p>Larger ATR family and central to Abelo's modern turboprop strategy.</p>
      </article>
      <article>
        <span class="lineage-tag historical">HISTORICAL CONTEXT</span>
        <h3>Dash 8-100 / 200 / 300</h3>
        <p>Earlier Dash 8 variants. The family remains useful for understanding the inherited regional-turboprop market and ageing-asset decisions.</p>
      </article>
      <article>
        <span class="lineage-tag historical">HISTORICAL CONTEXT</span>
        <h3>Dash 8-400 / Q400</h3>
        <p>The later, higher-capacity Dash 8 variant. “Q400” is a widely recognised Bombardier-era name; De Havilland Canada now markets the aircraft as the Dash 8-400.</p>
      </article>
    </div>

    <div class="lease-note">
      <strong>Historical anchor:</strong> Abelo announced the sale of a Dash 8-100 in July 2022, shortly after the Elix–ADARE combination created Abelo. This makes Dash 8 a legitimate part of the historical asset-management story while keeping the present-day ATR focus clear.
    </div>
  </section>
</div>

## What Erik can say in the interview

**“I wanted to go beyond reading about aircraft leasing, so I built an interactive decision-support model. It lets me start with an aircraft at a particular age, model lease cash flows and residual value, stress the assumptions, and compare an extension with a re-lease decision. The figures are illustrative, but the project shows how I approach a commercial problem: model it, test the assumptions and communicate the result clearly.”**

## Technical stack

This dashboard uses **plain HTML, CSS and JavaScript in the browser**. It is static, inspectable and deployable on GitHub Pages without Power BI, a proprietary BI licence or a paid backend.

<link rel="stylesheet" href="{{ '/assets/lease-dashboard.css' | relative_url }}">
<script defer src="{{ '/assets/lease-dashboard.js' | relative_url }}"></script>
