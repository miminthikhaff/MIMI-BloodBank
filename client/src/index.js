import React from "react";
import ReactDOM from "react-dom"; // Import ReactDOM, not ReactDOM from "react-dom/client"
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { ConfigProvider } from "antd";
import { Provider } from "react-redux";
import store from "./redux/store"; // Import the correct store
import { createRoot } from "react-dom/client";

const rootElement = document.getElementById("root");
const root = createRoot(document.getElementById("root"));

// Use ReactDOM.render if you're not using React 18+
// ReactDOM.render(
// <Provider store={store}>
//   <ConfigProvider
//     theme={{
//       token: {
//         colorPrimary: "#B70404",
//         colorBorder: "#B70404",
//       },
//     }}
//   >
//     <App />
//   </ConfigProvider>
// </Provider>,
//   rootElement
// );

root.render(
  <>
    <Provider store={store}>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#B70404",
            colorBorder: "#B70404",
          },
        }}
      >
        <App />
      </ConfigProvider>
    </Provider>
    ,
  </>
);
reportWebVitals();
