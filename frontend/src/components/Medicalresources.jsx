import React from "react";
import Medicalresources from "./components/Medicalresources";
import "./Resourses.css";

function Medicalresources() {
  return (
    <div className="ra-container">
      
      <header className="ra-topbar">
                
      </header>

      <div className="ra-content">

        /* Main content area (gray background) */
        <main className="ra-main">

          {/* Title row n edt btn*/}
          <div className="ra-header-row">
            <h1>Medical Recourse Allocation</h1>
            <button className="ra-add-btn">Add</button>
          </div>

          {/* Table*/}
          <table className="ra-table">
            <thead>
              <tr>
                <th>Medical Id</th>
                <th>Name</th>
                <th>Quantity</th>
                <th>Memaining</th>
                <th>Alocated Amount</th>
                <th>Remaining Amount</th>
              </tr>
            </thead>
          </table>

          <div className="ra-footer-row">
            <button className="ra-edit-btn">Edit</button>
            <button className="ra-report-btn">Generate report</button>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Medicalresources;