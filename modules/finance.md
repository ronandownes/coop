---
layout: doc
title: "Finance"
year: "2nd"
semester: "Sem1"
status: "Core"
eyebrow: "FINANCE · INTERACTIVE LEARNING COURSE"
study_mode: true
description: "A structured finance course in financial decision-making, valuation, capital budgeting, bonds, equities, capital structure, derivatives and risk-return."
---
<link rel="stylesheet" href="{{ '/assets/finance-course.css' | relative_url }}?v={{ site.github.build_revision }}">
<script>
window.MathJax={tex:{inlineMath:[['\\(','\\)']],displayMath:[['\\[','\\]']]},svg:{fontCache:'global'}};
</script>
<script defer src="https://cdn.jsdelivr.net/npm/mathjax@3.2.2/es5/tex-svg.js"></script>

<p><a href="{{ '/education.html' | relative_url }}">← Education</a></p>

<div class="finance-course" markdown="1">

<div class="fc-hero">
<div class="fc-kicker">DECISIONS · VALUE · RISK · EVIDENCE</div>
<h2>Learn finance as a connected decision system</h2>
<p><strong>The organising question is simple:</strong> if money arrives at different times and under different levels of uncertainty, how should a decision-maker compare the alternatives? The course moves from that question into valuation, investment appraisal, securities, financing, risk management and portfolio decisions.</p>
<div class="fc-path">
<a href="#start-here">Start</a><a href="#financial-decisions">Decisions</a><a href="#time-value">Time value</a><a href="#interest-rates">Rates</a><a href="#investment-appraisal">Projects</a><a href="#capital-budgeting">Cash flows</a><a href="#bonds">Bonds</a><a href="#equities">Equities</a><a href="#capital-structure">WACC</a><a href="#derivatives">Derivatives</a><a href="#risk-return">Risk & return</a><a href="#capstone">Capstone</a>
</div>
<div class="fc-progress"><div class="fc-progress-track" aria-label="Course progress"><span data-fc-progress-bar></span></div><strong data-fc-progress-label>0/10 lessons complete</strong></div>
</div>

<!-- REMOVE AFTER COURSE: START -->
<p class="fc-source-note"><strong>Temporary source note — remove after the course:</strong> this independent learning course was reconstructed from Erik’s University of Limerick FI4003 Finance lecture/tutorial pack and supporting resources. The public explanations, sequence, assessment and resource design are rewritten for learning rather than reproducing institutional lecture numbering, branding or slide content.</p>
<!-- REMOVE AFTER COURSE: END -->

## Start here | Diagnostic, learning cycle and assessment {#start-here}

<div class="fc-grid">
<div class="fc-card">
<h3>The learning cycle</h3>
<ol>
<li><strong>Orient:</strong> identify the decision and the information available.</li>
<li><strong>Explain:</strong> connect the intuition to a mathematical relationship.</li>
<li><strong>Work:</strong> solve a model example and interpret the answer.</li>
<li><strong>Check:</strong> answer a short AfL question with immediate feedback.</li>
<li><strong>Retrieve:</strong> return later without notes and reconstruct the idea.</li>
<li><strong>Transfer:</strong> use the idea in a new commercial context.</li>
</ol>
</div>
<div class="fc-card">
<h3>Mastery standard</h3>
<p>Knowing a formula is not enough. For every major concept, aim to be able to:</p>
<ul>
<li><strong>Recognise</strong> when the concept applies.</li>
<li><strong>Explain</strong> it in plain English.</li>
<li><strong>Calculate</strong> accurately with units and timing.</li>
<li><strong>Interpret</strong> the financial meaning.</li>
<li><strong>Challenge</strong> assumptions and sensitivity.</li>
</ul>
</div>
</div>

<div class="fc-assessment">
<div><strong>20%</strong><span>Lesson checks and retrieval</span></div>
<div><strong>30%</strong><span>Applied mini-cases</span></div>
<div><strong>20%</strong><span>Cumulative mixed review</span></div>
<div><strong>30%</strong><span>Final decision memo / capstone</span></div>
</div>

<div class="fc-check" id="diag-1" data-answer="1" data-correct="Discounting makes cash flows at different dates comparable in present-value terms." data-wrong="Timing matters. First put the cash flows on the same valuation date.">
<span class="fc-label">Diagnostic · no grade</span>
<p><strong>A project pays €110 in one year and another pays €108 today. What must you know before saying which is worth more?</strong></p>
<div class="fc-options"><button data-fc-option="0">Only the accounting profit</button><button data-fc-option="1">The relevant discount or required return</button><button data-fc-option="2">Only the project name</button></div><p class="fc-feedback" hidden></p>
</div>

<div class="fc-check" id="diag-2" data-answer="2" data-correct="A positive NPV means the project exceeds the required return on the assumptions used." data-wrong="NPV is about value after discounting the relevant cash flows, not simply total cash received.">
<span class="fc-label">Diagnostic · no grade</span>
<p><strong>What does a positive NPV most directly tell you?</strong></p>
<div class="fc-options"><button data-fc-option="0">The project cannot lose money</button><button data-fc-option="1">The project has the shortest payback</button><button data-fc-option="2">Discounted benefits exceed discounted costs at the chosen required return</button></div><p class="fc-feedback" hidden></p>
</div>

<div class="fc-retrieval"><strong>Before Lesson 1:</strong> on paper, write one sentence each for <em>cash flow</em>, <em>risk</em>, <em>return</em>, <em>debt</em> and <em>equity</em>. Do not look them up until after you have committed to an answer.</div>

## Lesson 1 | Financial decisions, firms and markets {#financial-decisions}

<section class="fc-unit" data-fc-unit="decisions" markdown="1">
<div class="fc-kicker">WHY FINANCE EXISTS</div>
<div class="fc-outcomes"><span>scarce capital</span><span>cash flow</span><span>financial manager</span><span>agency problem</span><span>primary / secondary markets</span></div>

<div class="fc-concept"><strong>Core idea:</strong> finance is the allocation of scarce resources across time and uncertainty. A financial manager is therefore deciding which assets/projects deserve capital and how those assets should be funded.</div>

<div class="fc-grid">
<div class="fc-card"><h3>Investment decision</h3><p>Which real assets or projects should receive capital? The finance question is not “does it make accounting profit?” but “do the future cash flows justify the resources committed today?”</p></div>
<div class="fc-card"><h3>Financing decision</h3><p>Should capital come from retained earnings, new equity, bank borrowing, bonds or another source? The source changes required returns, risk, flexibility and control.</p></div>
<div class="fc-card"><h3>Markets</h3><p><strong>Primary markets</strong> raise new capital for issuers. <strong>Secondary markets</strong> allow existing securities to trade, creating liquidity and price discovery.</p></div>
<div class="fc-card"><h3>Agency</h3><p>Managers may have incentives that differ from owners or other stakeholders. Governance, contracts, information and compensation are attempts to reduce that conflict.</p></div>
</div>

