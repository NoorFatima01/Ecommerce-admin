"use client";
import axios from "axios";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Img from "next/image";

export default function ProductForm({
  _id,
  title: existingTitle,
  description: existingDesc,
  price: existingPrice,
  images: existingImages,
  category: existingCategory,
  properties: existingProperties,
}) {
  const [title, setTitle] = useState(existingTitle || "");
  const [description, setDescription] = useState(existingDesc || "");
  const [price, setPrice] = useState(existingPrice || 0);
  const [goToProducts, setGoToProducts] = useState(false);
  const [images, setImages] = useState(existingImages || []);
  const [isUploading, setIsUploading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] =useState(existingCategory || "");
  const [productProperties, setProductProperties] = useState(existingProperties || []);
  const router = useRouter();

  useEffect(() => {
    if (goToProducts) {
      router.push("/products");
    }
  }, [goToProducts, router]);

  useEffect(() => {
    axios.get("/api/categories").then((res) => {
      setCategories(res.data);
    })
  },[])

  async function saveProduct(e) {
    e.preventDefault();
    const data = {
      title: title,
      description: description,
      price: price,
      images: images,
      category: category,
      properties: productProperties,
    };
    if (_id) {
      //update
      await axios.put("/api/products/" + _id, { ...data, _id });
    } else {
      //create
      await axios.post("/api/products", data);
    }
    setGoToProducts(true);
  }

  async function uploadImage(e) {
    const files = e.target?.files;
    console.log("files", files);

    if (!files || files.length === 0) {
      return;
    }
    setIsUploading(true);
    const formData = new FormData();

    // Append each file to the FormData
    for (const file of files) {
      formData.append("file", file);
    }

    console.log("formData", formData);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        console.log("data", data);
        settingImages(data.fileName);
        // const data = await res.json();
        // console.log("data", data);
        // setImages(prevImages => [...prevImages, data.fileName]);
          console.log("images", images);
        setIsUploading(false);
      } else {
        console.error("File upload failed:", res.statusText);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  }

  async function settingImages(newImage) {
    console.log("newImage", newImage);
    setImages(prevImages => [...prevImages, newImage]);
    console.log("now the images are images", images);
  }

  function changeProductProp(name, value){
    setProductProperties(prev => {
      const newProps = [...prev];
      const propIndex = newProps.findIndex(p => p.name === name);
      if(propIndex === -1){
        newProps.push({name, value});
      }else{
        newProps[propIndex].value = value;
      }
      return newProps;
    })
  }

  const properties = [];
  if(categories.length > 0 && category){
    let selCatInfo = categories.find((({_id}) => _id === category));
    properties.push(...selCatInfo.properties);
    while(selCatInfo?.parent?._id){
      const parent = categories.find((({_id}) => _id === selCatInfo.parent._id));
      properties.push(...parent.properties);
      selCatInfo = parent;
    }
  }

  return (
    <form onSubmit={saveProduct}>
      <div>
        <label>Product Name</label>
        <input
          type="text"
          placeholder="product name"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <label>Category</label>
        <select value={category} onChange={ev=>setCategory(ev.target.value)}>
          <option value="0">Uncategorized</option>
          {categories.length > 0 && categories.map((category) =>(
            <option key={category._id} value={category._id}>{category.name}</option>
          ))}
        </select>

        {properties.length > 0 && (
          <div>
            {properties.map((property, index) => (
              <div key={index}>
                <label>{property.name}</label>
                <select value={productProperties[p.name]} onChange={(ev)=>changeProductProp(p.name,ev.target.value)}>
                  {property.values.map((value, index) => (
                    <option key={index} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        )}


        <label>Photos</label>

        <div className="mb-2">
          {
            isUploading && <div className="h-24">Uploading...</div>
          }
          <label className="w-24 h-24 border flex items-center justify-center text-sm text-gray-500 rounded-lg cursor-pointer">
            Upload
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 8.25H7.5a2.25 2.25 0 0 0-2.25 2.25v9a2.25 2.25 0 0 0 2.25 2.25h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25H15m0-3-3-3m0 0-3 3m3-3V15"
              />
            </svg>
            <input type="file" onChange={uploadImage} className="hidden " />
          </label>
          <div className="mb-2 flex flex-wrap gap-2">
            {!images?.length && <p>No images</p>}
            {images?.length &&
              images.map((image, index) => {
                return (
                  <Img
                    key={index}
                    src={image}
                    alt={title}
                    width={30}
                    height={30}
                    className="rounded-md"
                  />
                );
              })}
          </div>
        </div>
        <label>Description</label>
        <textarea
          type="text"
          placeholder="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
        <label>Price (in USD)</label>
        <input
          type="number"
          placeholder="price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <button type="submit" className="btn-primary">
          Save
        </button>
      </div>
    </form>
  );
}

// if (goToProducts) {
//     router.push("/products");
//   }

//The warning you're encountering, "Cannot update a component (Router) while rendering a different component (ProductForm),"
//is due to the fact that you are calling router.push("/products"); inside the render phase of your
//component. This can cause issues because state updates (like setGoToProducts(true);) should not be triggered
//during the render phase.
