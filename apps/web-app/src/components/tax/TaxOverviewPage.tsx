'use client';

import React, { useState } from 'react';
import { Card, CardContent, Button, PageLoader, Badge, TaxTooltip } from '@/components/ui';
import {
  TrendingUp,
  DollarSign,
  PieChart,
  Calculator,
  AlertCircle,
  FileText,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import Link from 'next/link';
import {
  useGetTaxProjectionQuery,
  useGetLedgerQuery,
  useGetFiscalEntityQuery,
  FinancialType,
} from '@/lib/graphql';
import { BackButton } from '../BackButton';
import { useRouter } from 'next/navigation';
import { SupportedTaxYear, supportedTaxYears } from '@hq/validation-schema';
import { formatCurrency, formatPercentage } from '@hq/tools/client';
import { TAX_GLOSSARY } from '@/lib/tax-glossary';
import TaxFlowVisualization from './TaxFlowVisualization';
import NewcomerWelcomeBanner from './NewcomerWelcomeBanner';

interface TaxOverviewPageProps {
  entityId: string;
}

const TAX_YEARS: SupportedTaxYear[] = [...supportedTaxYears];

export default function TaxOverviewPage({ entityId }: TaxOverviewPageProps) {
  const [selectedTaxYear, setSelectedTaxYear] = useState<SupportedTaxYear>(2026);
  const router = useRouter();

  const { data: entityData, loading: entityLoading } = useGetFiscalEntityQuery({
    variables: { id: entityId },
  });

  const { data: taxData, loading: taxLoading } = useGetTaxProjectionQuery({
    variables: { entityId, taxYear: String(selectedTaxYear) },
  });

  const { data: entriesData, loading: entriesLoading } = useGetLedgerQuery({
    variables: { entityId, taxYear: String(selectedTaxYear) },
  });

  const loading = entityLoading || taxLoading || entriesLoading;

  if (loading) return <PageLoader message="Loading tax overview..." />;

  if (!taxData?.getTaxProjection || !entityData?.fiscalEntity) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="py-12 text-center">
            <AlertCircle className="w-12 h-12 text-error-500 mx-auto mb-4" />
            <p className="text-error-600">Unable to load tax data</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const entity = entityData.fiscalEntity;
  const projection = taxData.getTaxProjection;
  const entries = entriesData?.financialEntries?.items || [];

  // Entry type summaries now come from the backend
  const incomeTotal = projection.incomeTotal;
  const deductionsTotal = projection.deductionsTotal;
  const creditsTotal = projection.creditsTotal;
  const taxPaidTotal = projection.taxPaidTotal;

  // Total credits applied is calculated by the backend
  const actualCreditsApplied = projection.creditsApplied;

  const onBack = () => {
    router.push(`/entities/${entityId}`);
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-7xl mx-auto py-8 px-4">
        <BackButton onClick={onBack} text="Back to Entity" />

        {/* Newcomer Welcome Banner */}
        <NewcomerWelcomeBanner />

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-neutral-900 mb-2">Tax Overview</h1>
              <p className="text-neutral-600">
                {entity.name} • Tax Year {selectedTaxYear}
              </p>
            </div>
          </div>

          {/* Tax Year Selector */}
          <div className="flex gap-2">
            {TAX_YEARS.map(year => (
              <Button
                key={year}
                variant={selectedTaxYear === year ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setSelectedTaxYear(year)}
              >
                {year}
              </Button>
            ))}
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Total Tax Liability */}
          <Card className="border-l-4 border-l-error-500">
            <CardContent className="py-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-neutral-600 mb-1">
                    <TaxTooltip
                      term={TAX_GLOSSARY.taxLiability.term}
                      description={TAX_GLOSSARY.taxLiability.description}
                      example={TAX_GLOSSARY.taxLiability.example}
                      link={TAX_GLOSSARY.taxLiability.link}
                    >
                      Tax Liability
                    </TaxTooltip>
                  </p>
                  <p className="text-2xl font-bold text-neutral-900">
                    {formatCurrency(projection.totalTaxLiability)}
                  </p>
                  <p className="text-xs text-neutral-500 mt-2">
                    Amount owed to{' '}
                    <TaxTooltip
                      term={TAX_GLOSSARY.cra.term}
                      description={TAX_GLOSSARY.cra.description}
                      example={TAX_GLOSSARY.cra.example}
                      link={TAX_GLOSSARY.cra.link}
                    >
                      CRA
                    </TaxTooltip>
                  </p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-error-100 flex items-center justify-center">
                  <Calculator className="w-5 h-5 text-error-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Total Income */}
          <Card className="border-l-4 border-l-success-500">
            <CardContent className="py-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-neutral-600 mb-1">
                    <TaxTooltip
                      term={TAX_GLOSSARY.totalIncome.term}
                      description={TAX_GLOSSARY.totalIncome.description}
                      example={TAX_GLOSSARY.totalIncome.example}
                      link={TAX_GLOSSARY.totalIncome.link}
                    >
                      Total Income
                    </TaxTooltip>
                  </p>
                  <p className="text-2xl font-bold text-neutral-900">
                    {formatCurrency(projection.totalIncome)}
                  </p>
                  <p className="text-xs text-neutral-500 mt-2">
                    {entries.filter(e => e.type === FinancialType.Income).length} entries
                  </p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-success-100 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-success-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Taxable Income */}
          <Card className="border-l-4 border-l-warning-500">
            <CardContent className="py-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-neutral-600 mb-1">
                    <TaxTooltip
                      term={TAX_GLOSSARY.taxableIncome.term}
                      description={TAX_GLOSSARY.taxableIncome.description}
                      example={TAX_GLOSSARY.taxableIncome.example}
                      link={TAX_GLOSSARY.taxableIncome.link}
                    >
                      Taxable Income
                    </TaxTooltip>
                  </p>
                  <p className="text-2xl font-bold text-neutral-900">
                    {formatCurrency(projection.taxableIncome)}
                  </p>
                  <p className="text-xs text-neutral-500 mt-2">After deductions</p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-warning-100 flex items-center justify-center">
                  <PieChart className="w-5 h-5 text-warning-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Effective Tax Rate */}
          <Card className="border-l-4 border-l-primary-500">
            <CardContent className="py-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-neutral-600 mb-1">
                    <TaxTooltip
                      term={TAX_GLOSSARY.effectiveTaxRate.term}
                      description={TAX_GLOSSARY.effectiveTaxRate.description}
                      example={TAX_GLOSSARY.effectiveTaxRate.example}
                      link={TAX_GLOSSARY.effectiveTaxRate.link}
                    >
                      Effective Rate
                    </TaxTooltip>
                  </p>
                  <p className="text-2xl font-bold text-neutral-900">
                    {formatPercentage(projection.effectiveTaxRate)}
                  </p>
                  <p className="text-xs text-neutral-500 mt-2">Average tax rate</p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-primary-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Visual Tax Flow */}
        <div className="mb-8">
          <TaxFlowVisualization
            totalIncome={projection.totalIncome}
            deductions={deductionsTotal}
            taxableIncome={projection.taxableIncome}
            federalTax={projection.federalTax}
            provincialTax={projection.provincialTax}
            totalTax={projection.totalTax}
            credits={actualCreditsApplied}
            taxPaid={taxPaidTotal}
            taxLiability={projection.totalTaxLiability}
            provinceName={entity.province}
          />
        </div>

        {/* Tax Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Tax Calculation Breakdown */}
          <Card>
            <CardContent className="py-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center gap-2">
                <Calculator className="w-5 h-5 text-primary-600" />
                Tax Calculation
              </h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-neutral-200">
                  <span className="text-sm text-neutral-600">Total Income</span>
                  <span className="font-semibold text-neutral-900">
                    {formatCurrency(projection.totalIncome)}
                  </span>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-neutral-200">
                  <span className="text-sm text-neutral-600">
                    <TaxTooltip
                      term={TAX_GLOSSARY.deductions.term}
                      description={TAX_GLOSSARY.deductions.description}
                      example={TAX_GLOSSARY.deductions.example}
                      link={TAX_GLOSSARY.deductions.link}
                    >
                      Deductions
                    </TaxTooltip>
                  </span>
                  <span className="font-semibold text-error-600">
                    -{formatCurrency(deductionsTotal)}
                  </span>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-neutral-200 bg-neutral-50 px-3 rounded-lg">
                  <span className="text-sm font-medium text-neutral-700">Taxable Income</span>
                  <span className="font-bold text-neutral-900">
                    {formatCurrency(projection.taxableIncome)}
                  </span>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-neutral-200">
                  <span className="text-sm text-neutral-600">
                    <TaxTooltip
                      term={TAX_GLOSSARY.federalTax.term}
                      description={TAX_GLOSSARY.federalTax.description}
                      example={TAX_GLOSSARY.federalTax.example}
                      link={TAX_GLOSSARY.federalTax.link}
                    >
                      Federal Tax
                    </TaxTooltip>
                  </span>
                  <span className="font-semibold text-neutral-900">
                    {formatCurrency(projection.federalTax)}
                  </span>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-neutral-200">
                  <span className="text-sm text-neutral-600">
                    <TaxTooltip
                      term={TAX_GLOSSARY.provincialTax.term}
                      description={TAX_GLOSSARY.provincialTax.description}
                      example={TAX_GLOSSARY.provincialTax.example}
                      link={TAX_GLOSSARY.provincialTax.link}
                    >
                      Provincial Tax ({entity.province})
                    </TaxTooltip>
                  </span>
                  <span className="font-semibold text-neutral-900">
                    {formatCurrency(projection.provincialTax)}
                  </span>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-neutral-200">
                  <span className="text-sm text-neutral-600">Total Tax</span>
                  <span className="font-semibold text-neutral-900">
                    {formatCurrency(projection.totalTax)}
                  </span>
                </div>

                <div className="flex flex-col justify-center py-3 border-b border-neutral-200">
                  <div className="w-full flex items-center justify-between">
                    <span className="text-sm text-neutral-600">
                      <TaxTooltip
                        term={TAX_GLOSSARY.credits.term}
                        description={TAX_GLOSSARY.credits.description}
                        example={TAX_GLOSSARY.credits.example}
                        link={TAX_GLOSSARY.credits.link}
                      >
                        Credits Applied
                      </TaxTooltip>
                    </span>
                    <span className="font-semibold text-success-600">
                      -{formatCurrency(actualCreditsApplied)}
                    </span>
                  </div>

                  {actualCreditsApplied > 0 && (
                    <div className="mt-1 bg-success-50 rounded-md">
                      <p className="text-xs text-success-800">
                        💡 Includes automatic{' '}
                        <TaxTooltip
                          term={TAX_GLOSSARY.bpaCredit.term}
                          description={TAX_GLOSSARY.bpaCredit.description}
                          example={TAX_GLOSSARY.bpaCredit.example}
                          link={TAX_GLOSSARY.bpaCredit.link}
                        >
                          BPA credits
                        </TaxTooltip>{' '}
                        (~$3,061) that everyone gets automatically.
                        {creditsTotal > 0 &&
                          ` Plus your claimed credits of ${formatCurrency(creditsTotal)}.`}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between py-3 border-b border-neutral-200">
                  <span className="text-sm text-neutral-600">
                    <TaxTooltip
                      term={TAX_GLOSSARY.taxPaid.term}
                      description={TAX_GLOSSARY.taxPaid.description}
                      example={TAX_GLOSSARY.taxPaid.example}
                      link={TAX_GLOSSARY.taxPaid.link}
                    >
                      Tax Already Paid
                    </TaxTooltip>
                  </span>
                  <span className="font-semibold text-success-600">
                    -{formatCurrency(taxPaidTotal)}
                  </span>
                </div>

                <div className="flex items-center justify-between py-4 bg-primary-50 px-4 rounded-lg mt-2">
                  <span className="text-base font-bold text-primary-900">Final Tax Liability</span>
                  <span className="text-xl font-bold text-primary-900">
                    {formatCurrency(projection.totalTaxLiability)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Entry Type Summary */}
          <Card>
            <CardContent className="py-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center gap-2">
                <PieChart className="w-5 h-5 text-primary-600" />
                Financial Summary
              </h3>

              <div className="space-y-4">
                {/* Income */}
                <div className="p-4 bg-success-50 rounded-lg border border-success-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <ArrowUpRight className="w-5 h-5 text-success-600" />
                      <span className="font-semibold text-success-900">Income</span>
                    </div>
                    <Badge variant="success">
                      {entries.filter(e => e.type === FinancialType.Income).length} entries
                    </Badge>
                  </div>
                  <p className="text-2xl font-bold text-success-900">
                    {formatCurrency(incomeTotal)}
                  </p>
                </div>

                {/* Deductions */}
                <div className="p-4 bg-warning-50 rounded-lg border border-warning-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <ArrowDownRight className="w-5 h-5 text-warning-600" />
                      <span className="font-semibold text-warning-900">Deductions</span>
                    </div>
                    <Badge variant="warning">
                      {entries.filter(e => e.type === FinancialType.Deduction).length} entries
                    </Badge>
                  </div>
                  <p className="text-2xl font-bold text-warning-900">
                    {formatCurrency(deductionsTotal)}
                  </p>
                </div>

                {/* Credits */}
                <div className="p-4 bg-primary-50 rounded-lg border border-primary-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-primary-600" />
                      <span className="font-semibold text-primary-900">Tax Credits</span>
                    </div>
                    <Badge variant="primary">
                      {entries.filter(e => e.type === FinancialType.Credit).length} entries
                    </Badge>
                  </div>
                  <p className="text-2xl font-bold text-primary-900">
                    {formatCurrency(creditsTotal)}
                  </p>
                </div>

                {/* Tax Paid */}
                <div className="p-4 bg-neutral-100 rounded-lg border border-neutral-300">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Calculator className="w-5 h-5 text-neutral-600" />
                      <span className="font-semibold text-neutral-900">Tax Paid</span>
                    </div>
                    <Badge variant="secondary">
                      {entries.filter(e => e.type === FinancialType.TaxPaid).length} entries
                    </Badge>
                  </div>
                  <p className="text-2xl font-bold text-neutral-900">
                    {formatCurrency(taxPaidTotal)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardContent className="py-6">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Quick Actions</h3>
            <div className="flex flex-wrap gap-3">
              <Link href={`/entities/${entityId}/entries`}>
                <Button variant="outline" size="md">
                  <FileText className="w-4 h-4 mr-2" />
                  View All Entries
                </Button>
              </Link>
              <Link href={`/entities/${entityId}/entries/create`}>
                <Button variant="primary" size="md">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Add Entry
                </Button>
              </Link>
              <Link href={`/entities/${entityId}/documents`}>
                <Button variant="outline" size="md">
                  <FileText className="w-4 h-4 mr-2" />
                  View Documents
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Tax Information Notice */}
        <Card className="mt-6 bg-blue-50 border-blue-200">
          <CardContent className="py-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div className="text-sm text-blue-900">
                <p className="font-semibold mb-1">Tax Projection Disclaimer</p>
                <p className="mb-2">
                  This is an estimated tax projection based on your financial entries. Actual tax
                  liability may vary. Please consult with a tax professional for accurate filing.
                  Calculations use {selectedTaxYear} tax brackets for {entity.province}, Canada.
                </p>
                <p className="text-xs mt-2 pt-2 border-t border-blue-300">
                  <strong>Need Help?</strong> Call CRA at{' '}
                  <a href="tel:1-800-959-8281" className="font-semibold hover:underline">
                    1-800-959-8281
                  </a>{' '}
                  for free tax assistance, or visit a{' '}
                  <a
                    href="https://www.canada.ca/en/revenue-agency/services/tax/individuals/community-volunteer-income-tax-program.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold hover:underline"
                  >
                    free tax clinic
                  </a>{' '}
                  in your community. Filing deadline is April 30 each year.{' '}
                  <a
                    href="https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/about-your-tax-return.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold hover:underline inline-flex items-center gap-1"
                  >
                    Visit CRA Resources
                    <span className="text-[10px]">↗</span>
                  </a>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