<div class="fc-trap"><strong>Misconception trap</strong>Finance is not “accounting with harder maths.” Accounting records and reports financial events; finance uses information about cash flows, timing, risk and opportunity cost to make forward-looking decisions.</div>

<div class="fc-check" id="q-decisions" data-answer="0" data-correct="Exactly: issuing new shares raises capital in the primary market." data-wrong="A secondary-market trade transfers an already-issued security between investors.">
<span class="fc-label">Check understanding · AfL</span><p><strong>A company sells newly issued shares to investors. Which market is involved?</strong></p>
<div class="fc-options"><button data-fc-option="0">Primary market</button><button data-fc-option="1">Secondary market</button><button data-fc-option="2">Derivative market only</button></div><p class="fc-feedback" hidden></p>
</div>

<div class="fc-resource-grid">
<div class="fc-resource" data-youtube="7S4jfCFkMoE"><h4>Financial markets video from the source pack</h4><p>Use it as a visual introduction, then return to the primary/secondary market distinction above.</p><div class="fc-resource-actions"><button data-fc-preview>Watch here</button><a href="https://www.youtube.com/watch?v=7S4jfCFkMoE" target="_blank" rel="noopener">Open on YouTube ↗</a></div><div class="fc-resource-frame" hidden></div></div>
<div class="fc-resource"><h4>Yahoo Finance</h4><p>Useful for observing live/historical equity-market data. Treat market prices as data to interpret, not as an explanation by themselves.</p><div class="fc-resource-actions"><a href="https://finance.yahoo.com/" target="_blank" rel="noopener">Open original ↗</a></div></div>
</div>
<div class="fc-complete"><button data-fc-complete>Mark lesson complete</button></div>
</section>

## Lesson 2 | Time value of money {#time-value}

<section class="fc-unit" data-fc-unit="tvm" markdown="1">
<div class="fc-kicker">PUT CASH FLOWS ON THE SAME DATE</div>
<div class="fc-outcomes"><span>PV</span><span>FV</span><span>discounting</span><span>compounding</span><span>annuity</span><span>perpetuity</span></div>

<div class="fc-concept"><strong>Central principle:</strong> €1 today and €1 years from now are not financially equivalent. Money today can earn a return; future money is uncertain; and giving up money today has an opportunity cost.</div>

<div class="fc-formula">\[PV=\frac{FV}{(1+r)^n}\qquad FV=PV(1+r)^n\]</div>

<div class="fc-grid">
<div class="fc-card"><h3>Single cash flow</h3><p>Discount future money back; compound present money forward. Always draw a timeline before touching a formula.</p></div>
<div class="fc-card"><h3>Annuity</h3><p>Equal cash flows for a finite number of periods. Identify whether payments occur at the end (ordinary annuity) or beginning (annuity due).</p></div>
<div class="fc-card"><h3>Perpetuity</h3><div class="fc-formula">\[PV=\frac{C}{r}\]</div><p>A constant cash flow continuing indefinitely, with the first payment one period from now.</p></div>
<div class="fc-card"><h3>Growing perpetuity</h3><div class="fc-formula">\[PV=\frac{C_1}{r-g}\]</div><p>Useful later for constant-growth equity valuation. It requires \(r&gt;g\).</p></div>
</div>

<details class="fc-worked"><summary>Worked example · present value</summary><div><p>You will receive €5,000 in four years. The relevant annual discount rate is 6%.</p><ol><li>Timeline: cash flow occurs at \(t=4\).</li><li>Discount four periods: \(PV=5000/(1.06)^4\).</li><li>Result: <strong>€3,960.47</strong>.</li><li>Interpretation: €3,960.47 invested today at 6% grows to €5,000 in four years.</li></ol></div></details>

<form class="fc-calc" data-fc-calc="pv"><h4>Try it · present-value calculator</h4><div class="fc-calc-grid"><label>Future cash (€)<input name="fv" type="number" step="any" value="5000"></label><label>Annual rate (%)<input name="rate" type="number" step="any" value="6"></label><label>Years<input name="years" type="number" step="any" value="4"></label></div><button>Calculate PV</button><div class="fc-result" aria-live="polite"></div></form>

<div class="fc-trap"><strong>Misconception trap</strong>A 10% discount rate does not mean “take 10% off the future cash flow.” Compounding means the time exponent matters: two years requires two discounting periods.</div>

<div class="fc-check" id="q-tvm" data-answer="1" data-correct="Correct. A higher discount rate reduces the present value of a fixed future cash flow." data-wrong="Think about the denominator in PV = FV/(1+r)^n.">
<span class="fc-label">Check understanding · AfL</span><p><strong>If the future cash flow and date stay fixed, what happens to PV when the discount rate rises?</strong></p>
<div class="fc-options"><button data-fc-option="0">PV rises</button><button data-fc-option="1">PV falls</button><button data-fc-option="2">PV must stay equal to FV</button></div><p class="fc-feedback" hidden></p>
</div>
<div class="fc-complete"><button data-fc-complete>Mark lesson complete</button></div>
</section>

## Lesson 3 | Interest rates and the yield curve {#interest-rates}

<section class="fc-unit" data-fc-unit="rates" markdown="1">
<div class="fc-kicker">WHAT DOES THE RATE ACTUALLY MEAN?</div>
<div class="fc-outcomes"><span>APR</span><span>EAR</span><span>real / nominal</span><span>inflation</span><span>yield curve</span></div>

<div class="fc-formula">\[EAR=\left(1+\frac{APR}{m}\right)^m-1\]</div>
<p>A quoted nominal rate does not fully describe growth unless the compounding frequency is known. The effective annual rate puts differently compounded rates on a common annual basis.</p>

<details class="fc-worked"><summary>Worked example · APR to EAR</summary><div><p>A 6% APR compounded monthly gives:</p><p>\(EAR=(1+0.06/12)^{12}-1=0.061678\), so the effective annual rate is <strong>6.168%</strong>.</p></div></details>

<div class="fc-grid">
<div class="fc-card"><h3>Nominal versus real</h3><p>Nominal returns include the effect of inflation. Real returns focus on purchasing-power growth. Keep cash-flow assumptions and discount rates consistently nominal or consistently real.</p></div>
<div class="fc-card"><h3>Yield curve</h3><p>A yield curve relates yield to maturity across maturities for bonds of comparable credit quality. Shape matters, but it is evidence to interpret—not a crystal ball.</p></div>
</div>

