export const TAX_GLOSSARY = {
  totalIncome: {
    term: 'Total Income',
    description:
      'All the money you earned during the year. This includes your salary, tips, freelance work, investment earnings, and any other money you received.',
    example:
      'If you earned $60,000 from your job and $5,000 from a side business, your total income is $65,000.',
    link: 'https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/about-your-tax-return/tax-return/completing-a-tax-return/personal-income.html',
  },
  deductions: {
    term: 'Deductions',
    description:
      'Expenses that reduce the amount of income you pay tax on. Think of it as the government saying "we won\'t tax you on this money."',
    example:
      'If you put $5,000 into an RRSP (retirement savings), that $5,000 is deducted from your income before calculating tax. So if you earned $50,000, you only pay tax on $45,000.',
    link: 'https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/about-your-tax-return/tax-return/completing-a-tax-return/deductions-credits-expenses/deductions-credits-expenses.html',
  },
  taxableIncome: {
    term: 'Taxable Income',
    description:
      'The amount of money that actually gets taxed after subtracting your deductions from your total income. This is what the tax rates apply to.',
    example:
      'Total income $50,000 minus $5,000 in deductions = $45,000 taxable income. Only the $45,000 gets taxed.',
    link: 'https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/about-your-tax-return/tax-return/completing-a-tax-return/personal-income/line-15000-total-income.html',
  },
  federalTax: {
    term: 'Federal Tax  (Canada-wide)',
    description:
      'Tax paid to the Canadian federal government. This money funds national services like the military, passports, employment insurance, old age security, and federal programs.',
    example:
      'On $50,000 taxable income, you might pay about $6,700 in federal tax. This helps run country-wide programs.',
    link: 'https://www.canada.ca/en/revenue-agency/services/tax/individuals/frequently-asked-questions-individuals/canadian-income-tax-rates-individuals-current-previous-years.html',
  },
  provincialTax: {
    term: 'Provincial Tax (Ontario)',
    description:
      'Tax paid to Ontario. This money funds provincial services like hospitals, schools, roads, police, and provincial programs.',
    example:
      'On $50,000 taxable income, you might pay about $3,200 to Ontario. This helps run local services you use every day.',
    link: 'https://www.canada.ca/en/revenue-agency/services/tax/individuals/frequently-asked-questions-individuals/canadian-income-tax-rates-individuals-current-previous-years.html',
  },
  totalTax: {
    term: 'Total Tax Before Credits',
    description:
      'The combined federal and provincial tax calculated on your taxable income, before any tax credits are applied.',
    example: 'Federal tax $6,700 + Ontario tax $3,200 = $9,900 total tax owed before credits.',
    link: 'https://www.canada.ca/en/revenue-agency/services/tax/individuals/frequently-asked-questions-individuals/canadian-income-tax-rates-individuals-current-previous-years.html',
  },
  credits: {
    term: 'Tax Credits',
    description:
      "Direct discounts on your tax bill. Unlike deductions (which reduce what you're taxed on), credits reduce the actual tax you owe, dollar for dollar.",
    example:
      'Basic Personal Amount gives you about $3,000 in credits automatically. If you donated $100 to charity, you might get another $30 credit. These reduce your final tax bill.',
    link: 'https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/about-your-tax-return/tax-return/completing-a-tax-return/deductions-credits-expenses/deductions-credits-expenses.html',
  },
  bpaCredit: {
    term: 'Basic Personal Amount (BPA)',
    description:
      'A gift from the government! Everyone automatically gets to earn their first $16,200 (federal) and $12,500 (Ontario) without paying tax on it. This saves you about $3,061 automatically every year.',
    example:
      'Even if you don\'t claim anything else, you automatically get this $3,061 credit. It\'s like a "welcome bonus" for living in Canada!',
    link: 'https://www.canada.ca/en/revenue-agency/programs/about-canada-revenue-agency-cra/federal-government-budgets/basic-personal-amount.html',
  },
  taxPaid: {
    term: 'Tax Already Paid',
    description:
      'If you\'re employed, your employer sends part of each paycheque directly to the government throughout the year (called "withholding"). This is tax you already paid.',
    example:
      "If your employer sent $8,000 to the CRA throughout the year from your paycheques, you've already paid $8,000 in tax. At tax time, we subtract this from what you owe.",
    link: 'https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/about-your-tax-return/refunds.html',
  },
  taxLiability: {
    term: 'Tax Liability (Final Amount)',
    description:
      'The bottom line: what you owe to the CRA (Canada Revenue Agency) after all calculations. If this is negative, you get money back!',
    example:
      'Total tax $9,900 - Credits $3,061 - Already paid $8,000 = You owe $839. Or if already paid $11,000, you get back $1,100!',
    link: 'https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/about-your-tax-return/making-payments-individuals.html',
  },
  effectiveTaxRate: {
    term: 'Effective Tax Rate',
    description:
      'Your actual average tax percentage. It\'s the total tax divided by your total income. This is usually lower than the "tax bracket" you\'re in because of progressive taxation.',
    example:
      "If you paid $9,900 tax on $50,000 income, your effective rate is 19.8%. Even though your highest bracket might be 26%, you don't pay that rate on all your money.",
    link: 'https://www.canada.ca/en/revenue-agency/services/tax/individuals/frequently-asked-questions-individuals/canadian-income-tax-rates-individuals-current-previous-years.html',
  },
  progressiveTax: {
    term: 'Progressive Tax System',
    description:
      'You pay different rates on different portions of your income. Your first dollars are taxed less, later dollars are taxed more. You never lose money by earning more.',
    example:
      "First $53,891 → 15% federal tax. Next $53,891 → 20.5%. You DON'T pay the higher rate on all your money, only on the amount above each threshold.",
    link: 'https://www.canada.ca/en/revenue-agency/services/tax/individuals/frequently-asked-questions-individuals/canadian-income-tax-rates-individuals-current-previous-years.html',
  },
  cra: {
    term: 'CRA (Canada Revenue Agency)',
    description:
      'The Canadian government office that handles taxes. They collect taxes, send refunds, and help people file their tax returns. They have phone support and offices across Canada.',
    example:
      "When you file your tax return, you send it to the CRA. If you have questions, you can call them at 1-800-959-8281. They're helpful for honest mistakes!",
    link: 'https://www.canada.ca/en/revenue-agency/corporate/contact-information.html',
  },
  taxReturn: {
    term: 'Tax Return',
    description:
      'The form you fill out each year (by April 30) that calculates your taxes. It\'s called a "return" because you\'re returning information to the government about your income.',
    example:
      'Every April, you fill out a tax return saying "I earned $X, I paid $Y in tax, and I\'m eligible for $Z in credits." Then the CRA either refunds you or asks for more money.',
    link: 'https://www.canada.ca/en/services/taxes/income-tax/personal-income-tax/get-ready-taxes.html',
  },
  taxYear: {
    term: 'Tax Year',
    description:
      "The calendar year for which you're filing taxes. In Canada, the tax year is January 1 to December 31. You file the return by April 30 of the following year.",
    example:
      'For your 2026 tax year (Jan 1 - Dec 31, 2026), you must file your return by April 30, 2027.',
    link: 'https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/important-dates-individuals.html',
  },
};

export type TaxGlossaryKey = keyof typeof TAX_GLOSSARY;
