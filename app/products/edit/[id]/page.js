"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import ProductForm from "@/components/ProductForm";

export default function EditProductPage() {
  const [productInfo, setProductInfo] = useState(null);

  const { id } = useParams();

  useEffect(() => {
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

  return (
    <div>
      <h1>Edit Product</h1>
      {productInfo && <ProductForm {...productInfo} />}
    </div>
  );
}


// "use client";
// import { useParams } from "next/navigation";
// import { useEffect, useState } from "react";
// import axios from "axios";
// import ProductForm from "@/components/ProductForm";

// export default function EditProductPage() {
//   const [productInfo, setProductInfo] = useState(null);

//   const { id } = useParams();

//   useEffect(() => {
//     if (!id) {
//       return;
//     }

//     axios.get(`/api/products/${id}`).then((res) => {
//       console.log("Dataa");
//       console.log(res.data);
//       setProductInfo(res.data);
//       console.log("productInfo");
//         console.log(productInfo);
//     });
//   }, [id]);

//   return (
//     <div>
//         <h1>Edit Product</h1>
//       <ProductForm {...productInfo}/>
//     </div>
//   );
// }

//The above approach is wrong 