import React, { useState } from 'react';
import { formatINR } from '../utils/formatters';

const RentCalculator = () => {
  const [monthlySalary, setMonthlySalary] = useState(120000);
  const [metroTier, setMetroTier] = useState('tier1'); // tier1 = Bengaluru, Mumbai; tier2 = Pune, Hyd, NCR

  const safeRent = Math.round(monthlySalary * 0.30);
  const stretchRent = Math.round(monthlySalary * 0.40);
  const suggestedDepositMonths = metroTier === 'tier1' ? 4 : 2;
  const suggestedDeposit = safeRent * suggestedDepositMonths;

  return (
    <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white">
      <div className="card-header bg-teal-main text-white p-4">
        <div className="d-flex align-items-center gap-2">
          <i className="bi bi-calculator-fill fs-3 text-warning"></i>
          <div>
            <h5 className="mb-0 fw-bold">India Rent Affordability & Deposit Calculator</h5>
            <small className="text-light opacity-75">Calculate recommended rent based on the standard 30% financial rule</small>
          </div>
        </div>
      </div>

      <div className="card-body p-4">
        <div className="row g-4">
          {/* Controls */}
          <div className="col-lg-6">
            <div className="mb-4">
              <label className="form-label fw-bold text-dark d-flex justify-content-between">
                <span>Monthly In-Hand Salary (INR)</span>
                <span className="text-teal-main fs-5 fw-bold">{formatINR(monthlySalary)}</span>
              </label>
              <input
                type="range"
                className="form-range"
                min="20000"
                max="500000"
                step="5000"
                value={monthlySalary}
                onChange={(e) => setMonthlySalary(Number(e.target.value))}
              />
              <div className="d-flex justify-content-between text-muted small mt-1">
                <span>₹20,000 / mo</span>
                <span>₹2,50,000</span>
                <span>₹5,00,000 / mo</span>
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label fw-bold text-dark">Target Metro City Type</label>
              <div className="btn-group w-100" role="group">
                <button
                  type="button"
                  className={`btn ${metroTier === 'tier1' ? 'btn-teal' : 'btn-outline-secondary'}`}
                  onClick={() => setMetroTier('tier1')}
                >
                  Bengaluru / Mumbai
                  <small className="d-block" style={{ fontSize: '0.7rem' }}>Avg. 4-6 Mos Deposit</small>
                </button>
                <button
                  type="button"
                  className={`btn ${metroTier === 'tier2' ? 'btn-teal' : 'btn-outline-secondary'}`}
                  onClick={() => setMetroTier('tier2')}
                >
                  Delhi-NCR / Hyd / Pune
                  <small className="d-block" style={{ fontSize: '0.7rem' }}>Avg. 2-3 Mos Deposit</small>
                </button>
              </div>
            </div>
          </div>

          {/* Results Display */}
          <div className="col-lg-6">
            <div className="bg-light p-4 rounded-3 h-100 d-flex flex-column justify-content-center border">
              <div className="mb-3">
                <span className="text-muted small fw-semibold text-uppercase">Recommended Safe Rent (30% Rule)</span>
                <h3 className="text-teal-main fw-bold mb-0">{formatINR(safeRent)} <span className="fs-6 text-muted fw-normal">/ month</span></h3>
                <small className="text-muted">Keeps your finances healthy and leaves ample room for savings and investments.</small>
              </div>

              <div className="row g-2 pt-2 border-top">
                <div className="col-6">
                  <span className="text-muted small d-block">Max Stretch Rent (40%)</span>
                  <span className="fw-bold text-dark">{formatINR(stretchRent)}</span>
                </div>
                <div className="col-6">
                  <span className="text-muted small d-block">Est. Security Deposit</span>
                  <span className="fw-bold text-dark">{formatINR(suggestedDeposit)}</span>
                </div>
              </div>

              <div className="mt-3 pt-2 text-muted" style={{ fontSize: '0.75rem' }}>
                <i className="bi bi-info-circle-fill text-teal-main me-1"></i>
                Rental contracts in India are typically drafted for 11 months under the Indian Registration Act.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RentCalculator;
