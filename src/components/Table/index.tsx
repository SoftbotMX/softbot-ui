import clsx from "clsx";
import type { ButtonHTMLAttributes } from "react";
import React from "react";

export type TableProps = ButtonHTMLAttributes<HTMLDivElement>;

const Table = (props: TableProps) => {
  const { children, className, ...rest } = props;
  return (
    <div className={clsx("table-wrap has-selection", className)} {...rest}>
      <table className="table table--default">
        <thead>
          <tr>
            <th style={{ width: "52px" }}></th>
            <th>Order Number</th>
            <th>Customer Name</th>
            <th className="col-date">Order Date</th>
            <th>Status</th>
            <th className="num">Total Amount</th>
            <th className="col-payment">Payment Status</th>
            <th className="actions">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="cell-select">
              <input type="checkbox" />
            </td>
            <td>
              <a className="link" href="#">
                #ORD1008
              </a>
            </td>
            <td>
              <div className="hstack">
                <img
                  alt=""
                  src="https://via.placeholder.com/24"
                  style={{ borderRadius: "999rem" }}
                />{" "}
                Esther Kahn
              </div>
            </td>
            <td className="col-date">17 Dec 2024</td>
            <td>
              <span className="badge badge--pending">Pending</span>
            </td>
            <td className="num">$10.50</td>
            <td className="col-payment">Unpaid</td>
            <td className="actions">
              <button className="icon-btn" title="Edit">
                ✎
              </button>
              <button className="icon-btn" title="More">
                ⋯
              </button>
            </td>
          </tr>

          <tr className="is-selected">
            <td className="cell-select">
              <input type="checkbox" checked />
            </td>
            <td>
              <a className="link" href="#">
                #ORD1006
              </a>
            </td>
            <td>Clint Hoppe</td>
            <td className="col-date">16 Dec 2024</td>
            <td>
              <span className="badge badge--completed">Completed</span>
            </td>
            <td className="num">$60.56</td>
            <td className="col-payment">Paid</td>
            <td className="actions">
              <button className="icon-btn">✎</button>
              <button className="icon-btn">🗑</button>
              <button className="icon-btn">⋯</button>
            </td>
          </tr>

          <tr className="is-selected">
            <td className="cell-select">
              <input type="checkbox" checked />
            </td>
            <td>
              <a className="link" href="#">
                #ORD1003
              </a>
            </td>
            <td>Clint Hoppe</td>
            <td className="col-date">16 Dec 2024</td>
            <td>
              <span className="badge badge--completed">Completed</span>
            </td>
            <td className="num">$29.50</td>
            <td className="col-payment">Paid</td>
            <td className="actions">
              <button className="icon-btn">✎</button>
              <button className="icon-btn">🗑</button>
              <button className="icon-btn">⋯</button>
            </td>
          </tr>

          <tr>
            <td className="cell-select">
              <input type="checkbox" />
            </td>
            <td>
              <a className="link" href="#">
                #ORD1001
              </a>
            </td>
            <td>Gretchen Quitz</td>
            <td className="col-date">14 Dec 2024</td>
            <td>
              <span className="badge badge--refunded">Refunded</span>
            </td>
            <td className="num">$123.50</td>
            <td className="col-payment">Paid</td>
            <td className="actions">
              <button className="icon-btn">✎</button>
              <button className="icon-btn">🗑</button>
              <button className="icon-btn">⋯</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Table;
