import React from "react";

const CategoryForm = ({ handleSubmit, value, setValue  }) => {
  

  return (  
    <>
      <form onSubmit={handleSubmit}>
        <div className="mb-3 mr-6">
          <h2>Registrar categoria</h2>
          <input
            type="text"
            className="form-control"
            placeholder="Ingrese nueva categoría"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
           <input
          type="text"
          value={value}
          placeholder="Ingresa una descripción"
          className="form-control"
          onChange={(e) => setValue(e.target.value)}
          required
        />

        <label className="btn btn-primary col-md-12">
          Imagen
          <input
            type="file"
            name="photo"
            accept="image/*"
            onChange={(e) => setValue(e.target.value)}
            hidden
            required
          />
        </label>
        </div>

        <button type="submit" className="btn btn-success">
          Registrar categoría
        </button>
      </form>

      
    </>
  );
};

export default CategoryForm;