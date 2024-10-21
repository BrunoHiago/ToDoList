import React from "react";
import logo from "../assets/images/logov360.png";
import { MdLogout } from "react-icons/md";

const MenuBar = () => {
  return (
    <div className="bg-black  w-full " style={{ height: "100px" }}>
      <div
        className="text-white text-2xl p-4 flex flex-row "
        style={{ alignItems: "center" }}
      >
        <div className="flex flex-row justify-center ite">
          <img src={logo} alt="Logo" width={60} height={60} />
          <div className="ml-4  flex " style={{ alignItems: "center" }}>
            Bem Vindo, Bruno
          </div>
        </div>
        <MdLogout size={40} className="ml-auto" />
      </div>
    </div>
  );
};

export default MenuBar;
