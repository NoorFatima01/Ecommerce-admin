"use client";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
export default function DeleteProductPage() {
  const router = useRouter();
  const [productInfo, setProductInfo] = useState(null);
  function goBack() {
    router.back();
  }

  const { id } = useParams();

  useEffect(() => {
    if (!id) {
      return;
    }
    // axios.delete(`/api/products/${id}`).then((res) => {

    // });
    const fetchData = async () => {
      try {
        if (!id) {
          return;
        }

        const response = await axios.get(`/api/products/${id}`);
        console.log("Dataa");
        console.log(response.data);
        setProductInfo(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [id]);
  console.log("productInfo");
  console.log(productInfo);

  function deleteProduct() {
    axios.delete(`/api/products/${id}`);
    router.push("/products");
  }

  return (
    <div>
      <h1>Do you really want to delete {productInfo && productInfo.title}?</h1>
      <button className="bg-red-900 rounded-md px-4 py-1 mx-2 text-white" onClick={deleteProduct}>
        Delete
      </button>
      <button
        className="bg-blue-900 rounded-md px-4 py-1 mx-2 text-white"
        onClick={goBack}
      >
        Cancel
      </button>
    </div>
  );
}