<div class="fc-resource-grid">
<div class="fc-resource"><h4>ECB · Euro area yield curves</h4><p>Best live data link in the original material: inspect actual euro-area spot, forward and par curves and connect the chart to term structure.</p><div class="fc-resource-actions"><a href="https://www.ecb.europa.eu/stats/financial_markets_and_interest_rates/euro_area_yield_curves/html/index.en.html" target="_blank" rel="noopener">Open ECB ↗</a></div></div>
<div class="fc-resource"><h4>FINRA · yield and return</h4><p>A clearer modern replacement for several older bond/yield links in the source pack.</p><div class="fc-resource-actions"><a href="https://www.finra.org/investors/insights/bond-yield-return" target="_blank" rel="noopener">Open FINRA ↗</a></div></div>
</div>

<div class="fc-check" id="q-rates" data-answer="2" data-correct="Right: compounding frequency is needed to compare quoted nominal rates correctly." data-wrong="APR alone can hide the effect of compounding within the year."><span class="fc-label">Check understanding · AfL</span><p><strong>Two accounts both advertise 6% APR. What extra information is needed before saying they have the same annual growth?</strong></p><div class="fc-options"><button data-fc-option="0">The colour of the bank logo</button><button data-fc-option="1">Only the initial balance</button><button data-fc-option="2">The compounding frequency</button></div><p class="fc-feedback" hidden></p></div>
<div class="fc-complete"><button data-fc-complete>Mark lesson complete</button></div>
</section>

## Lesson 4 | Investment appraisal: NPV, IRR, payback and PI {#investment-appraisal}

<section class="fc-unit" data-fc-unit="appraisal" markdown="1">
<div class="fc-kicker">DOES THE PROJECT CREATE VALUE?</div>
<div class="fc-outcomes"><span>NPV</span><span>IRR</span><span>payback</span><span>ARR</span><span>profitability index</span><span>capital rationing</span></div>

<div class="fc-formula">\[NPV=-I_0+\sum_{t=1}^{n}\frac{CF_t}{(1+r)^t}\]</div>
<div class="fc-concept"><strong>Decision rule:</strong> for a conventional standalone project, accept if NPV is positive at the appropriate required return. NPV measures value added in today’s money.</div>

<div class="fc-grid">
<div class="fc-card"><h3>NPV</h3><p>Uses cash flows, time value and required return. It is the primary value-creation criterion.</p></div>
<div class="fc-card"><h3>IRR</h3><p>The discount rate that makes NPV equal zero. Intuitive as a percentage, but can mislead with non-conventional cash flows or mutually exclusive projects.</p></div>
<div class="fc-card"><h3>Payback</h3><p>How long until initial cash outlay is recovered. Useful for liquidity intuition, weak as a value measure because it can ignore time value and later cash flows.</p></div>
<div class="fc-card"><h3>Profitability index</h3><p>Value created per unit of scarce investment. Particularly useful as a ranking aid when capital is rationed, subject to project divisibility and interaction issues.</p></div>
</div>

<details class="fc-worked"><summary>Worked example · NPV</summary><div><p>A project costs €75,000 now and is expected to generate €24,000, €26,000, €29,000 and €22,000 over the next four years. At 8%:</p><p>\(NPV=-75,000+24,000/1.08+26,000/1.08^2+29,000/1.08^3+22,000/1.08^4\)</p><p><strong>NPV ≈ €8,704.82.</strong> On those assumptions, the project creates value relative to an 8% required return.</p></div></details>

<form class="fc-calc" data-fc-calc="npv"><h4>Try it · NPV calculator</h4><div class="fc-calc-grid"><label>Initial investment (€)<input name="initial" type="number" value="75000"></label><label>Discount rate (%)<input name="rate" type="number" step="any" value="8"></label><label>Future cash flows, comma separated<input name="flows" value="24000,26000,29000,22000"></label></div><button>Calculate NPV</button><div class="fc-result" aria-live="polite"></div></form>

<div class="fc-trap"><strong>Misconception trap</strong>The project with the highest IRR is not automatically the best mutually exclusive project. Scale and timing can cause IRR and NPV rankings to conflict; if the objective is value creation and the discount rate is appropriate, NPV is the central criterion.</div>

<div class="fc-check" id="q-appraisal" data-answer="0" data-correct="Yes. NPV directly measures value added at the required return." data-wrong="Payback and IRR can be informative, but neither universally dominates NPV for value creation."><span class="fc-label">Check understanding · AfL</span><p><strong>Two mutually exclusive projects conflict: A has higher IRR, B has higher NPV at the firm’s appropriate required return. Which metric most directly answers which adds more value?</strong></p><div class="fc-options"><button data-fc-option="0">NPV</button><button data-fc-option="1">Payback</button><button data-fc-option="2">Accounting profit alone</button></div><p class="fc-feedback" hidden></p></div>

<div class="fc-resource-grid"><div class="fc-resource" data-youtube="BohOLldcoxk"><h4>Investment appraisal video from the source pack</h4><p>Use after you can already explain NPV yourself; the video is reinforcement, not the lesson.</p><div class="fc-resource-actions"><button data-fc-preview>Watch here</button><a href="https://www.youtube.com/watch?v=BohOLldcoxk" target="_blank" rel="noopener">Open on YouTube ↗</a></div><div class="fc-resource-frame" hidden></div></div></div>
<div class="fc-complete"><button data-fc-complete>Mark lesson complete</button></div>
</section>

## Lesson 5 | Capital budgeting: relevant cash flows and uncertainty {#capital-budgeting}

<section class="fc-unit" data-fc-unit="capital-budgeting" markdown="1">
<div class="fc-kicker">BUILD THE RIGHT CASH-FLOW MODEL BEFORE CALCULATING</div>
<div class="fc-outcomes"><span>incremental cash flow</span><span>sunk cost</span><span>opportunity cost</span><span>working capital</span><span>tax</span><span>sensitivity</span><span>scenario analysis</span></div>

<div class="fc-grid">
<div class="fc-card"><h3>Include</h3><ul><li>Incremental revenues and costs</li><li>Opportunity costs</li><li>Tax effects</li><li>Changes in working capital</li><li>Relevant terminal cash flows</li><li>Side effects caused by the project</li></ul></div>
<div class="fc-card"><h3>Do not include merely because it exists</h3><ul><li>Sunk costs already incurred</li><li>Allocated overhead that does not change</li><li>Financing cash flows already reflected in the discount rate</li><li>Accounting charges with no cash consequence—except where they affect tax</li></ul></div>
</div>

