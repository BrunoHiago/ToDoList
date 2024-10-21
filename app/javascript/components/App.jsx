import React from "react";
import "bootstrap/dist/css/bootstrap.min.css"; // Adicione esta linha
import MenuBar from "./MenuBar";
import CategoryColumn from "./CategoryColumn";

const App = () => {
  return (
    <div>
      <MenuBar />
      <CategoryColumn
        category={{
          name: "Category 1",
          items: [
            { id: 1, name: "Item 1" },
            { id: 2, name: "Item 2" },
          ],
        }}
      />
    </div>
  );
};

export default App;
