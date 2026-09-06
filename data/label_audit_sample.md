# Label audit sample

**SYNTHETIC.** These customers do not exist and these labels are produced by
`training/labeling.py`, not observed from anyone. Regenerated on every dataset
build.

Read this before trusting the dataset. The invariant suite proves the labels are
*self-consistent*; only a person can notice that a self-consistent label is one
no human would agree with.

Policy version: `2.0.0`

---

## 1. `syn-0160`

- income ₹35,100/month, expenses ₹17,100, existing EMI ₹5,100
- disposable ₹12,900, EMI ceiling ₹6,450, health GOOD
- portfolio ₹3,813,600 (GROWTH)
- wants ₹209,000 for BUSINESS over 36 months, appetite MODERATE
- 17 candidates; HAS a good option

  BEST   grade 3 | score 0.858 | stress-fail 20%
      pay ₹209,000 from holdings and borrow nothing
      total interest ₹0, portfolio left ₹3,604,600

  WORST  grade 0 | score 0.510 | stress-fail 34%
      borrow ₹125,400 from IIFL Finance (BL-602) over 24 months at ₹6,260/month
      total interest ₹24,852, portfolio left ₹3,813,600

## 2. `syn-0274`

- income ₹38,500/month, expenses ₹15,700, existing EMI ₹1,200
- disposable ₹21,600, EMI ceiling ₹10,800, health EXCELLENT
- portfolio ₹341,700 (CONSERVATIVE)
- wants ₹193,000 for VEHICLE over 36 months, appetite AGGRESSIVE
- 80 candidates; HAS a good option

  BEST   grade 3 | score 0.835 | stress-fail 10%
      borrow ₹193,000 from SBI (VL-201) over 60 months at ₹4,025/month
      total interest ₹48,507, portfolio left ₹341,700

  WORST  grade 0 | score 0.561 | stress-fail 24%
      borrow ₹115,800 from Bajaj Finserv (VL-203) over 12 months at ₹10,370/month
      total interest ₹8,641, portfolio left ₹341,700

## 3. `syn-0615`

- income ₹80,100/month, expenses ₹32,200, existing EMI ₹0
- disposable ₹47,900, EMI ceiling ₹23,950, health EXCELLENT
- portfolio ₹0 (none)
- wants ₹745,000 for VEHICLE over 12 months, appetite MODERATE
- 9 candidates; HAS a good option

  BEST   grade 3 | score 0.703 | stress-fail 20%
      borrow ₹745,000 from Bajaj Finserv (VL-203) over 60 months at ₹17,142/month
      total interest ₹283,540, portfolio left ₹0

  WORST  grade 0 | score 0.554 | stress-fail 22%
      borrow ₹447,000 from Bajaj Finserv (VL-203) over 24 months at ₹21,356/month
      total interest ₹65,552, portfolio left ₹0

## 4. `syn-0420`

- income ₹34,200/month, expenses ₹11,300, existing EMI ₹4,700
- disposable ₹18,200, EMI ceiling ₹9,100, health EXCELLENT
- portfolio ₹2,884,500 (CONSERVATIVE)
- wants ₹692,000 for BUSINESS over 60 months, appetite CONSERVATIVE
- 22 candidates; HAS a good option

  BEST   grade 3 | score 0.805 | stress-fail 2%
      pay ₹692,000 from holdings and borrow nothing
      total interest ₹0, portfolio left ₹2,189,881

  WORST  grade 0 | score 0.444 | stress-fail 25%
      borrow ₹332,160 from IIFL Finance (BL-602) over 60 months at ₹8,435/month, selling ₹83,040 of holdings
      total interest ₹173,921, portfolio left ₹2,801,460

## 5. `syn-0777`

- income ₹349,800/month, expenses ₹251,600, existing EMI ₹47,900
- disposable ₹50,300, EMI ceiling ₹25,150, health FAIR
- portfolio ₹9,434,500 (GROWTH)
- wants ₹1,901,000 for BUSINESS over 60 months, appetite AGGRESSIVE
- 54 candidates; HAS a good option

  BEST   grade 2 | score 0.841 | stress-fail 34% | DEMOTED
      pay ₹1,901,000 from holdings and borrow nothing
      total interest ₹0, portfolio left ₹7,510,107

  WORST  grade 0 | score 0.541 | stress-fail 34%
      borrow ₹912,480 from IIFL Finance (BL-602) over 60 months at ₹23,171/month, selling ₹228,120 of holdings
      total interest ₹477,780, portfolio left ₹9,206,380