<div class="fc-concept"><strong>Modelling discipline:</strong> first ask “what cash flow changes if we accept the project?” Then ask “when does it change?” Only after that should you discount.</div>

<details class="fc-worked"><summary>Worked reasoning · sunk cost versus opportunity cost</summary><div><p>A firm paid €20,000 last year for a market study. It owns a warehouse that could be rented to another firm for €30,000 per year.</p><ul><li>The €20,000 study is a <strong>sunk cost</strong>: the payment does not change if the new project is accepted today.</li><li>Using the warehouse means giving up €30,000 rental income: that <strong>opportunity cost</strong> is incremental and belongs in the project analysis.</li></ul></div></details>

<div class="fc-grid">
<div class="fc-card"><h3>Sensitivity analysis</h3><p>Change one important assumption at a time to identify which inputs the decision is most exposed to.</p></div>
<div class="fc-card"><h3>Scenario analysis</h3><p>Change a coherent set of assumptions together—such as weak, base and strong demand—to see how the decision behaves under plausible states of the world.</p></div>
</div>

<div class="fc-check" id="q-capbudget" data-answer="1" data-correct="Correct. Forgone rental income is an opportunity cost created by using the warehouse for the project." data-wrong="The historical research payment is sunk; the rental income is lost only if the project uses the warehouse."><span class="fc-label">Check understanding · AfL</span><p><strong>Which item belongs in the project cash-flow model?</strong></p><div class="fc-options"><button data-fc-option="0">A feasibility report paid for last year</button><button data-fc-option="1">Rent the company gives up by using its own warehouse</button><button data-fc-option="2">An arbitrary share of head-office rent that does not change</button></div><p class="fc-feedback" hidden></p></div>
<div class="fc-retrieval"><strong>Cumulative retrieval 1:</strong><ol><li>Why must discount rate and cash flows be consistently nominal or real?</li><li>Why can payback and NPV disagree?</li><li>Give one sunk cost and one opportunity cost.</li><li>What does a positive NPV mean in words?</li></ol></div>
<div class="fc-complete"><button data-fc-complete>Mark lesson complete</button></div>
</section>

## Lesson 6 | Bonds: price, yield, duration and credit risk {#bonds}

<section class="fc-unit" data-fc-unit="bonds" markdown="1">
<div class="fc-kicker">A BOND IS A TIMELINE OF PROMISED CASH FLOWS</div>
<div class="fc-outcomes"><span>face value</span><span>coupon</span><span>maturity</span><span>YTM</span><span>premium / discount</span><span>duration</span><span>credit risk</span></div>

<div class="fc-formula">\[P=\sum_{t=1}^{n}\frac{C_t}{(1+y)^t}+\frac{F}{(1+y)^n}\]</div>
<p>A conventional bond is valued by discounting its coupons and repayment of face value at a yield appropriate to the timing and risk of those cash flows.</p>

<details class="fc-worked"><summary>Worked example · bond price</summary><div><p>A three-year €1,000 bond pays a 5% annual coupon. If the market YTM is 7%, its price is:</p><p>\(50/1.07+50/1.07^2+1050/1.07^3=\)<strong>€947.51</strong>.</p><p>The bond trades below par because its 5% coupon is less attractive than the 7% return demanded by the market for comparable risk.</p></div></details>

<form class="fc-calc" data-fc-calc="bond"><h4>Try it · bond-price calculator</h4><div class="fc-calc-grid"><label>Face value (€)<input name="face" type="number" value="1000"></label><label>Coupon rate (%)<input name="coupon" type="number" step="any" value="5"></label><label>YTM (%)<input name="ytm" type="number" step="any" value="7"></label><label>Years<input name="years" type="number" step="any" value="3"></label><label>Payments per year<select name="freq"><option value="1">1</option><option value="2">2</option></select></label></div><button>Price bond</button><div class="fc-result" aria-live="polite"></div></form>

<div class="fc-grid">
<div class="fc-card"><h3>Rates up → prices down</h3><p>Existing fixed coupons become less attractive when comparable market yields rise, so price adjusts downward. The inverse happens when yields fall.</p></div>
<div class="fc-card"><h3>Duration</h3><p>Duration summarises sensitivity to interest-rate changes. Longer-duration bonds generally experience larger percentage price changes for a given yield move.</p></div>
<div class="fc-card"><h3>Credit risk</h3><p>A corporate issuer may fail to make promised payments. A defaultable bond’s quoted YTM is calculated from promised cash flows and therefore is not automatically the investor’s expected return.</p></div>
<div class="fc-card"><h3>Yield curve</h3><p>Comparing yields across maturities helps price and interpret fixed-income cash flows. Always compare instruments of similar credit quality when isolating maturity effects.</p></div>
</div>

<div class="fc-check" id="q-bonds" data-answer="0" data-correct="Correct. When required yields rise, the present value of the old fixed cash flows falls." data-wrong="The coupon cash flow is fixed; price is what adjusts to the new required yield."><span class="fc-label">Check understanding · AfL</span><p><strong>A fixed-rate bond’s market-required yield rises, with all else unchanged. What normally happens to its price?</strong></p><div class="fc-options"><button data-fc-option="0">It falls</button><button data-fc-option="1">It rises</button><button data-fc-option="2">It must stay at par</button></div><p class="fc-feedback" hidden></p></div>

<div class="fc-resource-grid">
<div class="fc-resource" data-youtube="IuyejHOGCro"><h4>Investing Basics · Bonds</h4><p>Original source-pack video; useful as a short overview after the terminology is secure.</p><div class="fc-resource-actions"><button data-fc-preview>Watch here</button><a href="https://youtu.be/IuyejHOGCro" target="_blank" rel="noopener">Open on YouTube ↗</a></div><div class="fc-resource-frame" hidden></div></div>
<div class="fc-resource" data-youtube="OO9ou8Ye8TQ"><h4>How are bonds rated?</h4><p>Original source-pack video connecting corporate bonds to credit assessment.</p><div class="fc-resource-actions"><button data-fc-preview>Watch here</button><a href="https://www.youtube.com/watch?v=OO9ou8Ye8TQ" target="_blank" rel="noopener">Open on YouTube ↗</a></div><div class="fc-resource-frame" hidden></div></div>
<div class="fc-resource" data-youtube="orYkNGKxkk8"><h4>Bond trading video</h4><p>Original source-pack visual reference for how bonds trade.</p><div class="fc-resource-actions"><button data-fc-preview>Watch here</button><a href="https://www.youtube.com/watch?v=orYkNGKxkk8" target="_blank" rel="noopener">Open on YouTube ↗</a></div><div class="fc-resource-frame" hidden></div></div>
<div class="fc-resource"><h4>Investor.gov · Bonds</h4><p>Current, plain-language reference for bond structure, issuers and investor risks.</p><div class="fc-resource-actions"><a href="https://www.investor.gov/introduction-investing/investing-basics/investment-products/bonds-or-fixed-income-products/bonds" target="_blank" rel="noopener">Open Investor.gov ↗</a></div></div>
<div class="fc-resource"><h4>U.S. Bank · interest rates and bonds</h4><p>A current explanation of the price/yield relationship and interest-rate exposure.</p><div class="fc-resource-actions"><a href="https://www.usbank.com/investing/financial-perspectives/market-news/interest-rates-affect-bonds.html" target="_blank" rel="noopener">Open article ↗</a></div></div>
<div class="fc-resource"><h4>FINRA · Bonds</h4><p>Modern replacement for old “investing in bonds” links: terminology, yield, credit and product risks in one maintained resource.</p><div class="fc-resource-actions"><a href="https://www.finra.org/investors/investing/investment-products/bonds" target="_blank" rel="noopener">Open FINRA ↗</a></div></div>
</div>
<div class="fc-complete"><button data-fc-complete>Mark lesson complete</button></div>
</section>

