"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { withSwal } from "react-sweetalert2";

function Categories({ swal }) {
  const [name, setName] = useState("");
  const [categories, setCategories] = useState([]);
  const [parent, setParent] = useState("");
  const [editedCategory, setEditedCategory] = useState(null);
  const [properties, setProperties] = useState([]);

  async function saveCategory(ev) {
    ev.preventDefault();
    if (editedCategory) {
      const id = editedCategory._id;
      await axios
        .put("/api/categories/" + editedCategory._id, {
          name,
          parent,
          id,
          properties: properties.map((p) => ({
            name: p.name,
            values: p.values.split(","),
          })),
        })
        .then((res) => {
          console.log(res.data);
        });
      setEditedCategory(null);
    } else {
      await axios
        .post("/api/categories", {
          name,
          parent,
          properties: properties.map((p) => ({
            name: p.name,
            values: p.values.split(","),
          })),
        })
        .then((res) => {});
    }

    setName("");
    setParent(0);
    setProperties([]);
    getCategories();
  }

  useEffect(() => {
    getCategories();
  }, []);

  async function getCategories() {
    axios.get("/api/categories").then((res) => {
      setCategories(res.data);
    });
  }

  function editCategory(category) {
    setEditedCategory(category);
    setName(category.name);
    setParent(category.parent?._id);
    setProperties(
      category.properties.map((p) => ({
        name: p.name,
        values: p.values.join(","),
      }))
    );
  }

  function addProperty() {
    setProperties((prev) => [...prev, { name: "", values: "" }]);
  }

  function deleteCategory(category) {
    swal
      .fire({
        title: "Are you sure?",
        text: "You will not be able to recover this category!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, keep it",
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          await axios.delete("/api/categories/" + category._id).then((res) => {
            console.log(res.data);
          });
          swal.fire("Deleted!", "Your category has been deleted.", "success");
          getCategories();
        } else if (result.dismiss === swal.DismissReason.cancel) {
          swal.fire("Cancelled", "Your category is safe :)", "error");
        }
      });
  }

  function handlePropertyNameChange(property, newName, index) {
    const newProperties = [...properties];
    newProperties[index].name = newName;
    setProperties(newProperties);
  }

  function handlePropertyValueChange(property, newValue, index) {
    const newProperties = [...properties];
    newProperties[index].values = newValue;
    setProperties(newProperties);
  }

  function removeProperty(index) {
    return () => {
      const newProperties = [...properties];
      newProperties.splice(index, 1);
      setProperties(newProperties);
    };
  }

  return (
    <div>
      <h1>Categories</h1>
      <label>{editedCategory ? "Edit Category" : "New Category"}</label>
      <form
        onSubmit={saveCategory}
      >
        <div className="flex gap-1">
          <input
            type="text"
            placeholder="Category name"
            value={name}
            onChange={(ev) => setName(ev.target.value)}
          />
          <select value={parent} onChange={(ev) => setParent(ev.target.value)}>
            <option value="0">No parent category</option>
            {categories.length > 0 &&
              categories.map((category, index) => {
                return (
                  <option key={index} value={category._id}>
                    {category.name}
                  </option>
                );
              })}
          </select>
        </div>
        <div className="mb-2">
          <label className="block">Properties</label>
          <button onClick={addProperty} type="button" className="btn-primary">
            Add new property
          </button>
          {properties.length > 0 &&
            properties.map((property, index) => {
              return (
                <div key={index} className="flex gap-1 my-1">
                  <input
                    type="text"
                    placeholder="Property name"
                    value={property.name}
                    onChange={(ev) =>
                      handlePropertyNameChange(property, ev.target.value, index)
                    }
                  />
                  <input
                    type="text"
                    placeholder="Property values"
                    value={property.values}
                    onChange={(ev) =>
                      handlePropertyValueChange(
                        property,
                        ev.target.value,
                        index
                      )
                    }
                  />
                  <button
                    className="bg-gray-400 py-2 px-2 rounded-md"
                    onClick={removeProperty(index)}
                    type="button"
                  >
                    Remove
                  </button>
                </div>
              );
            })}
        </div>
        <button
          type={"submit"}
          className="bg-blue-900 text-white py-1 px-2 rounded-md"
        >
          Add
        </button>
      </form>
      {/* Exisiting categories */}
      <h2 className="bg-blue-400 p-2 font-bold my-2">Existing Categories</h2>

      <div>
        {/* <p>Here </p> */}
        {categories.length > 0 &&
          categories.map((category, index) => {
            return (
              <div key={index} className="p-2">
                <p>{category.name}</p>
                <p>Parent: {category?.parent?.name}</p>
                <button
                  className="btn-primary"
                  onClick={() => editCategory(category)}
                >
                  Edit
                </button>
                <button
                  className="btn-primary ml-2"
                  onClick={() => deleteCategory(category)}
                >
                  Delete
                </button>
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default withSwal(({ swal }, ref) => (
  <Categories ref={ref} swal={swal} />
));
