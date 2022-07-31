import React, { useEffect, useState } from "react";
import { db } from "./firebase-config";
import { onValue, ref } from "firebase/database";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap";
import "./App.css";
import { Route, Routes, useParams } from "react-router-dom";

function MyRecords() {
  const params = useParams();
  var walletAddress;
  if (params.walletAddress) {
    walletAddress = params.walletAddress;
  } else {
    walletAddress = prompt("Enter Wallet Address:");

    while (walletAddress === "") {
      walletAddress = prompt("Enter Wallet Address:");
    }
  }

  var [records, setRecords] = useState([]);

  useEffect(() => {
    onValue(ref(db, "/data"), (record) => {
      const data = record.val();

      if (data != null) {
        var result = [];

        Object.values(data).map((item) => {
          if (item.walletAddress === walletAddress) {
            result.push(item);
          }
        });
        setRecords(result);
      }
    });
  }, []);

  return (
    <div>
      <div className="col-md-11 mx-auto text-start mt-4 table-responsive">
        <h6 className="text-center mt-4 d-block mx-auto">Your Record</h6>

        <table className="table table-hover mt-3">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Title</th>
              <th scope="col">Description</th>
              <th scope="col">NFT Hash</th>
              <th scope="col">URL</th>
              <th scope="col">Image URL</th>
              <th scope="col">Date</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(records).length <= 0 ? (
              <span className="text-center mt-4 d-block mx-auto">
                No Record Found
              </span>
            ) : (
              records.map((res, i) => (
                <tr key={i}>
                  <th scope="row">{i + 1}</th>
                  <td>{res.item}</td>
                  <td>{res.description.replace(/___.*___/, "")}</td>
                  <td>{res.nft_hash}</td>
                  <td>{res.url}</td>
                  <td>{res.image_url}</td>
                  <td>{res.date}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* <Routes>
        <Route path="/users/:userId" element={<Users />} />
      </Routes> */}
    </div>
  );
}

export default MyRecords;