## 6. `syn-0363`

- income ₹124,600/month, expenses ₹36,600, existing EMI ₹5,800
- disposable ₹82,200, EMI ceiling ₹41,100, health EXCELLENT
- portfolio ₹0 (none)
- wants ₹2,042,000 for BUSINESS over 24 months, appetite AGGRESSIVE
- 12 candidates; HAS a good option

  BEST   grade 3 | score 0.676 | stress-fail 11%
      borrow ₹2,042,000 from SBI (BL-601) over 120 months at ₹26,703/month
      total interest ₹1,162,394, portfolio left ₹0

  WORST  grade 0 | score 0.522 | stress-fail 20%
      borrow ₹1,225,200 from IIFL Finance (BL-602) over 48 months at ₹35,990/month
      total interest ₹502,332, portfolio left ₹0

## 7. `syn-0361`

- income ₹31,900/month, expenses ₹18,300, existing EMI ₹1,800
- disposable ₹11,800, EMI ceiling ₹5,900, health GOOD
- portfolio ₹3,498,400 (AGGRESSIVE)
- wants ₹183,000 for MEDICAL over 12 months, appetite CONSERVATIVE
- 103 candidates; HAS a good option

  BEST   grade 3 | score 0.723 | stress-fail 23%
      borrow ₹73,200 from SBI (ML-501) over 60 months at ₹1,573/month, selling ₹109,800 of holdings
      total interest ₹21,201, portfolio left ₹3,388,600

  WORST  grade 0 | score 0.510 | stress-fail 34%
      borrow ₹65,880 from HDFC Bank (PL-401) over 12 months at ₹5,820/month, selling ₹43,920 of holdings
      total interest ₹3,954, portfolio left ₹3,454,480

## 8. `syn-0752`

- income ₹72,800/month, expenses ₹33,100, existing EMI ₹8,900
- disposable ₹30,800, EMI ceiling ₹15,400, health EXCELLENT
- portfolio ₹318,800 (CONSERVATIVE)
- wants ₹1,761,000 for EDUCATION over 48 months, appetite CONSERVATIVE
- 9 candidates; HAS a good option

  BEST   grade 2 | score 0.469 | stress-fail 27%
      borrow ₹1,056,600 from SBI (EL-301) over 120 months at ₹12,903/month
      total interest ₹491,805, portfolio left ₹318,800

  WORST  grade 0 | score 0.232 | stress-fail 27%
      borrow ₹845,280 from Axis Bank (EL-303) over 120 months at ₹12,972/month, selling ₹211,320 of holdings
      total interest ₹711,399, portfolio left ₹107,117

## 9. `syn-0181`

- income ₹462,000/month, expenses ₹261,400, existing EMI ₹49,700
- disposable ₹150,900, EMI ceiling ₹75,450, health GOOD
- portfolio ₹28,461,900 (GROWTH)
- wants ₹1,668,000 for MEDICAL over 60 months, appetite AGGRESSIVE
- 111 candidates; HAS a good option

  BEST   grade 3 | score 0.881 | stress-fail 23%
      pay ₹1,668,000 from holdings and borrow nothing
      total interest ₹0, portfolio left ₹26,793,900

  WORST  grade 0 | score 0.563 | stress-fail 34%
      borrow ₹800,640 from Bajaj Finserv (PL-403) over 12 months at ₹72,643/month, selling ₹200,160 of holdings
      total interest ₹71,073, portfolio left ₹28,261,740

## 10. `syn-0012`

- income ₹67,200/month, expenses ₹19,400, existing EMI ₹4,500
- disposable ₹43,300, EMI ceiling ₹21,650, health EXCELLENT
- portfolio ₹0 (none)
- wants ₹1,039,000 for EDUCATION over 120 months, appetite AGGRESSIVE
- 34 candidates; HAS a good option

  BEST   grade 3 | score 0.712 | stress-fail 10%
      borrow ₹1,039,000 from SBI (EL-301) over 120 months at ₹12,688/month
      total interest ₹483,613, portfolio left ₹0

  WORST  grade 0 | score 0.512 | stress-fail 22%
      borrow ₹623,400 from Axis Bank (EL-303) over 36 months at ₹21,216/month
      total interest ₹140,362, portfolio left ₹0

