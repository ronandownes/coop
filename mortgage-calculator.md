---
layout: doc
handle: Mortgage Lab
title: Mortgage Calculator — Open-Source Decision Lab
nav_order: 65
eyebrow: OPEN · ONLINE · INTERACTIVE
intro: Model house price, deposit, interest rate, term and annual overpayments, then inspect the repayment curves month by month.
---

## Technology choices

This calculator is deliberately built as an **open-source browser application** using **HTML, CSS and vanilla JavaScript**, hosted through **GitHub Pages / Jekyll**.

The mortgage mathematics runs entirely in the browser. There is no paid backend, no proprietary calculation engine and no licence required to use or inspect the model.

**Why this stack?**

- **HTML** provides the inputs, outputs and accessible page structure.
- **CSS** controls the responsive dashboard layout.
- **JavaScript** performs the amortisation calculations and redraws the chart instantly when an assumption changes.
- **Canvas** is used for the interactive repayment curves, including point inspection by mouse, touch or stylus.
- **GitHub Pages / Jekyll** keeps deployment simple, public and reproducible.

### Why not Power BI?

Power BI is highly relevant in business environments because it is strong for governed reporting, shared dashboards, scheduled data refreshes and connecting decision-makers to enterprise data.

It was **not used here by design**. This project is a public financial calculator rather than a reporting dashboard: the user needs fine-grained sliders, immediate amortisation recalculation, annual overpayment logic and interactive curve inspection. A small browser application gives direct control over that behaviour, remains licence-free for the public user, and demonstrates the underlying programming and financial mathematics rather than hiding them behind a BI layer.

A commercial organisation could still take the outputs from this model into **Power BI** for portfolio-level reporting, scenario comparison or management dashboards. The two technologies solve different parts of the problem.

<div class="mortgage-note"><strong>Model convention:</strong> “Deposit” means the cash paid up front. “Annual top-up” means an optional extra lump-sum mortgage repayment made after each 12 months of scheduled repayments.</div>

<div id="mortgageLab" class="mortgage-lab">
  <div class="mortgage-grid">
    <section class="mortgage-controls" aria-label="Mortgage assumptions">
      <h3>Mortgage assumptions</h3>

      <label for="housePrice">House price
        <div class="money-input"><span>€</span><input id="housePrice" type="number" min="0" step="1000" value="400000" inputmode="decimal"></div>
      </label>

      <label for="depositPct">Deposit <output id="depositPctOut">10.0%</output>
        <input id="depositPct" type="range" min="10" max="100" step="0.5" value="10">
      </label>

      <div class="mortgage-inline-readout">
        <span>Deposit cash</span><strong id="depositCash">€40,000</strong>
      </div>

      <label for="interestRate">Interest rate <output id="interestRateOut">2.2%</output>
        <input id="interestRate" type="range" min="0" max="9.9" step="0.1" value="2.2">
      </label>

      <label for="termYears">Mortgage term <output id="termYearsOut">30 years</output>
        <input id="termYears" type="range" min="0" max="35" step="1" value="30">
      </label>

      <label for="annualExtra">Annual top-up / overpayment
        <div class="money-input"><span>€</span><input id="annualExtra" type="number" min="0" step="100" value="0" inputmode="decimal"></div>
      </label>
      <p class="mortgage-help">Applied after every 12 scheduled monthly payments and automatically capped at the remaining balance.</p>

      <button type="button" id="resetMortgage" class="mortgage-reset">Reset assumptions</button>
      <p id="mortgageValidation" class="mortgage-validation" role="status" aria-live="polite"></p>
    </section>

    <section class="mortgage-output" aria-label="Mortgage results">
      <div class="mortgage-kpis">
        <div><span>Mortgage required</span><strong id="loanKpi">—</strong></div>
        <div><span>Monthly repayment</span><strong id="monthlyKpi">—</strong></div>
        <div><span>Payoff time</span><strong id="payoffKpi">—</strong></div>
        <div><span>Total interest</span><strong id="interestKpi">—</strong></div>
        <div><span>Total mortgage payments</span><strong id="totalPaidKpi">—</strong></div>
        <div><span>Interest saved by top-ups</span><strong id="savedKpi">—</strong></div>
      </div>

      <div class="mortgage-chart-card">
        <div class="mortgage-chart-heading">
          <div>
            <h3>Repayment curves</h3>
            <p>Move across the chart or tap it to inspect exact monthly values.</p>
          </div>
          <div class="mortgage-legend" aria-hidden="true">
            <span><i class="balance-dot"></i>Balance</span>
            <span><i class="principal-dot"></i>Principal repaid</span>
            <span><i class="interest-dot"></i>Interest paid</span>
          </div>
        </div>
        <div class="mortgage-canvas-wrap">
          <canvas id="mortgageChart" width="960" height="460" aria-label="Interactive mortgage balance, principal and interest curves"></canvas>
          <div id="mortgageTooltip" class="mortgage-tooltip" hidden></div>
        </div>
      </div>

      <div class="mortgage-summary-grid">
        <div><span>House price</span><strong id="houseKpi">—</strong></div>
        <div><span>Initial deposit</span><strong id="depositKpi">—</strong></div>
        <div><span>Top-ups actually used</span><strong id="extraUsedKpi">—</strong></div>
      </div>
    </section>
  </div>
</div>

## What the model is doing

For a standard repayment mortgage, the monthly payment is calculated from the principal, monthly interest rate and number of monthly payments. The model then simulates the mortgage **month by month**, splitting each payment into interest and principal.

When an annual top-up is entered, the simulator applies that extra payment after each completed year, reducing the outstanding principal. That can shorten the payoff period and reduce later interest.

At a **0% interest rate**, the model simply divides principal by the number of months. At a **100% deposit**, the mortgage required is zero and the house is treated as a cash purchase. A term of **0 years** is therefore only valid when no mortgage is required.

## Decision-support purpose

The point is not just to produce one repayment number. It is to let a user change the assumptions and see the **shape of the financing decision**: how a larger deposit changes borrowing, how rate changes affect interest, how term changes trade monthly affordability against total interest, and how recurring overpayments accelerate principal reduction.

<link rel="stylesheet" href="{{ '/assets/mortgage-calculator.css' | relative_url }}">
<script defer src="{{ '/assets/mortgage-calculator.js' | relative_url }}"></script>
