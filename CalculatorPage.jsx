import React from 'react';
import RentCalculator from '../components/RentCalculator';

const CalculatorPage = () => {
  return (
    <div className="py-5 bg-light min-vh-100">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-5">
          <span className="badge bg-teal-main px-3 py-2 rounded-pill fw-bold mb-2">
            Indian Real Estate Tools
          </span>
          <h2 className="fw-extrabold text-dark">Rent Affordability & Tenancy Guide</h2>
          <p className="text-muted mx-auto" style={{ maxWidth: '650px' }}>
            Calculate your recommended monthly rental budget, security deposit expectations across Indian metro tiers, and understand the Indian Model Tenancy Act.
          </p>
        </div>

        {/* Calculator Widget */}
        <div className="row justify-content-center mb-5">
          <div className="col-lg-10">
            <RentCalculator />
          </div>
        </div>

        {/* Indian Rental Law & Tenancy Guidelines */}
        <div className="row g-4 mt-2">
          <div className="col-lg-6">
            <div className="bg-white p-4 rounded-4 border shadow-sm h-100">
              <div className="d-flex align-items-center gap-2 mb-3">
                <i className="bi bi-file-earmark-ruled-fill text-teal-main fs-4"></i>
                <h5 className="fw-bold text-dark mb-0">The 11-Month Agreement Rule</h5>
              </div>
              <p className="text-secondary small leading-relaxed">
                In India, most residential rental contracts are signed for <strong>11 months</strong>. Under the Registration Act of 1908, leases for a period exceeding 11 months require mandatory stamp duty registration at the sub-registrar office. Signing an 11-month agreement saves time and recurring registry costs while remaining legally binding.
              </p>
              <ul className="text-secondary small d-flex flex-column gap-2 mb-0 ps-3">
                <li><strong>Notice Period:</strong> Typically 1 month (or 30 days) written notice from either tenant or landlord.</li>
                <li><strong>Rent Escalation:</strong> Standard annual rent increase in Indian metros ranges between 5% and 10%.</li>
                <li><strong>Security Deposit Refund:</strong> Payable upon handover of keys minus agreed painting/damage repairs.</li>
              </ul>
            </div>
          </div>

          <div className="col-lg-6">
            <div className="bg-white p-4 rounded-4 border shadow-sm h-100">
              <div className="d-flex align-items-center gap-2 mb-3">
                <i className="bi bi-cash-coin text-warning fs-4"></i>
                <h5 className="fw-bold text-dark mb-0">HRA Tax Exemption & TDS</h5>
              </div>
              <p className="text-secondary small leading-relaxed">
                Salaried employees in India can claim House Rent Allowance (HRA) tax exemption under Section 10(13A) of the Income Tax Act by submitting valid rent receipts and their rental agreement.
              </p>
              <ul className="text-secondary small d-flex flex-column gap-2 mb-0 ps-3">
                <li><strong>Landlord PAN Mandatory:</strong> Required by your employer if annual rent exceeds <strong>₹1,00,000</strong>.</li>
                <li><strong>TDS on Rent (Section 194-IB):</strong> If monthly rent exceeds <strong>₹50,000</strong>, the tenant is required to deduct 5% TDS and deposit it with the Income Tax Department via Form 26QC.</li>
                <li><strong>Police Verification:</strong> Mandatory in cities like Delhi, Mumbai, Bengaluru, and Pune for tenant onboarding.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalculatorPage;