## 11. `syn-0405`

- income ₹272,500/month, expenses ₹176,300, existing EMI ₹4,500
- disposable ₹91,700, EMI ceiling ₹45,850, health GOOD
- portfolio ₹0 (none)
- wants ₹1,684,000 for VEHICLE over 36 months, appetite CONSERVATIVE
- 22 candidates; HAS a good option

  BEST   grade 3 | score 0.753 | stress-fail 28%
      borrow ₹1,684,000 from SBI (VL-201) over 84 months at ₹27,265/month
      total interest ₹606,281, portfolio left ₹0

  WORST  grade 0 | score 0.621 | stress-fail 31%
      borrow ₹1,010,400 from HDFC Bank (VL-202) over 36 months at ₹32,319/month
      total interest ₹153,080, portfolio left ₹0

## 12. `syn-1045`

- income ₹171,500/month, expenses ₹60,900, existing EMI ₹30,700
- disposable ₹79,900, EMI ceiling ₹39,950, health EXCELLENT
- portfolio ₹11,796,200 (CONSERVATIVE)
- wants ₹1,293,000 for MEDICAL over 36 months, appetite CONSERVATIVE
- 150 candidates; HAS a good option

  BEST   grade 3 | score 0.809 | stress-fail 8%
      pay ₹1,293,000 from holdings and borrow nothing
      total interest ₹0, portfolio left ₹10,503,200

  WORST  grade 0 | score 0.486 | stress-fail 27%
      borrow ₹775,800 from Bajaj Finserv (PL-403) over 24 months at ₹37,986/month
      total interest ₹135,854, portfolio left ₹11,796,200

## 13. `syn-0568`

- income ₹64,000/month, expenses ₹20,600, existing EMI ₹8,100
- disposable ₹35,300, EMI ceiling ₹17,650, health EXCELLENT
- portfolio ₹627,400 (AGGRESSIVE)
- wants ₹2,335,000 for HOME over 84 months, appetite AGGRESSIVE
- 20 candidates; NO good option

  BEST   grade 1 | score 0.351 | stress-fail 20%
      borrow ₹840,600 from SBI (HL-101) over 120 months at ₹10,422/month, selling ₹560,400 of holdings
      total interest ₹410,068, portfolio left ₹27,389

  WORST  grade 0 | score 0.266 | stress-fail 26%
      borrow ₹840,600 from ICICI Bank (HL-103) over 60 months at ₹17,348/month, selling ₹560,400 of holdings
      total interest ₹200,259, portfolio left ₹27,389

## 14. `syn-1163`

- income ₹358,900/month, expenses ₹144,300, existing EMI ₹12,300
- disposable ₹202,300, EMI ceiling ₹101,150, health EXCELLENT
- portfolio ₹0 (none)
- wants ₹619,000 for MEDICAL over 60 months, appetite CONSERVATIVE
- 45 candidates; HAS a good option

  BEST   grade 3 | score 0.880 | stress-fail 5%
      borrow ₹619,000 from SBI (ML-501) over 48 months at ₹15,848/month
      total interest ₹141,728, portfolio left ₹0

  WORST  grade 0 | score 0.700 | stress-fail 8%
      borrow ₹371,400 from Bajaj Finserv (PL-403) over 12 months at ₹33,697/month
      total interest ₹32,969, portfolio left ₹0

## 15. `syn-0727`

- income ₹438,000/month, expenses ₹300,100, existing EMI ₹24,100
- disposable ₹113,800, EMI ceiling ₹56,900, health GOOD
- portfolio ₹81,180,700 (CONSERVATIVE)
- wants ₹3,983,000 for VEHICLE over 60 months, appetite AGGRESSIVE
- 85 candidates; HAS a good option

  BEST   grade 3 | score 0.899 | stress-fail 26%
      pay ₹3,983,000 from holdings and borrow nothing
      total interest ₹0, portfolio left ₹77,197,700

  WORST  grade 0 | score 0.594 | stress-fail 34%
      borrow ₹2,389,800 from HDFC Bank (VL-202) over 60 months at ₹50,074/month
      total interest ₹614,612, portfolio left ₹81,180,700