## Lesson 7 | Equities, valuation and market efficiency {#equities}

<section class="fc-unit" data-fc-unit="equities" markdown="1">
<div class="fc-kicker">OWNERSHIP CLAIMS AND THE VALUE OF FUTURE DISTRIBUTIONS</div>
<div class="fc-outcomes"><span>equity</span><span>dividend</span><span>DDM</span><span>Gordon growth</span><span>market efficiency</span><span>fundamental / technical</span></div>

<div class="fc-formula">\[P_0=\frac{D_1}{k_e-g}\]</div>
<p>The constant-growth dividend discount model says today’s value is the present value of a growing stream of future dividends. The formula is simple; the difficult work is deciding whether the assumptions are defensible.</p>

<details class="fc-worked"><summary>Worked example · Gordon growth</summary><div><p>Next year’s dividend is expected to be €0.84, long-run growth 4%, and required return 10%.</p><p>\(P_0=0.84/(0.10-0.04)=\)<strong>€14.00</strong>.</p><p>Now test sensitivity: a small change in \(k_e-g\) can materially change valuation. That is why a model output should never be reported without assumptions.</p></div></details>

<div class="fc-grid">
<div class="fc-card"><h3>Efficient-market idea</h3><p>Market prices can incorporate widely available information rapidly. That does not mean prices are always “correct”; it means earning abnormal returns from already-known information is a demanding proposition.</p></div>
<div class="fc-card"><h3>Fundamental analysis</h3><p>Uses business, financial and economic information to estimate underlying value.</p></div>
<div class="fc-card"><h3>Technical analysis</h3><p>Studies market data such as price, volume, momentum and patterns. Separate the descriptive tool from claims that any particular signal reliably beats the market.</p></div>
<div class="fc-card"><h3>Bid–ask spread</h3><p>The highest current bid is below the lowest current ask. The spread is one visible component of transaction cost and liquidity.</p></div>
</div>

<div class="fc-check" id="q-equity" data-answer="1" data-correct="Exactly. The model becomes unstable as required return approaches the assumed perpetual growth rate." data-wrong="The denominator is ke − g, so a small gap makes valuation highly sensitive."><span class="fc-label">Check understanding · AfL</span><p><strong>Why should a Gordon-growth valuation be treated cautiously when growth is close to the required return?</strong></p><div class="fc-options"><button data-fc-option="0">Because dividends are irrelevant</button><button data-fc-option="1">Because the denominator becomes very small and valuation becomes extremely sensitive</button><button data-fc-option="2">Because market prices cannot change</button></div><p class="fc-feedback" hidden></p></div>

<div class="fc-resource-grid">
<div class="fc-resource" data-youtube="TPUDPhpCecA"><h4>NYSE trading-floor tour</h4><p>Historical source-pack video. Useful for market microstructure context, but remember that modern trading is overwhelmingly electronic.</p><div class="fc-resource-actions"><button data-fc-preview>Watch here</button><a href="https://www.youtube.com/watch?v=TPUDPhpCecA" target="_blank" rel="noopener">Open on YouTube ↗</a></div><div class="fc-resource-frame" hidden></div></div>
<div class="fc-resource"><h4>Fidelity · technical analysis</h4><p>A maintained modern introduction to what technical analysis actually examines.</p><div class="fc-resource-actions"><a href="https://www.fidelity.com/learning-center/trading-investing/technical-analysis/what-is-technical-analysis" target="_blank" rel="noopener">Open Fidelity ↗</a></div></div>
</div>
<div class="fc-complete"><button data-fc-complete>Mark lesson complete</button></div>
</section>

## Lesson 8 | Capital structure and WACC {#capital-structure}

<section class="fc-unit" data-fc-unit="wacc" markdown="1">
<div class="fc-kicker">WHAT RETURN MUST THE ASSETS EARN TO JUSTIFY THEIR FINANCING?</div>
<div class="fc-outcomes"><span>debt</span><span>equity</span><span>tax shield</span><span>cost of capital</span><span>WACC</span><span>market-value weights</span></div>

<div class="fc-formula">\[WACC=w_Ek_E+w_Dk_D(1-T)\]</div>
<p>WACC combines required returns demanded by capital providers using their market-value weights. The after-tax debt term reflects the tax deductibility of interest where applicable.</p>

<details class="fc-worked"><summary>Worked example · WACC</summary><div><p>Suppose financing is 60% equity and 40% debt by market value; cost of equity is 10.5%, pre-tax cost of debt 5.5%, and the corporate tax rate is 12.5%.</p><p>\(WACC=0.60(10.5\%)+0.40(5.5\%)(1-0.125)=\)<strong>8.225%</strong>.</p><p>Use this as a discount rate only when the project’s risk and financing assumptions justify it.</p></div></details>

<form class="fc-calc" data-fc-calc="wacc"><h4>Try it · WACC calculator</h4><div class="fc-calc-grid"><label>Equity weight (%)<input name="ew" type="number" step="any" value="60"></label><label>Debt weight (%)<input name="dw" type="number" step="any" value="40"></label><label>Cost of equity (%)<input name="ke" type="number" step="any" value="10.5"></label><label>Pre-tax cost of debt (%)<input name="kd" type="number" step="any" value="5.5"></label><label>Tax rate (%)<input name="tax" type="number" step="any" value="12.5"></label></div><button>Calculate WACC</button><div class="fc-result" aria-live="polite"></div></form>

