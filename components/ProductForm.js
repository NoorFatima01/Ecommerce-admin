"use client";
import axios from "axios";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Img from "next/image";
import { set } from "mongoose";

export default function ProductForm({
  _id,
  title: existingTitle,
  description: existingDesc,
  price: existingPrice,
  images: existingImages,
}) {
  const [title, setTitle] = useState(existingTitle || "");
  const [description, setDescription] = useState(existingDesc || "");
  const [price, setPrice] = useState(existingPrice || 0);
  const [goToProducts, setGoToProducts] = useState(false);
  const [images, setImages] = useState(existingImages || []);
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (goToProducts) {
      router.push("/products");
    }
  }, [goToProducts, router]);

  async function saveProduct(e) {
    e.preventDefault();
    const data = {
      title: title,
      description: description,
      price: price,
      images: images,
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
        setImages(oldImages => {
          return [...oldImages, data.fileName];
        })
        setIsUploading(false);
      } else {
        console.error("File upload failed:", res.statusText);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  }

  console.log("images", images);
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
