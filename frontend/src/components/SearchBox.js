import React, { useState } from "react";
import { Form } from "react-bootstrap";

const SearchBox = ({ history }) => {
  const [keyword, setKeyword] = useState("");

  const submitHandler = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      history.push(`/search/${keyword}`);
    } else {
      history.push("/");
    }
  };

  return (
    <Form onSubmit={submitHandler} className="search-form">
      <div className="position-relative">
        <i className="fas fa-search search-icon"></i>
        <Form.Control
          type="text"
          name="q"
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Search products..."
          className="search-input"
        />
      </div>
    </Form>
  );
};

export default SearchBox;