<div class="fc-grid">
<div class="fc-card"><h3>Why market values?</h3><p>WACC is about current opportunity costs of capital. Historical book values need not represent the current economic weights faced by investors.</p></div>
<div class="fc-card"><h3>Why not “cheapest debt wins”?</h3><p>More debt can add tax advantages, but also increases financial distress, agency and refinancing exposures. Capital structure is a trade-off, not a free lunch.</p></div>
</div>

<div class="fc-check" id="q-wacc" data-answer="2" data-correct="Correct. A single corporate WACC can misprice a project whose operating risk is materially different from the firm’s existing assets." data-wrong="The discount rate should match the risk of the cash flows being valued."><span class="fc-label">Check understanding · AfL</span><p><strong>When is blindly applying the company’s overall WACC most questionable?</strong></p><div class="fc-options"><button data-fc-option="0">When the project is the same risk as existing operations</button><button data-fc-option="1">When market values are available</button><button data-fc-option="2">When the project has materially different operating risk from the existing business</button></div><p class="fc-feedback" hidden></p></div>
<div class="fc-complete"><button data-fc-complete>Mark lesson complete</button></div>
</section>

## Lesson 9 | Derivatives and risk management {#derivatives}

<section class="fc-unit" data-fc-unit="derivatives" markdown="1">
<div class="fc-kicker">CHANGE THE PAYOFF WITHOUT NECESSARILY OWNING THE UNDERLYING ASSET</div>
<div class="fc-outcomes"><span>forward</span><span>future</span><span>call</span><span>put</span><span>swap</span><span>hedging</span><span>speculation</span><span>real option</span></div>

<div class="fc-grid">
<div class="fc-card"><h3>Forward</h3><p>A customised agreement to transact later at a price fixed today. Both sides have obligations under the contract.</p></div>
<div class="fc-card"><h3>Future</h3><p>A standardised exchange-traded contract with clearing, margin and daily marking-to-market.</p></div>
<div class="fc-card"><h3>Option</h3><p>The buyer pays for a right, not an obligation. A call is a right to buy; a put is a right to sell, under the contract terms.</p></div>
<div class="fc-card"><h3>Swap</h3><p>An agreement to exchange cash-flow streams—for example fixed versus floating interest payments.</p></div>
</div>

<div class="fc-concept"><strong>Hedging versus speculation:</strong> the instrument can be identical; the economic purpose differs. A hedge reduces an existing exposure. A speculative position deliberately takes exposure in pursuit of return.</div>

<details class="fc-worked"><summary>Worked reasoning · fuel-price hedge</summary><div><p>An airline expects to buy fuel in three months and fears prices will rise. A derivatives hedge can create gains when fuel-related prices rise, partially offsetting the higher physical purchase cost. The central question is not “did the hedge itself make money?” but “did the combined position reduce the targeted uncertainty?”</p><p>If the hedge uses a related but non-identical contract, <strong>basis risk</strong> remains because the hedge price and actual exposure can move differently.</p></div></details>

<div class="fc-check" id="q-derivatives" data-answer="1" data-correct="Correct. An option buyer has a contractual right; the seller/writer carries the corresponding obligation if exercised." data-wrong="That right-versus-obligation distinction is what separates an option from a forward/future for the buyer."><span class="fc-label">Check understanding · AfL</span><p><strong>What is the defining distinction for the buyer of a standard option?</strong></p><div class="fc-options"><button data-fc-option="0">The buyer must transact at expiry</button><button data-fc-option="1">The buyer has a right but not an obligation to exercise</button><button data-fc-option="2">The contract cannot have an underlying asset</button></div><p class="fc-feedback" hidden></p></div>

<div class="fc-resource-grid">
<div class="fc-resource" data-youtube="LQrBzl0DMBA"><h4>Derivatives trading explained</h4><p>Original source-pack video: useful first visual overview of derivative contracts and underlying exposures.</p><div class="fc-resource-actions"><button data-fc-preview>Watch here</button><a href="https://www.youtube.com/watch?v=LQrBzl0DMBA" target="_blank" rel="noopener">Open on YouTube ↗</a></div><div class="fc-resource-frame" hidden></div></div>
<div class="fc-resource" data-youtube="EfmTWu2yn5Q"><h4>Call options & put options</h4><p>Original source-pack options video; use it to reinforce the payoff logic after defining the rights and obligations.</p><div class="fc-resource-actions"><button data-fc-preview>Watch here</button><a href="https://www.youtube.com/watch?v=EfmTWu2yn5Q" target="_blank" rel="noopener">Open on YouTube ↗</a></div><div class="fc-resource-frame" hidden></div></div>
<div class="fc-resource" data-youtube="JIdcips9vPU"><h4>Interest-rate swap explained</h4><p>Animated source-pack explanation of exchanging fixed and floating interest-payment exposures.</p><div class="fc-resource-actions"><button data-fc-preview>Watch here</button><a href="https://www.youtube.com/watch?v=JIdcips9vPU" target="_blank" rel="noopener">Open on YouTube ↗</a></div><div class="fc-resource-frame" hidden></div></div>
<div class="fc-resource" data-youtube="gw-1WebSOJI"><h4>Derivatives source-pack video</h4><p>Retained from the original resource collection. Use as extension rather than relying on it for core definitions.</p><div class="fc-resource-actions"><button data-fc-preview>Watch here</button><a href="https://www.youtube.com/watch?v=gw-1WebSOJI" target="_blank" rel="noopener">Open on YouTube ↗</a></div><div class="fc-resource-frame" hidden></div></div>
<div class="fc-resource"><h4>CME Group · options on futures guide</h4><p>A maintained market-operator guide to vocabulary, pricing fundamentals and option strategies.</p><div class="fc-resource-actions"><a href="https://www.cmegroup.com/education/brochures-and-handbooks/options-on-futures-brochure" target="_blank" rel="noopener">Open CME ↗</a></div></div>
<div class="fc-resource"><h4>Corporate Finance Institute · real options</h4><p>Extension: connects the language of options to management flexibility in real investment projects.</p><div class="fc-resource-actions"><a href="https://corporatefinanceinstitute.com/resources/valuation/real-options/" target="_blank" rel="noopener">Open CFI ↗</a></div></div>
</div>
<div class="fc-complete"><button data-fc-complete>Mark lesson complete</button></div>
</section>

## Lesson 10 | Risk, diversification and CAPM {#risk-return}

<section class="fc-unit" data-fc-unit="risk-return" markdown="1">
<div class="fc-kicker">RETURN IS NOT MEANINGFUL WITHOUT RISK</div>
<div class="fc-outcomes"><span>expected return</span><span>variance</span><span>standard deviation</span><span>covariance</span><span>correlation</span><span>diversification</span><span>beta</span><span>CAPM</span></div>

