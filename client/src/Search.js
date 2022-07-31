import React, { useEffect, useState } from "react";
import { v4 as uuid } from "uuid";
import { onValue, ref, set } from "firebase/database";
import { db } from "./firebase-config";
import { NFTStorage, File } from "nft.storage";
import { baseSVG } from "./utils/BaseSVG";
import { Link } from "react-router-dom";

const Search = () => {
  const REACT_APP_NFT_STORAGE_API_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweGY2Mjk2Y0Q0YzU5N2JiNEM3MjMxNjI5ZkJmOUIzNjA5ZDcyREE1YTgiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY1ODcyNDc5OTEzMCwibmFtZSI6Im9wdGVxX25mdF9rZXkifQ.1bwW6hy21w966fAIZnK1b5g6icZ63gP08T2nAc5e6wE";
  //
  const [query, setQuery] = useState("");
  const [readData, setReadData] = useState([]);
  var [searchResults, setSearchResults] = useState([]);
  var [searchResultsTitle, setSearchResultsTitle] = useState([]);
  var [notFound, setNotFound] = useState(null);

  var [term, setTerm] = useState("");
  var [description, setDescription] = useState("");
  var [walletAddress, setWalletAddress] = useState("");

  var [load, setLoad] = useState(false);

  const InsertNFTtoDatabase = (
    unique_id,
    term,
    description,
    walletAddress,
    ipnft,
    url,
    image_url
  ) => {
    set(ref(db, `/data/${unique_id}`), {
      unique_id,
      item: term,
      description: "___" + term + "___" + description,
      walletAddress: walletAddress,
      date: new Date().toLocaleString(),
      nft_hash: ipnft,
      url: url,
      image_url,
    });
  };

  async function storeNFT(imagePath, name, description) {
    console.log("saving to NFT storage");
    const nftstorage = new NFTStorage({ token: REACT_APP_NFT_STORAGE_API_KEY });
    setLoad(true);
    try {
      await nftstorage
        .store({
          name,
          description,
          image: new File([`${baseSVG}${name}</text></svg>`], `opteqnft.svg`, {
            type: "image/svg+xml",
          }),
        })
        .then((metadata) => {
          setTimeout(() => {
            setLoad(false);
          }, 3000);

          InsertNFTtoDatabase(
            uuid(),
            metadata.data.name,
            metadata.data.description,
            walletAddress,
            metadata.ipnft,
            metadata.url,
            metadata.data.image.href
          );

          alert("NFT Minted Successfully!");

          setTerm("");
          setDescription("");
          setWalletAddress("");
        });
    } catch (error) {
      console.log(error);
      console.log("Could not save NFT to NFT.Storage - Aborted minting");
    }
  }
  // NFT
  const SubmitNFTForm = () => {
    var currentItems = [];
    for (let record of readData) {
      currentItems.push(record.item);
    }

    if (
      query.trim() === "" ||
      description.trim() === "" ||
      walletAddress.trim() === ""
    ) {
      alert("Please provide complete details");
      return;
    } else if (currentItems.includes(query.trim())) {
      alert("This Term has already been Minted.");
    } else {
      storeNFT(null, query, description);
    }
  };

  const SubmitTermForm = () => {
    if (
      term.trim() === "" ||
      description.trim() === "" ||
      walletAddress.trim() === ""
    ) {
      alert("Please provide complete details");
      return;
    } else {
      writeToDatabase();
      alert("Term Added Successfully!");
      setTerm("");
      setDescription("");
      setWalletAddress("");
    }
  };

  // write
  const id = uuid();
  const writeToDatabase = () => {
    set(ref(db, `/data/${id}`), {
      id,
      item: term,
      description: "___" + term + "___" + description,
      walletAddress: walletAddress,
      date: new Date().toLocaleString(),
    });
  };

  // read
  useEffect(() => {
    onValue(ref(db, "/data"), (record) => {
      const data = record.val();
      if (data != null) {
        var out = [];
        Object.values(data).map((item) => {
          out.push(item);
        });
        setReadData(out);
      }
    });
  }, []);

  // search
  const SearchForQuery = () => {
    var titleResult = [];
    var descriptionResult = [];
    if (query.trim() === "") {
      setNotFound(true);
      return;
    }
    let words = query.split(" ");

    readData.map((record) => {
      var title = record.item;
      // var description = record.description.replace("___" + title + "___", "");
      var description = record.description;

      let foundTitle = words.every((item) =>
        title.toLowerCase().includes(item.toLowerCase())
      );
      if (foundTitle) {
        titleResult.push(title);
      } else {
        titleResult.push("");
      }

      let foundDescp = words.every((item) =>
        description.toLowerCase().includes(item.toLowerCase())
      );
      if (foundDescp) {
        descriptionResult.push(description);
      } else {
        descriptionResult.push("");
      }
    });

    if (descriptionResult.every((element) => element === "")) {
      descriptionResult = [];
    }
    if (titleResult.every((element) => element === "")) {
      titleResult = [];
    }

    let tempCount =
      titleResult.length > 0 ? titleResult.length : descriptionResult.length;

    for (var i = tempCount - 1; i >= 0; i--) {
      if (
        (titleResult[i] === "" &&
          typeof descriptionResult[i] === "undefined") ||
        (descriptionResult[i] === "" && typeof titleResult[i] === "undefined")
      ) {
        descriptionResult.splice(i, 1);
        titleResult.splice(i, 1);
      }

      if (titleResult[i] === "" && descriptionResult[i] === "") {
        descriptionResult.splice(i, 1);
        titleResult.splice(i, 1);
      }
    }

    if (descriptionResult.length > 0 || titleResult.length > 0) {
      setNotFound(false);
    } else {
      setNotFound(true);
    }

    setSearchResults(descriptionResult);
    setSearchResultsTitle(titleResult);
  };

  return (
    <div className="App">
      <div className="link text-end px-5 py-3">
        <Link
          to={`/MyRecord`}
          className="text-decoration-none fw-bold rounded-pill border py-2 px-3 border-primary"
        >
          My Record
        </Link>
      </div>

      <div className="container">
        <div className="row mt-5 mb-3">
          <div className="col-md-6 mx-auto">
            <div className="input-group p-2 overflow-hidden rounded-pill">
              <input
                type="text"
                className="form-control border-0 shadow-none"
                placeholder="Enter any Keyword to Search"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                }}
              />
              <button
                className="btn btn-primary rounded-pill w-25"
                type="button"
                id="button-addon2"
                onClick={SearchForQuery}
              >
                Search
              </button>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="text-start col-md-12 mx-auto">
            <div className="row mb-5">
              <div className="col-md-12 text-center">
                {/* add term button */}
                {notFound === false ? (
                  <>
                    <button
                      type="button"
                      className="btn btn-primary rounded-pill"
                      data-bs-toggle="modal"
                      data-bs-target="#formModal"
                    >
                      Add Term
                    </button>

                    <div
                      className="modal fade"
                      id="formModal"
                      aria-labelledby="formModalLabel"
                      aria-hidden="true"
                    >
                      <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                          <div className="modal-header">
                            <h5 className="modal-title" id="formModalLabel">
                              Add Term to Database
                            </h5>
                            <button
                              type="button"
                              className="btn-close"
                              data-bs-dismiss="modal"
                              aria-label="Close"
                            ></button>
                          </div>
                          <div className="modal-body">
                            <div className="form-group text-start mb-2">
                              <label>Term</label>
                              <input
                                type="text"
                                className="form-control"
                                value={term}
                                onChange={(e) => {
                                  setTerm(e.target.value);
                                }}
                              />
                            </div>
                            <div className="form-group text-start mb-2">
                              <label>Description</label>
                              <textarea
                                className="form-control"
                                id="exampleFormControlTextarea1"
                                rows="3"
                                value={description}
                                onChange={(e) => {
                                  setDescription(e.target.value);
                                }}
                              />
                            </div>
                            <div className="form-group text-start mb-2">
                              <label>Wallet Address</label>
                              <input
                                type="text"
                                className="form-control"
                                value={walletAddress}
                                onChange={(e) => {
                                  setWalletAddress(e.target.value);
                                }}
                              />
                            </div>
                          </div>
                          <div className="modal-footer">
                            <button
                              type="button"
                              className="btn btn-secondary"
                              data-bs-dismiss="modal"
                            >
                              Close
                            </button>
                            <button
                              type="button"
                              className="btn btn-primary"
                              onClick={SubmitTermForm}
                            >
                              Add Term
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                ) : null}
              </div>
            </div>

            <div className="row">
              {/* results */}
              {notFound == null || notFound === false ? (
                searchResults.map((res, index) => (
                  <div className="col-12 col-md-3 col-lg-3 mb-3" key={index}>
                    <div className="card h-100">
                      <div className="card-header">
                        <h5 className="card-title mb-0">
                          {searchResultsTitle[index]}
                        </h5>
                      </div>
                      <div className="card-body">
                        <p className="card-text">
                          {res.replace(/___.*___/, "")}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <i className="text-center mx-auto">
                  Nothing Found for this Term
                </i>
              )}
              {notFound == null ||
              notFound === false ||
              query.trim() === "" ? null : (
                <div className="col-md-12 text-center mx-auto">
                  <i>
                    You can <span className="help">MINT</span> this term.
                  </i>
                  <button
                    type="button"
                    className="btn orange-grad px-5 py-2 text-white rounded-pill d-block mx-auto mt-3 fw-normal"
                    data-bs-toggle="modal"
                    data-bs-target="#mintModal"
                  >
                    MINT
                  </button>

                  <div
                    className="modal fade"
                    id="mintModal"
                    aria-labelledby="mintModalLabel"
                    aria-hidden="true"
                  >
                    <div className="modal-dialog modal-dialog-centered">
                      <div className="modal-content">
                        {load === true ? (
                          <div
                            className="spinner-border wi-100 mx-auto mt-3"
                            role="status"
                          ></div>
                        ) : null}

                        <div className="modal-header">
                          <h5 className="modal-title" id="mintModalLabel">
                            MINT Term to NFT
                          </h5>
                          <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                          ></button>
                        </div>
                        <div className="modal-body">
                          <div className="form-group text-start mb-2">
                            <label>Term</label>
                            <input
                              type="text"
                              className="form-control orange-grad-input"
                              value={query}
                            />
                          </div>
                          <div className="form-group text-start mb-2">
                            <label>Description</label>
                            <textarea
                              className="form-control orange-grad-input"
                              id="exampleFormControlTextarea1"
                              rows="3"
                              value={description}
                              onChange={(e) => {
                                setDescription(e.target.value);
                              }}
                            />
                          </div>
                          <div className="form-group text-start mb-2">
                            <label>Wallet Address</label>
                            <input
                              type="text"
                              className="form-control orange-grad-input"
                              value={walletAddress}
                              onChange={(e) => {
                                setWalletAddress(e.target.value);
                              }}
                            />
                          </div>
                        </div>
                        <div className="modal-footer">
                          <button
                            type="button"
                            className="btn btn-secondary"
                            data-bs-dismiss="modal"
                          >
                            Close
                          </button>
                          <button
                            type="button"
                            className="btn orange-grad text-white w-25"
                            onClick={SubmitNFTForm}
                          >
                            MINT
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;
