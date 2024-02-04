import React from "react";
import { useSearch } from "../../context/search";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const SearchInput = () => {
  const [values, setValues] = useSearch();
  const navigate = useNavigate();

  //BUSCAR PRODUCTO
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.get(
        `/api/v1/product/search/${values.keyword}`
      );
      setValues({ ...values, results: data });
      navigate("/search");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <form
        
        role="search"
        onSubmit={handleSubmit}
      >
        <h1>Busca producto</h1>
        <input
          className="form-control me-2"
          type="search"
          placeholder="Buscar..."
          aria-label="Search"
          value={values.keyword}
          onChange={(e) => setValues({ ...values, keyword: e.target.value })}
        />
        <button className="btn btn-success btn-lg mt-4" style={{border: "none"}} type="submit">
          <strong>Buscar</strong>
        </button>
      </form>
    </div>
  );
};

export default SearchInput;