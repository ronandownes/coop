---
layout: doc
handle: Finance & Lease Lab
title: Residential & Aircraft Finance — Decision Lab
nav_order: 65
eyebrow: OPEN · ONLINE · INTERACTIVE
intro: Start with a residential mortgage, then use the same cash-flow thinking to understand aircraft ownership, financing, leasing, options and residual value.
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


## Residential rent and aircraft leasing | Same skeleton, different world

At the simplest level, the relationship is recognisable:

**Landlord → house → tenant → rent**

**Aircraft lessor → aircraft → airline → lease rentals**

In both cases, the owner supplies the use of an asset for a period in return for recurring payments. But an aircraft lease is a large, negotiated commercial contract with technical, maintenance, insurance, return-condition, jurisdiction, default and repossession provisions that have no close residential equivalent.

For Irish residential property, rent is also constrained by tenancy law. From **1 March 2026**, national rent-control rules generally limit annual increases to **2% or CPI inflation, whichever is lower**, subject to stated exceptions. That means a landlord cannot simply say “my mortgage rate rose, so I will raise the rent by the same amount.” [RTB — current rent-setting rules](https://rtb.ie/renting/setting-and-reviewing-private-rents-from-1-march-2026/)

### Who is financing the owner?

A useful way to extend the analogy is:

**Mortgage bank → homeowner/landlord → house → tenant**

**Banks / investors → aircraft lessor → aircraft → airline**

This is not hypothetical for Abelo. In 2024 Abelo announced a **$190 million financing facility covering 20 turboprop aircraft**, with MUFG, Deutsche Bank and Société Générale participating. In May 2025 it announced an **up-to-$750 million warehouse financing facility** arranged by Deutsche Bank and MUFG to support fleet growth.

So an aircraft lessor does not have to fund every acquisition entirely with cash equity. The lessor can combine investor capital with secured or corporate debt, acquire aircraft, lease them to airlines, and manage the difference between financing cost, lease income, asset costs and residual value.

### If both sides want out of an aircraft lease

The lease is binding according to its negotiated terms. An airline normally cannot simply hand the aircraft back because it no longer wants it, and the lessor normally cannot simply take it back because another customer offers more money.

If **both sides agree**, however, commercial contracts can generally be restructured by agreement. Depending on the actual lease this can involve an agreed early termination, lease amendment, buy-out, novation to another operator, sale of the aircraft subject to the lease, or an agreed return.

If only one side wants out, the contract matters. Aircraft leases commonly contain detailed **events of default, cure periods, termination rights, return conditions and remedies**. Enforcement also depends on governing law, aircraft registration, international conventions and local insolvency/repossesssion rules. So the correct interview answer is not “the lease can never be broken”; it is **“it is binding, but the contract defines the routes out.”**

## Aircraft version | Lessor economics

The model below is deliberately illustrative. It is **not Abelo pricing**. It is a way to see the extra layer that does not exist in the residential mortgage calculator: a lessor may borrow to acquire the asset and then lease that asset to somebody else.

<div id="aircraftFinanceLab" class="mortgage-lab">
  <div class="mortgage-grid">
    <section class="mortgage-controls" aria-label="Aircraft finance assumptions">
      <h3>Illustrative lessor assumptions</h3>

      <label>Aircraft acquisition price
        <div class="money-input"><span>€m</span><input id="airPrice" type="number" min="0" step="0.5" value="20"></div>
      </label>

      <label>Equity contribution <output id="airEquityOut">30%</output>
        <input id="airEquity" type="range" min="0" max="100" step="5" value="30">
      </label>

      <label>Debt interest rate <output id="airDebtRateOut">5.0%</output>
        <input id="airDebtRate" type="range" min="0" max="12" step="0.25" value="5">
      </label>

      <label>Debt amortisation term <output id="airDebtTermOut">10 years</output>
        <input id="airDebtTerm" type="range" min="1" max="20" step="1" value="10">
      </label>

      <label>Monthly airline lease rental
        <div class="money-input"><span>€k</span><input id="airRent" type="number" min="0" step="5" value="180"></div>
      </label>

      <label>Airline lease term <output id="airLeaseTermOut">8 years</output>
        <input id="airLeaseTerm" type="range" min="1" max="15" step="1" value="8">
      </label>

      <label>Annual owner / asset cost
        <div class="money-input"><span>€k</span><input id="airAnnualCost" type="number" min="0" step="25" value="350"></div>
      </label>

      <label>Illustrative residual value <output id="airResidualOut">45%</output>
        <input id="airResidual" type="range" min="0" max="100" step="5" value="45">
      </label>
    </section>

    <section class="mortgage-output" aria-label="Aircraft finance results">
      <div class="mortgage-kpis">
        <div><span>Equity invested</span><strong id="airEquityKpi">—</strong></div>
        <div><span>Acquisition debt</span><strong id="airDebtKpi">—</strong></div>
        <div><span>Illustrative debt payment</span><strong id="airDebtPayKpi">—</strong></div>
        <div><span>Lease rentals over term</span><strong id="airRentKpi">—</strong></div>
        <div><span>Residual value</span><strong id="airResidualKpi">—</strong></div>
        <div><span>Cash before tax / sale costs</span><strong id="airNetKpi">—</strong></div>
      </div>

      <div class="mortgage-chart-card">
        <h3>The capital stack</h3>
        <div class="capital-stack">
          <div><strong>Banks / investors</strong><span>provide debt + equity capital</span></div>
          <b>→</b>
          <div><strong>Aircraft lessor</strong><span>buys & manages the aircraft</span></div>
          <b>→</b>
          <div><strong>Airline</strong><span>pays lease rentals</span></div>
        </div>
        <p class="mortgage-help">The debt-payment output assumes a conventional amortising loan purely for illustration. Real aviation facilities may use different advance rates, repayment profiles, covenants, security packages and refinancing structures.</p>
      </div>
    </section>
  </div>
</div>

## Options | Not the same as a stock-market option

An aircraft purchase option is a **contractual right to firm additional aircraft under agreed commercial terms**, rather than a freely traded financial derivative.

At the **Dubai Airshow on 14 November 2023**, Abelo and ATR announced a Heads of Agreement for **10 firm ATR 72-600s plus options for 10 more**. In late 2024, Abelo converted three of those options into firm ATR 72-600 orders. On **31 March 2026**, ATR announced that Abelo had exercised three additional ATR 72-600 options; ATR said Abelo then had **36 firm aircraft ordered** and still held **nine options and purchase rights**. [Abelo/ATR 2023 agreement](https://abelo.aero/abelo-signs-deal-for-up-to-20-atr-72-600/) · [ATR option exercise, March 2026](https://www.atr-aircraft.com/presspost/abelo-confirms-three-additional-atr-72-600-options/)

The useful interview question is therefore:

**Why keep an option rather than firm the aircraft immediately?**

Because an option can preserve **fleet flexibility and access to production positions** while the lessor waits for customer demand, financing, market conditions and delivery timing to become clearer. The exact option price, aircraft price and escalation formula are commercial terms and should not be assumed to be public.

## Why airshows matter | The deal usually starts before the show

Airshows are not five days during which everybody suddenly negotiates billion-dollar contracts from scratch.

They are a **concentration point** for the industry: manufacturers, airlines, lessors, banks, investors, suppliers, governments and media are in the same place. Negotiations may have been running for weeks or months beforehand; an airshow creates a deadline and a high-visibility place to sign or announce a Heads of Agreement, order, financing, partnership or aircraft placement.

Abelo itself gives two excellent examples:

- **Farnborough 2022:** Abelo announced its agreement to acquire 20 ATR aircraft.
- **Dubai 2023:** Abelo and ATR announced 10 firm ATR 72-600s plus 10 options.

The latest of the major alternating European shows was **Farnborough, 20–24 July 2026**, which has already happened. The **next Paris Air Show is 14–20 June 2027**, followed later that year by the **Dubai Airshow, 15–19 November 2027**. Farnborough returns **17–21 July 2028**.

So, no: **Dubai was not the last big airshow.** Dubai 2025 was followed by Farnborough 2026. As of September 2026, Paris 2027 is the next major Paris/Farnborough commercial-airshow date.


## What the model is doing

For a standard repayment mortgage, the monthly payment is calculated from the principal, monthly interest rate and number of monthly payments. The model then simulates the mortgage **month by month**, splitting each payment into interest and principal.

When an annual top-up is entered, the simulator applies that extra payment after each completed year, reducing the outstanding principal. That can shorten the payoff period and reduce later interest.

At a **0% interest rate**, the model simply divides principal by the number of months. At a **100% deposit**, the mortgage required is zero and the house is treated as a cash purchase. A term of **0 years** is therefore only valid when no mortgage is required.

## Decision-support purpose

The point is not just to produce one repayment number. It is to let a user change the assumptions and see the **shape of the financing decision**: how a larger deposit changes borrowing, how rate changes affect interest, how term changes trade monthly affordability against total interest, and how recurring overpayments accelerate principal reduction.

<link rel="stylesheet" href="{{ '/assets/mortgage-calculator.css' | relative_url }}">
<script defer src="{{ '/assets/mortgage-calculator.js' | relative_url }}"></script>