## 16. `syn-0795`

- income ₹96,900/month, expenses ₹63,800, existing EMI ₹9,000
- disposable ₹24,100, EMI ceiling ₹12,050, health FAIR
- portfolio ₹276,700 (GROWTH)
- wants ₹273,000 for MEDICAL over 12 months, appetite MODERATE
- 145 candidates; HAS a good option

  BEST   grade 3 | score 0.635 | stress-fail 30%
      borrow ₹109,200 from SBI (ML-501) over 60 months at ₹2,347/month, selling ₹163,800 of holdings
      total interest ₹31,628, portfolio left ₹108,823

  WORST  grade 0 | score 0.358 | stress-fail 34%
      borrow ₹131,040 from Bajaj Finserv (PL-403) over 12 months at ₹11,889/month, selling ₹32,760 of holdings
      total interest ₹11,632, portfolio left ₹243,723

## 17. `syn-0396`

- income ₹447,400/month, expenses ₹164,800, existing EMI ₹38,500
- disposable ₹244,100, EMI ceiling ₹122,050, health EXCELLENT
- portfolio ₹1,835,500 (GROWTH)
- wants ₹8,632,000 for EDUCATION over 120 months, appetite AGGRESSIVE
- 13 candidates; HAS a good option

  BEST   grade 2 | score 0.573 | stress-fail 24%
      borrow ₹8,632,000 from Bank of Baroda (EL-302) over 120 months at ₹106,563/month
      total interest ₹4,155,600, portfolio left ₹1,835,500

  WORST  grade 0 | score 0.359 | stress-fail 24%
      borrow ₹4,143,360 from Bank of Baroda (EL-302) over 48 months at ₹101,931/month, selling ₹1,035,840 of holdings
      total interest ₹749,342, portfolio left ₹775,283

## 18. `syn-0310`

- income ₹71,300/month, expenses ₹18,900, existing EMI ₹9,300
- disposable ₹43,100, EMI ceiling ₹21,550, health EXCELLENT
- portfolio ₹2,007,500 (CONSERVATIVE)
- wants ₹1,038,000 for EDUCATION over 84 months, appetite AGGRESSIVE
- 57 candidates; HAS a good option

  BEST   grade 3 | score 0.782 | stress-fail 0%
      pay ₹1,038,000 from holdings and borrow nothing
      total interest ₹0, portfolio left ₹969,500

  WORST  grade 0 | score 0.529 | stress-fail 22%
      borrow ₹622,800 from Bank of Baroda (EL-302) over 36 months at ₹19,631/month
      total interest ₹83,931, portfolio left ₹2,007,500

## 19. `syn-0817`

- income ₹36,400/month, expenses ₹16,400, existing EMI ₹2,200
- disposable ₹17,800, EMI ceiling ₹8,900, health EXCELLENT
- portfolio ₹87,800 (BALANCED)
- wants ₹223,000 for BUSINESS over 24 months, appetite CONSERVATIVE
- 18 candidates; HAS a good option

  BEST   grade 2 | score 0.567 | stress-fail 22%
      borrow ₹223,000 from IIFL Finance (BL-602) over 60 months at ₹5,663/month
      total interest ₹116,764, portfolio left ₹87,800

  WORST  grade 0 | score 0.392 | stress-fail 22%
      borrow ₹107,040 from IIFL Finance (BL-602) over 24 months at ₹5,344/month, selling ₹26,760 of holdings
      total interest ₹21,213, portfolio left ₹60,903

## 20. `syn-0412`

- income ₹46,700/month, expenses ₹27,800, existing EMI ₹4,900
- disposable ₹14,000, EMI ceiling ₹7,000, health GOOD
- portfolio ₹2,118,600 (CONSERVATIVE)
- wants ₹1,081,000 for HOME over 180 months, appetite AGGRESSIVE
- 35 candidates; HAS a good option

  BEST   grade 3 | score 0.790 | stress-fail 24%
      pay ₹1,081,000 from holdings and borrow nothing
      total interest ₹0, portfolio left ₹1,029,891

  WORST  grade 0 | score 0.495 | stress-fail 34%
      borrow ₹648,600 from LIC Housing Finance (HL-104) over 180 months at ₹6,425/month
      total interest ₹507,917, portfolio left ₹2,118,600