<div class="fc-formula">\[E(R)=\sum p_iR_i\qquad Var(R)=\sum p_i(R_i-E(R))^2\]</div>
<div class="fc-formula">\[E(R_i)=R_f+\beta_i\big(E(R_m)-R_f\big)\]</div>

<div class="fc-grid">
<div class="fc-card"><h3>Diversification</h3><p>Portfolio risk depends not only on each asset’s volatility but on how returns move together. Combining imperfectly correlated assets can reduce portfolio variance.</p></div>
<div class="fc-card"><h3>Systematic risk</h3><p>Market-wide risk cannot be eliminated simply by holding more assets. CAPM uses beta as a measure of exposure to systematic market movements.</p></div>
<div class="fc-card"><h3>Beta</h3><p>Beta above 1 implies stronger sensitivity to market movements in the CAPM framework; beta below 1 implies lower sensitivity. It is not a complete description of risk.</p></div>
<div class="fc-card"><h3>CAPM</h3><p>Links required return to the risk-free rate plus compensation for systematic risk. Treat it as a model with assumptions, not a law of nature.</p></div>
</div>

<details class="fc-worked"><summary>Worked example · CAPM</summary><div><p>Risk-free rate 3%, expected market return 8%, beta 1.2:</p><p>\(E(R)=3\%+1.2(8\%-3\%)=\)<strong>9%</strong>.</p><p>Interpretation: within CAPM, a beta of 1.2 earns a required premium 20% larger than the market risk premium.</p></div></details>

<form class="fc-calc" data-fc-calc="capm"><h4>Try it · CAPM calculator</h4><div class="fc-calc-grid"><label>Risk-free rate (%)<input name="rf" type="number" step="any" value="3"></label><label>Beta<input name="beta" type="number" step="any" value="1.2"></label><label>Expected market return (%)<input name="rm" type="number" step="any" value="8"></label></div><button>Calculate</button><div class="fc-result" aria-live="polite"></div></form>

<div class="fc-trap"><strong>Misconception trap</strong>Diversification does not mean “more holdings automatically equals lower risk.” If holdings are highly correlated or concentrated in the same exposure, adding them may contribute little diversification.</div>

<div class="fc-check" id="q-risk" data-answer="2" data-correct="Exactly. Correlation is what makes the combination behave differently from the individual assets." data-wrong="Portfolio variance depends on co-movement as well as individual volatility."><span class="fc-label">Check understanding · AfL</span><p><strong>Two risky assets can produce a portfolio with lower risk than either simple intuition might suggest primarily because of:</strong></p><div class="fc-options"><button data-fc-option="0">Their names</button><button data-fc-option="1">Guaranteed positive returns</button><button data-fc-option="2">Less-than-perfect correlation between returns</button></div><p class="fc-feedback" hidden></p></div>

<div class="fc-retrieval"><strong>Cumulative retrieval 2 — close the notes first:</strong><ol><li>Explain why bond prices and yields move inversely.</li><li>State one weakness of IRR.</li><li>Explain the difference between a forward and an option from the buyer’s perspective.</li><li>Why are market-value weights normally used in WACC?</li><li>Explain diversification using correlation, not the phrase “don’t put all your eggs in one basket.”</li></ol></div>
<div class="fc-complete"><button data-fc-complete>Mark lesson complete</button></div>
</section>

## Capstone | Integrated finance decision {#capstone}

<div class="fc-final">
<h3>Decision memo: value a project, fund it and challenge the result</h3>
<p>Build a short decision memo for a hypothetical asset-intensive company considering a new €2.5m project. Your submission should be understandable to a commercially literate manager who does not want a page of unexplained calculations.</p>
<ol>
<li><strong>Cash-flow model:</strong> identify incremental investment, operating cash flows, working capital, tax and terminal value. Separate sunk and opportunity costs.</li>
<li><strong>Valuation:</strong> calculate NPV at a justified base discount rate and explain the economic meaning.</li>
<li><strong>Alternative metric:</strong> calculate or discuss IRR/payback and explain what it adds—and what it can miss.</li>
<li><strong>Financing:</strong> estimate a WACC or required return from transparent assumptions. Explain why the project risk is or is not comparable with the existing business.</li>
<li><strong>Risk:</strong> run at least three sensitivities and one coherent downside scenario. Identify the variable that matters most.</li>
<li><strong>Risk-management extension:</strong> identify one interest-rate, currency or commodity exposure and explain whether a forward, future, option or swap could reduce it.</li>
<li><strong>Recommendation:</strong> one paragraph: decision, evidence, key assumption, and what new information could change the conclusion.</li>
</ol>
</div>

### Capstone rubric

| Dimension | Strong evidence |
|---|---|
| Model construction | Only relevant incremental cash flows; timing and units explicit |
| Mathematics | Correct TVM/NPV/WACC/risk calculations with sensible checks |
| Interpretation | Every important output is translated into a financial meaning |
| Judgement | Assumptions challenged; sensitivity and scenario results affect the discussion |
| Communication | Decision comes first; calculations support rather than bury it |

## Resource design | Why some links stay here and others open externally

<div class="fc-grid">
<div class="fc-card"><h3>Video: two choices</h3><p><strong>Watch here</strong> loads a privacy-enhanced YouTube iframe only when requested. This keeps the learner beside the explanation and check question. <strong>Open on YouTube</strong> is always available for captions, comments, playlists or the full platform experience.</p></div>
<div class="fc-card"><h3>Websites: external by default</h3><p>Arbitrary sites are not iframed. Many use security headers that block embedding; others change layout, tracking or cookie behaviour. The course therefore gives the learner the key purpose in context and an <strong>Open original</strong> link.</p></div>
<div class="fc-card"><h3>Core versus extension</h3><p>No external resource carries the burden of teaching a core idea. A learner should be able to complete the course even if a third-party link disappears. External sources deepen, visualise or supply live data.</p></div>
<div class="fc-card"><h3>Link maintenance</h3><p>Prefer maintained primary or specialist sources—ECB, Investor.gov, FINRA, CME and current learning centres—over old static pages. Historical source-pack videos are retained where they still add visual value.</p></div>
</div>

## Video vault | Every YouTube item retained from the source material

