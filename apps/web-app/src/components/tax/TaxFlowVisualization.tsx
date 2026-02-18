import React from 'react';
import { ArrowDown, TrendingUp, TrendingDown, Minus, DollarSign, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui';

interface TaxFlowVisualizationProps {
  totalIncome: number;
  deductions: number;
  taxableIncome: number;
  federalTax: number;
  provincialTax: number;
  totalTax: number;
  credits: number;
  taxPaid: number;
  taxLiability: number;
  provinceName: string;
}

export const TaxFlowVisualization: React.FC<TaxFlowVisualizationProps> = ({
  totalIncome,
  deductions,
  taxableIncome,
  federalTax,
  provincialTax,
  totalTax,
  credits,
  taxPaid,
  taxLiability,
  provinceName,
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const FlowStep = ({
    icon: Icon,
    label,
    amount,
    color,
    description,
  }: {
    icon: React.ElementType;
    label: string;
    amount: number;
    color: string;
    description: string;
  }) => (
    <div className={`p-4 rounded-lg border-2 ${color}`}>
      <div className="flex items-center gap-3 mb-2">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center ${color.replace('border', 'bg').replace('500', '100')}`}
        >
          <Icon className={`w-5 h-5 ${color.replace('border', 'text')}`} />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-neutral-700">{label}</p>
          <p className="text-2xl font-bold text-neutral-900">{formatCurrency(amount)}</p>
        </div>
      </div>
      <p className="text-xs text-neutral-600 leading-relaxed">{description}</p>
    </div>
  );

  const Arrow = ({ label }: { label?: string }) => (
    <div className="flex flex-col items-center py-2">
      <ArrowDown className="w-6 h-6 text-neutral-400" />
      {label && (
        <span className="text-xs font-medium text-neutral-500 mt-1 px-2 py-1 bg-neutral-100 rounded">
          {label}
        </span>
      )}
    </div>
  );

  return (
    <Card>
      <CardContent className="py-6">
        <h3 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-primary-600" />
          Your Money's Journey Through Canadian Taxes
        </h3>

        <p className="text-sm text-neutral-600 mb-6">
          Follow your income as it moves through Canada's tax system. Each step is explained in
          simple terms!
        </p>

        <div className="space-y-1">
          {/* Step 1: Total Income */}
          <FlowStep
            icon={TrendingUp}
            label="1. Your Total Income"
            amount={totalIncome}
            color="border-success-500"
            description="All the money you earned this year from work, investments, or other sources."
          />

          <Arrow label="Subtract" />

          {/* Step 2: Deductions */}
          <FlowStep
            icon={TrendingDown}
            label="2. Your Deductions"
            amount={deductions}
            color="border-warning-500"
            description="Things that reduce what you're taxed on (like RRSP contributions). The government says 'We won't tax this part.'"
          />

          <Arrow label="Equals" />

          {/* Step 3: Taxable Income */}
          <FlowStep
            icon={DollarSign}
            label="3. Your Taxable Income"
            amount={taxableIncome}
            color="border-primary-500"
            description="This is what actually gets taxed. It's your income after removing deductions."
          />

          <Arrow label="Apply tax rates" />

          {/* Step 4: Taxes Calculated */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-4 rounded-lg border-2 border-error-300 bg-error-50">
              <p className="text-xs font-medium text-error-700 mb-1">4a. Federal Tax (Canada)</p>
              <p className="text-xl font-bold text-error-900">{formatCurrency(federalTax)}</p>
              <p className="text-xs text-error-700 mt-2">Funds national programs</p>
            </div>
            <div className="p-4 rounded-lg border-2 border-error-300 bg-error-50">
              <p className="text-xs font-medium text-error-700 mb-1">
                4b. Provincial Tax ({provinceName})
              </p>
              <p className="text-xl font-bold text-error-900">{formatCurrency(provincialTax)}</p>
              <p className="text-xs text-error-700 mt-2">Funds local services</p>
            </div>
          </div>

          <div className="text-center py-2">
            <span className="text-sm font-medium text-neutral-500 px-3 py-1 bg-neutral-100 rounded">
              Total: {formatCurrency(totalTax)}
            </span>
          </div>

          <Arrow label="Subtract" />

          {/* Step 5: Credits */}
          <FlowStep
            icon={CheckCircle}
            label="5. Tax Credits Applied"
            amount={credits}
            color="border-success-500"
            description="Automatic discounts everyone gets (like Basic Personal Amount). These directly reduce your tax."
          />

          <Arrow label="Subtract" />

          {/* Step 6: Already Paid */}
          <FlowStep
            icon={Minus}
            label="6. Tax Already Paid"
            amount={taxPaid}
            color="border-blue-500"
            description="Your employer sent this to CRA throughout the year from your paycheques."
          />

          <Arrow label="Final Result" />

          {/* Step 7: Final Liability */}
          <div
            className={`p-5 rounded-lg border-3 ${taxLiability > 0 ? 'border-error-500 bg-error-50' : 'border-success-500 bg-success-50'}`}
          >
            <div className="text-center">
              <p className="text-sm font-medium text-neutral-700 mb-2">
                7. Final Amount {taxLiability > 0 ? 'You Owe' : 'You Get Back'}
              </p>
              <p
                className={`text-4xl font-bold ${taxLiability > 0 ? 'text-error-900' : 'text-success-900'}`}
              >
                {formatCurrency(Math.abs(taxLiability))}
              </p>
              {taxLiability > 0 ? (
                <p className="text-sm text-error-700 mt-3">
                  💡 Pay by April 30 to avoid interest charges
                </p>
              ) : (
                <p className="text-sm text-success-700 mt-3">
                  🎉 You'll receive this refund from CRA!
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-900">
            <strong>For New Canadians:</strong> This flow shows how Canada's "progressive" tax
            system works. You don't pay ONE rate on all your money. Instead, different portions are
            taxed at different rates, and everyone gets automatic Credits to reduce their tax. The
            system is designed to be fair!
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaxFlowVisualization;
