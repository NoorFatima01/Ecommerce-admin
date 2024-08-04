## Client Side Data Fetching
Currently all the data is being fetched on the client side via useEffect hook.

During client side rendering the api request is made and data is fetched whenever the user loads the page. But this is mostly used for data that *frequently changes*. If the contents of the ecommerce store do not change that frequently we can use other ways to fetch data as well.

There is this thing known as `build-time`. During this time your server compiles your website and whatever HTML it has also called `static HTML pages`, it sends it to the client for rendering. This generation is called `Static Side Generation`.


## Static Site Generation (SSG)
`Static Site Generation` is when webpages are pre-rendered and *created in advance instead of on demand*. 

It is possible that some data is already fetched by APIs on the server during build time and the server includes that data in the static HTML it sends to the client for rendering as well. This is known as the Static Generation of your site. Most of the time this data that has already been fetched by the apis on the server is the data that does not change frequently. 

So, instead of making the api requests again and again for data that does not change frequently, the data is loaded on the server and sent to the client one single time. This helps in faster loading time.

## getStaticProps and getStaticPath

In Nextjs this would be done using `getStaticProps` and `getStaticPath`.
So, for example if I were to statically generate all the product pages it would involve something as follows:

`getStaticProps` returns `props` that is (in this case) the response from the api then these `props` are passed as props to the `component`.

`getStaticPath` is used along with `getStaticProps`. The 

The url would be `/product/[id] `

```import axios from 'axios';

const YourPage = ({ productInfo }) => {
  // Your component code here

  return (
    // Your JSX here
  );
};

export async function getStaticPaths() {
  // Generate paths for all products, (say we have 2 products with id 1 and 2)
  const paths = ['/product/1', '/product/2']; 

  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const id = params.id;

  try {
    const response = await axios.get(`https://your-api-url/api/products/${id}`);
    const productInfo = response.data;

    return {
      props: {
        productInfo,
      },
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      props: {
        productInfo: null, // Handle error case as needed
      },
    };
  }
}
``````

## Server Side Fetching

Now there is something known as `request time`. This is when the data is requested after the website has been rendered. The request is sent to the server the data is fetched on the server and sent to the client. In Next js, getServerSideProps

Understanding these rendering techniques in App Router: [in this stack overflow question](https://stackoverflow.com/questions/76267351/how-to-fetch-data-server-side-in-the-latest-next-js-tried-getstaticprops-but-it)