<div class="fc-resource-grid">
<div class="fc-resource" data-youtube="BohOLldcoxk"><h4>Investment decision rules</h4><div class="fc-resource-actions"><button data-fc-preview>Watch here</button><a href="https://www.youtube.com/watch?v=BohOLldcoxk" target="_blank" rel="noopener">YouTube ↗</a></div><div class="fc-resource-frame" hidden></div></div>
<div class="fc-resource" data-youtube="IuyejHOGCro"><h4>Bond basics</h4><div class="fc-resource-actions"><button data-fc-preview>Watch here</button><a href="https://youtu.be/IuyejHOGCro" target="_blank" rel="noopener">YouTube ↗</a></div><div class="fc-resource-frame" hidden></div></div>
<div class="fc-resource" data-youtube="OO9ou8Ye8TQ"><h4>Bond ratings</h4><div class="fc-resource-actions"><button data-fc-preview>Watch here</button><a href="https://www.youtube.com/watch?v=OO9ou8Ye8TQ" target="_blank" rel="noopener">YouTube ↗</a></div><div class="fc-resource-frame" hidden></div></div>
<div class="fc-resource" data-youtube="orYkNGKxkk8"><h4>Bond trading</h4><div class="fc-resource-actions"><button data-fc-preview>Watch here</button><a href="https://www.youtube.com/watch?v=orYkNGKxkk8" target="_blank" rel="noopener">YouTube ↗</a></div><div class="fc-resource-frame" hidden></div></div>
<div class="fc-resource" data-youtube="7S4jfCFkMoE"><h4>Financial markets</h4><div class="fc-resource-actions"><button data-fc-preview>Watch here</button><a href="https://www.youtube.com/watch?v=7S4jfCFkMoE" target="_blank" rel="noopener">YouTube ↗</a></div><div class="fc-resource-frame" hidden></div></div>
<div class="fc-resource" data-youtube="TPUDPhpCecA"><h4>NYSE trading floor</h4><div class="fc-resource-actions"><button data-fc-preview>Watch here</button><a href="https://www.youtube.com/watch?v=TPUDPhpCecA" target="_blank" rel="noopener">YouTube ↗</a></div><div class="fc-resource-frame" hidden></div></div>
<div class="fc-resource" data-youtube="LQrBzl0DMBA"><h4>Derivatives trading explained</h4><div class="fc-resource-actions"><button data-fc-preview>Watch here</button><a href="https://www.youtube.com/watch?v=LQrBzl0DMBA" target="_blank" rel="noopener">YouTube ↗</a></div><div class="fc-resource-frame" hidden></div></div>
<div class="fc-resource" data-youtube="gw-1WebSOJI"><h4>Derivatives extension video</h4><div class="fc-resource-actions"><button data-fc-preview>Watch here</button><a href="https://www.youtube.com/watch?v=gw-1WebSOJI" target="_blank" rel="noopener">YouTube ↗</a></div><div class="fc-resource-frame" hidden></div></div>
<div class="fc-resource" data-youtube="EfmTWu2yn5Q"><h4>Call and put options</h4><div class="fc-resource-actions"><button data-fc-preview>Watch here</button><a href="https://www.youtube.com/watch?v=EfmTWu2yn5Q" target="_blank" rel="noopener">YouTube ↗</a></div><div class="fc-resource-frame" hidden></div></div>
<div class="fc-resource" data-youtube="JIdcips9vPU"><h4>Interest-rate swap</h4><div class="fc-resource-actions"><button data-fc-preview>Watch here</button><a href="https://www.youtube.com/watch?v=JIdcips9vPU" target="_blank" rel="noopener">YouTube ↗</a></div><div class="fc-resource-frame" hidden></div></div>
</div>

## External reference shelf | Maintained links worth keeping

- [ECB — euro area yield curves](https://www.ecb.europa.eu/stats/financial_markets_and_interest_rates/euro_area_yield_curves/html/index.en.html)
- [ECB Data Portal — yield curve methodology](https://data.ecb.europa.eu/methodology/yield-curves)
- [Investor.gov — Bonds](https://www.investor.gov/introduction-investing/investing-basics/investment-products/bonds-or-fixed-income-products/bonds)
- [FINRA — Bonds](https://www.finra.org/investors/investing/investment-products/bonds)
- [FINRA — Understanding bond yield and return](https://www.finra.org/investors/insights/bond-yield-return)
- [U.S. Bank — How changing interest rates affect bonds](https://www.usbank.com/investing/financial-perspectives/market-news/interest-rates-affect-bonds.html)
- [Fidelity — What is technical analysis?](https://www.fidelity.com/learning-center/trading-investing/technical-analysis/what-is-technical-analysis)
- [CME Group — Options on futures guide](https://www.cmegroup.com/education/brochures-and-handbooks/options-on-futures-brochure)
- [Corporate Finance Institute — Real options](https://corporatefinanceinstitute.com/resources/valuation/real-options/)
- [Yahoo Finance — market data](https://finance.yahoo.com/)

## Formula map | Know the meaning before the symbol

| Idea | Core relationship | Ask yourself |
|---|---|---|
| Present value | \(PV=FV/(1+r)^n\) | What date am I valuing at? |
| Future value | \(FV=PV(1+r)^n\) | How many compounding periods? |
| Perpetuity | \(PV=C/r\) | Does the first cash flow arrive one period from now? |
| Growing perpetuity | \(PV=C_1/(r-g)\) | Is \(r>g\), and is perpetual growth plausible? |
| NPV | \(NPV=\sum CF_t/(1+r)^t\) | Are the cash flows incremental and is the rate appropriate? |
| Bond price | PV of coupons + principal | Does the discount rate match term and credit risk? |
| Gordon growth | \(P_0=D_1/(k_e-g)\) | How sensitive is value to \(k_e-g\)? |
| WACC | \(w_Ek_E+w_Dk_D(1-T)\) | Are weights market values and does risk match? |
| Expected return | \(\sum p_iR_i\) | Are probabilities and states coherent? |
| CAPM | \(R_f+\beta(E(R_m)-R_f)\) | What assumptions am I making about systematic risk? |

## Final retrieval | Can you reconstruct the course?

Without scrolling upward, answer these ten prompts aloud or on paper:

1. Why is a future euro worth less than a euro today when the discount rate is positive?
2. What exactly does a positive NPV mean?
3. Give one reason IRR can mislead.
4. Distinguish a sunk cost from an opportunity cost.
5. Explain why a fixed-rate bond price falls when market yields rise.
6. Explain the difference between YTM and expected return for a risky bond.
7. What assumption makes the Gordon growth formula especially sensitive?
8. Why is after-tax debt used in the standard WACC expression?
9. Contrast a forward and an option from the buyer’s perspective.
10. Explain how correlation creates diversification benefit.

<p><strong>Mastery test:</strong> if an answer is vague, do not reread the whole course. Return only to the relevant lesson, close it again, and retrieve the explanation once more from memory.</p>

<script defer src="{{ '/assets/finance-course.js' | relative_url }}?v={{ site.github.build_revision }}"></script>
</div>
